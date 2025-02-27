import { GridLabelProps } from '@nivo/radar'
// import { useState } from 'react';

function RadarChartLabel({ id, x, y, anchor }: GridLabelProps) {
    
    // const [fontSize, setFontSize] = useState(14)
    
    return ( <g transform={`translate(${x}, ${y})`}>
        <g className="cursor-pointer" transform={`translate(${anchor === 'end' ? -110 : anchor === 'middle' ? -30 : -20}, 10)`} 
            // onMouseOver={hoverOnLabel} onMouseOut={unhoverOnLabel}
            >
            <text style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    fill: '#ffffff',
                }}>{id}</text>
        </g>
    </g>
    );

    // function hoverOnLabel() {
    //     setFontSize(16);
    // }

    // function unhoverOnLabel() {
    //     setFontSize(14);
    // }

}

export default RadarChartLabel