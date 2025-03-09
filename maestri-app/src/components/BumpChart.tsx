import { getTheme, NIVO_DARK } from '../utils/colorUtilities';
import { ResponsiveBump } from '@nivo/bump'
import { BasicTooltip } from '@nivo/tooltip'
import NoDataFoundMessage from "./NoDataFoundMessage.tsx";
import { countryMappings } from "../utils/mapUtilities";

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
function BumpChart(props: BumpChartProps) {
    return <div style={{height: "100%"}}>
        <div style={{height: "90%", position: "relative"}}>
            { props.data.length === 0 && <NoDataFoundMessage message="Try changing data selection"></NoDataFoundMessage> }
            {/* @ts-expect-error */}
            <ResponsiveBump
                data={props.data}
                theme={getTheme()}
                colors={{ scheme: NIVO_DARK }}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={3}
                activePointBorderWidth={3}
                inactivePointBorderWidth={1}
                pointBorderColor={{ from: 'serie.color' }}
                enableGridX={false}
                enableGridY={false}
                axisTop={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 3,
                    tickRotation: 10,
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
                    truncateTickAt: 10
                }}
                margin={{ top: 40, right: 100, bottom: 40, left: 60 }}
                animate={false}
                useMesh={true}
                pointTooltip={bumpToolTip}
            />
        </div>
    </div>
};

function bumpToolTip(point: any) {
    const country = " in " + countryMappings.find(mapping => mapping.spotifyCode === point.point.data.country)?.label;
    const value = point.point.serie.id + ", ranked: " + point.point.data.y + (point.point.data.country ? country : "");
    return <BasicTooltip
            id={point.point.data.x}
            enableChip={true}
            value={value}
    />;
}

export default BumpChart;
