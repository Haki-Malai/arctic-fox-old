import database
import json
import re
import random
import string
import os
from pathlib import Path
from datetime import datetime
from flask import Flask, session, request, render_template, redirect, url_for
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
from werkzeug.utils import secure_filename

SQLALCHEMY_DATABASE_URI = "sqlite:///database.db"
JWT_SECRET_KEY = "please-remember-to-change-me"
UPLOAD_FOLDER = str(Path(__file__).resolve().parent) + '/static/uploads/'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])
app = Flask(__name__)
jwt = JWTManager(app)
CORS(app)
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
database.db.init_app(app)

with app.app_context():
    database.db.create_all()

# Used to hold sessions
tokens = []
users = []
# For the feed, for now it's faked with randomness
feed_stack = []
start_time = datetime.now()
wait = random.randint(1, 59)

# Responses
INVALID_CREDENTIALS = json.dumps({'error': 'invalid_credentials'})
SIGNUP_ERROR = json.dumps({'error': 'signup_error'})
SUCCESS = json.dumps({'success': True})
ERROR = json.dumps({'success': False})

# =============================POST-REQUESTS=============================

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
        return ERROR
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
        return ERROR

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
        return ERROR

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
    if function == 'available':
        vulnerability = request.json['vulnerability']
        tasks = database.get_available_tasks(vulnerability)
        return json.dumps({'tasks': tasks})
    elif function == 'assigned':
        id = request.json['id']
        tasks = database.get_user_tasks(id)
        return json.dumps({'tasks': tasks})
    elif function == 'assign':
        task_id = request.json['task_id']
        user_id = request.json['user_id']
        if database.assign_task(user_id, task_id):
            return SUCCESS
        else:
            return json.dumps({'error': 'error'})
    elif function == 'update':
        id = request.json['id']
        database.update_task(id, 1)
        return SUCCESS

@app.route('/proof', methods=['POST'])
def proof():
    if request.method == 'POST':
        image = request.files['image']
        if image:
            purpose = request.form['purpose']
            if purpose == 'avatar':
                id = request.form['id']
                image_name = secure_filename(image.filename)
                image.save(os.path.join(app.config['UPLOAD_FOLDER'], 'avatars/' + str(id) + image.filename))
                if database.set_user_avatar(id, image_name):
                    return SUCCESS
            if purpose == 'task':
                user_id = request.form['user_id']
                task_id = request.form['task_id']
                image_name = secure_filename(image.filename)
                image.save(os.path.join(app.config['UPLOAD_FOLDER'], 'avatars/' + str(id) + image.filename))
                if database.set_task_proof(user_id, admin_id, image_name):
                    return SUCCESS
    return ERROR

# =============================GET-REQUESTS=============================
@app.route('/feed', methods=['GET'])
def feed():
    """
        Returns the recents update from which users have upgraded level and more (currently faked with randomness)
    """
    global start_time, wait
    if len(feed_stack) == 0:
        for i in range(0, 6):
            # Create random username and level
            username = random.choice(string.ascii_letters) + random.randint(7, 14)*"*" + random.choice(string.ascii_letters)
            upgraded_to = random.randint(2, 6)
            feed_stack.append([username, upgraded_to])
        return json.dumps({'feed': feed_stack}, indent=4, sort_keys=True, default=str)
    elif (start_time - datetime.now()).total_seconds() >= wait:
        stack.pop()
        start_time = datetime.now()
        wait = random.randint(1, 19)
        # Create new feed
        username = random.choice(string.ascii_letters) + random.randint(7, 19)*"*" + random.choice(string.ascii_letters)
        upgraded_to = random.randint(2, 6)
        feed_stack.append([username, upgraded_to])
        stack.append()
        return json.dumps({'feed': feed_stack}, indent=4, sort_keys=True, default=str)
    return json.dumps({'feed': feed_stack}, indent=4, sort_keys=True, default=str)

@app.route('/guide', methods=['GET'])
def guide():
    try:
        file = open('assets/guide.json')
        guide = json.load(file)
        return json.dumps(guide)
    except:
        return ERROR

# =============================ADMIN-PAGE=========================
app.secret_key = 'SUPER SECRET KEY'
app.config['TEMPLATES_AUTO_RELOAD'] = True
admins = []
admin_tokens = []

@app.route('/admin', methods=['GET'])
def admin():
    return render_template('admin.html')

@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == "POST":
        username = request.form['username']
        password = request.form['password']
        if database.admin_credentials_valid(username, password):
            access_token = create_access_token(identity=username)
            admin_tokens.append(access_token)
            admins.append(database.get_admin_id(username))
            session['access_token'] = access_token
            return redirect(url_for('.admin_home', access_token=access_token))
    return render_template('login.html')

@app.route('/admin/register', methods=['GET', 'POST'])
def admin_register():
    if request.method == "POST":
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']
        secret_password = request.form['secret_password']
        if secret_password == 'TOPSECRETPASSWORD':
            if database.add_admin(username, password, email):
                access_token = create_access_token(identity=username)
                admin_tokens.append(access_token)
                admins.append(database.get_admin_id(username))
                session['access_token'] = access_token
                return redirect(url_for('.admin_home', access_token=access_token))
            else:
                return render_template('error.html')
    return render_template('register.html')

@app.route('/admin/home', methods=['GET', 'POST'])
def admin_home():
    access_token = request.args.get('access_token')
    if request.method == "POST":
        req = request.form['redirect']
        if access_token in admin_tokens:
            return redirect(url_for('.'+req, access_token=access_token))
    return render_template('home.html')

@app.route('/admin/home/addtasks', methods=['GET', 'POST'])
def add_tasks():
    if request.method == "POST":
        vulnerability = request.args.get('vulnerability')
        days = request.form['days']
        url = request.form['url']
        notes = request.form['notes']
        access_token = request.args.get('access_token')
        for index, token in enumerate(admin_tokens):
            if token == access_token:
                database.create_task(admins[index], vulnerability, url, days, notes)
    return render_template('addtasks.html')

@app.route('/admin/home/approvetasks', methods=['GET', 'POST'])
def approve_tasks():
    access_token = request.args.get('access_token')
    if access_token in admin_tokens:
        if request.method == 'POST':
            id = request.form['id']
            if request.form['submit'] == 'Approve':
                database.update_task(id, 2)
            elif request.form['submit'] == 'Disapprove':
                database.update_task(id, 3)

        for index, token in enumerate(admin_tokens):
            if token == access_token:
                tasks = database.get_admins_pending_tasks(admins[index])
                return render_template('approvetasks.html', tasks=tasks)
    else:
        return redirect(url_for('.admin_login'))

@app.route('/admin/home/payusers', methods=['GET', 'POST'])
def pay_users():
    if request.method == "POST":
        return 'TODO'
    return render_template('payusers.html')