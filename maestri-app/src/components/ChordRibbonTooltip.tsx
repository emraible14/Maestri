import { RibbonTooltipComponentProps } from "@nivo/chord";
import { TableTooltip, Chip } from '@nivo/tooltip'

function ChordRibbonTooltip({ ribbon }: RibbonTooltipComponentProps) {

    let rows = [];
    if (ribbon.target.id === ribbon.source.id) {
        rows = [
            [
                <Chip key="chip" color={ribbon.source.color} />,
                <strong key="id">{ribbon.source.id}</strong>,
                <span>{ribbon.source.value} total track{ribbon.source.value > 1 ? 's' : ''}</span>,
            ],
        ]
    } else {
        rows = [
            [
                <Chip key="chip" color={'#ffffff'} />,
                <span>{ribbon.target.value} collaboration{ribbon.target.value > 1 ? 's' : ''}</span>
            ],
            [
                <Chip key="chip" color={ribbon.source.color} />,
                <strong key="id">{ribbon.source.id}</strong>,
            ],
            [
                <Chip key="chip" color={ribbon.target.color} />,
                <strong key="id">{ribbon.target.id}</strong>,
            ],
        ]
    }

    return(<TableTooltip
        rows={rows}
    />)
}

export default ChordRibbonTooltip;