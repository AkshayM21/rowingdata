from flask import Flask
from flask import render_template
from flask import request
from flask import current_app
import os
import io
import json
import pandas as pd
from firebase_admin import credentials, initialize_app, storage


app = Flask(__name__)

firebaseConfig = {
    'apiKey': "REDACTED_API_KEY",
    'authDomain': "REDACTED_PROJECT_ID.firebaseapp.com",
    'projectId': "REDACTED_PROJECT_ID",
    'storageBucket': "REDACTED_PROJECT_ID.appspot.com",
    'messagingSenderId': "REDACTED_SENDER_ID",
    'appId': "1:REDACTED_SENDER_ID:web:b89950200d0b742a3beea0",
    'measurementId': "REDACTED_MEASUREMENT_ID"
  }

with app.app_context():
  APP_ROOT = os.path.dirname(os.path.abspath(__file__))
  cred = credentials.Certificate(json.load(current_app.open_resource("REDACTED_PROJECT_ID-firebase-adminsdk-yccz8-dabed493e7.json")))
  firebase = initialize_app(cred, options=firebaseConfig)
  rowers_df = pd.read_csv(current_app.open_resource("CSVs/rowers.csv"))
  coxswains_df = pd.read_csv(current_app.open_resource("CSVs/coxswains.csv"))
  testers_df = pd.read_csv(current_app.open_resource("CSVs/testers.csv"))
  admin_df = pd.read_csv(current_app.open_resource("CSVs/admin.csv"))



# saves pandas dataframe to the given output_path in firebase storage
# NB: gsutil command for copying a saved stats sheet to computer --  gsutil cp gs://REDACTED_PROJECT_ID.appspot.com/rower_stats/test.csv Documents/GitHub/rowingdata/online-coaching/api/output/test.csv
def save_to_cloud(df, folder_name, workout):
 storage.bucket(app=firebase).blob("rower_stats/"+folder_name+"/"+workout).upload_from_string(df.to_csv(), "text/csv")

def get_from_cloud(folder_name, workout):
  return pd.read_csv(io.BytesIO(storage.bucket(app=firebase).blob("rower_stats/"+folder_name+"/"+workout).download_as_bytes()))

def get_from_cloud_with_col(file_name, workout_id, index_col):
  return pd.read_csv(io.BytesIO(storage.bucket(app=firebase).blob("rower_stats/"+folder_name+"/"+workout_id).download_as_bytes()), index_col=index_col)\

#def get_img_from_cloud(uni, workout_id):
     #add functionality for pulling image from firebase

def isRower(email):
  email_list = rowers_df['Email']
  return not email_list[email_list.isin([email])].empty

def isCoxswain(email):
  email_list = coxswains_df['Email']
  return not email_list[email_list.isin([email])].empty

def isTester(email):
  email_list = testers_df['Email']
  return not email_list[email_list.isin([email])].empty

def isAdmin(email):
  email_list = admin_df['Email']
  return not email_list[email_list.isin([email])].empty


@app.route('/api', methods=['GET'])
def index(): 
  return {
    "name": "Hello World"
  }

@app.route('/auth', methods=['GET'])
def is_auth_user():
  email = request.args.get("email")
  admin = isAdmin(email)
  if(admin or isRower(email) or isCoxswain(email) or isTester(email)):
    isStudent = not admin
    return {
      "isValid": "True",
      "isStudent": str(isStudent) 
    }
  else:
    return {
      "isValid": "False"
    }

