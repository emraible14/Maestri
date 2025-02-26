import { Artist, Network, NetworkNode, Track } from "./utils/interfaces";
import artistsJson from "../../data/artists_v2.json";
import tracksJson from "../../data/tracks.json";
import networkJson from '../../data/network.json'  
import { countryCodeMapping } from "./utils/mapUtilities";
import { nivoDarkColorPalette } from "./utils/colorUtilities";

export class DataModel {
    artists: {[key: string]: Artist};
    tracks: {[key: string]: Track};
    allWeeks: Array<string>;
    networkData: {[key: string]: Network };

    constructor() {
        this.artists = artistsJson;
        this.tracks = tracksJson;
        this.networkData = networkJson;

        this.allWeeks = Array.from(
            new Set(Object.values(this.tracks).flatMap((track) => track.chartings.map((charting) => charting.week)))
        ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        // hotfix to add artist_id field
        Object.keys(this.artists).forEach((id) => {
            this.artists[id].artist_id = id;
        });
        // hotfix to add track_id field
        Object.keys(this.tracks).forEach((id) => {
            this.tracks[id].track_id = id;
        });

    }

    getArtists() {
        return Object.values(this.artists)
    }

    getArtist(id: string) {
        return this.artists[id];
    }

    getSpecificArtists(ids: Array<string>): Array<Artist> {
        const result: Array<Artist> = [];
        ids.forEach((id) => {
            if (this.artists[id]) {
                result.push(this.artists[id]);
            }
        });
        return result;
    }

    getNetworkDataForArtist(artistId: string) {
        return this.networkData[artistId] || {};
    }

    getSpecificTracks(ids: Array<string>): Array<Track> {
        const result: Array<Track> = [];
        ids.forEach((id) => {
            if (this.tracks[id]) {
                result.push(this.tracks[id]);
            }
        });
        return result;
    }

    filterTracksByWeekAndArtist(targetWeek: string, id: string) {
        const contributionIds = [...new Set(this.artists[id].contributions.map((cont) => { return cont.song_id.toString() }))];
        const result = this.getSpecificTracks(contributionIds)
            .filter((track) => track.chartings.some((charting) => charting.week === targetWeek))
            .map((track) => {
                const filteredChartings = track.chartings.filter((charting) => charting.week === targetWeek);
                return { ...track, chartings: filteredChartings };
            })
        return result;
    }

    generateMapDataForWeek(week: string, artistId: string) {
        const tracksForWeek = this.filterTracksByWeekAndArtist(week, artistId);
      
        const countryData: Record<string, Set<number>> = {};
      
        // initilize each country to fill with number of tracking songs
        Object.keys(countryCodeMapping).forEach(country => {
            const mappedCountry = countryCodeMapping[country];
            countryData[mappedCountry] = new Set(); // Initialize empty set for each country
        });
      
        tracksForWeek.forEach((track) => {
            track.chartings.forEach((charting) => {
                const country = charting.country;
                const mappedCountry = countryCodeMapping[country] || country;
        
                if (!countryData[mappedCountry]) {
                countryData[mappedCountry] = new Set();
                }
        
                countryData[mappedCountry].add(+track.track_id); // Add unique track_id per country
            });
        });
      
        // Convert to the map data format
        return Object.entries(countryData).map(([countryCode, trackIds]) => ({
            id: countryCode,
            value: trackIds.size, // Number of charting songs in that country
        }));
    };

    getNodeSize(node: NetworkNode, max_contributions: number) {
        // Normalize
        const contributions = this.networkData[node.id].total_contributions;
        const normalized_contributions = (contributions) / max_contributions;
        const max_size = 64;
        const min_size = 12
        return Math.floor(normalized_contributions*(max_size-min_size) + min_size);
    }

    getEdgeSize(node: NetworkNode, max_local_collaborations: number){
        // Normalize
        const collaborations = node.num_collaborations;
        const normalized_collaborations = (collaborations) / max_local_collaborations;
        const max_size = 12;
        const min_size = 2;
        return Math.floor(normalized_collaborations*(max_size-min_size) + min_size);
    }

    getEdgeDistance(mainAristId: string, collaboratorId: string, max_local_collaborations: number){
        const nodes: Array<NetworkNode> = this.networkData[mainAristId]["nodes"]
      
        const collaborations = nodes.find(n=>(n.id == collaboratorId)).num_collaborations
      
        const normalized_collaborations = 1 - ((collaborations) / max_local_collaborations); // Inverse relationship. More collaborations = closer to each other
        const max_size = 100;
        const min_size = 45;
        return Math.floor(normalized_collaborations*(max_size-min_size) + min_size);
    }

    getBarData(currentArtists: Array<Artist>, indexKey: string, keys: Array<string>) {
        const barData: Array<{[key: string]: string | number}> = [];
        currentArtists.forEach((artist, i1) => {
            const result: {[key: string]: string | number} = {};
            result[indexKey] = artist.name;
            const artistColor = Object.keys(nivoDarkColorPalette)[i1];
            keys.forEach((key, i2) => {
                result[key] = Math.floor(Math.random() * (Math.floor(20) - Math.ceil(1) + 1) + Math.ceil(1)); // random value
                result[key+"Color"] = nivoDarkColorPalette[artistColor][i2];
            });
            barData.push(result);
        });
        return barData;
    }

    getRadarData(currentArtists: Array<Artist>, indexKey: string) {
        const radarPoints = [
            "avg. team size",
            "# weeks on chart",
            "# top 10 tracks",
            'avg. samples/interpolations used',
            "# charting tracks",
        ];
        const radarData: Array<{[key: string]: string | number}> = [];
        radarPoints.forEach((point) => {
            const result: {[key: string]: string | number} = {};
            result[indexKey] = point;
            currentArtists.forEach((artist) => {
                result[artist.name] = Math.floor(Math.random() * (Math.floor(20) - Math.ceil(1) + 1) + Math.ceil(1)); // random value
            });
            radarData.push(result);
        })
        return radarData;
    }
}