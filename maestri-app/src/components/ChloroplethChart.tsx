import { ResponsiveChoropleth } from "@nivo/geo";
import { MapDatum } from "../utils/interfaces";
import { getColorPalette, getTheme } from "../utils/colorUtilities";
import { getFeaturesArray } from "../utils/mapUtilities";
import ChoroplethTooltip from "./ChloroplethTooltip";
import ChoroplethGlobalTooltip from "./ChloroplethGlobalTooltip";

interface ChoroplethProps {
    mapData: MapDatum[];
    isGlobal: boolean;
    isCumulative: boolean;
    country: string | null;
  }


const ChoroplethChart: React.FC<ChoroplethProps> = ({ mapData, isGlobal, isCumulative, country }) => (
    <ResponsiveChoropleth
        data={isCumulative? mapData:(isGlobal? mapData:mapData.filter((obj) => obj.id === country))}
        features={getFeaturesArray()}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        theme={getTheme()}
        colors={ 
            ['#00000','#fff7ec','#fee8c8','#fdd49e','#fdbb84','#fc8d59','#ef6548','#d7301f','#b30000','#7f0000']}
        domain={[ 0, 10 ]}
        unknownColor="#666666"
        label="properties.name"
        value={'value'}
        projectionType='mercator'
        fillColor={'#00000'}
        enableGraticule={false}
        graticuleLineWidth={0}
        graticuleLineColor={'#00000'}
        isInteractive={true}
        onMouseEnter={() => {}} // Fix: Provide an empty function
        onMouseMove={() => {}}
        onMouseLeave={() => {}}
        onClick={() => {}}
        role=''
        projectionScale={(isGlobal? 120:290)} // change to zoom in zoom out, effectively cutting the map
        projectionTranslation={isGlobal? [0.5, 0.6]:[ 0.77, 1.11 ]}
        projectionRotation={[ 0, 0, 0 ]}
        borderWidth={0.5}
        borderColor={getColorPalette().amber}
        tooltip={(isGlobal? ChoroplethGlobalTooltip: ChoroplethTooltip)} 
        legends={[
            {
                anchor: 'bottom-left',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 0,
                itemsSpacing: 0,
                itemWidth: 18,
                itemHeight: 18,
                itemDirection: 'bottom-to-top',
                itemTextColor: getColorPalette().amber,
                itemOpacity: 0.85,
                symbolSize: 18,
                data: [
                    { id: '0', label: '0', color: '#000000' },
                    { id: '1', label: '1', color: '#fff7ec' },
                    { id: '2', label: '2', color: '#fee8c8' },
                    { id: '3', label: '3', color: '#fdd49e' },
                    { id: '4', label: '4', color: '#fdbb84' },
                    { id: '5', label: '5', color: '#fc8d59' },
                    { id: '6', label: '6', color: '#ef6548' },
                    { id: '7', label: '7', color: '#d7301f' },
                    { id: '8', label: '8', color: '#b30000' },
                    { id: '9', label: '9+', color: '#7f0000' }
              ]
                
            }
        ]
        }
    />
);

export default ChoroplethChart;