import pymongo

# Connect to MongoDB
connection = pymongo.MongoClient("mongodb+srv://kilianplapp:ubCpJxtuW4XzaDX8@sdt-0.bbusij8.mongodb.net/?retryWrites=true&w=majority")

# Connect to the database
db = connection["Accelerant"]

# List all unique vendors
seen = []
for document in db.requests.find({}):
    if document['data']['canv'] not in seen:
        seen.append(document['data']['canv'])
        print(document['data']['canv'])

