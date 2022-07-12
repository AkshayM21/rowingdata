import requests
import time

str1 = "https://rp3rowing-app.com/workouts/1925915?token=e%3AHOaKm4N0HV9ociSZksbxZ9AwhyMwnvcZ"

def download_link(url):
    tokenIndex = url.index("?token=")
    return url[0:tokenIndex]+"/download/token"+url[tokenIndex:]+"&type=csv"

def export_link(url):
    tokenIndex = url.index("?token=")
    return url[0:tokenIndex]+"/export/token"+url[tokenIndex:]+"&type=csv"

def download_csv(url):
    r = requests.get(export_link(url))
    while not r.json()["ready"]:
        time.sleep(2)
        r = requests.get(export_link(url))

    open("test.csv", "wb").write(requests.get(download_link(url)).content)

print(download_csv(str1))
