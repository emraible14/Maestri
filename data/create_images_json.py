import pandas as pd
import json

df_images = pd.read_csv("merged_datasets/df_images_merged.csv", dtype={"artistId": pd.Int64Dtype()})
images_dict = df_images.astype(str).set_index('artistId').to_dict(orient='index')

with open('images.json', 'w') as f:
    json.dump(images_dict, f)
