import database
import json
from flask import Flask
from flask_jwt_extended import create_access_token

SQLALCHEMY_DATABASE_URI = "sqlite:///database.db"
JWT_SECRET_KEY = "please-remember-to-change-me"
app = Flask(__name__)
CORS(app)
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI

# Used to hold sessions
tokens = []
users = []

#=============================POST-REQUESTS=============================
app.route("/", methods=["POST"])
def welcome():
    """
        Automatical login if access_token provided is in the 'tokens' list.
        Returns a json containing valueable data of the user.
    """
    access_token = request.json['access_token']
    if access_token in tokens:
        while True:
            user_data = ''
            for index, token in enumerate(tokens):
                if token == access_token:
                    user_data = database.get_user_data(users[index])
            if user_data != None and user_data != '': break
        return json.dumps({'user_data': user_data})
    return json.dumps({'state': 'logout'})