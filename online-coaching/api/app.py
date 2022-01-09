from flask import Flask
from flask import render_template
from flask import request
from flask import current_app
from parsing import parse
import os
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
def save_to_cloud(df, file_name):
  storage.bucket(app=firebase).blob("rower_stats/"+file_name).upload_from_string(df.to_csv(), "text/csv")


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


#page that covers rower's data
#need to keep track of all parameters we will need
#need to add post form in submit.html
#decoupling will be implemented as a boolean for decoupling
@app.route('/submit', methods=['GET', 'POST'])
def submit():
    params = {}
    params['break_time']=int(request.form['break_time'])
    params['on_time']=int(request.form['on_time'])
    params["decoupling"]=request.form['decoupling']=="True"
    params['name'] = request.form['name']
    save_to_cloud(parse(pd.read_csv(request.files['file']), params), params['name']+".csv")
    return "200"
    # with open('/CSVs/params.json', 'w') as output:
    #     json.dump(params, output)

# def uploadFiles():
#     file = request.files['file']
#     path='/CSVs'
#     file_path = os.path.join(path, file.filename)
#     open(file_path, 'w').write(file.read())


if __name__ == '__main__':
    app.run(debug=True)
