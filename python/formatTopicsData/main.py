import json
import random
import string

pathArray = []
dataArray = []

def recursive(data, path, value):
    if (isinstance(value, dict)):
        for subTopic in value.keys():
            recursive(data, f"{path}/{subTopic}", value[subTopic])
    else:
        pathId = ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(20))
        pathArray.append({"path": path, "pathId": pathId})
        dataArray.append({"pathId": pathId, "value": value})

with open("python/formatTopicsData/topicsData.json", "r", encoding="utf-8") as file:
    topicsData = json.load(file)

    for topic in topicsData.keys():
        recursive(topicsData, topic, topicsData[topic])

with open("python/formatTopicsData/pathArray.json", "w", encoding="utf-8") as file:
    json.dump(pathArray, file, indent=4)
with open("python/formatTopicsData/dataArray.json", "w", encoding="utf-8") as file:
    json.dump(dataArray, file, indent=4)