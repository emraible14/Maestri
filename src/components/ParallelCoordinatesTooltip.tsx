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
        charting tracks: {// @ts-expect-error
                        datum.data.charting_tracks}
        <br />
        avg. team size: {// @ts-expect-error
                        datum.data.avg_team_size}
        <br />
        total samples/interpolations: {// @ts-expect-error
                        datum.data.originality}
        <br />
        top 10 hits: {// @ts-expect-error
                        datum.data.num_one}

    </div>
)