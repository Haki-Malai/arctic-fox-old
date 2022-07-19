import database
import random
import string
import os
import base64
from pathlib import Path
from datetime import datetime
from flask import Flask, request, render_template, redirect, url_for, send_from_directory, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app = Flask(__name__, static_folder='static/web-build', static_url_path='/')
jwt = JWTManager(app)
CORS(app)
app.config["JWT_SECRET_KEY"] = 'random key secret must change'
app.config["JWT_TOKEN_LOCATION"] = ["headers", "query_string"]
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = str(Path(__file__).resolve().parent) + '/static/uploads/'
app.config['TEMPLATES_AUTO_RELOAD'] = True
database.db.init_app(app)

with app.app_context():
    database.db.create_all()

# =============================POST-REQUESTS=============================
@app.route("/")
def index():
    return app.send_static_file('index.html')

@app.route("/user", methods=["GET"])
@jwt_required()
def welcome():
    """
        Automatical login with access_token provided and jwt_required decorator
        Returns a json containing valueable data of the user
    """
    try:
        user_id = get_jwt_identity()
        user_data = database.get_user_json(user_id)
        user_avatar = database.get_user_avatar(user_id, app.config['UPLOAD_FOLDER'])
        return jsonify(
            userData=user_data, 
            avatar=user_avatar,
            status=200
        )
    except Exception as e:
        print(str(e))
    return jsonify(
            success(False),
            status=400
        )

@app.route('/login', methods=['POST'])
def login():
    """
        Receives json with 3 parameters: username, password and remember
        Returns created session token and the user's data or the notification of invalid credentials
    """
    try:
        username = request.json['username'].lower()
        password = request.json['password']
        #remember = request.json['remember']
        user_id = database.user_credentials_valid(password, username=username)
        if user_id:
            access_token = create_access_token(identity=user_id)
            return jsonify(
                access_token= access_token, 
                user_data= database.get_user_json(user_id)
            )
    except Exception as e:
        print(str(e))
    return success(False)

@app.route('/signup', methods=['POST'])
def signup():
    """
        Receives json with 4 parameters: username, password, email and invitor's code
        Returns either login token and user's data or failure response
    """
    try:
        username = request.json['username'].lower()
        password = request.json['password']
        email = request.json['email']
        invitedFrom = request.json['invitationCode']
        # db_response will be int (user's id) or an error message
        db_response = database.add_user(username, password, email, invitedFrom)
        if isinstance(db_response, int):
            access_token = create_access_token(identity=db_response)
            user_data = database.get_user_json(db_response)
        response = {'access_token': access_token, 'user_data': user_data }
        return jsonify(
            access_token= access_token,
            user_data= user_data 
        )
    except Exception as e:
        print(str(e))
    return success(False)

@app.route('/password', methods=['POST'])
@jwt_required()
def password():
    """
        Received json with jwt_token, username, old password and new password
        If old credentials are validated then the password changes to the new one
    """
    try:
        user_id = get_jwt_identity()
        password = request.json['password']
        new = request.json['new']
        if database.credentials_valid(password, id=user_id):
            return success(database.change_user_password(user_id, new))
    except Exception as e:
        print(str(e))
    return success(False)

@app.route('/tasks', methods=['POST'])
@jwt_required()
def task():
    """
        Receives the function's name
        Does task based on function name
        Returns success or failure status
    """
    try:
        user_id = get_jwt_identity()
        function = request.json['function']
        if function == 'available':
            vulnerability = request.json['vulnerability']
            tasks = database.get_available_tasks(vulnerability)
            return jsonify(tasks=tasks)
        elif function == 'assigned':
            tasks = database.get_user_tasks(user_id)
            return jsonify(tasks=tasks)
        elif function == 'assign':
            task_id = request.json['task_id']
            if database.assign_task(user_id, task_id):
                return success(True)
    except Exception as e:
        print(str(e))
    return success(False)

@app.route('/payments', methods=['POST'])
@jwt_required()
def payments():
    """
    """
    try:
        user_id = get_jwt_identity()
        function = request.json['function']
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
                return jsonify(requests=pay_requests)

        elif function == 'get_payments':
            payments = database.get_user_payments(user_id)
            if payments:
                return jsonify(payments=payments)

    except Exception as e:
        print(str(e))
    return success(False)



@app.route('/upload', methods=['POST'])
@jwt_required()
def proof():
    """
        Received data as form-data
        Expected file is image type
        Saves file for whatever purpose
        Returns success or failure status
    """
    try:
        user_id = get_jwt_identity()
        image = request.files['image']
        if image and allowed_file(image.filename):
            if request.form.get('user_id'):
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
                if database.set_task_proof(task_id, user_id, image_name):
                    return success(True)
    except Exception as e:
        print(str(e))
    return success(False)

