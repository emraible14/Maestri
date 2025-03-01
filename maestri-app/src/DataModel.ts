import { Artist, Network, NetworkNode, Track } from "./utils/interfaces";
import artistsJson from "../../data/artists_v3.json";
import tracksJson from "../../data/tracks.json";
import networkJson from '../../data/network_v3.json'
import { countryCodeMapping } from "./utils/mapUtilities";
import { nivoDarkColorPalette } from "./utils/colorUtilities";
import { getBarKeyLabelsFromType } from "./utils/dataUtilities";


// hotfix (am i using this word correctly) to convert array to an object with track_id as keys which makes the map work again
const tracksObject = tracksJson.reduce((acc, track) => {
    acc[track.track_id] = track;  // Use track_id as the key
    return acc;
  }, {} as { [key: number]: Track }); // Type declaration for tracksObject
  
export class DataModel {
    artists: {[key: string]: Artist};
    tracks: {[key: string]: Track};
    allWeeks: Array<string>;
    networkData: {[key: string]: Network };

    constructor() {
        this.artists = artistsJson;
        this.tracks = tracksObject;
        this.networkData = networkJson;

        this.allWeeks = Array.from(
            new Set(Object.values(this.tracks).flatMap((track) => track.chartings.map((charting) => charting.week)))
        ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        // hotfix to add artist_id field and adjust stats data
        Object.keys(this.artists).forEach((id) => {
            this.artists[id].artist_id = id;
            this.artists[id].stats.overall.weeks_on_chart = this.artists[id].stats.weeks_on_chart;
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
        const max_size = 8;
        const min_size = 1;
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

    getBarData(currentArtists: Array<Artist>, indexKey: string, barType: string) {
        const barData: Array<{[key: string]: string | number}> = [];

        const keys = getBarKeyLabelsFromType(barType);
        let dataKeys: Array<string> = [];
        let typeIndex = ""
        if (barType === "avg. team size") {
            typeIndex = "team_size";
            dataKeys = ['one', 'two_to_five', 'six_to_ten', 'eleven_or_more'];
        } else if (barType === "# weeks on charts") {
            typeIndex = "weeks_on_chart";
            dataKeys = ["oneWeek", "twoToFiveWeeks", "sixToTenWeeks", "overTenWeeks"];
        } else if (barType === "#1 tracks") {
            typeIndex = "top_songs";
            dataKeys = ['num1', 'top10', 'top50', 'top200'];
        } else if (barType === "total samples/interpolations used") {
            typeIndex = "song_references";
            dataKeys = ['nothing', 'samples', 'interpolations', 'samples_and_interpolations'];
        } else if (barType === "# charting tracks") {
            typeIndex = "contribution_counts";
            dataKeys = ['primary', 'feature', 'producer', 'writer'];
        }


        if (typeIndex) {
            currentArtists.forEach((artist, i1) => {
                const result: {[key: string]: string | number} = {};
                result[indexKey] = artist.name;
                const artistColor = Object.keys(nivoDarkColorPalette)[i1];
                keys.forEach((key, i2) => {
                    result[key] = artist.stats.overall[typeIndex][dataKeys[i2]];
                    result[key+"Color"] = nivoDarkColorPalette[artistColor][i2];
                });
                barData.push(result);
            });
        }
        return barData;
    }

    getRadarData(currentArtists: Array<Artist>, indexKey: string) {
        const radarData: Array<{[key: string]: string | number}> = [];

        // I hate this, should be a loop but there isn't a consistent way to access the stats so forgive me
        const result1: {[key: string]: string | number} = {};
        result1[indexKey] = "avg. team size";
        currentArtists.forEach((artist) => {
            result1[artist.name] = artist.stats.overall.team_size.avg;
        });
        radarData.push(result1);

        const result2: {[key: string]: string | number} = {};
        result2[indexKey] = "# weeks on charts";
        currentArtists.forEach((artist) => {
            result2[artist.name] = artist.stats.weeks_on_chart.totalWeeksOnChart;
        });
        radarData.push(result2);

        const result3: {[key: string]: string | number} = {};
        result3[indexKey] = "#1 tracks";
        currentArtists.forEach((artist) => {
            result3[artist.name] = artist.stats.overall.top_songs.num1;
        });
        radarData.push(result3);

        const result4: {[key: string]: string | number} = {};
        result4[indexKey] = "total samples/interpolations used";
        currentArtists.forEach((artist) => {
            result4[artist.name] = artist.stats.overall.song_references.total;
        });
        radarData.push(result4);

        const result5: {[key: string]: string | number} = {};
        result5[indexKey] = "# charting tracks";
        currentArtists.forEach((artist) => {
            result5[artist.name] = artist.stats.overall.contribution_counts.total;
        });
        radarData.push(result5);

        return radarData;
    }
}