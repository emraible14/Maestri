import { Artist, Track } from "./utils/interfaces";
import artistsJson from "../../data/artists.json";
import tracksJson from "../../data/tracks.json";

export class DataModel {
    artists: Array<Artist>;
    tracks: Array<Track>;

    constructor() {
        this.artists = artistsJson;
        this.tracks = tracksJson;
    }

    getArtists() {
        return this.artists;
    }

    getSpecificArtists(ids: Array<number>): Array<Artist> {
        return [...this.artists].filter((art: Artist) => ids.includes(art.artist_id))
    }
}