# =============================GET-REQUESTS=============================
# For the feed, for now it's faked with randomness
@app.route('/feed', methods=['GET']) #TODO CHANGE THIS!!!
@jwt_required()
def feed():
    """
        Returns the recents update from which users have upgraded level and more (currently faked with randomness)
    """
    feed_stack = []
    start_time = datetime.now()
    wait = random.randint(1, 59)
    if len(feed_stack) == 0:
        for i in range(0, 6):
            # Create random username and level
            username = random.choice(string.ascii_letters) + random.randint(7, 14)*"*" + random.choice(string.ascii_letters)
            upgraded_to = random.randint(2, 6)
            feed_stack.append([username, upgraded_to])
        return jsonify(feed=feed_stack)
    elif (start_time - datetime.now()).total_seconds() >= wait:
        stack.pop()
        start_time = datetime.now()
        wait = random.randint(1, 19)
        # Create new feed
        username = random.choice(string.ascii_letters) + random.randint(7, 19)*"*" + random.choice(string.ascii_letters)
        upgraded_to = random.randint(2, 6)
        feed_stack.append([username, upgraded_to])
        stack.append()
        return jsonify(feed=feed_stack)
    return jsonify(feed=feed_stack)

@app.route('/guide', methods=['GET'])
@jwt_required()
def guide():
    """
        Returns guide text for guide.json file
    """
    try:
        file = open('assets/guide.json')
        guide = json.load(file)
        return jsonify(guide)
    except:
        return success(False)

# =============================ADMIN-PAGE=========================
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
                return redirect(url_for('.admin_home', jwt=access_token))
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
                    return redirect(url_for('.admin_home', jwt=access_token))
    except Exception as e:
        print(str(e))
    return render_template('register.html')

@app.route('/admin/home', methods=['GET', 'POST'])
@jwt_required()
def admin_home():
    """
        Receives access_token
        If valid, renders home.html else redirects to login page
    """
    try:
        if request.method == 'POST':
            to_redirect = '.' + request.form['redirect']
            return redirect(url_for(to_redirect, jwt=request.args.get('jwt')))
        return render_template('home.html')
    except Exception as e:
        print(str(e))
    return redirect(url_for('.admin_login'))

@app.route('/admin/home/addtasks', methods=['GET', 'POST'])
@jwt_required()
def add_tasks():
    """
        Receives access_token, vulnerability type, days, url and notes as form-data
        Creates the task
        If no access_token, redirects to login
    """
    try:
        admin_id = get_jwt_identity()
        if request.method == "POST":
                vulnerability = request.form['vulnerability']
                days = request.form['days']
                url = request.form['url']
                notes = request.form['notes']
                return render_template('addtasks.html', success=database.create_task(admin_id, vulnerability, url, days, notes), jwt=request.args.get('jwt'))
        return render_template('addtasks.html', jwt=request.args.get('jwt'))
    except Exception as e:
        print(str(e))
    return redirect(url_for('.admin_login'))

@app.route('/admin/home/approvetasks', methods=['GET', 'POST'])
@jwt_required()
def approve_tasks():
    """
        Receives access_token, vulnerability type, days, url and notes as form-data
        Creates the task
        If no access_token, redirects to login
    """
    try:
        admin_id = get_jwt_identity()
        if request.method == 'POST':
            task_id = request.form['task_id']
            if request.form['submit'] == 'Approve':
                database.update_task(task_id, 2)
            elif request.form['submit'] == 'Disapprove':
                database.update_task(task_id, 3)

        tasks = database.get_admin_tasks(admin_id, 1)
        return render_template('approvetasks.html', tasks=tasks, jwt=request.args.get('jwt'))
    except Exception as e:
        print(str(e))
    return redirect(url_for('.admin_login'))

@app.route('/admin/home/payusers', methods=['GET', 'POST'])
@jwt_required()
def pay_users():
    """
        Receives access_token, payment request details as form-data
        Updates to paid with new tx_id
    """
    try:
        admin_id = get_jwt_identity()
        if request.method == 'POST':
            pay_id = request.form['pay_id']
            tx_id = request.form['tx_id']
            database.update_payment(admin_id, pay_id, tx_id)
        pending_payments = database.get_pending_payments()
        return render_template('payusers.html', pending_payments=pending_payments, admin_id=admin_id, jwt=request.args.get('jwt'))
    except Exception as e:
        print(str(e))
    return redirect(url_for('.admin_login'))


# ==========================HELPER-FUNCTIONS=======================
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def success(bool):
    return jsonify(success= bool)
