import json

with open("python/topicsDictionaryData/topicsDictionary.json", "r") as file:
    dataset = json.load(file)

    lookup_table = {}

    for entry in dataset:
        word = entry["word"].lower()
        # Map the main word to its data
        lookup_table[word] = entry
        # Map each form to the same data
        for form in entry["forms"]:
            lookup_table[form.lower()] = entry
    
    with open("python/topicsDictionaryData/output.json", "w") as output_file:
        json.dump(lookup_table, output_file)

    def get_word_details(word):
        return lookup_table.get(word, "Not found")