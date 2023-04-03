# COPYRIGHT 2023 Kilian Plapp -  https://kilianpl.app/
import base64
import time
import json
from pymongo import MongoClient
from flask import Flask, send_file, make_response, request, render_template, jsonify, send_from_directory
import random
import traceback
import string
import math
from sentry_sdk.integrations.flask import FlaskIntegration
import sentry_sdk

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

def check_mm(mouse_events, speed_limit=5, acceleration_limit=5):
    # Check for suspiciously high mouse speed
    speed_limit_breaks = 0
    for i in range(1, len(mouse_events)):
        dx = mouse_events[i]['x'] - mouse_events[i-1]['x']
        dy = mouse_events[i]['y'] - mouse_events[i-1]['y']
        dt = mouse_events[i]['timestamp'] - mouse_events[i-1]['timestamp']
        distance = math.sqrt(dx**2 + dy**2)
        speed = distance / dt
        print("Speed: " + str(speed))
        if speed > speed_limit:
            speed_limit_breaks += 1
        
    acceleration_limit_breaks = 0
    for i in range(2, len(mouse_events)):
        dx1 = mouse_events[i-1]['x'] - mouse_events[i-2]['x']
        dy1 = mouse_events[i-1]['y'] - mouse_events[i-2]['y']
        dt1 = mouse_events[i-1]['timestamp'] - mouse_events[i-2]['timestamp']
        distance1 = math.sqrt(dx1**2 + dy1**2)
        speed1 = distance1 / dt1
        
        dx2 = mouse_events[i]['x'] - mouse_events[i-1]['x']
        dy2 = mouse_events[i]['y'] - mouse_events[i-1]['y']
        dt2 = mouse_events[i]['timestamp'] - mouse_events[i-1]['timestamp']
        distance2 = math.sqrt(dx2**2 + dy2**2)
        speed2 = distance2 / dt2
        
        acceleration = (speed2 - speed1) / dt2
        acceleration = abs(acceleration)
        print("Acceleration: " + str(acceleration))
        if acceleration > acceleration_limit:
            acceleration_limit_breaks += 1
    return [speed_limit_breaks, acceleration_limit_breaks]

app = Flask(__name__)
client = MongoClient(
    "mongodb+srv://kilianplapp:ubCpJxtuW4XzaDX8@sdt-0.bbusij8.mongodb.net/?retryWrites=true&w=majority")

db = client.starl1ght

def get_random_string(length):
    return ''.join(random.choice(string.ascii_letters) for i in range(length))

def deobfuscate(obfuscated_str):
    key = "1KxIeFm2bC5xxEk89XGLVwRuDIRCqq0xlQRfYmiWkGXOPzFFsITZwp5RwMe6RWtn"
    result = ''
    decoded_str = base64.b64decode(obfuscated_str).decode('utf-8')
    for i in range(len(decoded_str)):
        key_char = key[i % len(key)]
        key_int = ord(key_char)
        result += chr(key_int ^ ord(decoded_str[i]))
    return result

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
        deobfuscated_data = deobfuscate(obfuscated_data)
        # Parse the JSON data
        accelerant = json.loads(deobfuscated_data)
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
                        'pixel': False,
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
        # calculate score
        profile = db.accelerant.find_one({'id': id})
        # get average time between requests
        score = 0
        t = 0
        for request in profile['request-data']:
            t += request['timestamp'] - profile['timestamp']
            if request['vvpt'] > 0: score += 5
            if request['wdrv'] == True:
                return jsonify({"score": 0, "success": True, "code":"002", "user-agent": profile['user-agent']})
            if request['uagt'] != profile['user-agent']:
                return jsonify({"score": 0, "success": True, "code":"001", "user-agent": profile['user-agent']})
            for data in request:
                if data in ['wdrv', 'bdid']: continue
                if request[data] == 0: continue
                if request[data] == False:
                    score -= 15
            mm_sus = check_mm(request['msmv'])
            score -= mm_sus[0] * 5
            score -= mm_sus[1] * 5
        t = t / profile['requests']
        if t > 12000:
            score += 75
        elif t > 30000:
            score += 50
        elif t > 10000:
            score += 25
        if profile['requests'] == 1:
            score += 50
        if score > 100: score = 100
        if score < 0: score = 0
        return jsonify({"score": score, "success": True, "user-agent": profile['user-agent']})
    except Exception as e:
        traceback.print_exc(e)
        return jsonify({"success": False})
