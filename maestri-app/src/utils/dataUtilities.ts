const typeToBarKeyLabels: {[key: string]: Array<string>} = {
    'avg. team size': ['1 contributor', '2-5 contributors', '6-10 contributors', '11+ contributors'],
    '# weeks on charts': ['1 week', '2-5 weeks', '6-10 weeks', '11+ weeks'],
    '#1 tracks': ['Number 1', 'Top 10', 'Top 50', 'Top 200'],
    '# charting tracks': ['primary', 'feature', 'producer', 'writer'],
    'total samples/interpolations used': ['no samples/interpolations', 'only samples', 'only interpolations', 'samples and interpolations'],
}

export function getBarKeyLabelsFromType(barType: string) {
    return typeToBarKeyLabels[barType] || null;
}

export const contributionLabels = {
    "primary": "PR",
    "feature": "FT",
    "producer": "PD",
    "writer": "WR",
}