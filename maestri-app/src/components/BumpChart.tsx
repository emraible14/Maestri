import { getTheme, NIVO_DARK } from '../utils/colorUtilities';
import { ResponsiveBump } from '@nivo/bump'

interface BumpChartProps {
    readonly data: Array<{[key: string]: string}>;
    readonly keys: Array<string>;
}


// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
function BumpChart(props: BumpChartProps) {
    return <ResponsiveBump
            data={data}
            theme={getTheme()}
            colors={{ scheme: NIVO_DARK }}
            lineWidth={3}
            activeLineWidth={6}
            inactiveLineWidth={3}
            inactiveOpacity={0.15}
            pointSize={10}
            activePointSize={16}
            inactivePointSize={0}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={3}
            activePointBorderWidth={3}
            pointBorderColor={{ from: 'serie.color' }}
            axisTop={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: '',
                legendPosition: 'middle',
                legendOffset: 32,
                truncateTickAt: 0
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'ranking',
                legendPosition: 'middle',
                legendOffset: -40,
                truncateTickAt: 0
            }}
            margin={{ top: 40, right: 100, bottom: 40, left: 60 }}
            axisRight={null}
        />
};

export default BumpChart;


const data = [
    {
      "id": "Serie 1",
      "data": [
        {
          "x": "2000",
          "y": 9
        },
        {
          "x": "2001",
          "y": 2
        },
        {
          "x": "2002",
          "y": 12
        },
        {
          "x": "2003",
          "y": 11
        },
        {
          "x": "2004",
          "y": 7
        }
      ]
    },
    {
      "id": "Serie 2",
      "data": [
        {
          "x": "2000",
          "y": 1
        },
        {
          "x": "2001",
          "y": 5
        },
        {
          "x": "2002",
          "y": 8
        },
        {
          "x": "2003",
          "y": 6
        },
        {
          "x": "2004",
          "y": 5
        }
      ]
    },
    {
      "id": "Serie 3",
      "data": [
        {
          "x": "2000",
          "y": 12
        },
        {
          "x": "2001",
          "y": 10
        },
        {
          "x": "2002",
          "y": 4
        },
        {
          "x": "2003",
          "y": 7
        },
        {
          "x": "2004",
          "y": 4
        }
      ]
    },
    {
      "id": "Serie 4",
      "data": [
        {
          "x": "2000",
          "y": 4
        },
        {
          "x": "2001",
          "y": 8
        },
        {
          "x": "2002",
          "y": 7
        },
        {
          "x": "2003",
          "y": 10
        },
        {
          "x": "2004",
          "y": 2
        }
      ]
    },
    {
      "id": "Serie 5",
      "data": [
        {
          "x": "2000",
          "y": 8
        },
        {
          "x": "2001",
          "y": 9
        },
        {
          "x": "2002",
          "y": 1
        },
        {
          "x": "2003",
          "y": 1
        },
        {
          "x": "2004",
          "y": 11
        }
      ]
    }
  ];