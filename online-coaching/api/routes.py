from flask import Flask, render_template
from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import StringField, BooleanField, SubmitField

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret"
dictionary = 'See dictionary.py'

class Form(FlaskForm):
  id =  StringField("UNI:")
  date = StringField("Date(mm/dd/yyyy):")
  workout_type = StringField("Workout Description:")
  decoupling = BooleanField("Decoupling")
  time_on = StringField("Piece Time:")
  rpe = StringField("RPE:")
  submit = SubmitField("Submit")

class Upload(FlaskForm):
    upload = FileField('file', validators=[
        FileRequired(),
        FileAllowed(['csv'], 'CSV format only')
    ])

@app.route("/rower_view", methods=["POST"])
def rower_view():
    submission = Form(csrf_enabled=False)
    file = Upload(csrf_enabled=False)
    if(dictionary.hasKey(submission.id) == False):
        #flash('Invalid UNI')
        return
        redirect(url_for("/rower_view", _external=True, _scheme='https'))
    if(submission.validate_on_submit() & file.validate_on_submit()):
        params = {}
        params['id']=submission.id
        params['date']=submission.date
        params['name']=submission.workout_type
        params['on_time']=submission.time_on
        params["decoupling"]=submission.decoupling
        params['rpe'] = submission.rpe
        #Update to pull rower csv by uni
        rower_file = get_from_cloud(params['id']+'.csv', False)
        df_final = pd.read_csv(rower_file, index_col='date')
        new_data = pd.read_csv(file, index_col='date')
        df_new = parse(new_data, params)
        df_final.append(df_new)
        save_to_cloud(parse(df_final, params), params['name']+ ".csv")
        return render_template("templates/rower_view.html", template_form=submission)
    else:
        #flash('Missing Information')
        return
        redirect(url_for("/rower_view", _external=True, _scheme='https'))

@app.route("/coach_view")
def coach_view():
    return render_template("templates/coach_view.html", rower_dictionary=dictionary)

@app.route("/workouts/<String:id>", methods=["GET"])
def workouts(id):
    workout_data = get_from_cloud(id + '.csv', False)
    return render_template("templates/workouts.html", file = workout_data, uni=id)

@app.route("/sors/<String:id>", methods=["GET"])
def sors(id):
    sors_data = get_from_cloud(id, True)
    return render_template("templates/sors.html", file=sors_data, uni=id)
