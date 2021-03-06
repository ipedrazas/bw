"""BW APi.

API to work as backend for BW
"""

from flask import Flask, request
from flask.ext.pymongo import PyMongo
import hashlib
from slugify import slugify
from bson.json_util import dumps
from bson.objectid import ObjectId


app = Flask(__name__)

# connect to another MongoDB server altogether
app.config['MONGO_HOST'] = 'mongodb'
app.config['MONGO_PORT'] = 27017
app.config['MONGO_DBNAME'] = 'doctest2'

mongo = PyMongo(app, config_prefix='MONGO')


@app.route('/api/')
def hello_bw():
    """Hello function."""
    return 'Hello BW!'


@app.route('/api/entries', methods=['POST'])
def save_entry():
    """Save entry."""
    app.logger.debug(request.get_json())
    content = request.get_json()
    if 'body' in content:
        m = hashlib.md5()
        m.update(content.get('body').encode("utf-8"))

        slug = content.get('title', 'new-').encode("utf-8")
        prefix = slugify(str.lower(slug)) + '-'

        filename = "/data/" + prefix + m.hexdigest()

        # TODO: to create versions, use the parent & key

        if content.get('oid'):
            app.logger.debug("Update " + content.get('oid'))
            new_object = {
                'body': content.get('body').encode("utf-8"),
                'key': m.hexdigest(),
                'title': content.get('title', '').encode("utf-8"),
                'path': filename,
                'parent': content.get('oid'),
                '_id': ObjectId(content.get('oid'))
            }
            mongo.db.entries.update(
                {'_id': ObjectId(content.get('oid'))}, new_object
            )
        else:
            app.logger.debug("Insert")
            new_object = {
                'body': content.get('body').encode("utf-8"),
                'key': m.hexdigest(),
                'title': content.get('title', '').encode("utf-8"),
                'parent': '',
                'path': filename
            }
            insert = mongo.db.entries.insert(new_object)
            new_object = mongo.db.entries.find_one_or_404(
                {'_id': ObjectId(insert)}
            )
        app.logger.debug(new_object)
        with open(filename, 'wb') as f:
            f.write(content.get('body').encode("utf-8"))

    return dumps(new_object)


@app.route('/api/entries/<entry>')
def get_entry(entry):
    """Get entry."""
    entry = mongo.db.entries.find_one_or_404({'_id': ObjectId(entry)})
    return dumps(entry)


@app.route('/api/entries', methods=['GET'])
def get_entries():
    """Get entries."""
    entries = mongo.db.entries.find()
    return dumps(entries)


@app.route('/api/versions/<entry>', methods=['GET'])
def get_versions(entry):
    """Get entries."""
    entries = mongo.db.entries.find({'parent': ObjectId(entry)})
    return dumps(entries)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True, threaded=True)
