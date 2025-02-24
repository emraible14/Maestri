import pandas as pd
import json
from tqdm import tqdm



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

    df_tracks = pd.read_csv("merged_datasets/df_tracks_merged.csv", dtype={"geniusId": pd.Int64Dtype()}) # spotifyId,trackName,artistName,releaseDate,geniusId,geniusTrackName,geniusArtistName,geniusReleaseDate,trackLanguage
    df_tracks= df_tracks[df_tracks["geniusId"].notna()].drop_duplicates(subset=["geniusId"])
    df_contributions = pd.read_csv("merged_datasets/df_contributions_merged.csv", dtype={"geniusId": pd.Int64Dtype()})
    tracks_by_spotify_id = {}
    tracks_without_charting = []
    for i, t in df_tracks.iterrows(): 

        track = {
            "track_id": t['geniusId'],
            "spotify_id": t['spotifyId'],
            "name": t['geniusTrackName'],
            "release_date": t['geniusReleaseDate'],
            "primary_artist_name": t['geniusArtistName'],
            "primary_artist_id": hash(t['geniusArtistName']),
            "chartings":[]
        }

        if pd.isnull(t['geniusId']):
            track["track_id"] = ""
        if pd.isnull(t['geniusReleaseDate']):
            track["release_date"] = ""
        if pd.isnull(t['spotifyId']):
            track['spotify_id'] = ""
            tracks_without_charting.append(track)
        else: 
            tracks_by_spotify_id[t['spotifyId']] = track
    #with open('tracks_by_spotify_id.json', 'w') as fp:
    #        json.dump(tracks_by_spotify_id, fp)
    
    df_charting = pd.read_csv("merged_datasets/df_charting_merged.csv") # Country,Week,spotifyId,trackName,artistName,releaseDate,currentRank,peakRank,weeksOnChart,numStreams,entryDate
    #df_tracks_with_charting = df_tracks.merge(df_charting, on=['spotifyId'])
    for i, c in df_charting.iterrows():
        spotify_id = c['spotifyId']
        charting_info = {
            "week" : c['Week'],
            "rank" : c['currentRank'],
            "country" : c['Country'] ,
            "entry_date" : c['entryDate'] ,
            "num_streams" : c['numStreams'] ,
            "weeks_on_chart" : c['weeksOnChart'],
        }
        t = tracks_by_spotify_id.get(spotify_id, {})
        if t == {}:
            print(f"Skipping {spotify_id} for charting")
            continue
        t["chartings"].append(charting_info)
        tracks_by_spotify_id[spotify_id] = t

    tracks = list(tracks_by_spotify_id.values())
    tracks.extend(tracks_without_charting)

    with open('tracks.json', 'w') as fp:
        json.dump(tracks, fp)

    ####### Artists
        """
    Artist
    {artist_id
     name
     image_link
     contributions [{
                    track_id
                    track_name
                    track_artist_id
                    contribution_type (producer|writer|primary_artist|featuring_artist)
                    }]
     contributors [{
                    track_id
                    track_name
                    contributor_id
                    contributor_name
                    contribution_type (producer|writer|featuring_artist)
                    }]
    }
    """
    artists_by_id = {}
    # Assign primary artist contributions
    for t in tqdm(tracks, desc="Assigning primary artist contributions"):
        if t['primary_artist_id'] in artists_by_id:
            artist = artists_by_id[t['primary_artist_id']]
            artist['contributions'].append({
                'track_id': t['track_id'],
                'track_name': t['name'],
                'primary_artist_id': t['primary_artist_id'],
                'contribution_type': 'primary'
                })
            artists_by_id['primary_artist_id'] = artist
        else:
            artist = {
                "artist_id" : t['primary_artist_id'],
                "name" : t['primary_artist_name'],
                "image_link" : None,
                "contributions": [{
                            'track_id': t['track_id'],
                            'track_name': t['name'],
                            'primary_artist_id': t['primary_artist_id'],
                            'contribution_type': 'primary'
                            }],
                "contributors": []
                }
            artists_by_id['primary_artist_id'] = artist
       
    
    # Assign contributions
    df_joined_contributions = df_tracks.merge(df_contributions, on="geniusId")
    # spotifyId,trackName,artistName,releaseDate,geniusId,geniusTrackName,geniusArtistName,geniusReleaseDate,trackLanguage,type,artistId,name
    for i, t in tqdm(df_joined_contributions.iterrows(), desc="Assigning contributions"):
        if pd.isnull(t['name']): # TODO: make sure feature artists have their names
            continue
        # contributions by artist
        primary_artist_id = hash(t['geniusArtistName'])
        contributing_artist_id = hash(t['name'])
        if contributing_artist_id in artists_by_id:
            artist = artists_by_id[contributing_artist_id]
            artist['contributions'].append({
                'track_id': t['geniusId'],
                'track_name': t['geniusTrackName'],
                "primary_artist_id": hash(t['geniusArtistName']),
                'contribution_type': t['type']
                })
            artists_by_id[contributing_artist_id] = artist
        else:
            artist = {
                "artist_id" : contributing_artist_id,
                "name" : t['name'],
                "image_link" : None,
                "contributions": [{
                    'track_id': t['geniusId'],
                    'track_name': t['geniusTrackName'],
                    "primary_artist_id": hash(t['geniusArtistName']),
                    'contribution_type': t['type']
                            }],
                "contributors": []
                }
            artists_by_id[contributing_artist_id] = artist
        #### Contributors
        if primary_artist_id in artists_by_id:
            artist = artists_by_id[primary_artist_id]
            artist['contributors'].append({
                'track_id': t['geniusId'],
                'track_name': t['geniusTrackName'],
                'contributor_artist_id': contributing_artist_id,
                'contributor_name' : t['name'],
                'contribution_type': t['type']
                })
            artists_by_id[primary_artist_id] = artist
        else:
            artist = {
                "artist_id" : primary_artist_id,
                "name" : t['geniusArtistName'],
                "image_link" : None,
                "contributions": [],
                "contributors": [{
                    'track_id': t['geniusId'],
                    'track_name': t['geniusTrackName'],
                    'contributor_artist_id': contributing_artist_id,
                    'contributor_name' : t['name'],
                    'contribution_type': t['type']
                    }]
                }
            artists_by_id[primary_artist_id] = artist
    artists = list(artists_by_id.values())
    with open('artists.json', 'w') as fp:
        json.dump(artists, fp)
        
