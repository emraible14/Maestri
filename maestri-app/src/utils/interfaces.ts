export interface Artist {
    "artist_id": string,
    "name": string,
    "image_url": string,
    "contributions": Array<Contribution>,
    "stats": Stats
}

export interface Contribution {
    "song_id": number,
    "type": string
}

export interface Stats {
    "overall": {
        "team_size": {
            "avg": number, 
            "one": number, 
            "two_to_five": number, 
            "six_to_ten": number, 
            "eleven_or_more": number
        }, 
        "contribution_counts": {
            "total": number, 
            "primary": number, 
            "writer": number, 
            "producer": number, 
            "feature": number
        }, 
        "song_references": {
            "total": number, 
            "nothing": number, 
            "samples": number, 
            "interpolations": number, 
            "samples_and_interpolations": number
        }, 
        "top_songs": {
            "total": number,
            "num1": number, 
            "top10": number, 
            "top50": number, 
            "top200": number
        },
        "weeks_on_chart": {
            "totalWeeksOnChart": number, 
            "oneWeek": number, 
            "twoToFiveWeeks": number, 
            "sixToTenWeeks": number, 
            "overTenWeeks": number
        }
    }, 
    "weeks_on_chart": {
        "totalWeeksOnChart": number, 
        "oneWeek": number, 
        "twoToFiveWeeks": number, 
        "sixToTenWeeks": number, 
        "overTenWeeks": number
    }
}

export interface Track {
    "track_id": string,
    "spotify_id": string,
    "name": string, 
    "release_date": string, 
    "image_url": string,
    "primary_artist_name": string, 
    "primary_artist_id": number, 
    "chartings": Array<Chart>,
    "credits": Array<Credit>,
    "stats": {
        "samples": number,
        "interpolations": number,
    }
}

export interface Chart {
    "week": string, 
    "rank": number, 
    "country": string, 
    "entry_date": string, 
    "num_streams": number, 
    "weeks_on_chart": number
}

export interface Credit {
    "artist_id": string,
    "contribution_type": string,
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