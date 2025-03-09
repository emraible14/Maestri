import numpy as np
import pandas as pd
import json
import math
from tqdm import tqdm

def create_tracks_json(df_tracks, df_contributions, df_charting, df_image_urls, df_relationships):
    tracks_json = {}
    spotify_id_to_genius_id = {}

    #? 1) Tracks
    for i, t in df_tracks[~df_tracks["spotifyId"].isna()].iterrows():
        image_url = df_image_urls[(df_image_urls['id'] == t['geniusId']) & (df_image_urls['type'] == 'song')]['imageURL']

        # print(t['geniusId'], image_url)
        tracks_json[t['geniusId']] = {
            "spotify_id": t.get('spotifyId', None),
            "name": t['geniusTrackName'],
            "release_date": t.get('geniusReleaseDate', None),
            "image_url": image_url.iloc[0] if not image_url.empty else None,
            "credits": [],
            "chartings": [],
            "stats": {
                'samples': 0,
                'interpolations': 0,
            }
        }

        if not pd.isnull(t['spotifyId']):
            spotify_id_to_genius_id[t['spotifyId']] = t['geniusId']

    #? 2) Add charting information to spotify songs
    for i, c in df_charting.iterrows():
        genius_id = spotify_id_to_genius_id.get(c['spotifyId'], None)
        if genius_id is None:
            # print(f"Skipping {c['spotifyId']} for charting")
            continue

        tracks_json[genius_id]['chartings'].append({
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
            tracks_json[contribution['geniusId']]['primary_artist_name'] = contribution['name']
            tracks_json[contribution['geniusId']]['primary_artist_id'] = contribution['artistId']

        tracks_json[contribution['geniusId']]['credits'].append({
            "artist_id": str(contribution['artistId']),
            "contribution_type": contribution['type']
        })

    #? 4) statistics
    for i, x in df_tracks.merge(df_relationships, left_on="geniusId", right_on="from_genius_id", how="inner").groupby(['spotifyId']).agg(list).iterrows():
        tracks_json[x['geniusId'][0]]['stats']['samples'] = x['type'].count('samples')
        tracks_json[x['geniusId'][0]]['stats']['interpolations'] = x['type'].count('interpolates')

    #? 99) write to json file
    with open('tracks_v2.json', 'w') as fp:
        json.dump(tracks_json, fp)


def create_artists_json(df_tracks, df_contributions, df_charting, df_image_urls, df_relationships):
    artist_json = {}

    #? 1) Artists
    for i, c in df_contributions.iterrows():
        image_url = df_image_urls[(df_image_urls['id'] == c['artistId']) & (df_image_urls['type'] == 'artist')]['imageURL']

        artist_json[c['artistId']] = {
            "name": c['name'],
            "image_url": image_url.iloc[0] if not image_url.empty else None,
            "contributions": [{"song_id": str(x['geniusId']), "type": x['type']} for i, x in df_contributions[df_contributions['artistId'] == c['artistId']].iterrows()],
            "stats": {
                "overall": {}
            }
        }

    #? 2) Add stats
    for artistId in df_contributions.drop_duplicates(subset=["artistId"])['artistId']:
        song_ids_for_artist = df_contributions[df_contributions['artistId'] == artistId].drop_duplicates(subset=["geniusId"])['geniusId']

        #? TEAM SIZES
        num_contributions_x_artist = []
        for songId in song_ids_for_artist:
            num_contributions = df_contributions[df_contributions['geniusId'] == songId]['artistId'].drop_duplicates().count()
            num_contributions_x_artist.append(num_contributions)
            # print(f"{songId}: {num_contributions}")
        # print(num_contributions_x_artist)

        artist_json[artistId]['stats']['overall']['team_size'] = {
            "avg": math.floor(sum(num_contributions_x_artist) / len (num_contributions_x_artist)),
            "one": len([x for x in num_contributions_x_artist if x == 1]),
            "two_to_five": len([x for x in num_contributions_x_artist if 2 <= x <= 5]),
            "six_to_ten": len([x for x in num_contributions_x_artist if 6 <= x <= 10]),
            "eleven_or_more": len([x for x in num_contributions_x_artist if x >= 11])
        }

        #? TYPE OF CONTRIBUTION STATS
        contributions_counts = df_contributions[df_contributions['artistId'] == artistId]['type'].value_counts()

        artist_json[artistId]['stats']['overall']['contribution_counts'] = {
            "total":  int(contributions_counts.sum()),
            "primary": int(contributions_counts.get(["primary"], 0)),
            "writer": int(contributions_counts.get(["writer"], 0)),
            "producer": int(contributions_counts.get(["producer"], 0)),
            "feature": int(contributions_counts.get(["feature"], 0)),
        }


        #? REFERENCES COUNT
        n_songs_by_artist = int(song_ids_for_artist.count())

        grouped_relationships = df_relationships[df_relationships['from_genius_id'].isin(song_ids_for_artist)].groupby('from_genius_id')['type'].agg(set)
        count_samples_and_interpolations = grouped_relationships.apply(lambda x: 'samples' in x and 'interpolates' in x).sum()
        count_only_samples = grouped_relationships.apply(lambda x: x == {'samples'}).sum()
        count_only_interpolations = grouped_relationships.apply(lambda x: x == {'interpolates'}).sum()

        artist_json[artistId]['stats']['overall']['song_references'] = {
            'total': int(count_samples_and_interpolations + count_only_samples + count_only_interpolations),
            'nothing': int(n_songs_by_artist - count_samples_and_interpolations - count_only_samples - count_only_interpolations),
            'samples': int(count_only_samples),
            'interpolations': int(count_only_interpolations),
            'samples_and_interpolations': int(count_samples_and_interpolations)
        }

        #? TOP X SONGS
        spotify_ids_for_artist = df_tracks[df_tracks['geniusId'].isin(song_ids_for_artist)]['spotifyId']
        charts_for_artist = df_charting[(df_charting['spotifyId'].isin(spotify_ids_for_artist)) & (df_charting['Country'] == "GLOBAL")]


        peak_ranks = charts_for_artist.groupby('spotifyId')['peakRank'].max()

        artist_json[artistId]['stats']['overall']['top_songs'] = {
            "total": len(peak_ranks),
            "num1": len([x for x in peak_ranks if x == 1]),
            "top10": len([x for x in peak_ranks if 1 < x <= 10]),
            "top50": len([x for x in peak_ranks if 10 < x <= 50]),
            "top200": len([x for x in peak_ranks if x > 50])
        }

        #? NUM OF WEEKS CHARTS
        total_weeks_on_chart = len(charts_for_artist.groupby('Week').agg(set))
        weeks_on_chart = charts_for_artist.groupby('spotifyId')['weeksOnChart'].max()

        artist_json[artistId]['stats']['weeks_on_chart'] = {
            "totalWeeksOnChart": total_weeks_on_chart,
            "oneWeek": len([x for x in weeks_on_chart if x == 1]),
            "twoToFiveWeeks": len([x for x in weeks_on_chart if 1 < x <= 5]),
            "sixToTenWeeks": len([x for x in weeks_on_chart if 5 < x <= 10]),
            "overTenWeeks": len([x for x in weeks_on_chart if x > 10])
        }


    with open('artists_v3.json', 'w') as fp:
        json.dump(artist_json, fp)

def create_network_json(df_tracks, df_contributions, df_charting, df_image_urls, df_relationships):
    network_json = {}

    # For each unique artist
    for artist_id in tqdm(df_contributions.drop_duplicates(subset=["artistId"])['artistId'], desc="Creating artist networks"):

        # Get each unique song they have contributed to
        genius_ids_for_artist = df_contributions[df_contributions['artistId'] == artist_id].drop_duplicates(subset=["geniusId"])['geniusId']

        
        collaborators = {}
        for song_id in genius_ids_for_artist:
            is_primary = not df_contributions[(df_contributions['geniusId'] == song_id) & (df_contributions['artistId'] == artist_id) & (df_contributions['type'] == 'primary')].empty
            # print(song_id, is_primary)
            if is_primary:
                # Count contributions to main artist
                artists_contributed_to_main = df_contributions[(df_contributions['geniusId'] == song_id) & (df_contributions['artistId'] != artist_id)]['artistId']
                # collaborator_ids.append(df_contributions[(df_contributions['geniusId'] == song_id) & (df_contributions['artistId'] != artist_id)]['artistId'])
                for a in artists_contributed_to_main:
                    collaborators[a] = collaborators.get(a, 0) + 1
            else:
                # Count contributions by main artist
                main_contributed_to_artist = df_contributions[(df_contributions['geniusId'] == song_id) & (df_contributions['type'] == 'primary')]['artistId']
                for a in main_contributed_to_artist:
                    # Incase there are several primary artists
                    main_contributions_in_song = len(df_contributions[(df_contributions['geniusId'] == song_id) & (df_contributions['artistId'] == artist_id)])
                    collaborators[a] = collaborators.get(a, 0) + main_contributions_in_song

        network_json[str(artist_id)] = {
            "nodes": [],
            "links": []
        }

        for connected_artist_id, collaborations in collaborators.items():

            network_json[str(artist_id)]['nodes'].append({
                "id": str(connected_artist_id),
                "num_collaborations": collaborations
            })

            network_json[str(artist_id)]['links'].append({
                "source": str(artist_id),
                "target": str(connected_artist_id),
                "distance": 80
            })
        # Total contributions for an artist is every credit they have on any song, except for primary
        network_json[str(artist_id)]["total_contributions"] =  len(df_contributions[(df_contributions['artistId'] == artist_id) & (df_contributions['type'] != 'primary')])

        #? add self node
        network_json[str(artist_id)]['nodes'].append({
            "id": str(artist_id),
            "num_collaborations": 0
        })


    with open('network_v3.json', 'w') as fp:
        json.dump(network_json, fp)

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


    tracks_file = "new_dataset/output_tracks.csv"
    contributions_file = "new_dataset/output_contributions.csv"
    charting_file = "new_dataset/output.csv"
    image_urls_file = "new_dataset/image_urls.csv"
    relationships_file = "new_dataset/output_relationships.csv"

    # load tracks
    df_tracks = pd.read_csv(tracks_file, dtype={"geniusId": pd.Int64Dtype()})  # spotifyId,trackName,artistName,releaseDate,geniusId,geniusTrackName,geniusArtistName,geniusReleaseDate,trackLanguage
    df_tracks = df_tracks[df_tracks["geniusId"].notna()].drop_duplicates(subset=["geniusId"])
    df_tracks['geniusReleaseDate'].replace({pd.NaT: None, np.nan: None}, inplace=True)

    # load contributions
    df_contributions = pd.read_csv(contributions_file, dtype={"geniusId": pd.Int64Dtype(), "artistId": pd.Int64Dtype()})

    # load charting data
    df_charting = pd.read_csv(charting_file)  # Country,Week,spotifyId,trackName,artistName,releaseDate,currentRank,peakRank,weeksOnChart,numStreams,entryDate

    # load image urls
    df_image_urls = pd.read_csv(image_urls_file)

    # load relationships
    df_relationships = pd.read_csv(relationships_file)

    tracks_by_spotify_id = {}
    tracks_without_charting = []

    #? TRACKS
    create_tracks_json(df_tracks, df_contributions, df_charting, df_image_urls, df_relationships)

    #? ARTISTS
    create_artists_json(df_tracks, df_contributions, df_charting, df_image_urls, df_relationships)

    #? NETWORK GRAPH
    create_network_json(df_tracks, df_contributions, df_charting, df_image_urls, df_relationships)