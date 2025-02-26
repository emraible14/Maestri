import { Image } from 'primereact/image';
import { getColorPalette, getTheme , getFeaturesArray, getMapData} from '../utilities';
import { ResponsiveChoropleth } from '@nivo/geo'
import { useState, useEffect, useMemo, } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Slider } from "primereact/slider";
import { allWeeks, filterTracksByWeekAndArtist, generateMapDataForWeek, Track } from '../ArtistPageUtilities';


function Artist() {
  const id = window.location.href.split('/').pop() // the id from the URL
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [artistName, setArtistName] = useState(id !== 'artist' ? id || 'Eminem' : 'Eminem'); //to be changed
  const [mapData, setMapData] = useState(generateMapDataForWeek(allWeeks[0], artistName));
  const [chartingTracks, setChartingTracks] = useState<Track[]>([]);
  
  // compute all map data for each week when artistName changes 
  const allMapData = useMemo(() => {
    return allWeeks.map((week) => generateMapDataForWeek(week, artistName));
  }, [artistName]);

  // filter week when week or artistName changes
  const filterTracksForCurrentWeek = useMemo(() => {
    return filterTracksByWeekAndArtist(allWeeks[currentIndex], artistName);
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
        setCurrentIndex((prevIndex) => (prevIndex + 1) % allWeeks.length);
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

  const handleSliderEnd = () => {
    setIsPaused(false); // Resume when slider is released
  };

  
  return (
    <div>
      <Image src='https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg' height='100px' width='100px'></Image>
      <h1 style={{ minHeight: '5vh', color: getColorPalette().amber}}>{artistName}</h1>
      
      <div style={{ position: "absolute", left: 50, top: 240, height: "50vh", width: "30hw" }}>
        <h2 style={{ color: getColorPalette().amber }}>Globally charting {allWeeks[currentIndex]} <br></br>Total track(s): {chartingTracks.length}</h2>
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
        <MyResponsiveChoropleth mapData={mapData} />   
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
        <p>Current week {allWeeks[currentIndex]}</p>
        <Slider
          value={currentIndex}
          min={0}
          max={allWeeks.length - 1}
          onChange={handleSliderChange}
          //onSlideEnd={handleSliderEnd}
        />
      </div>
    </div>
  );
}

export default Artist

interface MapDatum {
  id: string | number;
  value: number;
}

interface ChoroplethProps {
  mapData: MapDatum[];
}

const MyResponsiveChoropleth: React.FC<ChoroplethProps> = ({ mapData }) => (
  <ResponsiveChoropleth
      data={mapData}
      features={getFeaturesArray()}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      theme={getTheme()}
      colors={['#00000','#fff7ec','#fee8c8','#fdd49e','#fdbb84','#fc8d59','#ef6548','#d7301f','#b30000','#7f0000']}
      domain={[ 0, 10 ]}
      unknownColor="#666666"
      label="properties.name"
      value={'value'}
      valueFormat=".2s"
      projectionType='mercator'
      fillColor={'#00000'}
      enableGraticule={false}
      graticuleLineWidth={0}
      graticuleLineColor={'#00000'}
      isInteractive={true}
      onMouseEnter={() => {}} // Fix: Provide an empty function
      onMouseMove={() => {}}
      onMouseLeave={() => {}}
      onClick={() => {}}
      role=''
      projectionScale={300} // change to zoom in zoom out, effectively cutting the map
      projectionTranslation={[ 0.8, 1 ]}
      projectionRotation={[ 0, 0, 0 ]}
      borderWidth={0.5}
      borderColor={getColorPalette().amber}
      legends={[
          {
              anchor: 'bottom-left',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: 0,
              itemsSpacing: 0,
              itemWidth: 18,
              itemHeight: 18,
              itemDirection: 'bottom-to-top',
              itemTextColor: getColorPalette().amber,
              itemOpacity: 0.85,
              symbolSize: 18,
              effects: [
                  {
                      on: 'hover',
                      style: {
                          itemTextColor: '#000000',
                          itemOpacity: 1
                      }
                  }
              ],
              data: [
                  { id: '0', label: '0', color: '#000000' },
                  { id: '1', label: '1', color: '#fff7ec' },
                  { id: '2', label: '2', color: '#fee8c8' },
                  { id: '3', label: '3', color: '#fdd49e' },
                  { id: '4', label: '4', color: '#fdbb84' },
                  { id: '5', label: '5', color: '#fc8d59' },
                  { id: '6', label: '6', color: '#ef6548' },
                  { id: '7', label: '7', color: '#d7301f' },
                  { id: '8', label: '8', color: '#b30000' },
                  { id: '9', label: '9', color: '#7f0000' }
            ]
              
          }
      ]}
  />
)
