from asyncio import current_task
from random import sample
from turtle import color
from flask import Flask
from flask import render_template
from flask import request
import requests
import base64
from flask import current_app
import os
import io
import PIL.Image as Image
import json
import pandas as pd
import statistics
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from firebase_admin import credentials, initialize_app, storage


app = Flask(__name__)

base_path ="rower_stats/"

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

###classes of files to get & save
####Sors.csv
####workouts.csv
####raw workout data
####image (either force profile or variance)

# saves pandas dataframe to the given output_path in firebase storage
# NB: gsutil command for copying a saved stats sheet to computer --  gsutil cp gs://REDACTED_PROJECT_ID.appspot.com/rower_stats/test.csv Documents/GitHub/rowingdata/online-coaching/api/output/test.csv
def save_csv_to_cloud(df, path):
 storage.bucket(app=firebase).blob(path).upload_from_string(df.to_csv(), "text/csv")

def save_png_to_cloud(image, cloud_path):
 storage.bucket(app=firebase).blob(cloud_path).upload_from_string(image, content_type="image/png")

def get_csv_from_cloud(path):
  return pd.read_csv(io.BytesIO(storage.bucket(app=firebase).blob(path).download_as_bytes()))

def get_csv_from_cloud_with_col(path, index_col):
  return pd.read_csv(io.BytesIO(storage.bucket(app=firebase).blob(path).download_as_bytes()), index_col=index_col)

def get_png_from_cloud(path):
  return io.BytesIO(storage.bucket(app=firebase).blob(path).download_as_bytes()).getvalue()
  

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
  return { "data": get_workouts(request.args.get('uni'))}

@app.route("/graphs", methods=['GET'])
def graphs():
  return { 
    "force_profile": str(base64.b64encode(get_png_from_cloud(base_path+request.args.get('uni')+"/"+str(request.args.get('workout_id'))+"/ForceProfile.png"))),
    "stroke_variance": str(base64.b64encode(get_png_from_cloud(base_path+request.args.get('uni')+"/"+str(request.args.get('workout_id'))+"/StrokeVariance.png")))
  }
  

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
    save_csv_to_cloud(parse(pd.read_csv(request.files['file']), params), base_path+params["name"]+"/workouts.csv")
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
    workout_id = df["workout_interval_id"][0]

    save_csv_to_cloud(df, base_path+str(params["name"])+"/"+str(workout_id)+"/raw.csv")

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


    past_data_df = get_csv_from_cloud(base_path+params['name']+"/workouts.csv")
  
    if(not past_data_df.empty):
      past_data_df = get_csv_from_cloud_with_col(base_path+params['name']+"/workouts.csv", 0)
    


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
        imse = graphs(df, ranges, params["name"], workout_id)
        output_df = pd.DataFrame(
            {
                "workout_id":workout_id,
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
                "description":params['description'],
                "imse":imse,
                "tss":"",
                "hrtss":"",
                "ets":"",
                "metric1":"",
                "metric2":"",
                "metric3":""
            }, index=[params['date']]
        )

        return pd.concat([past_data_df, output_df])

        #output_df.to_csv(params["output_path"])
        
    else:
        imse = graphs(df, ranges, params["name"], workout_id)
        output_df = pd.DataFrame(
            {
                "workout_id":workout_id,
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
                "description":params['description'],
                "imse": imse,
                "tss":"",
                "hrtss":"",
                "ets":"",
                "metric1":"",
                "metric2":"",
                "metric3":""
            },index=[params['date']]
        )

        #output_df.to_csv(params["output_path"])
        return pd.concat([past_data_df, output_df])

def get_sors(uni):
  df = get_csv_from_cloud(base_path+"SorS.csv")
  
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



