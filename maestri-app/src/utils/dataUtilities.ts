



const typeToBarKeys: {[key: string]: Array<string>} = {
    'team size': ['1 contributor', '2-5 contributors', '6-10 contributors', '11+ contributors'],
    '# weeks on charts': ['1 week', '2-5 weeks', '6-10 weeks', '11+ weeks'],
    '# tracks at peak rank': ['#1 tracks', 'top 10 tracks', 'top 50 tracks', 'top 200 tracks'],
    '# charting tracks': ['primary', 'featured', 'producer', 'writer'],
    'samples/interpolations used': ['no samples/interpolations', 'only samples', 'only interpolations', 'samples and interpolations'],
}

export function getBarKeysFromType(barType: string) {
    return typeToBarKeys[barType] || null;
}