import json
from flask import Flask

app = Flask(__name__)
CORS(app)

#=============================POST-REQUESTS=============================
app.route('/', methods=['POST'])
def welcome():
    return json.dumps({'success': True})