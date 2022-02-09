#We need to save data to csv and parse them as well. Do this by looping through all files in a folder and matching with uni, then sending each file down to the folder through parse

import os
import pandas as pd
from app import parse, get_csv_from_cloud, save_csv_to_cloud
path = "11_24_21 HISE"
on_time=100
workout_type="rp3"
date=path.split()[0]
description="HISE Predictor Test"

directory = 'rp3_Files/'+path

for filename in os.listdir(directory):
    f = os.path.join(directory, filename)
    # checking if it is a file
    if os.path.isfile(f):
        uni=f.split("/")[2].split(".")[0]
    params = {}
    params['on_time']=on_time
    params["workout_type"]=workout_type
    params['name'] = uni
    params['date'] = date
    params['description'] = description
    params['rpe'] = 0
    settings=get_csv_from_cloud("rower_stats/"+params['name']+"/settings.csv")
    save_csv_to_cloud(parse(pd.read_csv(f), settings, params), "rower_stats/"+params["name"]+"/workouts.csv")