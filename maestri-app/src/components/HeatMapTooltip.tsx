import { ComputedCell, HeatMapDatum } from '@nivo/heatmap'
import { BasicTooltip } from '@nivo/tooltip'

function HeatMapTooltip({ cell }: { cell: ComputedCell<HeatMapDatum> }) {
    let total = '';
    if (cell.formattedValue === null) {
        total = '0 tracks charting globally';
    } else if (+cell.formattedValue === 1) {
        total = '1 track charting globally';
    } else {
        total = cell.formattedValue + ' tracks charting globally'
    }
    return (
        <BasicTooltip
            id={cell.data.x}
            color={cell.color}
            enableChip={true}
            value={total}
        />
    )
}

export default HeatMapTooltip