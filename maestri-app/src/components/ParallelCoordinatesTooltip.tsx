import { TooltipProps, DatumGroupKeys, BaseDatum } from '@nivo/parallel-coordinates'



export const ParallelCoordinatesTooltip = <
    Datum extends BaseDatum,
    GroupBy extends DatumGroupKeys<Datum> | undefined
>({
    datum,
}: TooltipProps<Datum, GroupBy>) => (
    <div
        style={{
            padding: '12px',
            borderRadius: '3px',
            color: `#ffffff`,
            backgroundColor: datum.color,
            display: 'grid',
            gridTemplateColumns: '1fr',
            gridColumnGap: '12px',
            boxShadow: '2px 5px 5px #00000033',
        }}
    >
        <b>{datum.id}</b>
        charting tracks: {(datum.data)["charting_tracks"]} 
        <br></br>
        avg. team size: {datum.data["avg_team_size"]}
        <br></br>
        total samples/interpolations: {datum.data["originality"]}
        <br></br>
        top 10 hits: {datum.data["num_one"]}

    </div>
)