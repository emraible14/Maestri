import { BasicTooltip } from "@nivo/tooltip"
import { memo } from "react"

const ChoroplethTooltip = memo(({ feature }) => {
    if (feature.data === undefined) return null

    return (
        <BasicTooltip
            id={feature.label}
            color={feature.color}
            enableChip={true}
            value={feature.formattedValue + ' track' + (feature.formattedValue === 1 ? '' : 's') + ' charting'}
        />
    )
})

export default ChoroplethTooltip