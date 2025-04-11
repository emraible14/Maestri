// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/scatterplot
import {ResponsiveScatterPlot} from '@nivo/scatterplot'
import {getColorPalette, getTheme} from '../utils/colorUtilities';
import {Track} from '../utils/interfaces';
import {Dropdown} from 'primereact/dropdown';
import {useEffect, useState} from 'react';
import {Button} from "primereact/button";
import NoDataFoundMessage from "./NoDataFoundMessage.tsx";

function ScatterPlot(props: { currentTracks: Array<Track>, onClickHandler: (node: any) => void }) {
    const axisOptions = [
      {
        label: "Peak Rank",
        computation: (track: Track) => Math.min(...track.chartings.map(chart => chart.rank))
      },
      {
        label: "Weeks on Chart",
        computation: (track: Track) => Math.max(...track.chartings.map(chart => chart.weeks_on_chart))
      },
      {
        label: "Team Size",
        computation: (track: Track) => track.credits.length
      },
      {
        label: "Peak Charting Countries",
        computation: (track: Track) => (new Set(track.chartings.map((chart) => chart.country))).size
      },  
      {
        label: "Peak Weekly Streams",
        computation: (track: Track) => {
          const streamsPerWeek = new Map<string, number>();
          track.chartings
            .forEach(chart => streamsPerWeek.set(chart.week, (streamsPerWeek.get(chart.week) ?? 0) + chart.num_streams))

          return Math.max(...Array.from(streamsPerWeek.values()))/ 1000;
        },
        // @ts-expect-error
        format: value => value + "K"
      },
      {
        label: "Samples/Interpolations",
        computation: (track: Track) => track.stats.samples + track.stats.interpolations
      }
  ]

    const [xAxis, setXAxis] = useState(axisOptions[0]);
    const [yAxis, setYAxis] = useState(axisOptions[1]);
    const [data, setData] = useState<{ id: string; data: { x: number; y: number; }[]; }[]>([]);



    function buildData() {
      return props.currentTracks.map(track => (
        {
          id: track.name,
          data: [
            {
              "x": xAxis.computation(track),
              "y": yAxis.computation(track),
            }
          ]
        }
      ))
    }

    useEffect(() => {
      setData(buildData())
    }, [xAxis, yAxis, props.currentTracks]);

    return (
        <div style={{height: '100%'}}>
          <div style={{height: "90%", position: "relative"}}>
            { data.length === 0 && <NoDataFoundMessage message="Try changing data selection"></NoDataFoundMessage> }
            <ResponsiveScatterPlot
              data={data}
              margin={{ top: 25, right: 25, bottom: 70, left: 90 }}
              xScale={{ type: 'linear', min: 0, max: 'auto' }}
              xFormat=">-d"
              yScale={{ type: 'linear', min: 0, max: 'auto' }}
              yFormat=">-d"
              axisTop={null}
              axisRight={null}
              theme={getTheme()}
              colors={getColorPalette().amber}
              useMesh={false}
              onClick={props.onClickHandler}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                format: xAxis?.format,
                legend: xAxis.label,
                legendPosition: 'middle',
                legendOffset: 46,
                truncateTickAt: 0
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                format: yAxis?.format,
                legend: yAxis.label,
                legendPosition: 'middle',
                legendOffset: -75,
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
                    <strong>{xAxis.label}: {xAxis?.format ? xAxis.format(node.formattedX) : node.formattedX}</strong>
                    <strong>{yAxis.label}: {yAxis?.format ? yAxis.format(node.formattedY) : node.formattedY}</strong>
                  </div>
                </div>
              )}
            />
          </div>
          <div className="flex flex-row" style={{maxHeight: "10%", gap: "1rem", padding: "0 0.5rem"}} >
            <Dropdown
              style={{ width: '100%'}}
              value={xAxis.label}
              onChange={(e) => setXAxis(e.value)}
              options={axisOptions}
              optionLabel="label"
              placeholder={xAxis.label}
              checkmark={true}
              highlightOnSelect={false}
            />
            <Button style={{padding: "0.75rem"}} onClick={() => {
              const tXAxis = xAxis;
              setXAxis(yAxis)
              setYAxis(tXAxis)
            }} icon="pi pi-arrow-right-arrow-left" outlined tooltip="Switch Axis"/>
            <Dropdown
              style={{ width: '100%'}}
              value={yAxis.label}
              onChange={(e) => setYAxis(e.value)}
              options={axisOptions}
              optionLabel="label"
              placeholder={yAxis.label}
              checkmark={true}
              highlightOnSelect={false}
            />
          </div>
        </div>

    )
}

export default ScatterPlot;