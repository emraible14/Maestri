import { ArcTooltipComponentProps } from "@nivo/chord";
import { BasicTooltip } from '@nivo/tooltip'


function ChordArcTooltip ({ arc }: ArcTooltipComponentProps) {
    return (<BasicTooltip
        id={arc.label}
        value={''}
        color={arc.color}
        enableChip={true}
    />)
}

export default ChordArcTooltip;