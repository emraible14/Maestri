import { useState, useEffect, useMemo, } from 'react';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Slider, SliderChangeEvent } from "primereact/slider";
import { getColorPalette } from '../utils/colorUtilities';
import { DataModel } from '../DataModel';
import { Track } from '../utils/interfaces';
import ChoroplethChart from '../components/ChloroplethChart';
import BumpChart from '../components/BumpChart';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SingleArtistCard from '../components/SingleArtistCard';
import { Button } from 'primereact/button';
import HeatMapBar from '../components/HeatMapBar';
import ScatterPlot from '../components/ScatterPlot';
import { countryMappings } from "../utils/mapUtilities.ts";


interface ArtistProps {
    readonly model: DataModel;
}

function Artist(props: ArtistProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(true);
    const [currentArtist, setCurrentArtist] = useState(props.model.getArtist(searchParams.get("id") || '45'));
    const [mapData, setMapData] = useState(props.model.generateMapDataForWeek(props.model.allWeeks[0], currentArtist.artist_id));
    const [chartingTracks, setChartingTracks] = useState<Track[]>([]);

    const [selectedCountry, setSelectedCountry] = useState(countryMappings[0]);

    // update current artist when id changes
    useEffect(() => {
        setCurrentArtist(props.model.getArtist(searchParams.get("id") || '45'))
    }, [searchParams]);

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
  
    return (
        <div className="flex flex-col" style={{padding: "1rem", gap: "1.25rem"}}>
            <div className='grid grid-cols-5'>
                <div className='col-span-2'>
                    <div style={{ margin: '10px 20px 0px 10px'}}>
                        <Dropdown
                          style={{ width: '50%'}}
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
                    </div>
                    <div className='grid grid-cols-2'>
                        <div>
                            <SingleArtistCard  artist={currentArtist} comparable networkable ></SingleArtistCard>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h1>Songs Stats</h1>
                <div className='grid grid-cols-5' style={{gap: "1rem"}}>
                    <div className='col-span-3'>
                        <div className="flex flex-row" style={{gap: "1rem", alignItems: "center"}}>
                            <div>
                                Data Selection:
                            </div>
                            <Dropdown
                              style={{ width: '50%'}}
                              value={selectedCountry.label}
                              onChange={(e) => setSelectedCountry(e.value)}
                              options={countryMappings}
                              optionLabel="label"
                              placeholder={selectedCountry.label}
                              checkmark={true}
                              highlightOnSelect={false}
                            />
                        </div>
                        <div style={{height: '50vh'}}>
                            <ScatterPlot artist={currentArtist} currentTracks={
                                props.model.getTracksForArtist(currentArtist.artist_id)
                                  .filter(track => selectedCountry.spotifyCode === null ? true : track.chartings.some(chart => chart.country === selectedCountry.spotifyCode) )
                            } country={selectedCountry} currentWeek={props.model.allWeeks[currentIndex]}  ></ScatterPlot>
                        </div>
                    </div>
                    <div className='col-span-2'>
                        <div style={{height: '50vh'}}>
                            <h2 style={{ color: getColorPalette().amber, margin: "0 0 1rem 0" }}>All songs</h2>
                            <div className="flex flex-col" style={{ gap: "1rem", overflowY: 'scroll', height: "100%"}}>
                                { props.model.getTracksForArtist(currentArtist.artist_id)
                                  .filter(track => selectedCountry.spotifyCode === null ? true : track.chartings.some(chart => chart.country === selectedCountry.spotifyCode) )
                                  .map(trackDisplay) }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h1>Charting</h1>
                <div className="flex flex-col" style={{gap: "3rem"}}>
                    <div className='grid grid-cols-5' style={{gap: "2rem"}}>
                        <div className='col-span-2'>
                            <div style={{height: '55vh'}}>
                                <h2 style={{ color: getColorPalette().amber, margin: "0 0 1rem 0" }}>Globally charting {props.model.allWeeks[currentIndex]} <br></br>Total track(s): {chartingTracks.length}</h2>
                                <div className="flex flex-col" style={{ gap: "1rem", overflowY: 'scroll', height: "100%"}}>
                                    {chartingTracks.length === 0 ? (
                                      <p>No charting tracks for this week.</p>
                                    ) : (
                                      chartingTracks.map(trackDisplay)
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='col-span-3'>
                            <div className='clipped'>
                                <ChoroplethChart mapData={mapData} />
                            </div>
                            <h3 style={{ color: getColorPalette().amber, margin: '10px' }}>{props.model.allWeeks[currentIndex]}</h3>
                            <div className='flex items-center'>
                                { timelineButton() }
                                <div style={{ marginLeft: '20px', width: '100%'}}>
                                    <HeatMapBar artist={currentArtist}
                                                model={props.model}
                                                setSliderPosition={newDate => {
                                                    const weekIdx = props.model.allWeeks.indexOf(newDate)
                                                    setCurrentIndex(weekIdx);
                                                    setMapData(allMapData[weekIdx])
                                                }}
                                    ></HeatMapBar>
                                    <div style={{margin: '0px 5px'}}>
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
                    <div className='flex flex-row'>
                        <div style={{height: "40vh", width: "100vh"}}>
                            <BumpChart data={props.model.getBumpData(currentArtist, selectedCountry.spotifyCode, currentIndex)}/>
                        </div>
                        <div>
                            Scatter plot here
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

    function trackDisplay(track: Track) {
        const contributions = currentArtist.contributions.filter((cont) => cont.song_id.toString() === track.track_id);

        const primaryArtists = track.credits
          .filter(c => c.contribution_type === "primary")
          .map(c => {
              return <>
                  <a className="artist-name-link" onClick={() => navigate('/artist?id=' + c.artist_id)}> {props.model.getArtist(c.artist_id).name}</a>
              </>
          } )
          .reduce((acc, i) => {
              return <>
                  {acc}
                  {" & "}
                  {i}
              </>
          })

        return (
            <div key={track.track_id} className='flex items-center flex-row' style={{gap: '0.875rem'}}>
                <div style={{height: "4.5rem", width: "4.5rem"}}>
                    <img src={track.image_url} style={{height: "100%", width: "100%", objectFit: "cover", borderRadius: "5%"}}></img>
                </div>
                <div className="flex flex-col" style={{gap: '0.25rem'}}>
                    <span style={{ color: getColorPalette().amber, fontWeight: 800 }}>{track.name}</span>
                    <span style={{ fontSize: "80%"}}>{primaryArtists}</span>
                    <span className='flex' style={{gap: "0.375rem"}}>
                        { contributions.map((cont) => {
                            return (
                              <span style={{backgroundColor: "#424b57", borderRadius: "20px", padding: "0.25rem 0.5rem", fontSize: "80%"}}>{cont.type}</span>
                            )
                        })}
                    </span>
                </div>
            </div>
        )
    }
}

export default Artist;