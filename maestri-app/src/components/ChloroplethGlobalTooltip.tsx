import { BasicTooltip } from "@nivo/tooltip"
import { memo } from "react"

interface ChoroplethTooltipProps {
    feature: any; // Replace 'any' with a more specific type if possible
  }

const ChoroplethGlobalTooltip = memo(({ feature }: ChoroplethTooltipProps) => {
    if (feature.data === undefined) return null


    return (
        <BasicTooltip
            id={feature.label}
            color={feature.color}
            enableChip={true}
            value={'is included in global data'}
        />
    )
})

export default ChoroplethGlobalTooltip