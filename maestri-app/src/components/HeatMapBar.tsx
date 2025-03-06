import { ResponsiveHeatMap } from '@nivo/heatmap'
import { getTheme } from '../utils/colorUtilities';
import { Artist } from '../utils/interfaces';
import { DataModel } from '../DataModel';
import HeatMapTooltip from './HeatMapTooltip';

function HeatMapBar(props: {artist: Artist, model: DataModel}) {

    const data = [];
    const result: {[key: string] : string | Array<{[key: string] : string | number | null}>} = { "id": props.artist.name };
    const resultData: Array<{[key: string] : string | number | null}> = [];
    props.model.allWeeks.forEach((week) => {
        const tracks = props.model.filterTracksByWeekAndArtist(week, props.artist.artist_id)
        if (tracks.length === 0) {
            resultData.push({
                'x': week,
                'y': null,
            })
        } else {
            resultData.push({
                'x': week,
                'y': tracks.length,
            })
        }
    })
    result['data'] = resultData;
    data.push(result);

    return (
    <div style={{height: '25px', marginBottom: '10px'}}>
    <ResponsiveHeatMap
        // @ts-expect-error
        data={data}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        // valueFormat=">-.2s"
        theme={getTheme()}
        colors={{
            type: 'sequential',
            scheme: 'reds',
            minValue: 1,
            maxValue: 9
        }}
        emptyColor="#000000"
        enableLabel={false}
        label={''}
        borderColor={{ from: 'color'}}
        tooltip={HeatMapTooltip}
    />
    </div>)
}

export default HeatMapBar;