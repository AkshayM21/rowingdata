import pandas as pd
df = pd.read_csv('CSVs/SorS.csv')
params = { 
    "name" : "Gil Dexter"
}
output_df = df[df['Name'] == params["name"]]
output_df.to_csv("output/SorS stats.csv")
