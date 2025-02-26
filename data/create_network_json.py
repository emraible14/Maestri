import json

def new_node_dict(id, name, num_collaborations=1):
    d = {
        "id":str(id),
        "name": name,
        "num_collaborations":num_collaborations,
        }
    return d
"""

{"nodes": [
    {
      "id": "Node 0",
      "height": 1,
      "size": 24,
      "color": "rgb(97, 205, 187)"
    },
    {
      "id": "Node 1",
      "height": 1,
      "size": 24,
      "color": "rgb(97, 205, 187)"
    }]
"links": [
    {
      "source": "Node 0",
      "target": "Node 1",
      "distance": 80
    }]
}

"""

# Load data
# with open('tracks.json') as tracks_file:
#     tracks = json.load(tracks_file)
with open('artists.json') as artists_file:
    artists = json.load(artists_file)

artist_names = {}
for a in artists:
    artist_names[a["artist_id"]] = a["name"]


artist_graphs = {}

# Create a collaboration graph for each artist
for a in artists:
    try:
        artist_id = a["artist_id"]
    except Exception as e:
        print(a)
        raise e
    nodes = {}
    links = []
    nodes[artist_id] = new_node_dict(artist_id, a["name"])
    for c in a["contributions"]:
        # {"track_id": 38571, "track_name": "Guess Who\u2019s Back", "primary_artist_id": -2469174458947865905, "contribution_type": "primary"}
        if c["contribution_type"] == "primary":
            continue
        try:
            if c["primary_artist_id"] in nodes:
                nodes[c["primary_artist_id"]]["num_collaborations"] += 1 
            else:
                nodes[c["primary_artist_id"]] =  new_node_dict(c["primary_artist_id"], artist_names[c["primary_artist_id"]]) # TODO: add primary artist name to artists.json
                links.append({
                "source": str(artist_id),
                "target": str(c["primary_artist_id"]),
                "distance": 80
                })
        except Exception as e:
            print(a)
            raise e
    for c in a["contributors"]:
        # {"track_id": 6576448, "track_name": "Ghost", "contributor_artist_id": -3463787306063367616, "contributor_name": "Jon Bellion", "contribution_type": "producer"}
        if c["contributor_artist_id"] in nodes:
            nodes[c["contributor_artist_id"]]["num_collaborations"] += 1
        else:
            nodes[c["contributor_artist_id"]] =  new_node_dict(c["contributor_artist_id"], c["contributor_name"])
            links.append({
            "source": str(artist_id),
            "target": str(c["contributor_artist_id"]),
            "distance": 80
            })
    artist_graphs[artist_id] = {"nodes":list(nodes.values()), "links":links, "total_contributions": len(a["contributions"])}

with open('network.json', 'w') as f:
    json.dump(artist_graphs, f)

