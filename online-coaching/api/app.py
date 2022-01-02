from flask import Flask
from flask import render_template
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






# saves pandas dataframe to the given output_path in firebase storage
# todo - test with website; commit
def save_to_cloud(df, file_name):
  cred = credentials.Certificate("REDACTED_PROJECT_ID-firebase-adminsdk-yccz8-dabed493e7.json")
  firebase = initialize_app(cred, options=firebaseConfig)

  bucket = storage.bucket(app=firebase)
  #temporarily save to output folder
  df.to_csv("output/"+file_name)

  #transfer to cloud bucket
  blob = bucket.blob("rower_stats/"+file_name)
  blob.upload_from_filename("output/"+file_name)


@app.route('/', methods=['GET'])
def hello_world():  # put application's code here
  return render_template("index.html")

#page that covers rower's data
#need to keep track of all parameters we will need
#need to add post form in submit.html
#workout_type will be implemented as a "yes or no" for decoupling
@app.route('/submit', methods=['GET', 'POST'])
def submit():
    params = {}
    params['time_off']=request.form['time_off']
    params['time_on']=request.form['time_on']
    params['workout_type']=request.form['workout_type']
    params['name'] = request.form['name']
    with open('/CSVs/params.json', 'w') as output:
        json.dump(params, output)

def uploadFiles():
    file = request.files['file']
    path='/CSVs'
    file_path = os.path.join(path, file.filename)
    open(file_path, 'w').write(file.read())


if __name__ == '__main__':
    app.run(debug=True)
