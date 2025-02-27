import pandas as pd
import json
import math

def create_tracks_json(df_tracks, df_contributions, df_charting, df_image_urls):
    tracks_json_format = {}
    spotify_id_to_genius_id = {}

    #? 1) Tracks
    for i, t in df_tracks.iterrows():
        image_url = df_image_urls[(df_image_urls['id'] == t['geniusId']) & (df_image_urls['type'] == 'song')]['imageURL']

        print(t['geniusId'], image_url)
        tracks_json_format[t['geniusId']] = {
            "spotify_id": t.get('spotifyId', None),
            "name": t['geniusTrackName'],
            "release_date": t.get('geniusReleaseDate', None),
            "image_url": image_url.iloc[0] if not image_url.empty else None,
            "credits": [],
            "chartings": []
        }

        if not pd.isnull(t['spotifyId']):
            spotify_id_to_genius_id[t['spotifyId']] = t['geniusId']

    #? 2) Add charting information to spotify songs
    for i, c in df_charting.iterrows():
        genius_id = spotify_id_to_genius_id.get(c['spotifyId'], None)
        if genius_id is None:
            print(f"Skipping {c['spotifyId']} for charting")
            continue

        tracks_json_format[genius_id]['chartings'].append({
            "week": c['Week'],
            "rank": c['currentRank'],
            "country": c['Country'],
            "entry_date": c['entryDate'],
            "num_streams": c['numStreams'],
            "weeks_on_chart": c['weeksOnChart'],
        })

    #? 3) add contributions to song
    for i, contribution in df_contributions.iterrows():
        if contribution['type'] == "primary":
            tracks_json_format[contribution['geniusId']]['primary_artist_name'] = contribution['name']
            tracks_json_format[contribution['geniusId']]['primary_artist_id'] = contribution['artistId']

        tracks_json_format[contribution['geniusId']]['credits'].append({
            "artist_id": contribution['artistId'],
            "contribution_type": contribution['type']
        })

    #? 99) write to json file
    with open('tracks_v2.json', 'w') as fp:
        json.dump(tracks_json_format, fp)


def create_artists_json(df_tracks, df_contributions, df_charting, df_image_urls):
    artist_json_format = {}

    #? 1) Artists
    for i, c in df_contributions.iterrows():
        image_url = df_image_urls[(df_image_urls['id'] == c['artistId']) & (df_image_urls['type'] == 'artist')]['imageURL']

        artist_json_format[c['artistId']] = {
            "name": c['name'],
            "image_url": image_url.iloc[0] if not image_url.empty else None,
            "contributions": [{"song_id": x['geniusId'], "type": x['type']} for i, x in df_contributions[df_contributions['artistId'] == c['artistId']].iterrows()],
            "stats": {}
        }

    #? 2) Add stats
    for artistId in df_contributions.drop_duplicates(subset=["artistId"])['artistId']:
        num_contributions_x_artist = []
        for songId in df_contributions[df_contributions['artistId'] == artistId]['geniusId'].drop_duplicates():
            num_contributions = df_contributions[df_contributions['geniusId'] == songId]['artistId'].drop_duplicates().count()
            num_contributions_x_artist.append(num_contributions)
            # print(f"{songId}: {num_contributions}")
        # print(num_contributions_x_artist)

        artist_json_format[artistId]['stats']['contributions'] = {
            "avg": math.floor(sum(num_contributions_x_artist) / len (num_contributions_x_artist)),
            "one": len([x for x in num_contributions_x_artist if x == 1]),
            "twoToFive": len([x for x in num_contributions_x_artist if 2 <= x <= 5]),
            "sixToTen": len([x for x in num_contributions_x_artist if 6 <= x <= 10]),
            "elevenOrMore": len([x for x in num_contributions_x_artist if x >= 11])
        }



    with open('artists_v2.json', 'w') as fp:
        json.dump(artist_json_format, fp)




if __name__ == "__main__":
    """
    Track
    {genius_id
     spotify_id
     name
     genre
     charting [{
                week
                rank
                country
                entry_date
                num_streams
                weeks_on_chart
                }]
     release_date
     primary_artist_name
     primary_artist_id
    }
    """

    # tracks_file = "merged_datasets/df_tracks_merged.csv"
    # contributions_file = "merged_datasets/df_contributions_merged.csv"
    # charting_file = "merged_datasets/df_charting_merged.csv"


    tracks_file = "output_tracks.csv"
    contributions_file = "output_contributions.csv"
    charting_file = "output.csv"
    image_urls_file = "image_urls.csv"

    # load tracks
    df_tracks = pd.read_csv(tracks_file, dtype={"geniusId": pd.Int64Dtype()})  # spotifyId,trackName,artistName,releaseDate,geniusId,geniusTrackName,geniusArtistName,geniusReleaseDate,trackLanguage
    df_tracks = df_tracks[df_tracks["geniusId"].notna()].drop_duplicates(subset=["geniusId"])

    # load contributions
    df_contributions = pd.read_csv(contributions_file, dtype={"geniusId": pd.Int64Dtype(), "artistId": pd.Int64Dtype()})

    # load charting data
    df_charting = pd.read_csv(charting_file)  # Country,Week,spotifyId,trackName,artistName,releaseDate,currentRank,peakRank,weeksOnChart,numStreams,entryDate

    # load image urls
    df_image_urls = pd.read_csv(image_urls_file)

    tracks_by_spotify_id = {}
    tracks_without_charting = []

    #? TRACKS
    create_tracks_json(df_tracks, df_contributions, df_charting, df_image_urls)

    #? ARTISTS
    create_artists_json(df_tracks, df_contributions, df_charting, df_image_urls)