// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/scatterplot
import {ResponsiveScatterPlot} from '@nivo/scatterplot'
import {getTheme} from '../utils/colorUtilities';
import {Artist, Track} from '../utils/interfaces';
import {Dropdown} from 'primereact/dropdown';
import {useEffect, useState} from 'react';
import {CountryDetails} from "../utils/mapUtilities.ts";
import { countryMappings } from '../utils/mapUtilities.ts';

function RankScatterPlot(props: {artist: Artist, tracksForArtist: Array<Track>, currentWeek: string, dataSelection: CountryDetails}) {

    if (props.tracksForArtist.length === 0) {
        return null;
    }
    //console.log(props.dataSelection.spotifyCode)
    //console.log('cumulative week', props.cumulativeAllWeeks)
    
    const [xAxis, setXAxis] = useState('SE');
    const [yAxis, setYAxis] = useState(props.dataSelection.spotifyCode);

    const [data, setData] = useState<{ id: string; data: { x: number; y: number; }[]; }[]>([]);

   
  
    function filterByTwoCountries() {
      //check if song in charting in 1 or both of the countries
      return props.tracksForArtist.map(track => {
        const chartingInCountries = track.chartings
          .filter(chart => chart.week === props.currentWeek);
      
      const chartingInBoth = chartingInCountries.some(chart => chart.country === xAxis);

      //if it is not charting in the countries we want, we set it to null and filter it away
        return chartingInBoth ? {... track, chartings: chartingInCountries} : null;
      }).filter(track => track !== null);
    }
    //console.log('filtered', filterByTwoCountries())

    function buildRanksData() {
      
      return filterByTwoCountries().map(track => (
        {
        "id": track.name,
        "data": [
          {
            "x": track.chartings.find(chart => chart.country === xAxis) ? (track.chartings.find(chart => chart.country === xAxis)?.rank) : 1000*1000,
            "y": props.dataSelection.spotifyCode? 
            (track.chartings.find(chart => chart.country === yAxis) ? (track.chartings.find(chart => chart.country === yAxis)?.rank) : 1000*1000) 
            : Math.min(...track.chartings.map(chart => chart.rank), 1000*1000),

          }
        ]
      }))      
    }

    useEffect(() => {
      setYAxis(props.dataSelection.spotifyCode);
    }, [props.dataSelection.spotifyCode]);

    useEffect(() => {
        const data = buildRanksData()
        // @ts-ignore
        setData(data)
    }, [xAxis, yAxis, props.dataSelection, props.artist, props.currentWeek]);


    return (
        <div style={{display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{ position:'relative', height: '25rem', width: "25rem"}}>
            <ResponsiveScatterPlot
              data={data}
              margin={{ top: 25, right: 25, bottom: 70, left: 70 }}
              xScale={{ type: 'linear', min: 200, max: 0 }}
              xFormat=">-d"
              yScale={{ type: 'linear', min: 200, max: 0 }}
              yFormat=">-d"
              axisTop={null}
              axisRight={null}
              theme={getTheme()}
              colors={"#fbbf23"}
              useMesh={false}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: `Song Rank ${countryMappings.find(country => country.spotifyCode === xAxis)?.label}`,
                legendPosition: 'middle',
                legendOffset: 46,
                truncateTickAt: 0
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: countryMappings.find(country => country.spotifyCode === yAxis)?.spotifyCode ?
                  `Song Rank ${countryMappings.find(country => country.spotifyCode === yAxis)?.label}` :
                  'Highest Song Rank on Any Chart',
                legendPosition: 'middle',
                legendOffset: -60,
                truncateTickAt: 0
              }}
              tooltip={({ node }) => (
                <div style={{
                  color: '#000000',
                  background: '#FFFFFF',
                  padding: '5px 5px',
                  fontSize: '14px',
                }}>
                  <div className="flex flex-col" style={{gap: "0.125rem"}}>
                    <span>{node.serieId}</span>
                    <strong>Rank {countryMappings.find(country => country.spotifyCode === xAxis)?.label}: {node.formattedX}</strong>
                    <strong>Rank {countryMappings.find(country => country.spotifyCode === yAxis)?.label}: {node.formattedY}</strong>
                  </div>
                </div>
              )}
            />
          </div>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: "0.5rem", width: '100%'}} >
            <div style={{width: "10%"}}>
              X-axis:
            </div>
            <Dropdown
              style={{width: '50%'}}
              value={xAxis}
              onChange={(e) => setXAxis(e.value.spotifyCode)}
              options={countryMappings.filter(country => country.label !== "Cumulative")}
              optionLabel="label"
              placeholder={countryMappings.find(country => country.spotifyCode === xAxis)?.label}
              checkmark={true}
              highlightOnSelect={false}
            />
          </div>
        </div>

    )
}

export default RankScatterPlot;