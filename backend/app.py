import database
import json
from flask import Flask, session, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token

SQLALCHEMY_DATABASE_URI = "sqlite:///database.db"
JWT_SECRET_KEY = "please-remember-to-change-me"
app = Flask(__name__)
jwt = JWTManager(app)
CORS(app)
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
database.db.init_app(app)

# Used to hold sessions
tokens = []
users = []

# Responses
INVALID_CREDENTIALS = json.dumps({'error': 'invalid_credentials'})

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

@app.route('/login', methods=['POST'])
def login():
    """
        Receives json with 3 parameters: username, password and remember.
        Returns created session token and the user's data or the notification of invalid credentials.
    """
    username = request.json['username'].lower()
    password = request.json['password']
    remember = request.json['remember']
    if database.credentials_valid(username, password):
        access_token = create_access_token(identity=username)
        while True:
            user_data = database.get_user_data(username)
            if user_data != None and access_token != None: 
                tokens.append(access_token)
                users.append(database.get_user_id(username))
                break
        response = json.dumps({'access_token': access_token, 'user_data': json.dumps(user_data, default=str) })
        return response
    return INVALID_CREDENTIALS