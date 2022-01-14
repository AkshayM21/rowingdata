import pandas as pd

# todo: currently, the parse method makes a new csv for each workout -- change to editing 1 csv for each player (by id)
# note - returns output csv as a pandas dataframe
# params is a dictionary containing parameters relevant for parsing
# eg, "workout_type" is a string indicating the type of workout (e.g. decoupling)
# "on_time" indicates in seconds the lengths of reps (ie, that aren't on break)
# "name" indicates the ID of the rower
def parse(df, params):
    #df = pd.read_csv(params["path"])
    

    ranges = find_valid_ranges(df, params["on_time"])

    count = 0
    power_sum = 0
    stroke_rate_sum = 0
    stroke_length_sum = 0
    pulse_sum = 0 #if not connected, pulse sum will remain zero after summing across ranges, so the average will be zero
    energy_per_stroke_sum = 0
    meters_500_split = 0
    for interval in ranges:
        count+=interval[1]-interval[0]
        power_sum+=df["power"][interval[0]:interval[1]].sum(axis=0)
        stroke_rate_sum+=df["stroke_rate"][interval[0]:interval[1]].sum(axis=0)
        stroke_length_sum+=df["stroke_length"][interval[0]:interval[1]].sum(axis=0)
        pulse_sum+=df["pulse"][interval[0]:interval[1]].sum(axis=0)
        energy_per_stroke_sum+=df["energy_per_stroke"][interval[0]:interval[1]].sum(axis=0)
        meters_500_split+=df["estimated_500m_time"][interval[1]-1]
    avg_power = power_sum/count
    avg_stroke_rate = stroke_rate_sum/count
    avg_stroke_length = stroke_length_sum/count
    avg_pulse = pulse_sum/count
    avg_energy_per_stroke = energy_per_stroke_sum/count
    avg_500_split = meters_500_split/len(ranges) #since it is only 1 measurement per set of reps, instead of 1 per rep

    #past_data_df = get_from_cloud(params['name']+".csv")
    #past_data_df.set_index("date")


    ##could/should refactor the below if statement to be more efficient/reuse less code but its late so ill do this later or something

    #find averages across columns
    if(params["workout_type"]=="decoupling"): #it is a decoupling workout - find avg_power to avg_heart_rate ratio
        #decoupling workouts should have 3 legs; use ranges[1] and ranges[2] for relevant ranges
        #saving 5 things -- avg_power and avg_pulse for the last two legs, and the percent change of power:pulse ratio btwn legs
        leg_2_avg_power = df["power"][ranges[1][0]:ranges[1][1]].sum(axis=0)/(ranges[1][1]-ranges[1][0])
        leg_2_avg_pulse = df["pulse"][ranges[1][0]:ranges[1][1]].sum(axis=0) / (ranges[1][1] - ranges[1][0])
        leg_3_avg_power = df["power"][ranges[2][0]:ranges[2][1]].sum(axis=0) / (ranges[2][1] - ranges[2][0])
        leg_3_avg_pulse = df["pulse"][ranges[2][0]:ranges[2][1]].sum(axis=0) / (ranges[2][1] - ranges[2][0])
        decoupling_rate = (leg_3_avg_power/leg_3_avg_pulse - leg_2_avg_power/leg_2_avg_pulse)/(leg_2_avg_power/leg_2_avg_pulse)
        output_df = pd.DataFrame(
            {
                "date": params['date'],
                "workout_type":params['workout_type'],
                "avg_power": avg_power,
                "avg_stroke_rate": avg_stroke_rate,
                "avg_stroke_length": avg_stroke_length,
                "avg_pulse": avg_pulse,
                "avg_energy_per_stroke": avg_energy_per_stroke,
                "avg_500m_time": avg_500_split,
                "leg_2_avg_power":leg_2_avg_power,
                "leg_2_avg_pulse":leg_2_avg_pulse,
                "leg_3_avg_power":leg_3_avg_power,
                "leg_3_avg_pulse":leg_3_avg_pulse,
                "decoupling_rate":decoupling_rate,
                "rpe":params['rpe'],
                "description":params['description']
            },
        )
        output_df.set_index("date")

        #return pd.concat([past_data_df, output_df])

        #output_df.to_csv(params["output_path"])
        
    else:
        output_df = pd.DataFrame(
            {
                "date": params['date'],
                "workout_type":params['workout_type'],
                "avg_power":avg_power,
                "avg_stroke_rate":avg_stroke_rate,
                "avg_stroke_length":avg_stroke_length,
                "avg_pulse":avg_pulse,
                "avg_energy_per_stroke":avg_energy_per_stroke,
                "avg_500m_time":avg_500_split,
                "leg_2_avg_power":"",
                "leg_2_avg_pulse":"",
                "leg_3_avg_power":"",
                "leg_3_avg_pulse":"",
                "decoupling_rate":"",
                "rpe":params['rpe'],
                "description":params['description']
            },
        )

        output_df.set_index("date")
        #output_df.to_csv(params["output_path"])
        #return pd.concat([past_data_df, output_df])


# returns a list of tuples of row ranges in the dataframe that are valid data
# valid, ie, not during a break period
# note: tuple ranges are start inclusive, end exclusive -- [start, end) -- as this captures the desired rows using slices
# on_time is in seconds, amount of time spent for each stretch of the workout (between breaks)
def find_valid_ranges(df, on_time):

    # basic intuition: find every stroke that is number 1, determine if the range btwn the ones is a break or not
    stroke_one_rows = df[df['stroke_number']==1]

    range_list = []

    #note -- the ranges in these tuples are exclusive -- [start, end) -- because that's how pandas treats ranges
    #so the end range index will point to the index immediately after the actual end of range
    for i in range(0, len(stroke_one_rows.index)-1):
        range_list.append((stroke_one_rows.index[i], stroke_one_rows.index[i+1]))
    range_list.append((stroke_one_rows.index[len(stroke_one_rows.index)-1], len(df.index))) # last range (goes till end), not covered by loop

    if (len(stroke_one_rows.index) == 1):  # only 1 instance of a #1 stroke -- means no breaks in the workout, so only 1 tuple (go till end)
        return range_list

    for interval in range_list: #remove breaks
        end_time = df["time"][interval[1]-1]
        if(abs(end_time-on_time)>2): #more than 2 seconds away from a rep_time, label as break
            range_list.remove(interval)

    return range_list

# params = {
#     "path": "CSVs/Step Test Sample.csv",
#     "on_time": 240,
#     "workout_type": "idk",
#     "output_path": "output/Step Test Sample stats.csv"
# }
# parse(params)
#find_valid_ranges(pd.read_csv("CSVs/3x19 2 for Johnny.csv"), 1140, 60)
#find_valid_ranges(pd.read_csv("CSVs/40 minute test.csv"), 0)
#find_valid_ranges(pd.read_csv("CSVs/HISE_Sample.csv"), 100, 20)
