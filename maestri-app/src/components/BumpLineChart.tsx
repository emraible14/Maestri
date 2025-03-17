import { getTheme, NIVO_DARK } from '../utils/colorUtilities.ts';
import { ResponsiveLine } from '@nivo/line'
import { BasicTooltip } from '@nivo/tooltip'
import NoDataFoundMessage from "./NoDataFoundMessage.tsx";
import { countryMappings } from "../utils/mapUtilities.ts";
import { Fragment } from 'react';
import { LinesLabels } from './labels/LineLabels.tsx';

interface BumpChartProps {
    readonly data: Array<{
        id: string;
        data: Array<{ x: string; y: number | null; country: string | null }>;
    }>;
    readonly dates: Array<string>
};

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
function LineChart(props: BumpChartProps) {
  const xAxis = props.dates.map(date => (new Date(date)));
  
  const minX = new Date(props.dates[0]);
  minX.setDate(minX.getDate() - 3);
  const maxX = new Date(props.dates[5]);
  maxX.setDate(maxX.getDate() + 3);
  

    return <div style={{height: "100%"}}>
        <div style={{height: "90%", position: "relative"}}>
            { props.data.length === 0 && <NoDataFoundMessage message="Try changing data selection"></NoDataFoundMessage> }
            <ResponsiveLine
              data={props.data}
              animate={false}
              theme={getTheme()}
              colors={{ scheme: NIVO_DARK }}

              axisBottom={{
                format: '%Y-%m-%d',
                // tickValues: 'every 1 week',
                tickValues: xAxis,
                tickSize: 5,
                tickPadding: 5,
                legend: 'Week',
                legendPosition: 'middle',
                legendOffset: 40,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Chart rank',
                legendPosition: 'middle',
                legendOffset: -50,
                truncateTickAt: 10,
              }}

              curve="monotoneX"
              // xFormat="time:%Y-%m-%d"
              xScale={{
                format: '%Y-%m-%d',
                precision: 'day',
                type: 'time',
                useUTC: false,
                min: minX,
                max: maxX
              }}
              xFormat="time:%Y-%m-%d"
              yScale={{
                type: 'linear',
                min: 0,
                max: 200,
                reverse: true
              }}

              margin={{
                bottom: 60,
                left: 80,
                right: 120,
                top: 20
              }}
              
              pointSize={8}
              pointColor={{ from: 'color', modifiers: [] }}
              useMesh={true}
              tooltip={bumpToolTip}
              crosshairType='cross'

              layers={[
                'axes',
                'crosshair',
                'lines',
                'points',
                'mesh',
                'legends',
                labelRender
              ]}
          />
        </div>
    </div>
};

function bumpToolTip(point: any) {
    const country = " in " + countryMappings.find(mapping => mapping.spotifyCode === point.point.data.country)?.label;
    const value = "ranked " + point.point.data.y + (point.point.data.country ? country : "") + " on " + point.point.data.xFormatted;
    return <BasicTooltip
            id={point.point.serieId}
            value={value}
    />;
}


function labelRender(props: any) {
  return <Fragment key="legends">
            <LinesLabels
                series={props.series}
                getLabel={true}
                position="end"
                padding={15}
                color={{ from: 'color' }}
            />
        </Fragment>
}

export default LineChart;
