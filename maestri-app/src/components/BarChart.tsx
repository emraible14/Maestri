import { ResponsiveBar } from '@nivo/bar'
import { getTheme } from '../utils/colorUtilities';
import { Datum } from '@nivo/legends';

interface BarChartProps {
    readonly data: Array<{[key: string]: string | number}>
    readonly keys: Array<string>;
    readonly indexKey: string,
    readonly type: string,
}

function BarChart(props: BarChartProps) {

    const legendData: Array<Datum> = []
    const grayColors = ['#333333', '#777777', '#bbbbbb','#ffffff']
    props.keys.forEach((key, idx) => {
        legendData.push({
            id: key,
            label: key,
            color: grayColors[idx]
        })
    })
    legendData.reverse(); // reverse to follow stacking order 

    return (
    <div style={{ height: '43vh', width: '100%'}}>
    <ResponsiveBar
        data={props.data}
        // layout="horizontal"
        // enableGridY={false} 
        // enableGridX={true}
        keys={props.keys}
        indexBy={props.indexKey}
        margin={{ top: 35, right: 30, bottom: 150, left: 50 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={({ id, data }) => String(data[`${id}Color`])}
        theme={getTheme()}
        borderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    1.6
                ]
            ]
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -20,
            // legend: props.type,
            // legendPosition: 'middle',
            legendOffset: 40,
            truncateTickAt: 0
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: props.type,
            legendPosition: 'middle',
            legendOffset: -45,
            truncateTickAt: 0
        }}
        enableTotals={true}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    1.6
                ]
            ]
        }}
        legends={[
            {
                // dataFrom: 'keys',
                data: legendData,
                dataFrom: 'keys',
                anchor: 'bottom',
                direction: 'column',
                justify: false,
                translateX: 0,
                translateY: 145,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemOpacity: 1
                        }
                    }
                ],
            }
        ]}
        role="application"
        ariaLabel="Nivo bar chart demo"
        barAriaLabel={e=>e.id+": "+e.formattedValue+" in country: "+e.indexValue}
    />
    </div>);
}

export default BarChart 