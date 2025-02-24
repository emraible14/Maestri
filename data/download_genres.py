import pandas as pd
import json
import requests
import datetime
import time
import urllib.parse
import unicodedata
import re
from bs4 import BeautifulSoup
from tqdm import tqdm
import threading
from concurrent.futures import ThreadPoolExecutor
import concurrent.futures

genius_token = "WJrlisPS9YMSVBPq9yVSMR1HJmzw1kBdgjAAPo3HTjXGgEM2NpglSCjFxA29lb_D"

def try_request(method, url, headers):
    error = True
    i = 0
    while error:
        try:
            response = requests.request(method, url, headers=headers)
            if response.status_code != 200 and response.status_code != 404:
                print(response.text)
                raise Exception("Retry")
            error = False
        except Exception as e:
            print(e)
            if i > 10:
                raise Exception("Too many retries for request: " + url)
            time.sleep(1.0 + (i*5))
            i += 1
            print("Retrying " + str(i) +  ":\t" + url)
    return response

def genres_from_genius_id(song_id):
    # Scrapes 'main' genres from genius.com
    page_url = 'https://genius.com' + "/songs/" + str(song_id)
    page = try_request("GET", page_url, None)
    if page.status_code == 404:
        # Try to get the webpage through API instead. Costs two more API calls, but is seemingly rare
        query = {
        "access_token": genius_token,
        }
        query = urllib.parse.urlencode(query)
        url = f'https://api.genius.com/songs/{genius_id}?{query}'
        response = try_request("GET", url, None)
        if response.status_code == 404:
            return {'geniusId':song_id, 'primaryGenres': [], 'secondaryGenres': []}
        response_json = response.json()
        song = response_json.get('response', {}).get('song', {})
        url = song.get('url', "")
        if url == "":
            return {'geniusId':song_id, 'primaryGenres': [], 'secondaryGenres': []}
        page = try_request("GET", url, None)
        
    html = BeautifulSoup(page.text, 'html.parser')
    tags = html.find(class_='SongTags-sc-b55131f0-1')
    if tags is None:
        print("No genre tags for ID: "+ str(song_id))
        return {'geniusId':song_id, 'primaryGenres': [], 'secondaryGenres': []}
    first_tag_class = tags.find('a')['class']
    all_tags = tags.find_all('a')
    primary_tags = []
    secondary_tags = []
    for t in all_tags:
        t_class = t['class']
        if first_tag_class[1] == t_class[1]:
            primary_tags.append(t.text)
        else:
            secondary_tags.append(t.text)
    return {'geniusId':song_id, 'primaryGenres': primary_tags, 'secondaryGenres': secondary_tags}

if __name__ == "__main__":
    filename = 'output_tracks.csv'
    df_tracks = pd.read_csv(filename, dtype={"geniusId": pd.Int64Dtype()})
    df_tracks = df_tracks.drop_duplicates(subset=["geniusId"], keep='first')
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = []
        genres_list = []
        for genius_id in tqdm(df_tracks[df_tracks["geniusId"].notna()]["geniusId"].tolist(), desc=f"Starting downloads of {filename}"):
            data_future = executor.submit(genres_from_genius_id, genius_id)
            futures.append(data_future)
        with tqdm(total=len(futures), desc=f"Collecting results") as pb:
            for future in concurrent.futures.as_completed(futures):
                genres_list.append(future.result())
                pb.update(1)
        
        df_genres = pd.json_normalize(genres_list)
        df_genres.to_csv("output_genres.csv", encoding='utf-8', index=False, header=True)

