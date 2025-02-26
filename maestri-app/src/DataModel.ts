import { Artist, Network, NetworkNode, Track } from "./utils/interfaces";
import artistsJson from "../../data/artists.json";
import tracksJson from "../../data/tracks.json";
import networkJson from '../../data/network.json'  
import { countryCodeMapping } from "./utils/mapUtilities";

export class DataModel {
    artists: Array<Artist>;
    tracks: Array<Track>;
    allWeeks: Array<string>;
    networkData: {[key: string]: Network };

    constructor() {
        this.artists = artistsJson;
        this.tracks = tracksJson;
        this.networkData = networkJson;

        this.allWeeks = Array.from(
            new Set(this.tracks.flatMap((track) => track.chartings.map((charting) => charting.week)))
          ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    }

    getArtists() {
        return this.artists;
    }

    getSpecificArtists(ids: Array<string>): Array<Artist> {
        return [...this.artists].filter((art: Artist) => ids.includes(art.artist_id.toString()))
    }

    getNetworkDataForArtist(artistId: string) {
        return this.networkData[artistId] || {};
    }

    filterTracksByWeekAndArtist(targetWeek: string, artistName: string) {
        return this.tracks
          .filter((track) => track.chartings.some((charting) => charting.week === targetWeek))
          .map((track) => {
            const filteredChartings = track.chartings.filter((charting) => charting.week === targetWeek);
            return { ...track, chartings: filteredChartings };
          })
          .filter((track) => track.primary_artist_name.includes(artistName));
    }

    generateMapDataForWeek(week: string, artistName: string) {
        const tracksForWeek = this.filterTracksByWeekAndArtist(week, artistName);
      
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
      
            countryData[mappedCountry].add(track.track_id); // Add unique track_id per country
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
}