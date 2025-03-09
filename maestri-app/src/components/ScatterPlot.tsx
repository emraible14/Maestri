// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/scatterplot
import {ResponsiveScatterPlot} from '@nivo/scatterplot'
import {getColorPalette, getTheme} from '../utils/colorUtilities';
import {Track} from '../utils/interfaces';
import {Dropdown} from 'primereact/dropdown';
import {useEffect, useState} from 'react';
import {Button} from "primereact/button";
import NoDataFoundMessage from "./NoDataFoundMessage.tsx";

function ScatterPlot(props: { currentTracks: Array<Track> }) {
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

          return Math.max(...Array.from(streamsPerWeek.values()))
        }
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
              margin={{ top: 25, right: 25, bottom: 70, left: 70 }}
              xScale={{ type: 'linear', min: 0, max: 'auto' }}
              xFormat=">-.2f"
              yScale={{ type: 'linear', min: 0, max: 'auto' }}
              yFormat=">-.2f"
              axisTop={null}
              axisRight={null}
              theme={getTheme()}
              colors={getColorPalette().amber}
              useMesh={false}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: xAxis.label,
                legendPosition: 'middle',
                legendOffset: 46,
                truncateTickAt: 0
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: yAxis.label,
                legendPosition: 'middle',
                legendOffset: -60,
                truncateTickAt: 0
              }}
              // legends={[
              //     {
              //         anchor: 'bottom-right',
              //         direction: 'column',
              //         justify: false,
              //         translateX: 130,
              //         translateY: 0,
              //         itemWidth: 100,
              //         itemHeight: 12,
              //         itemsSpacing: 5,
              //         itemDirection: 'left-to-right',
              //         symbolSize: 12,
              //         symbolShape: 'circle',
              //         effects: [
              //             {
              //                 on: 'hover',
              //                 style: {
              //                     itemOpacity: 1
              //                 }
              //             }
              //         ]
              //     }
              // ]}
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