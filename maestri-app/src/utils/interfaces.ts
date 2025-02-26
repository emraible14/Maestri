export interface Artist {
    "artist_id": number,
    "name": string,
    "image_link": string,
    "contributions": Array<Contribution>,
    "contributors": Array<Contributor>
    "top chart": number,
    "avg. team size": number,
    "# weeks on chart": number,
    "# top 5 tracks": number,
    "# credits": number
}

export interface Contribution {
    "track_id": number,
    "track_name": string,
    "primary_artist_id": number,
    "contribution_type": string
}

export interface Contributor {
    "track_id": number,
    "track_name": string,
    "contributor_artist_id": number,
    "contributor_name": string,
    "contribution_type": string
}

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