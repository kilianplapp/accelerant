# COPYRIGHT 2023 Kilian Plapp -  https://kilianpl.app/
import base64
import io
import httpagentparser
import threading
import time
import json
from pymongo import MongoClient
from flask import Flask, send_file, make_response, request, render_template, jsonify, send_from_directory
from collections import Counter
import random
import string
app = Flask(__name__)
url = "https://kilianpl.app"
px = base64.b64decode(
    "R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==")
inj = """var i = document.createElement("img")
i.src = FLAG_CALLBACK + '/star?c=' + Math.random() + '&n=' + window.location.host + window.location.pathname
document.body.appendChild(i)"""
client = MongoClient(
    "mongodb+srv://kilianplapp:ubCpJxtuW4XzaDX8@sdt-0.bbusij8.mongodb.net/?retryWrites=true&w=majority")

db = client.starl1ght


def get_random_string(length):
    return ''.join(random.choice(string.ascii_letters) for i in range(length))


def starl1ght(referrer, useragent, url):
    user_agent = httpagentparser.detect(useragent)
    data = {
        'user_agent': useragent,
        'detection': user_agent,
        'url': url,
        'referer': referrer,
        'time': int(time.time())
    }
    db.starl1ght.insert_one(data)


@app.route('/starl1ght', methods=['GET'])
def home():
    return render_template('index.html', url=url)


@app.route('/star', methods=['GET'])
def star():
    r = make_response(send_file(io.BytesIO(px), mimetype="image/gif"))
    r.headers['Cache-Control'] = 'no-cache'
    r.headers['Server'] = 'starl1ght'
    r.headers['X-Powered-By'] = 'starl1ght'
    t = threading.Thread(target=starl1ght, args=(request.headers.get(
        'Referer'), request.headers.get('User-Agent'), request.args.get('n')))
    t.start()
    return send_file(io.BytesIO(px), mimetype="image/gif")


@app.route('/view', methods=['GET'])
def view():
    site = request.args.get('site')
    if site is None:
        return "No site specified", 400
    q = db.starl1ght.find({"url": {"$regex": f"^{site}"}}).sort('time', -1)
    currently_browsing = 0
    uas = []
    urls = []
    for i in q:
        if i['time'] > int(time.time()) - 120:
            currently_browsing += 1
        else:
            continue
        uas.append(i['user_agent'])
        urls.append(i['url'])
    ua = Counter(uas)
    urls = Counter(urls)
    return render_template('view.html', currently_browsing=currently_browsing, site=site, ua=ua, urls=urls, url=url)


@app.route('/star.js', methods=['GET'])
def meteor():
    id = inj.replace('FLAG_CALLBACK', f'"{url}"')
    return id.replace('\n', ';')


def deobfuscate(obfuscated_str):
    key = "1KxIeFm2bC5xxEk89XGLVwRuDIRCqq0xlQRfYmiWkGXOPzFFsITZwp5RwMe6RWtn"
    result = ''
    decoded_str = base64.b64decode(obfuscated_str).decode('utf-8')
    for i in range(len(decoded_str)):
        key_char = key[i % len(key)]
        key_int = ord(key_char)
        result += chr(key_int ^ ord(decoded_str[i]))
    return result

@app.route('/accelerant.js', methods=['GET'])
def accelerant():
    return send_from_directory('dist', 'main.js')

@app.route('/api/accelerant', methods=['POST', 'OPTIONS'])
def mm():
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()
    elif request.method == "POST":  # The actual request following the preflight
        obfuscated_data = json.loads(request.get_data())['data']

        # De-obfuscate the data using the obfuscation key
        deobfuscated_data = deobfuscate(obfuscated_data)

        # Parse the JSON data
        accelerant = json.loads(deobfuscated_data)
        id = get_random_string(128)
        db.Accelerant.insert_one(
            {
                'id': id,
                'headers': dict(request.headers),
                'accelerant': accelerant,
                'ip': request.remote_addr,
                'time': time.ctime(),
                'user-agent': request.headers.get('User-Agent'),
            }
        )
        return _corsify_actual_response(jsonify({"success": True}), id)


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
