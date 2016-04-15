"""BW APi.

API to work as backend for BW
"""

from flask import Flask, jsonify, request
from flask.ext.pymongo import PyMongo
import hashlib


app = Flask(__name__)

# connect to another MongoDB server altogether
app.config['MONGO_HOST'] = 'mongodb'
app.config['MONGO_PORT'] = 27017
app.config['MONGO_DBNAME'] = 'bw'
mongo = PyMongo(app, config_prefix='MONGO')


@app.route('/api/')
def hello_bw():
    """Hello function."""
    return 'Hello BW!'


@app.route('/api/entries', methods=['POST'])
def save_entry():
    """Save entry."""
    m = hashlib.md5()
    m.update("entry")
    entry = request.form['entry']
    filename = "/data/" + m.hexdigest()

    mongo.db.entries.insert(
        {
            'entry': entry.encode("utf-8"),
            'key': m.hexdigest(),
            'parent': m.hexdigest()}
    )

    # print filename

    with open(filename, 'wb') as f:
        f.write(entry.encode("utf-8"))
    # return 200
    return "hello"


@app.route('/api/entries/<entry>')
def get_entry(entry):
    """Get entry."""
    entry = mongo.db.entries.find_one_or_404({'_id': entry})
    return jsonify(entry=entry)


@app.route('/api/entries', methods=['GET'])
def get_entries():
    """Get entries."""
    entries = mongo.db.entries.find()
    return jsonify(entry=entries)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True, threaded=True)
