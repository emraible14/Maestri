import { getTheme, NIVO_DARK } from '../utils/colorUtilities.ts';
import { ResponsiveLine } from '@nivo/line'
import { BasicTooltip } from '@nivo/tooltip'
import NoDataFoundMessage from "./NoDataFoundMessage.tsx";
import { countryMappings } from "../utils/mapUtilities.ts";

interface BumpChartProps {
    readonly data: Array<{
        id: string;
        data: Array<{ x: string; y: number | null; country: string | null }>;
    }>;
};

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
function LineChart(props: BumpChartProps) {
    return <div style={{height: "100%"}}>
        <div style={{height: "90%", position: "relative"}}>
            { props.data.length === 0 && <NoDataFoundMessage message="Try changing data selection"></NoDataFoundMessage> }
            <ResponsiveLine
              data={props.data}
              animate={false}
              theme={getTheme()}
              colors={{ scheme: NIVO_DARK }}

              enableGridX={false}
              enableGridY={false}
              axisBottom={{
                format: '%Y-%m-%d',
                tickValues: 'every 1 week',
                tickSize: 5,
                tickPadding: 3,
                legend: 'Week',
                legendPosition: 'middle',
                legendOffset: 32,
                truncateTickAt: 0
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Chart rank',
                legendPosition: 'middle',
                legendOffset: -40,
                truncateTickAt: 10,
              }}

              curve="monotoneX"
              // xFormat="time:%Y-%m-%d"
              xScale={{
                format: '%Y-%m-%d',
                precision: 'day',
                type: 'time',
                useUTC: false
              }}
              yScale={{
                type: 'linear',
                min: 0,
                max: 200,
                reverse: true
              }}

              margin={{
                bottom: 60,
                left: 80,
                right: 20,
                top: 20
              }}
              
              pointSize={10}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              useMesh={true}
              tooltip={bumpToolTip}
          />
        </div>
    </div>
};

function bumpToolTip(point: any) {
    const country = " in " + countryMappings.find(mapping => mapping.spotifyCode === point.point.data.country)?.label;
    const value = "ranked " + point.point.data.y + (point.point.data.country ? country : "");
    return <BasicTooltip
            id={point.point.serieId}
            value={value}
    />;
}

export default LineChart;
