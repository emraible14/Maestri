import { getTheme, NIVO_DARK } from '../utils/colorUtilities';
import { ResponsiveBump } from '@nivo/bump'

interface BumpChartProps {
    readonly data: Array<{
        id: string;
        data: Array<{ x: string; y: number }>;
    }>;
};

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
function BumpChart(props: BumpChartProps) {
    // @ts-expect-error
    return <ResponsiveBump
            data={props.data}
            // keys={props.keys}
            theme={getTheme()}
            colors={{ scheme: NIVO_DARK }}
            lineWidth={3}
            activeLineWidth={6}
            inactiveLineWidth={3}
            inactiveOpacity={0.15}
            pointSize={10}
            activePointSize={16}
            inactivePointSize={0}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={3}
            activePointBorderWidth={3}
            pointBorderColor={{ from: 'serie.color' }}
            axisTop={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: '',
                legendPosition: 'middle',
                legendOffset: 32,
                truncateTickAt: 0
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'ranking',
                legendPosition: 'middle',
                legendOffset: -40,
                truncateTickAt: 0
            }}
            margin={{ top: 40, right: 100, bottom: 40, left: 60 }}
            axisRight={null}
        />
};

export default BumpChart;
