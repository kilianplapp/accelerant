# COPYRIGHT 2023 Kilian Plapp -  https://kilianpl.app/
import base64
import time
import json
import threading
from pymongo import MongoClient
from flask import Flask, send_file, make_response, request, render_template, jsonify, send_from_directory
import random
import string
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

def handle_request(data, id):
    obfuscated_data = data['data']
    # De-obfuscate the data using the obfuscation key
    deobfuscated_data = deobfuscate(obfuscated_data)
    # Parse the JSON data
    accelerant = json.loads(deobfuscated_data)
    if db.accelerant.count_documents({'id': id}) == 0: # id has not been assigned, create new profile
        id = get_random_string(128)
        db.accelerant.insert_one(
            {
                'id': id,
                'headers': dict(request.headers),
                'connection-ip': request.remote_addr,
                'forwarded-for': request.headers.get('X-Forwarded-For'),
                'ctime': time.ctime(),
                'timestamp': int(time.time()),
                'user-agent': request.headers.get('User-Agent'),
                'score': 0,
                'requests': 1,
                'request-data': [
                    accelerant
                ]
            }
        )
        return id
    else: # id has been assigned, update profile
        id = data['accelerant']
        db.accelerant.update_one(
            {
                'id': id
            },
            {
                "$push":{"request-data": accelerant},
                "$inc":{"requests": 1}
            }
        )
        return id

@app.route('/accelerant.js', methods=['GET'])
def accelerant():
    return send_from_directory('dist', 'main.js')

@app.route('/api/accelerant', methods=['POST', 'OPTIONS'])
def mm():
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()
    elif request.method == "POST":  # The actual request following the preflight
        data = json.loads(request.get_data())

        if db.accelerant.count_documents({'id': data['accelerant']}) == 0: # id has not been assigned, create new profile
            id = get_random_string(128)
            threading.Thread(target=handle_request, args=(data,id)).start()
            return _corsify_actual_response(jsonify({"success": True, "accelerant":id}), id)
        else: # id has been assigned, update profile
            id = data['accelerant']
            threading.Thread(target=handle_request, args=(data,id)).start()
            return _corsify_actual_response(jsonify({"success": True, "accelerant":id}), id)


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
