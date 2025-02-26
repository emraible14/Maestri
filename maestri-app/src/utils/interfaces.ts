export interface Artist {
    "artist_id": string,
    "name": string,
    "image_url": string,
    "contributions": Array<Contribution>,
    "stats": Stats
}

export interface Contribution {
    "song_id": number,
    "contribution_type": string
}

export interface Stats {
    "contributions": {
        "avg": number,
        "one": number,
        "twoToFive": number,
        "sixToTen": number,
        "elevenOrMore": number
    }
}

// export interface Contributor {
//     "track_id": number,
//     "track_name": string,
//     "contributor_artist_id": number,
//     "contributor_name": string,
//     "contribution_type": string
// }

export interface Track {
    "track_id": number,
    "spotify_id": string,
    "name": string, 
    "release_date": string, 
    "primary_artist_name": string, 
    "primary_artist_id": number, 
    "chartings": Array<Chart>,
}

export interface Chart {
    "week": string, 
    "rank": number, 
    "country": string, 
    "entry_date": string, 
    "num_streams": number, 
    "weeks_on_chart": number
}

export interface MapDatum {
    id: string | number;
    value: number;
}

export interface Network {
    "nodes": Array<NetworkNode>,
    "links": Array<NetworkLink>, 
    "total_contributions": number, 
}

export interface NetworkNode {
    "id": string,
    "name": string, 
    "num_collaborations": number,
}

export interface NetworkLink {
    "source": string, 
    "target": string,
    "distance": number,
}