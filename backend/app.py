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

@app.route("/", methods=["POST"])
def welcome():
    """
        Automatical login if access_token provided is in the 'tokens' list.
        Returns a json containing valueable data of the user.
    """
    # Handle data parsing errors
    try:
        access_token = request.json['access_token']
    except Exception as e:
        print(str(e))
        return json.dumps({'error': 'Error while receiving access token.', 'data': e})
    if access_token in tokens:
        while True:
            user_data = ''
            for index, token in enumerate(tokens):
                if token == access_token:
                    user_data = database.get_user_data(users[index])
            if user_data != None and user_data != '': break
        return json.dumps({'user_data': user_data}, indent=4, sort_keys=True, default=str)
    return json.dumps({'state': 'logout'})

@app.route('/login', methods=['POST'])
def login():
    """
        Receives json with 3 parameters: username, password and remember.
        Returns created session token and the user's data or the notification of invalid credentials.
    """
    # Handle data parsing errors
    try:
        username = request.json['username'].lower()
        password = request.json['password']
        remember = request.json['remember']
    except Exception as e:
        print(str(e))
        return json.dumps({'error': 'Error while receiving data.', 'data': e})

    if database.credentials_valid(username, password):
        id = database.get_user_id(username)
        access_token = create_access_token(identity=id)
        while True:
            user_data = database.get_user_data(id)
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
    # Handle data parsing errors
    try:
        username = request.json['username'].lower()
        password = request.json['password']
        email = request.json['email']
        # If it's empty then it's NOBODY
        try:
            invitedFrom = request.json['invitorCode']
        except:
            invitedFrom = 'NOBODY'
    except Exception as e:
        print(str(e))
        return json.dumps({'error': 'Error while receiving data.', 'data': e})

    # Check for availability, if fields are ok etc then create the new user entry in the database
    email_regex = '^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$'
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
    """
        Received json with username, old password and new password
        If old credentials are validated then the password changes to the new one
    """
    # Handle data parsing errors
    try:
        username = request.json['username'].lower()
        password = request.json['password']
        new = request.json['new']
    except Exception as e:
        print(str(e))
        return json.dumps({'error': 'Error while receiving data.', 'data': e})
    if database.credentials_valid(username, password):
        if len(new) >= 8 and len(new) <= 25:
            database.change_user_password(username, new)
            return SUCCESS
        return PASSWORD_ERROR
    return INVALID_CREDENTIALS

@app.route('/logout', methods=['POST'])
def logout():
    """
        Logs out the user by deleting the access_token from server's memory
    """
    # Handle data parsing errors
    try:
        access_token = request.json['access_token']
    except Exception as e:
        print(str(e))
        return json.dumps({'error': 'Caution; the token didn\'t get deleted from the server\'s memory and it can still be used!', 'data': e})
    for index, token in enumerate(tokens):
        if access_token == token:
            tokens.remove(index)
            users.remove(index)
    return SUCCESS

@app.route('/tasks', methods=['POST'])
def task():
    """
        Receives the function's name
        Returns success or failure status
    """
    function = request.json['function']
    if function == 'get':
        username = request.json['username'].lower()
        tasks = database.get_user_tasks(username)
        return json.dumps({'tasks': tasks})
    elif function == 'add':
        username = request.json['username'].lower()
        social = request.json['social']
        if database.add_task(username, social) == 0:
            return ERROR
        else:
            return SUCCESS
    elif function == 'update':
        id = request.json['id']
        database.update_task(id, 1)
        return SUCCESS
