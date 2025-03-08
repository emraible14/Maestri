// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/scatterplot
import {ResponsiveScatterPlot} from '@nivo/scatterplot'
import {getTheme} from '../utils/colorUtilities';
import {Artist, Track} from '../utils/interfaces';
import {Dropdown} from 'primereact/dropdown';
import {useEffect, useState} from 'react';
import {CountryDetails} from "../utils/mapUtilities.ts";
import {Button} from "primereact/button";
import { countryMappings } from '../utils/mapUtilities.ts';

function RankScatterPlot(props: {artist: Artist, tracksForArtist: Array<Track>, currentWeek: string}) {

    if (props.tracksForArtist.length === 0) {
        return null;
    }

    
    
    const [xAxis, setXAxis] = useState('GLOBAL');
    const [yAxis, setYAxis] = useState('SE');
    const [data, setData] = useState<{ id: string; data: { x: number; y: number; }[]; }[]>([]);

    function filterByTwoCountries() {
      //check if song in charting in 1 or both of the countries
      return props.tracksForArtist.map(track => {
        const chartingInCountries = track.chartings
          .filter(chart => chart.week === props.currentWeek && (chart.country === xAxis || chart.country === yAxis));
          
      const chartingInBoth = chartingInCountries.some(chart => chart.country === xAxis) && 
                             chartingInCountries.some(chart => chart.country === yAxis);
        
      //if it is not charting in the countries we want, we set it to null and filter it away
        return chartingInBoth ? {... track, chartings: chartingInCountries} : null;
      }).filter(track => track !== null);
    }
    //console.log('hej', filterByTwoCountries()[0].chartings[0].rank)

    function buildRanksData() {
      return filterByTwoCountries().map(track => ({
        "id": track.name,
        "data": [
          {
            "x": track.chartings.find(chart => chart.country === xAxis) ? (track.chartings.find(chart => chart.country === xAxis).rank) : 200, 
            "y": track.chartings.find(chart => chart.country === yAxis) ? (track.chartings.find(chart => chart.country === yAxis).rank) : 200
          }
        ]
      }))      
    }

    useEffect(() => {
        const data = buildRanksData()
        console.log("hadsgj", data)
        setData(data)
    }, [xAxis, yAxis, props.artist, props.currentWeek]);


    return (
        <div style={{display: 'flex', justifyContent: 'center', height: '100%'}}>
          <div style={{ position:'relative', height: '450px', width: "450px"}}>
            <ResponsiveScatterPlot
              data={data}
              margin={{ top: 25, right: 25, bottom: 70, left: 70 }}
              xScale={{ type: 'linear', min: 200, max: 0 }}
              xFormat=">-.2f"
              yScale={{ type: 'linear', min: 200, max: 0 }}
              yFormat=">-.2f"
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
                legend: `Song Rank ${countryMappings.find(country => country.spotifyCode === yAxis)?.label}`,
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
                  {node.id.split('.')[0]}: &nbsp;
                  <strong>Rank {countryMappings.find(country => country.spotifyCode === xAxis)?.label}: {node.formattedX}, &nbsp;</strong>
                  <strong>Rank {countryMappings.find(country => country.spotifyCode === yAxis)?.label}: {node.formattedY}</strong> 
                </div>
              )}
            />
          </div>
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: "1rem"}} >
            <Dropdown
              style={{width: '100%'}}
              value={yAxis}
              onChange={(e) => setYAxis(e.value.spotifyCode)}
              options={countryMappings.filter(country => country.label !== "Cumulative")} // cumulative not interesting here
              optionLabel="label"
              placeholder={countryMappings.find(country => country.spotifyCode === yAxis)?.label}
              checkmark={true}
              highlightOnSelect={false}
            />
            <Button style={{padding: "1.75rem"}} onClick={() => {
              const tempXAxis = xAxis;
              setXAxis(yAxis)
              setYAxis(tempXAxis)
            }} icon="pi pi-arrow-right-arrow-left" outlined tooltip="Switch Axis"/>
            <Dropdown
              style={{ width: '100%'}}
              value={xAxis}
              onChange={(e) => setXAxis(e.value.spotifyCode)}
              options={countryMappings.filter(country => country.label !== "Cumulative")} // cumulative not interseting here
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