import { Image } from 'primereact/image';
import { useState, useEffect, useMemo, } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Slider } from "primereact/slider";
import { getColorPalette } from '../utils/colorUtilities';
import { DataModel } from '../DataModel';
import { Track } from '../utils/interfaces';
import ChoroplethChart from '../components/ChloroplethChart';
import { useSearchParams } from 'react-router-dom';


interface ArtistProps {
    readonly model: DataModel;
}

function Artist(props: ArtistProps) {
    // const id = window.location.href.split('/').pop() // the id from the URL
    const [searchParams] = useSearchParams();
    console.log(searchParams.get("id"))
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(true);
    const [artistName, setArtistName] = useState('Eminem'); //to be changed
    const [mapData, setMapData] = useState(props.model.generateMapDataForWeek(props.model.allWeeks[0], artistName));
    const [chartingTracks, setChartingTracks] = useState<Track[]>([]);
    
    // compute all map data for each week when artistName changes 
    const allMapData = useMemo(() => {
        return props.model.allWeeks.map((week) => props.model.generateMapDataForWeek(week, artistName));
    }, [artistName]);

    // filter week when week or artistName changes
    const filterTracksForCurrentWeek = useMemo(() => {
        return props.model.filterTracksByWeekAndArtist(props.model.allWeeks[currentIndex], artistName);
    }, [currentIndex, artistName]);
  
    useEffect(() => {
        setChartingTracks(filterTracksForCurrentWeek); // Update charting tracks
        // used of debugging
        //console.log(chartingTracks) 
    }, [filterTracksForCurrentWeek]);

    useEffect(() => {
        // update map data when artistName changes, allows map to change when we change artist from menu
        setMapData(allMapData[currentIndex]); // Start with map data for the current week
    }, [artistName, currentIndex, allMapData]);

    useEffect(() => {
        //update if playing, else do nothing, basically do this manually in handleSliderChange
        if (!isPaused) {
        const interval = setInterval(() => {
            setMapData(allMapData[currentIndex]);
            setCurrentIndex((prevIndex) => (prevIndex + 1) % props.model.allWeeks.length);
        }, 250); // Update every second (can adjust this)

        return () => clearInterval(interval);
        }
    }, [artistName, currentIndex, isPaused, allMapData]);

    const handleTogglePause = () => {
        setIsPaused((prev) => !prev);
    };

    const handleSliderChange = (e: any) => {
        setIsPaused(true); // Pause when slider is moved
        setCurrentIndex(e.value); // Update index
        setMapData(allMapData[e.value])
    };

    // const handleSliderEnd = () => {
    //   setIsPaused(false); // Resume when slider is released
    // };
  
    return (
        <div>
        <Image src='https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg' height='100px' width='100px'></Image>
        <h1 style={{ minHeight: '5vh', color: getColorPalette().amber}}>{artistName}</h1>
        
        <div style={{ position: "absolute", left: 50, top: 240, height: "50vh", width: "30hw" }}>
            <h2 style={{ color: getColorPalette().amber }}>Globally charting {props.model.allWeeks[currentIndex]} <br></br>Total track(s): {chartingTracks.length}</h2>
            <div style={{ maxHeight: '40vh', overflowY: 'auto', paddingRight: '10px'}}>
                <ul>
                    {chartingTracks.length === 0 ? (
                        <p>No charting tracks for this week.</p>
                    ) : (
                        chartingTracks.map((track) => (
                        <li key={track.track_id}>
                            <strong style={{ color: getColorPalette().amber }}>{track.name}</strong> - {track.primary_artist_name} <br />
                            <br />
                        </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
        <div className='clipped'>
            <ChoroplethChart mapData={mapData} />   
        </div>
        

        <div style={{ position: "absolute", bottom: 50, left: 10, height: "10%", width: "99%" }}>
        <Dropdown
            value={artistName}
            onChange={(e) => setArtistName(e.value)}
            options={["Eminem", "Billie Eilish", "Beyoncé", "Kendrick Lamar"]} //hardcoded just to test shifting artist
            optionLabel="name"
            placeholder={artistName}
            className="w-full md:w-14rem"
            checkmark={true}
            highlightOnSelect={false}
        />
        <button onClick={handleTogglePause} style={{padding: '10px 20px'}}>{isPaused ? "Play" : "Pause"}</button>
            <p>Current week {props.model.allWeeks[currentIndex]}</p>
            <Slider
                value={currentIndex}
                min={0}
                max={props.model.allWeeks.length - 1}
                onChange={handleSliderChange}
                //onSlideEnd={handleSliderEnd}
            />
        </div>
        </div>
    );
}

export default Artist;