import database
import json
import random
import string
import os
import base64
from pathlib import Path
from datetime import datetime
from flask import Flask, session, request, render_template, redirect, url_for, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
from werkzeug.utils import secure_filename

SQLALCHEMY_DATABASE_URI = "sqlite:///database.db"
JWT_SECRET_KEY = "please-remember-to-change-me"
UPLOAD_FOLDER = str(Path(__file__).resolve().parent) + '/static/uploads/'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
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

# =============================POST-REQUESTS=============================

@app.route("/", methods=["POST"])
def welcome():
    """
        Automatical login if access_token provided is in the 'tokens' list.
        Returns a json containing valueable data of the user.
    """
    try:
        access_token = request.json['access_token']
        user_id = get_id_from_token(access_token)
        if user_id:
            user_data = database.get_user_data(user_id)
            user_avatar = database.get_user_avatar(user_id, app.config['UPLOAD_FOLDER'])
            return json.dumps({'user_data': user_data, 'avatar': user_avatar}, indent=4, sort_keys=True, default=str)
    except Exception as e:
        print(str(e))
    return success(False)

@app.route('/login', methods=['POST'])
def login():
    """
        Receives json with 3 parameters: username, password and remember.
        Returns created session token and the user's data or the notification of invalid credentials.
    """
    try:
        username = request.json['username'].lower()
        password = request.json['password']
        remember = request.json['remember']
        user_id = database.user_credentials_valid(username, password)
        if user_id:
            access_token = create_access_token(identity=user_id)
            while True:
                user_data = database.get_user_data(user_id)
                if user_data != None and access_token != None: 
                    tokens.append(access_token)
                    users.append(user_id)
                    break
            response = json.dumps({'access_token': access_token, 'user_data': json.dumps(user_data, default=str) })
            return response
    except Exception as e:
        print(str(e))
    return success(False)

@app.route('/signup', methods=['POST'])
def signup():
    """
        Receives json with 4 parameters: username, password, email and invitor's code.
        Returns either login token and user's data or failure response
    """
    try:
        username = request.json['username'].lower()
        password = request.json['password']
        email = request.json['email']
        invitedFrom = request.json['invitationCode']
        while True:
            # db_response will be int (user's id) or an error message
            db_response = database.add_user(username, password, email, invitedFrom)
            if isinstance(db_response, int):
                access_token = create_access_token(identity=db_response)
                user_data = database.get_user_data(db_response)
            else:
                return json.dumps({'error': db_response})
            # Save access_token and user data
            if user_data != None and access_token != None: 
                tokens.append(access_token)
                users.append(db_response)
                break
        response = {'access_token': access_token, 'user_data': json.dumps(user_data, default=str)}
        return response
    except Exception as e:
        print(str(e))
    return success(False)

@app.route('/password', methods=['POST'])
def password():
    """
        Received json with username, old password and new password
        If old credentials are validated then the password changes to the new one
    """
    try:
        username = request.json['username'].lower()
        password = request.json['password']
        new = request.json['new']
        if database.credentials_valid(username, password):
            return success(database.change_user_password(username, new))
    except Exception as e:
        print(str(e))
    return success(False)

@app.route('/logout', methods=['POST'])
def logout():
    """
        Logs out the user by deleting the access_token from server's memory
    """
    try:
        access_token = request.json['access_token']
        for index, token in enumerate(tokens):
            if access_token == token:
                tokens.remove(index)
                users.remove(index)
        return success(True)
    except Exception as e:
        print(str(e))
    return success(False)

@app.route('/tasks', methods=['POST'])
def task():
    """
        Receives the function's name
        Does task based on function name
        Returns success or failure status
    """
    try:
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
                return success(True)
    except Exception as e:
        print(str(e))
    return success(False)

@app.route('/payments', methods=['POST'])
def payments():
    """
    """
    try:
        function = request.json['function']
        access_token = request.json['access_token']
        user_id = get_id_from_token(access_token)
        if function == 'change':
            password = request.json['password']
            address = request.json['address']
            if database.set_user_address(user_id, password, address):
                return success(True)

        elif function == 'request':
            if database.request_payment(user_id):
                return success(True)

        elif function == 'get_requests':
            pay_requests = database.get_user_pay_requests(user_id)
            if pay_requests:
                return json.dumps({'requests': pay_requests}, indent=4, default=str, sort_keys=True)

        elif function == 'get_payments':
            payments = database.get_user_payments(user_id)
            if payments:
                return json.dumps({'payments': payments}, indent=4, default=str, sort_keys=True)

    except Exception as e:
        print(str(e))
    return success(False)



@app.route('/upload', methods=['POST'])
def proof():
    """
        Received data as form-data
        Expected file is image type
        Saves file for whatever purpose
        Returns success or failure status
    """
    try:
        if request.method == 'POST':
            image = request.files['image']
            if image and allowed_file(image.filename):
                if request.form.get('user_id'):
                    user_id = request.form['user_id']
                    image_name = secure_filename(image.filename)
                    image_name = 'user' + user_id + image_name
                    image.save(os.path.join(app.config['UPLOAD_FOLDER'], 'avatars/' + image_name))
                    if database.set_user_avatar(user_id, image_name):
                        return success(True)
                elif request.form.get('task_id'):
                    task_id = request.form['task_id']
                    image_name = secure_filename(image.filename)
                    image_name = 'task' + task_id + image_name
                    image.save(os.path.join(app.config['UPLOAD_FOLDER'], 'tasks/' + image_name))
                    if database.set_task_proof(task_id, image_name):
                        return success(True)
    except Exception as e:
        print(str(e))
    return success(False)

