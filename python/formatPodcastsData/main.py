import json

formattedData = {}

with open("python/formatPodcastsData/selected-rows.json", "r") as file:
    selectedRows = json.load(file)

    for row in selectedRows:
        print(row)
        subjectType, fileName = row["name"].split("-", 1)

        fileData = {
            "title": fileName.replace(".mp3", ""),
            "url": row["url"]
        }

        try:
            formattedData[subjectType].append(fileData)
        except:
            formattedData[subjectType] = [fileData]

with open("python/formatPodcastsData/formattedData.json", "w") as file:
    json.dump(formattedData, file, indent=None)