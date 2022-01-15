import pandas as pd

rowers = pd.read_csv('CSVs/rowers.csv')

uni_list = []
email_list = rowers['Email']
name_list = rowers['Name']

for rower in email_list:
    uni_list.append(rower.split('@')[0])

df2 = pd.DataFrame({'uni': uni_list, 'name': name_list})
column_order = ['uni', 'name']
dictionary = dict(df2[column_order].values)

#for element in list:
#    df[column_order].to_csv('output/' + element + '.csv')
#df[column_order].to_csv('output/ykv2002.csv')
