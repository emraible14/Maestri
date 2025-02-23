import { ResponsiveRadar } from '@nivo/radar'

interface RadarChartProps {
    data: null;
}

function RadarChart(props: RadarChartProps) {

    const data = [
        {
          "taste": "fruity",
          "chardonay": 49,
          "carmenere": 66,
          "syrah": 20
        },
        {
          "taste": "bitter",
          "chardonay": 26,
          "carmenere": 60,
          "syrah": 85
        },
        {
          "taste": "heavy",
          "chardonay": 28,
          "carmenere": 24,
          "syrah": 118
        },
        {
          "taste": "strong",
          "chardonay": 26,
          "carmenere": 101,
          "syrah": 56
        },
        {
          "taste": "sunny",
          "chardonay": 76,
          "carmenere": 83,
          "syrah": 63
        }
    ]

    return (
        <div className='chart-box'>
            <ResponsiveRadar
                data={data}
                keys={[ 'chardonay', 'carmenere', 'syrah' ]}
                indexBy="taste"
                valueFormat=">-.2f"
                margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
                borderColor={{ from: 'color' }}
                gridShape="linear"
                gridLabelOffset={36}
                dotSize={10}
                dotColor={{ theme: 'background' }}
                dotBorderWidth={2}
                colors={{ scheme: 'nivo' }}
                blendMode="multiply"
                motionConfig="wobbly"
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
                                    itemTextColor: '#000'
                                }
                            }
                        ]
                    }
                ]}
            />
        </div>
    );

}

export default RadarChart;