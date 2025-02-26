import tracksData from '../dummy_data/tracks.json';
import artistsData from '../dummy_data/artists.json';


// convert country codes from the Spotify to nivo-map
const countryCodeMapping: Record<string, string> = {
  "IT": "ITA",  // italy
  "GB": "GBR",  // uk
  "DE": "DEU",  // germany
  "SE": "SWE",
  "ES": "ESP",
  "AR":"ARG",
  "AT":"AUT",
  "BE":"BEL",
  "BG":"BGR",
  "CA":"CAN",
  "CY":"CYP",
  "CZ":"CZE",
  "DK":"DNK",
  "EE":"EST",
  "FI":"FIN",
  "FR":"FRA",
  "GR":"GRC",
  "HU":"HUN",
  "IS":"ISL",
  "IE":"IRL",
  "LV":"LVA",
  "LT":"LTU",
  "LU":"LUX",
  "MX":"MEX",
  "NL":"NLD",
  "NO":"NOR",
  "PL":"POL",
  "PT":"PRT",
  "RO":"ROU",
  "SK":"SVK",
  "CH":"CHE",
  "UA":"UKR",
  "US":"USA",

  // add more as needed
};

// Define the types for the track data
interface Charting {
  week: string;
  rank: number;
  country: string;
  entry_date: string;
  num_streams: number;
  weeks_on_chart: number;
}

interface Track {
  track_id: number;
  spotify_id: string;
  name: string;
  release_date: string;
  primary_artist_name: string;
  primary_artist_id: number;
  chartings: Charting[];
}

interface Artist {
  artist_id: string;
  name: string;
  image_link: string | null;
  contributions: any[];
  contributors: any[];
}


const tracks: Track[] = tracksData;

// Get sorted unique weeks
const allWeeks = Array.from(
  new Set(tracks.flatMap((track) => track.chartings.map((charting) => charting.week)))
).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

// Function to filter tracks by week and artist name
const filterTracksByWeekAndArtist = (targetWeek: string, artistName: string) => {
  return tracks
    .filter((track) => track.chartings.some((charting) => charting.week === targetWeek))
    .map((track) => {
      const filteredChartings = track.chartings.filter((charting) => charting.week === targetWeek);
      return { ...track, chartings: filteredChartings };
    })
    .filter((track) => track.primary_artist_name.includes(artistName));
};

// Generate map data for a specific week
const generateMapDataForWeek = (week: string, artistName: string) => {
  const tracksForWeek = filterTracksByWeekAndArtist(week, artistName);

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

export type{Track}
export {generateMapDataForWeek, filterTracksByWeekAndArtist, allWeeks}