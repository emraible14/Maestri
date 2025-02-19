import { Image } from 'primereact/image';
import { getColorPalette, getTheme } from '../utilities';


function Artist() {
  return (
    <div>
      <h1>{artist.name}</h1>
      <span className="card flex justify-content-center">
      <Image src={artist.image_link} alt="Image" width="250"/>
      </span>
      <span>Hello</span>

    </div>
  )
}

export default Artist

const artist = {
  "genius_id": 12345,
  "name": "Dummy Eminem",
  "image_link": "https://media.npr.org/assets/music/news/2010/06/eminem_wide-5b8530e7c1ae24e07afa9c9c5b49b50d46a43364.jpg?s=1400&c=100&f=jpeg",
  "contributions": [
    {
      "track_id": 67890,
      "track_name": "Dummy Song",
      "track_artist_id": 54321,
      "contribution_type": "primary_artist"
    },
    {
      "track_id": 11112,
      "track_name": "Another Dummy Song",
      "track_artist_id": 98765,
      "contribution_type": "writer"
    }
  ],
  "contributors": [
    {
      "track_id": 67890,
      "track_name": "Dummy Song",
      "contributor_id": 22233,
      "contributor_name": "Producer X",
      "contribution_type": "producer"
    },
    {
      "track_id": 67890,
      "track_name": "Dummy Song",
      "contributor_id": 33344,
      "contributor_name": "Writer Y",
      "contribution_type": "writer"
    }
  ]
}

const track = {
  "genius_id": 123456,
  "spotify_id": "7abcD3EfGhIjKlmN",
  "name": "Sample Track",
  "genre": "Pop",
  "charting": [
    {
      "week": "2024-02-12",
      "rank": 5,
      "country": "US",
      "entry_date": "2024-02-01",
      "num_streams": 1200000,
      "weeks_on_chart": 3
    },
    {
      "week": "2024-02-19",
      "rank": 7,
      "country": "UK",
      "entry_date": "2024-02-05",
      "num_streams": 950000,
      "weeks_on_chart": 2
    }
  ],
  "release_date": "2024-01-25",
  "primary_artist_name": "Sample Artist",
  "primary_artist_id": 789012
}
