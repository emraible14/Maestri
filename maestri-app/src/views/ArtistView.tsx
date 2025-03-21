import {useState, useEffect, useMemo, useRef,} from 'react';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Slider, SliderChangeEvent } from "primereact/slider";
import { getColorPalette } from '../utils/colorUtilities';
import { DataModel } from '../DataModel';
import {Track} from '../utils/interfaces';
import ChoroplethChart from '../components/ChloroplethChart';
import LineChart from '../components/BumpLineChart';
// @ts-expect-error
import BumpChart from '../components/BumpChart';

import { useNavigate, useSearchParams } from 'react-router-dom';
import SingleArtistCard from '../components/SingleArtistCard';
import { Button } from 'primereact/button';
import HeatMapBar from '../components/HeatMapBar';
import ScatterPlot from '../components/ScatterPlot';
import { countryMappings, getMapData } from "../utils/mapUtilities.ts";
import RankScatterPlot from "../components/RankScatterplot.tsx";
import {contributionLabels, getBarKeyLabelsFromType} from "../utils/dataUtilities.ts";
import {Tooltip} from "primereact/tooltip";
import BarChart from '../components/BarChart.tsx';


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

    // @ts-expect-error
    const [chartingTracks, setChartingTracks] = useState<Track[]>([]);
    const [selectedCountry, setSelectedCountry] = useState(countryMappings[0]);


    const songsStatsSongRef = useRef(new Map<string, HTMLDivElement>());
    // @ts-expect-error
    const handleNodeClick = node => {
      songsStatsSongRef.current.get(node.serieId)?.scrollIntoView({ behavior: "smooth", block: "nearest"});
    }

    function getFilteredChartingForSelectedCountryAndWeek(country: string | null, week: string | null) {
        return props.model.getTracksForArtist(currentArtist.artist_id)
            .map(track => {
                const chartingInCountriesAndWeek = track.chartings.filter(
                    chart =>
                        (
                          (country !== null && chart.country === country)
                          || (country === null && chart.country !== "GLOBAL")
                        )
                        && (week === null || chart.week === week)
                    );
                return chartingInCountriesAndWeek.length > 0 ? { ...track, chartings: chartingInCountriesAndWeek } : null;
            })
            .filter(track => track !== null);
    }
    // charting data for selected country
    const chartingsAllWeeks = useMemo(() => {
      return getFilteredChartingForSelectedCountryAndWeek(selectedCountry.spotifyCode, null);
    }, [currentArtist, selectedCountry]);
    //console.log('cumulative all weeks', chartingsAllWeeks)
    // charting data for selected country and week
    const chartingsOneWeek = useMemo(() => {
        return getFilteredChartingForSelectedCountryAndWeek(
            selectedCountry.spotifyCode,
            props.model.allWeeks[currentIndex]
        );
    }, [selectedCountry, currentIndex, currentArtist]);

    const [globalMapData, setGlobalMapData] = useState(getMapData().map(obj => ({...obj, value: chartingsOneWeek.length})));

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
    }, [filterTracksForCurrentWeek]);

    

    useEffect(() => {
        // update map data when artistName changes, allows map to change when we change artist from menu
        setMapData(allMapData[currentIndex]); // Start with map data for the current week
        setGlobalMapData(getMapData().map(obj => ({...obj, value: chartingsOneWeek.length})));
    }, [currentArtist, currentIndex, allMapData,selectedCountry]);

    useEffect(() => {
        //update if playing, else do nothing, basically do this manually in handleSliderChange
        if (!isPaused) {
        const interval = setInterval(() => {
            setMapData(allMapData[currentIndex]);
            setCurrentIndex((prevIndex) => (prevIndex + 1) % props.model.allWeeks.length);
            setGlobalMapData(getMapData().map(obj => ({...obj, value: chartingsOneWeek.length})));
        }, 500); // Update every second (can adjust this)

        return () => clearInterval(interval);
        }
    }, [currentArtist, currentIndex, isPaused, allMapData,selectedCountry]);

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
  
    return (
        <div className="flex flex-col" style={{padding: "1rem", gap: "1.25rem"}}>
            <div className='grid grid-cols-6'>
                <div className='col-span-1'>
                    <div style={{ margin: '10px 10px 0px 10px'}}>
                        <Dropdown
                          style={{ width: '100%'}}
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
                    <div>
                        <SingleArtistCard  artist={currentArtist} comparable networkable ></SingleArtistCard>
                    </div>
                </div>
                <div className='col col-span-5'>
                    <div className="flex justify-around">
                        <BarChart data={props.model.getBarData([currentArtist], "artist", "# charting tracks")} 
                            keys={getBarKeyLabelsFromType("# charting tracks")} indexKey={"artist"} type={"# charting tracks"}></BarChart>
                        <BarChart data={props.model.getBarData([currentArtist], "artist", "avg. team size")} 
                            keys={getBarKeyLabelsFromType("avg. team size")} indexKey={"artist"} type={"avg. team size"}></BarChart>
                        <BarChart data={props.model.getBarData([currentArtist], "artist", "total samples/interpolations used")} 
                            keys={getBarKeyLabelsFromType("total samples/interpolations used")} indexKey={"artist"} type={"total samples/interpolations used"}></BarChart>
                        <BarChart data={props.model.getBarData([currentArtist], "artist", "#1 tracks")} 
                            keys={getBarKeyLabelsFromType("#1 tracks")} indexKey={"artist"} type={"#1 tracks"}></BarChart>
                    </div>
                </div>
            </div>
            <div>
                <h1>Song Stats
                    <Tooltip target=".custom-info-icon" />
                    <i className="custom-info-icon pi pi-info-circle p-text-secondary p-overlay-badge" style={{ fontSize: '1rem', marginLeft: '5px', color: '#7b889e' }}
                        data-pr-tooltip="Cumulative is the sum of charts for our 30 selected countries, while Global charts are based on all 184 countries in the Spotify dataset." 
                        data-pr-position="right" data-pr-at="right+5 top+10" data-pr-my="left center-2"></i>
                </h1>
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
                            <ScatterPlot currentTracks={ chartingsAllWeeks } onClickHandler={handleNodeClick} ></ScatterPlot>
                        </div>
                    </div>
                    <div className='col-span-2'>
                        <div style={{height: '50vh'}}>
                            <h2 style={{ color: getColorPalette().amber, margin: "0 0 1rem 0" }}>Tracks</h2>
                            <div className="flex flex-col" style={{ gap: "1rem", overflowY: 'scroll', height: "100%"}}>
                                { chartingsAllWeeks.length === 0 ? (
                                  <p>No tracks found for this selection</p>
                                ) : (
                                  chartingsAllWeeks.map(v => trackDisplay(v, true))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h1>
                    Charts
                    <Tooltip target=".custom-info-icon" />
                    <i className="custom-info-icon pi pi-info-circle p-text-secondary p-overlay-badge" style={{ fontSize: '1rem', marginLeft: '5px', color: '#7b889e' }}
                        data-pr-tooltip="Cumulative is the sum of charts for our 30 selected countries, while Global charts are based on all 184 countries in the Spotify dataset." 
                        data-pr-position="right" data-pr-at="right+5 top+10" data-pr-my="left center-2"></i>
                </h1>
                <div className="flex flex-col" style={{gap: "2rem"}}>
                    <div className='flex flex-col' style={{gap: "1.25rem"}}>
                      <div className="flex flex-row" style={{gap: "1rem", alignItems: "center"}}>
                        <div>
                          Data Selection:
                        </div>
                        <Dropdown
                          style={{ width: '30%'}}
                          value={selectedCountry.label}
                          onChange={(e) => setSelectedCountry(e.value)}
                          options={countryMappings}
                          optionLabel="label"
                          placeholder={selectedCountry.label}
                          checkmark={true}
                          highlightOnSelect={false}
                        />
                      </div>
                      <h3 style={{ color: getColorPalette().amber, margin: "0" }}>{ selectedCountry.label } Charts { props.model.allWeeks[currentIndex] }</h3>
                      <div className="flex flex-row" style={{gap: "1.5rem"}}>
                        { isPaused
                            ? <Button style={{minWidth: "3rem", marginTop: "-3px"}} onClick={handleTogglePause} icon="pi pi-play" aria-label="Play" rounded />
                            : <Button style={{minWidth: "3rem", marginTop: "-3px"}} onClick={handleTogglePause} icon="pi pi-pause" aria-label="Play" rounded />
                        }
                        <div style={{ width: '100%'}}>
                          <HeatMapBar model={props.model}
                                      currentTracks={ chartingsAllWeeks }
                                      setSliderPosition={ newDate => {
                                        const weekIdx = props.model.allWeeks.indexOf(newDate)
                                        setCurrentIndex(weekIdx);
                                        setMapData(allMapData[weekIdx])
                                      }}
                          ></HeatMapBar>
                          <Slider
                            value={currentIndex}
                            min={0}
                            max={props.model.allWeeks.length - 1}
                            onChange={handleSliderChange}
                            pt={{root: {style: {cursor: 'pointer', margin: "0 7px"}}}}
                            //onSlideEnd={handleSliderEnd}
                          />
                        </div>
                      </div>
                    </div>


                    <div className='grid grid-cols-5' style={{gap: "2rem"}}>
                        <div className='col-span-3 flex flex-col' style={{gap: "1.25rem"}}>
                          <div className='clipped'>
                            <ChoroplethChart mapData={selectedCountry.label === 'Global'? globalMapData:mapData}
                                             isGlobal={selectedCountry.label === 'Global'}
                                             isCumulative={selectedCountry.label === 'Cumulative'}
                                             country={selectedCountry.mapCode}/>
                          </div>
                          <div style={{height: "35rem", width: "100%"}}>
                            {BumpChartRender()}
                          </div>
                        </div>
                        <div className='col-span-2 flex flex-col' style={{gap: "1.25rem"}}>
                            <div className='clipped flex flex-col'>
                                <h2 style={{ color: getColorPalette().amber, margin: "0 0 1rem 0" }}> Charting Tracks ({ chartingsOneWeek.length })</h2>
                                <div className="flex flex-col" style={{ gap: "1rem", overflowY: 'scroll', height: "100%"}}>
                                    { chartingsOneWeek.length === 0 ? (
                                      <p>No charting tracks during this week</p>
                                    ) : (
                                      chartingsOneWeek.map(v => trackDisplay(v))
                                    )}
                                </div>
                            </div>
                            <div style={{width: "100%"}}>
                              <RankScatterPlot artist={currentArtist} tracksForArtist={
                                props.model.getTracksForArtist(currentArtist.artist_id)
                              } currentWeek={props.model.allWeeks[currentIndex]} dataSelection={selectedCountry}></RankScatterPlot>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    function BumpChartRender() {
        const start: Date = new Date("2023-01-05");        

        const current = new Date(start);
        current.setDate(start.getDate() + ((currentIndex < 5) ? 5 : currentIndex) * 7);

        const fiveWeeksAgo = new Date(current);
        fiveWeeksAgo.setDate(current.getDate() - 5 * 7);

        const dates: Array<string> = [];
        for (let d = new Date(fiveWeeksAgo); d <= current; d.setDate(d.getDate() + 7)) {
            dates.push(new Date(d).toLocaleDateString("en-CA"));
        }

        // @ts-expect-error
        return <LineChart data={props.model.getBumpData(currentArtist, selectedCountry.spotifyCode, dates)} maxValue={200} dates={dates}/>
    }

    function selectArtist(e: DropdownChangeEvent) {
        // update search params
        const newQueryParameters : URLSearchParams = new URLSearchParams();
        newQueryParameters.set("id",  e.value.artist_id)
        setSearchParams(newQueryParameters);
        setCurrentArtist(e.value)
    }

    function trackDisplay(track: Track, isScrollableTo: boolean = false) {
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
            <div key={track.name} ref={(el) => {
              if (isScrollableTo && el) songsStatsSongRef.current.set(track.name, el);
            }} className='flex items-center flex-row' style={{gap: '0.875rem'}}>
                <div style={{height: "4.5rem", width: "4.5rem"}}>
                    <img src={track.image_url} style={{height: "100%", width: "100%", objectFit: "cover", borderRadius: "5%"}}></img>
                </div>
                <div className="flex flex-col" style={{gap: '0.25rem'}}>
                    <span style={{ color: getColorPalette().amber, fontWeight: 800 }}>{track.name}</span>
                    <span style={{ fontSize: "80%"}}>{primaryArtists}</span>
                    <span className='flex' style={{gap: "0.375rem"}}>
                        { contributions.map((cont) => {
                            return <>
                              <span className={`chip-${cont.type}-${currentArtist.artist_id}`} style={{ backgroundColor: "#424b57", borderRadius: "20px", padding: "0.25rem 0.5rem", fontSize: "70%" }}>{contributionLabels[cont.type].acronym}</span>
                              <Tooltip target={`.chip-${cont.type}-${currentArtist.artist_id}`} content={`${currentArtist.name} is a ${contributionLabels[cont.type].text} on this track`} pt={{text: {style: {boxShadow: "none", fontSize: "80%"}}}}/>
                            </>
                        })}
                    </span>
                </div>
            </div>
        )
    }
}

export default Artist;