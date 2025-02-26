import { ResponsiveRadar } from '@nivo/radar'
import { getTheme, NIVO_DARK } from '../utils/colorUtilities';
import RadarChartLabel from './RadarChartLabel';

interface RadarChartProps {
    readonly data: Array<{[key: string]: string | number}>;
    readonly keys: Array<string>;
    readonly indexKey: string;
}

function RadarChart(props: RadarChartProps) {

    return (
        <div className='chart-box'>
            <ResponsiveRadar
                data={props.data}
                keys={props.keys}
                indexBy={props.indexKey}
                valueFormat=">-.2f"
                margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
                borderWidth={7}
                // borderColor="#ffffff"
                gridShape="linear"
                gridLabelOffset={36}
                dotSize={10}
                dotColor={{ theme: 'background' }}
                dotBorderWidth={2}
                theme={getTheme()}
                colors={{ scheme: NIVO_DARK }}
                fillOpacity={0}
                motionConfig="wobbly"
                onClick={clickedSomething}
                gridLabel={RadarChartLabel}
                legends={[
                    {
                        anchor: 'top-left',
                        direction: 'column',
                        translateX: -50,
                        translateY: -40,
                        itemWidth: 80,
                        itemHeight: 20,
                        itemTextColor: '#999',
                        symbolSize: 12,
                        symbolShape: 'circle',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemTextColor: '#fff'
                                }
                            }
                        ]
                    }
                ]}
            />
        </div>
    );

}

function clickedSomething(event) {
    console.log(event);
}

export default RadarChart;