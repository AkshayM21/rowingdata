import pandas as pd

#df = pd.DataFrame({'date':[], 'workout_type':[], 'avg_power':[], 'avg_stroke_rate':[], 'avg_stroke_length':[], 'avg_pulse':[], 'avg_energy_per_stroke':[], 'avg_500m_time':[], 'leg_2_avg_power':[], 'leg_2_avg_pulse':[], 'leg_3_avg_power':[], 'leg_3_avg_pulse':[], 'decoupling_rate':[]})
rowers = pd.read_csv('CSVs/rowers.csv')
#column_order = ['date', 'workout_type', 'avg_power', 'avg_stroke_rate', 'avg_stroke_length', 'avg_pulse', 'avg_energy_per_stroke', 'avg_500m_time', 'leg_2_avg_power', 'leg_2_avg_pulse', 'leg_3_avg_power', 'leg_3_avg_pulse', 'decoupling_rate']
uni_list = []
email_list = rowers['Email']
name_list = rowers['Name']

for rower in email_list:
    uni_list.append(rower.split('@')[0])

df2 = pd.DataFrame({'uni': uni_list, 'name': name_list})
column_order = ['uni', 'name']
dictionary = sorted(dict(df2[column_order].values).items())
print(dictionary)

#for element in list:
#    df[column_order].to_csv('output/' + element + '.csv')
#df[column_order].to_csv('output/ykv2002.csv')