@app.route("/workouts", methods=['GET'])
def workouts():
  return { "data": get_workouts(request.args.get('uni'), request.args.get(''workout_id")) 
              "img": get_image(request.args.get('uni'), request.args.get('workout_id'))}

@app.route("/sors", methods=['GET'])
def sors():
  return { "data": get_sors(request.args.get('uni')) }

@app.route('/rowers', methods=['GET'])
def rowers():
  email_list = rowers_df['Email']
  unis = [email.split("@")[0] for email in email_list]
  return {
      "unis": unis
  }

@app.route('/rower_list', methods=['GET'])
def rower_list():
  email_list = rowers_df['Email']
  uni_list = [email.split("@")[0] for email in email_list]
  name_list = rowers_df['Name']
  df2 = pd.DataFrame({'uni': uni_list, 'name': name_list})
  column_order = ['uni', 'name']
  return(dict(df2[column_order].values))

#page that covers rower's data
#need to keep track of all parameters we will need
#need to add post form in submit.html
#decoupling will be implemented as a boolean for decoupling
@app.route('/submit', methods=['POST'])
def submit():
    params = {}
    params['on_time']=int(request.form['on_time'])
    params["workout_type"]=request.form['workout_type']
    params['name'] = request.form['name']
    params['date'] = request.form['date']
    params['description'] = request.form['description']
    params['rpe'] = int(request.form['rpe'])
    save_to_cloud(parse(pd.read_csv(request.files['file']), params), params['name']+".csv")
    return "{}"
    # with open('/CSVs/params.json', 'w') as output:
    #     json.dump(params, output)

# def uploadFiles():
#     file = request.files['file']
#     path='/CSVs'
#     file_path = os.path.join(path, file.filename)
#     open(file_path, 'w').write(file.read())


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
    workout_id = df.iloc[0]["workout_id"]
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

    past_data_df = get_from_cloud(params['name']+".csv")
  
    if(not past_data_df.empty):
      past_data_df = get_from_cloud_with_col(params['name']+".csv", 0)
    
    print(past_data_df)


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
                "workout_id"=workout_id,
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
            }, index=[params['date']]
        )

        print(output_df)

        dfresult = pd.concat([past_data_df, output_df])

        print(dfresult)
        return dfresult

        #output_df.to_csv(params["output_path"])
        
    else:
        output_df = pd.DataFrame(
            {
                "workout_id"="",
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
            },index=[params['date']]
        )

        #output_df.to_csv(params["output_path"])
        return pd.concat([past_data_df, output_df])

def get_sors(uni):
  df = get_from_cloud("SorS.csv")
  
  return [{
    "id": row.Index,
    "date": row[2],
    "boat_class": row[3],
    "rank": row[4],
    "avg_time": row[5],
    "avg_wbt": row[6],
    "piece_1_time": row[7],
    "piece_1_wbt": row[8],
    "piece_2_time": row[9],
    "piece_2_wbt": row[10],
    "piece_3_time": row[11] if not pd.isnull(row[11]) else "",
    "piece_3_wbt": row[12] if not pd.isnull(row[12]) else "",
  } for row in df[df["uni"]==uni].itertuples()]



def get_workouts(uni, workout_id):
  df = get_from_cloud(uni, workout_id+".csv")

  if(df.empty):
    return []
  else:
    df = get_from_cloud_with_col(uni, workout_id+".csv", 0)
  
  return [{
      "date": row[0],
      "workout_id": row[1]
      "workout_type": row[2],
      "avg_power": row[3],
      "avg_stroke_rate": row[4],
      "avg_stroke_length": row[5],
      "avg_pulse": row[6],
      "avg_energy_per_stroke": row[7],
      "avg_500m_time": row[8],
      "leg_2_avg_power": row[9] if not pd.isnull(row[8]) else "",
      "leg_2_avg_pulse": row[10] if not pd.isnull(row[9]) else "",
      "leg_3_avg_power": row[11] if not pd.isnull(row[10]) else "",
      "leg_3_avg_pulse": row[12] if not pd.isnull(row[11]) else "",
      "decoupling_rate": row[13] if not pd.isnull(row[12]) else "",
      "rpe": row[14],
      "description": row[15]
    } for row in df.itertuples()]
                                                                 
#def get_image(uni, workout_id):
     #img = get_img_from_cloud(uni, workout_id+".png")
     #return image;    
                                                                          

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


if __name__ == '__main__':
    app.run(debug=True)
