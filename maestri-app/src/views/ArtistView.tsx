import { useState, useEffect, useMemo, } from 'react';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Slider, SliderChangeEvent } from "primereact/slider";
import { getColorPalette } from '../utils/colorUtilities';
import { DataModel } from '../DataModel';
import { Track } from '../utils/interfaces';
import ChoroplethChart from '../components/ChloroplethChart';
import { useSearchParams } from 'react-router-dom';
import SingleArtistCard from '../components/SingleArtistCard';
import { Button } from 'primereact/button';


interface ArtistProps {
    readonly model: DataModel;
}

function Artist(props: ArtistProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const artistId = searchParams.get("id");

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(true);
    const [currentArtist, setCurrentArtist] = useState(artistId ? props.model.getArtist(artistId) : props.model.getArtist('45'));
    const [mapData, setMapData] = useState(props.model.generateMapDataForWeek(props.model.allWeeks[0], currentArtist.artist_id));
    const [chartingTracks, setChartingTracks] = useState<Track[]>([]);
    
    // compute all map data for each week when artistName changes 
    const allMapData = useMemo(() => {
        return props.model.allWeeks.map((week) => props.model.generateMapDataForWeek(week, currentArtist.artist_id));
    }, [currentArtist]);

    // filter week when week or artistName changes
    const filterTracksForCurrentWeek = useMemo(() => {
        return props.model.filterTracksByWeekAndArtist(props.model.allWeeks[currentIndex], currentArtist.artist_id);
    }, [currentIndex, currentArtist]);
  
    useEffect(() => {
        setChartingTracks(filterTracksForCurrentWeek); // Update charting tracks
        // used of debugging
        //console.log(chartingTracks) 
    }, [filterTracksForCurrentWeek]);

    useEffect(() => {
        // update map data when artistName changes, allows map to change when we change artist from menu
        setMapData(allMapData[currentIndex]); // Start with map data for the current week
    }, [currentArtist, currentIndex, allMapData]);

    useEffect(() => {
        //update if playing, else do nothing, basically do this manually in handleSliderChange
        if (!isPaused) {
        const interval = setInterval(() => {
            setMapData(allMapData[currentIndex]);
            setCurrentIndex((prevIndex) => (prevIndex + 1) % props.model.allWeeks.length);
        }, 250); // Update every second (can adjust this)

        return () => clearInterval(interval);
        }
    }, [currentArtist, currentIndex, isPaused, allMapData]);

    const handleTogglePause = () => {
        setIsPaused((prev) => !prev);
    };

    const handleSliderChange = (e: SliderChangeEvent) => {
        if (typeof e.value === 'number') {
            setIsPaused(true); // Pause when slider is moved
            setCurrentIndex(e.value); // Update index
            setMapData(allMapData[e.value])
        }
    };

    function timelineButton() {
        if (isPaused) {
            return (<Button onClick={handleTogglePause} icon="pi pi-play" aria-label="Play" rounded />);
        } else {
            return (<Button onClick={handleTogglePause} icon="pi pi-pause" aria-label="Play" rounded/>);
        }
    }

    // const handleSliderEnd = () => {
    //   setIsPaused(false); // Resume when slider is released
    // };
  
    return (
        <div>
            <div className='grid grid-cols-3'>
                <div>
                    <Dropdown
                        style={{ marginLeft: '10px', marginTop: '10px', width: '19vw'}}
                        value={currentArtist}
                        onChange={selectArtist}
                        options={props.model.getArtists()} //hardcoded just to test shifting artist
                        optionLabel="name"
                        placeholder={currentArtist.name}
                        checkmark={true}
                        highlightOnSelect={false}
                        filter
                        virtualScrollerOptions={{ itemSize: 38 }}
                    />
                    <div style={{width: '20vw'}}>
                        <SingleArtistCard  artist={currentArtist} comparable networkable ></SingleArtistCard>
                    </div>
                    <h2 style={{ color: getColorPalette().amber }}>Globally charting {props.model.allWeeks[currentIndex]} <br></br>Total track(s): {chartingTracks.length}</h2>
                    <div style={{ maxHeight: '40vh', overflowY: 'auto', paddingRight: '10px'}}>
                        <ul>
                            {chartingTracks.length === 0 ? (
                                <p>No charting tracks for this week.</p>
                            ) : (
                                chartingTracks.map((track) => (
                                <li key={track.track_id}>
                                    <img src={track.image_url} height={50}></img>
                                    <strong style={{ color: getColorPalette().amber }}>{track.name}</strong> - {track.primary_artist_name} 
                                    <br />
                                    <br />
                                </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
                <div className='col-span-2'>
                    <div className='clipped'>
                        <ChoroplethChart mapData={mapData} />   
                    </div>
                    <p>Current week {props.model.allWeeks[currentIndex]}</p>
                    <div className='flex items-center'>
                        { timelineButton() }
                        <div style={{ marginLeft: '20px', width: '100%'}}>
                            <Slider
                                value={currentIndex}
                                min={0}
                                max={props.model.allWeeks.length - 1}
                                onChange={handleSliderChange}
                                //onSlideEnd={handleSliderEnd}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    function selectArtist(e: DropdownChangeEvent) {
        // update search params
        const newQueryParameters : URLSearchParams = new URLSearchParams();
        newQueryParameters.set("id",  e.value.artist_id)
        setSearchParams(newQueryParameters);
        setCurrentArtist(e.value)
    }
}

export default Artist;