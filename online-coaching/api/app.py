from flask import Flask
from flask import render_template, request
import pyrebase
import json
import os

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

firebase = pyrebase.initialize_app(firebaseConfig)
storage = firebase.storage()

#index.html should cover login page
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
