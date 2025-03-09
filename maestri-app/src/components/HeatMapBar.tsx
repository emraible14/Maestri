import { ResponsiveHeatMap } from '@nivo/heatmap'
import { getTheme } from '../utils/colorUtilities';
import {Artist, Track} from '../utils/interfaces';
import { DataModel } from '../DataModel';
import HeatMapTooltip from './HeatMapTooltip';
import {useEffect, useState} from "react";

function HeatMapBar(props: { model: DataModel, currentTracks: Track[], setSliderPosition: (newDate: string) => void}) {
    const [data, setData] = useState<{ id: string; data: { x: string; y: number | null; }[]; }[]>([]);

    useEffect(() => {
        const newData = [
            {
                id: "X",
                data: props.model.allWeeks.map(week => {
                    const numTracks = props.currentTracks
                      .filter(track => track.chartings.some(chart => chart.week === week)).length

                    return {
                        "x": week,
                        "y": numTracks === 0 ? null : numTracks,
                    }
                })
            }
        ]

        setData(newData)
    }, [props.currentTracks]);

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
        enableLabels={false}
        label={''}
        borderColor={{ from: 'color'}}
        tooltip={HeatMapTooltip}
        onClick={(e) => props.setSliderPosition(e.data.x as string)}
    />
    </div>)
}

export default HeatMapBar;