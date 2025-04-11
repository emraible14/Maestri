import { useMemo } from 'react'
import { useTheme } from '@nivo/core'
import { useInheritedColor, InheritedColorConfig } from '@nivo/colors'
import {
    BumpDatum,
    BumpComputedSerie,
    BumpLabel,
    BumpLabelData,
    BumpSerieExtraProps,
} from '@nivo/bump'

export const useBumpSeriesLabels = <
    Datum extends BumpDatum,
    ExtraProps extends BumpSerieExtraProps
>({
    series,
    position,
    padding,
    color,
    getLabel,
}: {
    series: BumpComputedSerie<Datum, ExtraProps>[]
    position: 'start' | 'end'
    padding: number
    color: InheritedColorConfig<BumpComputedSerie<Datum, ExtraProps>>
    getLabel: Exclude<BumpLabel<Datum, ExtraProps>, false>
}) => {
    const theme = useTheme()
    const getColor = useInheritedColor(color, theme)

    return useMemo(() => {
        let textAnchor: 'start' | 'end'
        let signedPadding: number
        if (position === 'start') {
            textAnchor = 'end'
            signedPadding = padding * -1
        } else {
            textAnchor = 'start'
            signedPadding = padding
        }

        const labels: BumpLabelData<Datum, ExtraProps>[] = []
        series.forEach(serie => {
          let label = serie.id
          if (typeof getLabel === 'function') {
            label = getLabel(serie.data)
          }
          
            const point: any =
                position === 'start'
                    ? serie.data[0]
                    // @ts-expect-error
                    : serie.data[serie.data.length - 1]
                    
            // exclude labels for series having missing data at the beginning/end
            if (point?.position.y === null || point?.position.x === null) {
                return
            }

            labels.push({
                id: serie.id,
                label,
                x: point.position.x + signedPadding,
                y: point.position.y,
                color: getColor(serie) as string,
                opacity: serie.opacity,
                serie,
                textAnchor,
            })
        })

        return labels
    },  [series, position, padding, getColor, getLabel])
}