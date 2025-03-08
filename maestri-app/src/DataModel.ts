import { Artist, Network, Track } from "./utils/interfaces";
import { countryCodeMapping } from "./utils/mapUtilities";
import { nivoDarkColorPalette } from "./utils/colorUtilities";
import { getBarKeyLabelsFromType } from "./utils/dataUtilities";

export class DataModel {
    artists: {[key: string]: Artist} = {};
    tracks: {[key: string]: Track} = {};
    allWeeks: Array<string> = [];
    networkData: {[key: string]: Network } = {};
    isLoaded: boolean = false;

    async loadData() {
        try {
            const [artistsResponse, tracksResponse, networkResponse] = await Promise.all([
                fetch('/data/artists_v3.json'),
                fetch('/data/tracks_v2.json'),
                fetch('/data/network_v3.json')
            ]);

            this.artists = await artistsResponse.json();
            const tracksObject = await tracksResponse.json();
            this.networkData = await networkResponse.json();

            this.tracks = tracksObject;

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

            this.isLoaded = true;
            return true;
        } catch (error) {
            console.error("Failed to load data:", error);
            return false;
        }
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

    getTrack(id: string) {
        return this.tracks[id];
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

    getTracksForArtist(artistId: string) {
        const contributionIds = [...new Set(this.artists[artistId].contributions.map((cont) => { return cont.song_id.toString() }))];
        return this.getSpecificTracks(contributionIds);
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
                    // @ts-expect-error upset because type index could not be in object but for now this is what we are doing
                    result[key] = artist.stats.overall[typeIndex][dataKeys[i2]];
                    result[key+"Color"] = nivoDarkColorPalette[artistColor][i2];
                });
                barData.push(result);
            });
        }
        return barData;
    }

    getRadarData(currentArtists: Array<Artist>, indexKey: string) {
        const radarData: Array<{[key: string]: string}> = [];

        // I hate this, should be a loop but there isn't a consistent way to access the stats so forgive me
        const result1: {[key: string]: string} = {};
        result1[indexKey] = "avg. team size";
        currentArtists.forEach((artist) => {
            result1[artist.name] = artist.stats.overall.team_size.avg.toString();
        });
        radarData.push(result1);

        const result2: {[key: string]: string} = {};
        result2[indexKey] = "# weeks on charts";
        currentArtists.forEach((artist) => {
            result2[artist.name] = artist.stats.weeks_on_chart.totalWeeksOnChart.toString();
        });
        radarData.push(result2);

        const result3: {[key: string]: string} = {};
        result3[indexKey] = "#1 tracks";
        currentArtists.forEach((artist) => {
            result3[artist.name] = artist.stats.overall.top_songs.num1.toString();
        });
        radarData.push(result3);

        const result4: {[key: string]: string} = {};
        result4[indexKey] = "total samples/interpolations used";
        currentArtists.forEach((artist) => {
            result4[artist.name] = artist.stats.overall.song_references.total.toString();
        });
        radarData.push(result4);

        const result5: {[key: string]: string} = {};
        result5[indexKey] = "# charting tracks";
        currentArtists.forEach((artist) => {
            result5[artist.name] = artist.stats.overall.contribution_counts.total.toString();
        });
        radarData.push(result5);

        return radarData;
    }

    // This function is so ugly and can probably be made better and more efficient
    getBumpData(artist: Artist, country: String | null, week: number) {
        const result: Array<{ id: string, data: Array<{ x: string; y: number | null }>}> = [];

        if (country === null) {
            return result;
        }
        
        const start: Date = new Date("2023-01-05");        

        const current = new Date(start);
        current.setDate(start.getDate() + ((week < 5) ? 5 : week) * 7);

        const fiveWeeksAgo = new Date(current);
        fiveWeeksAgo.setDate(current.getDate() - 5 * 7);

        const dates: Array<string> = [];
        for (let d = new Date(fiveWeeksAgo); d <= current; d.setDate(d.getDate() + 7)) {
            dates.push(new Date(d).toLocaleDateString("en-CA"));
        }
        current.setDate(current.getDate()+1);

        const contributionIds = [...new Set(this.artists[artist.artist_id].contributions.map((cont) => { return cont.song_id.toString()}))];
        const trackInfo = this.getSpecificTracks(contributionIds).map((track) => {
            const filteredChartings = track.chartings.filter((charting) => {
                const chartDay = new Date(charting.week);
                return (
                    charting.country === country &&
                    chartDay >= fiveWeeksAgo &&
                    chartDay <= current
                );
            });
            return { ...track, chartings: filteredChartings };
        });

        console.log(current)
        console.log(dates)
        console.log(trackInfo[0])


        trackInfo.forEach((track) => {
            if (!Array.isArray(track.chartings) || !track.chartings.length) { return; }
            const serie: Array<{ x: string, y: number | null }> = [];
            const chartingMap = new Map(track.chartings.map(entry => [entry.week, entry.rank]));

            // Iterate through the list of dates and push rank or null
            dates.forEach((week) => {
                serie.push({ x: week, y: chartingMap.get(week) ?? null });
            });
            result.push({
                id: track.name.toString(),
                data: serie
            })
        });

        return result;
    }

    getCollaborations(artistA: Artist, artistB: Artist) {
        /**
         * Returns the track ids of tracks where both artists have a credit
         */
        const tracksA: Set<number> = new Set(artistA.contributions.map((c) => { return c.song_id }))
        const tracksB: Set<number> = new Set(artistB.contributions.map((c) => { return c.song_id }))
        const collaborations: Array<number> = []
        tracksA.forEach((s) => {
            if (tracksB.has(s)) {
                collaborations.push(s)
            }
        })
        return collaborations.map(String)
    }
}
