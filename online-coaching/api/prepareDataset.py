import tensorflow as tf
import matplotlib.pyplot as plt
import numpy as np
import os
import pandas as pd
#from app import *
import math


path = "2022-04-13 20s"
on_time=20
workout_type="rp3"
date=path.split()[0]
description="20s Joules Workout"
directory = 'rp3_Files/'+path

# This is the percentage of the data used for training (validation % = 1- ratio)
training_percentile=0.80
# Extra 10% used for validation, last 10% used for testing
validation_percentile=0.90

# Need to add rows and columns
training = pd.DataFrame()
validation=pd.DataFrame()
test=pd.DataFrame()

#iterate over files in given directory
for filename in os.listdir(directory):
    f = os.path.join(directory, filename)
    #checking if it is a file, parse out uni 
    if (os.path.isfile(f)):
        uni=f.split("/")[2].split(".")[0]

    #Need to remove first row of each interval

    # Removes Unwanted Columns, adds "uni" label
    workout=pd.read_csv(f)
    workout["label"]=uni
    #workout.drop("stroke_number", axis=1, inplace=True)
    workout.pop('id') 
    workout.pop("workout_interval_id")
    workout.pop("ref")
    workout.pop("avg_power")
    workout.pop("time")
    workout.pop("distance")
    workout.pop("distance_per_stroke")
    workout.pop("energy_sum")
    workout.pop("pulse")
    workout.pop("work_per_pulse")
    workout.pop("k")
    workout.pop("curve_data")
    workout.pop("stroke_number_in_interval")
    workout.pop("avg_calculated_power")
    
    
    workout.drop(workout[workout.stroke_number<=2].index, inplace=True)
    # 100 Watts is a reasonable lower bound for valid strokes in this dataset
    workout.drop(workout[workout.power<=100].index, inplace=True)
    training_endpoint=math.floor(len(workout)*training_percentile)
    validation_endpoint=math.floor(len(workout)*validation_percentile)
    training=pd.concat([training, workout.iloc[0:training_endpoint]])
    training.pop('stroke_number')
    validation=pd.concat([validation, workout.iloc[training_endpoint:validation_endpoint]])
    validation.pop('stroke_number')
    test=pd.concat([test, workout.iloc[validation_endpoint:]])
    test.pop('stroke_number')

    print(workout.head(5))

print(training.head(5))
#print(validation.head(5))
#print(test.head(5))

# Columns in dataset used for processing 
# ref	stroke_number	power	avg_power	stroke_rate	time	stroke_length	distance	distance_per_stroke	estimated_500m_time	energy_per_stroke	energy_sum	pulse	work_per_pulse	peak_force	peak_force_pos	rel_peak_force_pos	drive_time	recover_time	k	curve_data	stroke_number_in_interval	avg_calculated_power

# To Do: 
# Parse Data:
#   DONE: Narrow down which input shape (11 columns including labels)
#   DONE: Selectively Concatenate all dataframes into full training and validation datasets
#   Split into labels and data (remove uni column as labels)
# Design Model: # of and type of (Dense v. Sparse) layers (part 1 DONE)
# Download Software, Setup, and Test with print statements, Finish Reading Book


training_labels=training.pop("label")
val_labels= validation.pop("label")
test_labels=test.pop("label")

tf.convert_to_tensor(training)
tf.convert_to_tensor(validation)

model=tf.keras.Sequential([
    tf.keras.layers.Dense(25, activation="relu", input_shape=(11,)),
    tf.keras.layers.Dense(29, activation="softmax")
])

model.compile(optimizer="adam",
    loss=tf.keras.losses.SparseCategoricalCrossentropy(),
    metrics=['accuracy'])

