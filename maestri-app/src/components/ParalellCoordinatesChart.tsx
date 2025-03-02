
import { ResponsiveParallelCoordinates } from '@nivo/parallel-coordinates'
import { getTheme, NIVO_DARK } from '../utils/colorUtilities';
import { DataModel } from '../DataModel';
import { Artist } from '../utils/interfaces';
import { ParallelCoordinatesTooltip } from './ParallelCoordinatesTooltip';

function ParallelCoordinatesChart(props: {artists: Array<Artist>, model: DataModel}) {

    interface ChartData {
        "charting_tracks": number,
        "avg_team_size": number,
        "originality": number,
        "num_one": number,
        "id": string,
    }
    const data: Array<ChartData> = [];
    props.artists.forEach((artist) => {
        data.push({
            "charting_tracks": artist.stats.overall.contribution_counts.total,
            "avg_team_size": artist.stats.overall.team_size.avg,
            "originality": artist.stats.overall.song_references.total,
            "num_one": artist.stats.overall.top_songs.top10,
            "id": artist.name,
        })
    })

    return (
        <div style={{height: "43vh"}}>
            <ResponsiveParallelCoordinates
                data={data}
                variables={[
                    {
                        id: 'charting_tracks',
                        label: 'charting tracks',
                        value: 'charting_tracks',
                        min: 'auto',
                        max: 'auto',
                        ticksPosition: 'before',
                        legendPosition: 'start',
                        legendOffset: 20
                    },
                    {
                        id: 'avg_team_size',
                        label: 'avg. team size',
                        value: 'avg_team_size',
                        min: 0,
                        max: 'auto',
                        ticksPosition: 'before',
                        legendPosition: 'start',
                        legendOffset: 20
                    },
                    {
                        id: 'originality',
                        label: 'total samples/interpolations',
                        value: 'originality',
                        min: 'auto',
                        max: 'auto',
                        legendPosition: 'start',
                        legendOffset: 20
                    },
                    {
                        id: 'num_one',
                        label: 'top 10 hits',
                        value: 'num_one',
                        min: 0,
                        max: 'auto',
                        legendPosition: 'start',
                        legendOffset: 20
                    }
                ]}
                margin={{ top: 30, right: 230, bottom: 30, left: 250 }}
                lineWidth={10}
                lineOpacity={1}
                theme={getTheme()}
                colors={{ scheme: NIVO_DARK }}
                tooltip={ParallelCoordinatesTooltip}
                // legends={[
                //     {
                //         anchor: 'top',
                //         direction: 'row',
                //         justify: false,
                //         translateX: 100,
                //         translateY: 0,
                //         itemsSpacing: 2,
                //         itemWidth: 60,
                //         itemHeight: 20,
                //         itemDirection: 'left-to-right',
                //         itemOpacity: 0.85,
                //         symbolSize: 20,
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
    )
}

export default ParallelCoordinatesChart