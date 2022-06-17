import database
import json
import re
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
SIGNUP_ERROR = json.dumps({'error': 'signup_error'})

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
        access_token = create_access_token(identity=id)
        while True:
            user_data = database.get_user_data(username)
            if user_data != None and access_token != None: 
                tokens.append(access_token)
                users.append(database.get_user_id(username))
                break
        response = json.dumps({'access_token': access_token, 'user_data': json.dumps(user_data, default=str) })
        return response
    return INVALID_CREDENTIALS

@app.route('/signup', methods=['POST'])
def signup():
    """
        Receives json with 4 parameters: username, password, email and invitor's code.
        Returns either login token and user's data or failure response
    """
    username = request.json['username'].lower()
    password = request.json['password']
    email = request.json['email']
    email_regex = '^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$'
    invitedFrom = request.json['invitorCode']
    if username == '' or password == '' or email == '':
        return json.dumps({'error': 'empty_fields'})
    if database.username_exists(username) or len(username) < 6 or len(username) > 25:
        return json.dumps({'error': 'username_unavailable'})
    elif database.email_exists(email) or not re.search(email_regex, email):
        return json.dumps({'error': 'email_unavailable'})
    elif len(password) < 8 or len(password) > 25:
        return json.dumps({'error': 'password_error'})
    else:
        while True:
            new_id = database.add_user(username, password, email, invitedFrom)
            if new_id:
                access_token = create_access_token(identity=new_id)
                user_data = database.get_user_data(new_id)
            if user_data != None and access_token != None: 
                tokens.append(access_token)
                users.append(new_id)
                break
        response = {'access_token': access_token, 'user_data': json.dumps(user_data, default=str)}
        return response
    return SIGNUP_ERROR

@app.route('/password', methods=['POST'])
def password():
    username = request.json['username'].lower()
    password = request.json['password']
    new = request.json['new']
    if database.credentials_valid(username, password):
        if len(new) >= 8 and len(new) <= 25:
            database.change_user_password(username, new)
            return SUCCESS
        return PASSWORD_ERROR
    return INVALID_CREDENTIALS

@app.route('/logout', methods=['POST'])
def logout():
    access_token = request.json['access_token']
    for index, token in enumerate(tokens):
        if access_token == token:
            tokens.remove(index)
            users.remove(index)
    return SUCCESS