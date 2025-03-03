// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/chord
import { ResponsiveChord } from '@nivo/chord'
import { getTheme, NIVO_DARK } from '../utils/colorUtilities'
import { Artist } from '../utils/interfaces'

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
function ChordChart(props: { readonly artists: Array<Artist> }) {
    const data = [
        [
          425,
          317,
          494,
          318,
          380
        ],
        [
          638,
          1305,
          440,
          74,
          38
        ],
        [
          1342,
          71,
          305,
          426,
          1289
        ],
        [
          448,
          183,
          1443,
          381,
          833
        ],
        [
          282,
          213,
          244,
          1703,
          2
        ]
      ]

    return (
        <div style={{height: '400px', width: '500px'}}>
            <ResponsiveChord
                data={data}
                keys={props.artists.map((art) => { return art.name})}
                margin={{ top: 100, right: 60, bottom: 100, left: 80 }}
                valueFormat=".2f"
                padAngle={0.02}
                innerRadiusRatio={0.96}
                innerRadiusOffset={0.02}
                inactiveArcOpacity={0.25}
                arcBorderColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            0.3
                        ]
                    ]
                }}
                activeRibbonOpacity={0.75}
                inactiveRibbonOpacity={0.25}
                ribbonBorderColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            0.1
                        ]
                    ]
                }}
                labelRotation={-90}
                labelTextColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            0.1
                        ]
                    ]
                }}
                theme={getTheme()}
                colors={{ scheme: NIVO_DARK }}
                motionConfig="stiff"
                // legends={[
                //     {
                //         anchor: 'bottom',
                //         direction: 'column',
                //         justify: false,
                //         translateX: 0,
                //         translateY: 90,
                //         itemWidth: 80,
                //         itemHeight: 14,
                //         itemsSpacing: 0,
                //         itemTextColor: '#999',
                //         itemDirection: 'left-to-right',
                //         symbolSize: 12,
                //         symbolShape: 'circle',
                //         effects: [
                //             {
                //                 on: 'hover',
                //                 style: {
                //                     itemTextColor: '#000'
                //                 }
                //             }
                //         ]
                //     }
                // ]}
            />
        </div>
    )
}

export default ChordChart