# =============================GET-REQUESTS=============================
@app.route('/feed', methods=['GET']) #TODO CHANGE THIS!!!
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
    """
        Returns guide text for guide.json file
    """
    try:
        file = open('assets/guide.json')
        guide = json.load(file)
        return json.dumps(guide)
    except:
        return success(False)

# =============================ADMIN-PAGE=========================
app.config['TEMPLATES_AUTO_RELOAD'] = True
admins = []
admin_tokens = []

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                          'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route('/admin', methods=['GET'])
def admin():
    """
        Renders the template
    """
    return render_template('admin.html')

@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    """
        Receives username and password as form-data
        Redirects to home or renders login page
    """
    try:
        if request.method == "POST":
            username = request.form['username']
            password = request.form['password']
            admin_id = database.admin_credentials_valid(username, password)
            if isinstance(admin_id, int):
                access_token = create_access_token(identity=admin_id)
                admin_tokens.append(access_token)
                admins.append(admin_id)
                return redirect(url_for('.admin_home', access_token=access_token))
    except Exception as e:
        print(str(e))
    return render_template('login.html')

@app.route('/admin/register', methods=['GET', 'POST'])
def admin_register():
    """
        Receives username, password, email and secret_password as form-data
        Redirects to home or renders login page
    """
    try:
        if request.method == "POST":
            username = request.form['username']
            password = request.form['password']
            email = request.form['email']
            secret_password = request.form['secret_password']
            if secret_password == 'TOPSECRETPASSWORD':
                admin_id = database.add_admin(username, password, email)
                if isinstance(admin_id, int):
                    access_token = create_access_token(identity=admin_id)
                    admin_tokens.append(access_token)
                    admins.append(admin_id)
                    return redirect(url_for('.admin_home', access_token=access_token))
    except Exception as e:
        print(str(e))
    return render_template('register.html')

@app.route('/admin/home', methods=['GET', 'POST'])
def admin_home():
    """
        Receives access_token
        If valid, renders home.html else redirects to login page
    """
    try:
        access_token = request.args.get('access_token')
        if access_token in admin_tokens:
            if request.method == "POST":
                req = request.form['redirect']
                return redirect(url_for('.'+req, access_token=access_token))
            return render_template('home.html')
    except Exception as e:
        print(str(e))
    return redirect(url_for('.admin_login'))

@app.route('/admin/home/addtasks', methods=['GET', 'POST'])
def add_tasks():
    """
        Receives access_token, vulnerability type, days, url and notes as form-data
        Creates the task
        If no access_token, redirects to login
    """
    try:
        access_token = request.args.get('access_token')
        if access_token in admin_tokens:
            if request.method == "POST":
                    vulnerability = request.form['vulnerability']
                    days = request.form['days']
                    url = request.form['url']
                    notes = request.form['notes']
                    for index, token in enumerate(admin_tokens):
                        if token == access_token:
                            return render_template('addtasks.html', success=database.create_task(admins[index], vulnerability, url, days, notes))
            return render_template('addtasks.html')
    except Exception as e:
        print(str(e))
    return redirect(url_for('.admin_login'))

@app.route('/admin/home/approvetasks', methods=['GET', 'POST'])
def approve_tasks():
    """
        Receives access_token, vulnerability type, days, url and notes as form-data
        Creates the task
        If no access_token, redirects to login
    """
    try:
        access_token = request.args.get('access_token')
        if access_token in admin_tokens:
            if request.method == 'POST':
                task_id = request.form['task_id']
                if request.form['submit'] == 'Approve':
                    database.update_task(task_id, 2)
                elif request.form['submit'] == 'Disapprove':
                    database.update_task(task_id, 3)

            for index, token in enumerate(admin_tokens):
                if token == access_token:
                    tasks = database.get_admin_tasks(admins[index], 1)
                    return render_template('approvetasks.html', tasks=tasks)
    except Exception as e:
        print(str(e))
    return redirect(url_for('.admin_login'))

@app.route('/admin/home/payusers', methods=['GET', 'POST'])
def pay_users():
    """
        Receives access_token, payment request details as form-data
        Updates to paid with new tx_id
    """
    try:
        access_token = request.args.get('access_token')
        if access_token in admin_tokens:
            if request.method == 'POST':
                pay_id = request.form['pay_id']
                tx_id = request.form['tx_id']
                admin_id = request.form['admin_id']
                database.update_payment(admin_id, pay_id, tx_id)
            for index, token in enumerate(admin_tokens):
                if token == access_token:
                    pending_payments = database.get_pending_payments()
                    return render_template('payusers.html', pending_payments=pending_payments, admin_id=admins[index])
    except Exception as e:
        print(str(e))
    return redirect(url_for('.admin_login'))


# ==========================HELPER-FUNCTIONS=======================
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def success(bool):
    return json.dumps({'success': bool})

def get_id_from_token(access_token):
    if access_token in tokens:
        while True:
            for index, token in enumerate(tokens):
                if token == access_token:
                    user_id = users[index]
            if user_id:
                return user_id
    return False