import { BasicTooltip } from "@nivo/tooltip"
import { memo } from "react"

interface ChoroplethTooltipProps {
    feature: any; // Replace 'any' with a more specific type if possible
  }

const ChoroplethTooltip = memo(({ feature }: ChoroplethTooltipProps) => {
    if (feature.data === undefined) return null

    if(feature.formattedValue > 100) return ( //used for the global map (standard values from nivo are greater than 100)
        <BasicTooltip
            id={feature.label}
            color={'#1DB954'}
            enableChip={true}
            value={'Included in global data'}
        />
    )

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