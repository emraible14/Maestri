export const colorPalette: { [key: string]: string } = {
    black: "#111827",
    brown_sugar: "#c57b57",
    beaver: "#ae9487",
    cadet_gray: "#96acb7",
    cambridge_blue: "#81957f",
    reseda_green: "#6c7d47",
    sandina_sheen_gold: "#b49e35",
    amber: "#fbbf23"
};

export const NIVO_DARK = "dark2";

export const nivoDarkColorPalette: {[key:string]: Array<string>} = {
    '#1b9e77': ['#1b9e77', '#40d195', '#8edab3', '#d4eddd'],
    '#d95f02': ['#d95f02', '#eb7d2a', '#e39f6c', '#e3c0a6'],
    '#7570b3': ['#7570b3', '#9994c4', '#bbb6d5', '#dbd8e8'],
    '#e7298a': ['#e7278a', '#ed5ba6', '#f38fc3','#f9c3df'],
    '#66a61e': ['#65a41e', '#89cb3e', '#abd180', '#cddeba'],
    '#e6ab02': [],
    '#a6761d': [],
    '#666666': [],
}

function getColorPalette(){
    return colorPalette;
}

// You can pass this object to the `theme` property
const theme = {
    "background": "#111827",
    "text": {
        "fontSize": 14,
        "fill": "#ffffff",
        "outlineWidth": 0,
        "outlineColor": "transparent"
    },
    "axis": {
        "domain": {
            "line": {
                "stroke": "#ffffff",
                "strokeWidth": 1
            }
        },
        "legend": {
            "text": {
                "fontSize": 18,
                "fill": "#ffffff",
                "outlineWidth": 0,
                "outlineColor": "transparent"
            }
        },
        "ticks": {
            "line": {
                "stroke": "#777777",
                "strokeWidth": 1
            },
            "text": {
                "fontSize": 14,
                "fill": "#ffffff",
                "outlineWidth": 0,
                "outlineColor": "transparent"
            }
        }
    },
    "grid": {
        "line": {
            "stroke": "#999",
            "strokeWidth": 1
        }
    },
    "legends": {
        "title": {
            "text": {
                "fontSize": 14,
                "fill": "#ffffff",
                "outlineWidth": 0,
                "outlineColor": "transparent"
            }
        },
        "text": {
            "fontSize": 14,
            "fill": "#ffffff",
            "outlineWidth": 0,
            "outlineColor": "transparent"
        },
        "ticks": {
            "line": {},
            "text": {
                "fontSize": 14,
                "fill": "#333333",
                "outlineWidth": 0,
                "outlineColor": "transparent"
            }
        }
    },
    "annotations": {
        "text": {
            "fontSize": 14,
            "fill": "#333333",
            "outlineWidth": 2,
            "outlineColor": "#ffffff",
            "outlineOpacity": 1
        },
        "link": {
            "stroke": "#000000",
            "strokeWidth": 1,
            "outlineWidth": 2,
            "outlineColor": "#ffffff",
            "outlineOpacity": 1
        },
        "outline": {
            "stroke": "#000000",
            "strokeWidth": 2,
            "outlineWidth": 2,
            "outlineColor": "#ffffff",
            "outlineOpacity": 1
        },
        "symbol": {
            "fill": "#000000",
            "outlineWidth": 2,
            "outlineColor": "#ffffff",
            "outlineOpacity": 1
        }
    },
    "tooltip": {
        "wrapper": {},
        "container": {
            "background": "#ffffff",
            "color": "#333333",
            "fontSize": 14
        },
        "basic": {},
        "chip": {},
        "table": {},
        "tableCell": {},
        "tableCellValue": {}
    }
}

const getTheme = () => theme;

export {getColorPalette, getTheme}

