# COPYRIGHT 2023 Kilian Plapp -  https://kilianpl.app/
# import libraries
import time
import json
import random
import traceback
import string
from sentry_sdk.integrations.flask import FlaskIntegration
import sentry_sdk
import io
import base64
import ipaddress

from pymongo import MongoClient
from flask import Flask, make_response, request, jsonify, send_from_directory, send_file

#import backend
from backend.check_mm import check_mm
from backend.deobfuscate import decrypt_with_keyfile

# initialize sentry
sentry_sdk.init(
    dsn="https://20998e7297a14def82eba60f9a234352@o4504805411389440.ingest.sentry.io/4504952506941440",
    integrations=[
        FlaskIntegration(),
    ],

    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for performance monitoring.
    # We recommend adjusting this value in production.
    traces_sample_rate=1.0
)

# initialize flask
app = Flask(__name__)

# initialize mongodb
client = MongoClient("mongodb+srv://kilianplapp:ubCpJxtuW4XzaDX8@sdt-0.bbusij8.mongodb.net/?retryWrites=true&w=majority")
db = client.starl1ght

#initialize util functions
def get_random_string(length):
    return ''.join(random.choice(string.ascii_letters) for i in range(length))

# initialize ip ban list
with open('./backend/ip_list.json') as f:
    ip_list = json.load(f)

def _build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response


def _corsify_actual_response(response,id):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers['Cache-Control'] = 'no-cache'
    response.headers['Server'] = 'Accelerant'
    response.headers['X-Powered-By'] = 'Accelerant'
    response.headers['X-Accelerant-Id'] = id
    return response

# initialize routes
@app.route('/accelerant.js', methods=['GET'])
def accelerant():
    return send_from_directory('dist', 'main.js')

@app.route('/api/accelerant', methods=['POST', 'OPTIONS'])
def mm():
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()
    elif request.method == "POST":  # The actual request following the preflight
        data = json.loads(request.get_data())
        obfuscated_data = data['data']
        # De-obfuscate the data using the obfuscation key
        decrypted_data = decrypt_with_keyfile('./backend/obfuscation_key.pem', obfuscated_data)
        #deobfuscated_data = deobfuscate(obfuscated_data)
        # Parse the JSON data
        accelerant = json.loads(decrypted_data)
        while True:
            if db.accelerant.count_documents({'id': data['accelerant']}) == 0: # id has not been assigned, create new profile
                id = get_random_string(64)
                accelerant['ctime'] = time.ctime()
                accelerant['timestamp'] = int(time.time()* 1000)
                db.accelerant.insert_one(
                    {
                        'id': id,
                        'headers': dict(request.headers),
                        'connection-ip': request.remote_addr,
                        'forwarded-for': request.headers.get('X-Forwarded-For'),
                        'ctime': time.ctime(),
                        'timestamp': int(time.time() * 1000),
                        'user-agent': request.headers.get('User-Agent'),
                        'requests': 1,
                        'star': False,
                        'request-data': [
                            accelerant
                        ]
                    }
                )
                return _corsify_actual_response(jsonify({"success": True, "accelerant":id}), id)
            else: # id has been assigned, update profile
                profile = db.accelerant.find_one({'id': data['accelerant']})
                if profile['request-data'][-1]['timestamp'] < int(time.time()) - 1800000:
                    db.accelerant.delete_one({'id': data['accelerant']})
                    continue
                accelerant['ctime'] = time.ctime()
                accelerant['timestamp'] = int(time.time()* 1000)
                db.accelerant.update_one(
                    {
                        'id': data['accelerant']
                    },
                    {
                        "$push":{"request-data": accelerant},
                        "$inc":{"requests": 1}
                    }
                )
                return _corsify_actual_response(jsonify({"success": True, "accelerant":data['accelerant']}), data['accelerant'])

@app.route('/api/accelerant/<id>', methods=['GET'])
def get_accelerant(id):
    try:
        profile = db.accelerant.find_one({'id': id})
        score = 0
        t = 0
        for request in profile['request-data']: # for request in session
            # add time between requests to total
            t += request['timestamp'] - profile['timestamp']
            # if the user has scrolled, add 5 points
            if request['vvpt'] > 0: score += 5
            # if the user is a webdriver, return 0
            if request['wdrv'] == True:
                return jsonify({"score": 0, "success": True, "code":"002", "user-agent": profile['user-agent']})
            # if the user has a mismatched user-agent, return 0
            if request['uagt'] != profile['user-agent']:
                return jsonify({"score": 0, "success": True, "code":"001", "user-agent": profile['user-agent']})
            # for each of the parameters missing, subtract 15 points
            for data in request:
                if data in ['wdrv', 'bdid']: continue
                if request[data] == 0: continue
                if request[data] == False:
                    score -= 15
            # check for suspicious mouse movements
            mm_sus = check_mm(request['msmv'])
            score -= mm_sus[0] * 5
            score -= mm_sus[1] * 5
        # calculate average time between requests
        t = t / profile['requests']
        if t > 120000:
            score += 75
        elif t > 30000:
            score += 50
        elif t > 10000:
            score += 25
        # if the user has only made 1 request, give them 50 points
        if profile['requests'] == 1:
            score += 50
        # check if the user responded to star request
        if profile['star'] == True:
            score += 15
        else:
            score -= 15
        #if the score is greater than 100, set it to 100
        if score > 100: score = 100
        # if the score is less than 0, set it to 0
        if score < 0: score = 0

        #check ip address
        for ip_range in ip_list['ips']:
            if profile['forwarded-for'] in ipaddress.IPv4Network(ip_range):
                score = 0
                break
        
        return jsonify({"score": score, "success": True, "user-agent": profile['user-agent']})
    except Exception as e:
        traceback.print_exc(e)
        return jsonify({"success": False})

@app.route('/api/accelerant/<id>/star', methods=['GET'])
def star(id):
    r = make_response(send_file(io.BytesIO(base64.b64decode("R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==")), mimetype="image/gif"))
    r.headers['Cache-Control'] = 'no-cache'
    r.headers['Server'] = 'Accelerant'
    r.headers['X-Powered-By'] = 'Accelerant'
    db.accelerant.update_one({'id': id}, {"$set":{"star": True}})
    return r