def get_workouts(uni):
  df = get_csv_from_cloud(base_path+str(uni)+"/workouts.csv")

  if(df.empty):
    return []
  else:
    df = get_csv_from_cloud_with_col(base_path+str(uni)+"/workouts.csv", 0)
  return [{
      "date": row[0],
      "workout_id": row[2],
      "workout_type": row[3],
      "avg_power": round(row[4],2),
      "avg_stroke_rate": round(row[5], 1),
      "avg_stroke_length": round(row[6],1),
      "avg_pulse": round(row[7], 2),
      "avg_energy_per_stroke": round(row[8],2),
      "avg_500m_time": row[9],
      "leg_2_avg_power": round(row[10], 2) if not pd.isnull(row[10]) else "",
      "leg_2_avg_pulse": round(row[11],2) if not pd.isnull(row[11]) else "",
      "leg_3_avg_power": round(row[12],2) if not pd.isnull(row[10]) else "",
      "leg_3_avg_pulse": round(row[13],2) if not pd.isnull(row[11]) else "",
      "decoupling_rate": round(row[14],2) if not pd.isnull(row[12]) else "",
      "rpe": row[15],
      "description": row[16],
      "imse": round(row[17],2),
      "tss":"",
      "hrtss":"",
      "ets":"",
      "metric1":"",
      "metric2":"",
      "metric3":""
    } for row in df.itertuples()]
 
                                                                          

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

def graphs(df, valid_intervals, uni, workout_id):
  #get curve data, turn into list, store in list of lists
  #RIP elegant 1 line solution
  #curve_datas = [data.split(",") for data in df["curve_data"][interval[0]:interval[1]].values() for interval in valid_intervals]
  curve_datas = []
  ##valid_intervals[-1] = (valid_intervals[-1][0], valid_intervals[-1][1]-20)
  for interval in valid_intervals:
    for data in df["curve_data"][interval[0]+5:interval[1]]:
      #handle NaN
      if not pd.isna(data):
        curve_datas.append(list(map(int, data.split(","))))


  #compute mean curve
  max_length = 0
  for i in range(len(curve_datas)):
    if len(curve_datas[i])>max_length:
      max_length = len(curve_datas[i])
  
  ##elegant but doesnt work if there are missing values
  ##mean_curve = [statistics.mean([curve_datas[i][j] for i in range(len(curve_datas))]) for j in range(max_length)]
  mean_curve = []
  for i in range(max_length):
    temp = []
    for j in range(len(curve_datas)):
      if i<len(curve_datas[j]):
        temp.append(curve_datas[j][i])
    mean_curve.append(statistics.mean(temp))
  
  
  #subtract mean from each curve, use to find squared error
  squared_errors = [[pow(curve_datas[i][j]-mean_curve[j], 2) for j in range(len(curve_datas[i]))] for i in range(len(curve_datas))]

  mse = [statistics.mean(squared_error) for squared_error in squared_errors]


  imse = statistics.mean(mse)

  #plot force profile graph

  plt.figure(1)
  for curve_data in curve_datas:
    plt.plot(curve_data, linestyle="dashed", label="_nolegend_")
  plt.plot(mean_curve, label="mean force curve", color="yellow")
  plt.title('Force Curve')
  plt.ylabel('Force')
  plt.xlabel('Measurement')
  plt.xlim(0, len(mean_curve))
  plt.ylim(0, 600)
  plt.legend(loc='best')

  img_buf = io.BytesIO()
  plt.savefig(img_buf, format='png')
  save_png_to_cloud(img_buf.getvalue(), base_path+uni+"/"+str(workout_id)+"/ForceProfile.png")
  img_buf.close()

  #plot variance graph
  plt.figure(2)
  plt.plot(mse, color="black")
  plt.title("Variance over Strokes")
  plt.xlabel("Strokes")
  plt.ylabel("Variance")

  img_buf = io.BytesIO()
  plt.savefig(img_buf, format='png')
  save_png_to_cloud(img_buf.getvalue(), base_path+uni+"/"+str(workout_id)+"/StrokeVariance.png")
  img_buf.close()

  return imse


if __name__ == '__main__':
    app.run(debug=True)
