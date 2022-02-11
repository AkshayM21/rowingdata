import os
import pandas as pd
from app import *
path = "10_01_21 40'"
on_time=2400
workout_type="other"
date=path.split()[0]
description="40 minute test"
directory = 'rp3_Files/'+path

for filename in os.listdir(directory):
    f = os.path.join(directory, filename)
    # checking if it is a file
    if (os.path.isfile(f)):
        uni=f.split("/")[2].split(".")[0]
    
    params = {}
    params['on_time']=on_time
    params["workout_type"]=workout_type
    params['name'] = uni
    params['date'] = date
    params['description'] = description
    params['rpe'] = 0
    if (uni != ""):
        if uni == "sjm2254": continue
        settings=get_csv_from_cloud("rower_stats/"+params['name']+"/settings.csv")
        print(params["name"])
        save_csv_to_cloud(parse(pd.read_csv(f), settings, params), "rower_stats/"+params["name"]+"/workouts.csv")
