import { ResponsiveChord } from '@nivo/chord'
import { getTheme, NIVO_DARK } from '../utils/colorUtilities'
import { Artist } from '../utils/interfaces'
import { DataModel } from '../DataModel';
import ChordRibbonTooltip from './ChordRibbonTooltip';
import ChordArcTooltip from './ChordArcTooltip';

function ChordChart(props: { readonly artists: Array<Artist>, readonly model: DataModel }) {

    // loop through artists and get their connections
    const data: Array<Array<number>> = [];
    props.artists.forEach((artist) => {
        const result: Array<number> = []
        const others = [...props.artists]
        const network = props.model.getNetworkDataForArtist(artist.artist_id);
        others.forEach((artist2) => {
            if (artist.artist_id === artist2.artist_id) {
                const uniqueConts = new Set(artist.contributions.map((cont) => { return cont.song_id }));
                result.push(uniqueConts.size) 
            } else {
                const collabs = network.nodes.find((node) => node.id === artist2.artist_id);
                if (collabs) {
                    result.push(collabs.num_collaborations);
                } else {
                    result.push(0); // no collaborations
                }
            }
        });
        data.push(result);
    })

    return (
        <div style={{height: '37vh'}}>
            <ResponsiveChord
                data={data}
                keys={props.artists.map((art) => { return art.name})}
                margin={{ top: 30, right: 40, bottom: 30, left: 40 }}
                valueFormat=".2f"
                inactiveArcOpacity={0.25}
                padAngle={0.02}
                innerRadiusRatio={0.92}
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
                ribbonTooltip={ChordRibbonTooltip}
                arcTooltip={ChordArcTooltip}
            />
        </div>
    )
}

export default ChordChart