import os
import pandas as pd

# Define the parent directory
parent_dir = "datasets"

# List all subdirectories in the parent directory
sub_dirs = [d for d in os.listdir(parent_dir) if os.path.isdir(os.path.join(parent_dir, d))]

def load_datasets(in_file_name, out_file_name, drop_keys, int_fields = None, drop_duplicates = True):
    dataframes = []
    
    ## load csv files into dataframes
    for sub_dir in sub_dirs:
        csv_path = os.path.join(parent_dir, sub_dir, in_file_name)
        if os.path.exists(csv_path):
            dataframes.append(pd.read_csv(csv_path))

    ## merge dataframes
    merged_df = pd.DataFrame([])
    for df in dataframes:
        merged_df = pd.concat([merged_df, df])

    ## drop duplicate keys
    if drop_duplicates:
        merged_df = merged_df.drop_duplicates(subset=drop_keys, keep='first')

    ## convert to int specified fields
    for int_field in int_fields:
        merged_df[int_field] = merged_df[int_field].astype("Int64")
        
    ## create destination folder
    os.makedirs("merged_datasets", exist_ok=True)
    
    ## save merged_datasets dataframe to file
    merged_df.to_csv(f"./merged_datasets/{out_file_name}", encoding='utf-8', index=False, header=True)

    return merged_df


## Merge charting dataset: output.csv file
df_charting = load_datasets("output.csv", "df_charting_merged.csv", ['Country', 'Week', 'spotifyId'], [],True)

## Merge Tracks dataset: output_tracks.csv file
df_tracks = load_datasets("output_tracks.csv", "df_tracks_merged.csv", ["geniusId"], ["geniusId"], True)

## Merge Contributions dataset: output_contributions.csv file
df_contributions = load_datasets("output_contributions.csv", "df_contributions_merged.csv", ["geniusId", "artistId"], ["geniusId", "artistId"], True)

## Merge Relationships dataset: output_relationships.csv file
df_relationships = load_datasets("output_relationships.csv", "df_relationships_merged.csv", ["from_genius_id", "to_genius_id"], ["from_genius_id", "to_genius_id"], True)

## Merge Image Urls dataset: image_urls.csv file
df_images = load_datasets("image_urls.csv", "df_images_merged.csv", ["artistId"], ["artistId"], True)