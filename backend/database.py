import string
import random
import json
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(25), unique=True)
    password = db.Column(db.String(512))
    email = db.Column(db.String(50), unique=True)
    avatar = db.Column(db.String(224), default='')
    confirmedEmail = db.Column(db.Boolean, default=False)
    created = db.Column(db.Date)
    level = db.Column(db.Integer, default=1)
    lastActive = db.Column(db.DateTime)
    invitationCode = db.Column(db.String(10), unique=True)
    invitationCommision = db.Column(db.Float(10), default=0)
    invitedFrom = db.Column(db.String(10), default='NOBODY')
    taskProfit = db.Column(db.Float(10), default=0)
    balance = db.Column(db.Float, default=0)

    def __init__(self, username, email, password, invitationCode, invitedFrom):
        self.username = username
        self.email = email
        self.password = generate_password_hash(password)
        self.created = created=datetime.now()
        self.lastActive = created=datetime.now()
        self.invitationCode = invitationCode
        self.invitedFrom = invitedFrom

    def __repr__(self):
        return '<User %r>' % self.username

    def get_data(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'confirmedEmail': self.confirmedEmail,
            'created': self.created,
            'level': self.level,
            'lastActive': self.lastActive,
            'invitationCode': self.invitationCode,
            'invitedFrom': self.invitedFrom,
            'invitationCommision': self.invitationCommision,
            'balance': self.balance,
            'taskProfit': self.taskProfit,
            'tasks': []#get_user_tasks(self.username)
        }
    
    def validate_password(self, password):
        return check_password_hash(self.password, password)

    def get_paid(self, amount, payment_type):
        self.balance += amount
        if payment_type == 'task':
            self.taskProfit += amount
        elif payment_type == 'invite':
            self.invitationCommision += amount
        # Give 2% to the invitor
        if (self.invitedFrom != 'NOBODY'):
            invitor_amount = amount*0.02
            user = User.query.filter_by(invitationCode=self.invitedFrom).first()
            if user:
                user.get_paid(invitor_amount, 'invite')
        db.session.commit()

class Task(db.Model):
    __tablename__ = "task"
    
    id = db.Column(db.Integer, primary_key=True)
    admin_id = db.Column(db.Integer, db.ForeignKey('admin.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), default=None)
    vulnerability = db.Column(db.String(64))
    status = db.Column(db.Integer, default=0)
    proof = db.Column(db.String(248), default='')
    created = db.Column(db.DateTime)
    days = db.Column(db.Integer)
    url = db.Column(db.String(64))
    notes = db.Column(db.String(1024))
    submited = db.Column(db.DateTime, default=None)

    def __init__(self, admin_id, vulnerability, url, days, notes):
        self.admin_id = admin_id
        self.vulnerability = vulnerability
        self.created = datetime.now()
        self.days = days
        self.url = url
        self.notes = notes

    def __repr__(self):
        return '<Task %r>' % self.id

    def assign(id):
        self.user_id = id

    def get_data(self):
        return {
            'id': self.id,
            'admin_id': self.admin_id,
            'user_id': self.user_id,
            'proof': self.proof,
            'vulnerability': self.vulnerability,
            'status': self.status,
            'created': self.created,
            'days': self.days,
            'url': self.url,
            'submited': self.submited,
            'notes': self.notes
        }

class Admin(db.Model):
    __talblename__ = "admin"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(25), unique=True)
    password = db.Column(db.String(512))
    email = db.Column(db.String(25))
    
    def __init__(self, username, password, email):
        self.username = username
        self.password = generate_password_hash(password)
        self.email = email

    def __repr__(self):
        return '<Admin %r>' % self.username
    
    def validate_password(self, password):
        return check_password_hash(self.password, password)

# =========================USER==============================================
def add_user(username, password, email, invitedFrom='NOBODY'):
    # Check for availability
    email_regex = '^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$'
    if username == '' or password == '' or email == '':
        return 'empty_fields'
    elif User.query.filter_by(username=username).first():
        return 'username_unavailable'
    elif User.query.filter_by(email=email).first() or not re.search(email_regex, email):
        return 'email_unavailable'
    try:
        user = User(username=username, password=password, email=email, invitationCode=create_random_code(), invitedFrom=invitedFrom)
        db.session.add(user)
        db.session.commit()
    except Exception as e:
        print(str(e))
        return str(e)
    return user.id

def change_user_password(username, password):
    try:
        user = User.query.filter_by(username=username).first()
        user.password = generate_password_hash(password)
        db.session.commit()
        return True
    except Exception as e:
        print(str(e))
        return False

def get_user_data(id):
    return User.query.filter_by(id=id).first().get_data()

def get_user_id(username):
    return User.query.filter_by(username=username).first().id

def credentials_valid(username, password):
    user = User.query.filter_by(username=username).first()
    if user:
        return user.validate_password(password)
    return False

def create_random_code():
    chars=string.ascii_uppercase + string.digits
    size = 10
    code = ''.join(random.choice(chars) for _ in range(size))
    while User.query.filter_by(invitationCode=code).first():
        code = ''.join(random.choice(chars) for _ in range(size))
    return code

def set_user_avatar(id, image):
    user = User.query.filter_by(id=id).first()
    if user:
        user.avatar = image
        db.session.commit()
        return True
    return False

# ========================ADMIN-METHODS=========================================
def add_admin(username, password, email):
    admin = Admin(username=username, password=password, email=email)
    db.session.add(admin)
    db.session.commit()
    return True

def admin_credentials_valid(username, password):
    admin = Admin.query.filter_by(username=username).first()
    if admin:
        return admin.validate_password(password)
    return False

def get_admin_id(username):
    return Admin.query.filter_by(username=username).first().id

# ========================TASKS=================================================
def assign_task(user_id, task_id):
    # Check if user is privileged to another task
    user = User.query.filter_by(id=user_id).first()
    if user:
        yesterday = datetime.now() - timedelta(days = 1)
        today_done = 0#len(Task.query.filter(Task.user_id == user_id, Task.created > yesterday).all())
        if (user.level == 1 and today_done >= 3) or \
            (user.level == 2 and today_done >= 5) or \
            (user.level == 3 and today_done >= 8) or \
            (user.level == 4 and today_done >= 15) or \
            (user.level == 5 and today_done >= 22) or \
            (user.level == 6 and today_done >= 60):
            return False
        else:
            task = Task.query.filter_by(id=task_id).first()
            task.user_id = user_id
            db.session.commit()
            return True
    return False

def create_task(admin_id, vulnerability, url, days, notes):
    task = Task(admin_id=admin_id, vulnerability=vulnerability, days=days, url=url, notes=notes)
    db.session.add(task)
    db.session.commit()
    return task.id

def get_user_tasks(user_id):
    # Return tasks from last 24h
    tasks = []
    yesterday = datetime.now() - timedelta(days = 1)
    for task in Task.query.filter(Task.user_id == user_id, Task.created > yesterday).all():
        tasks.append(json.dumps(task.get_data(), indent=4, default=str, sort_keys=True))
    return tasks

def get_available_tasks(vulnerability):
    tasks = []
    for task in Task.query.filter_by(vulnerability=vulnerability, user_id=None).all():
        tasks.append(json.dumps(task.get_data(), indent=4, default=str, sort_keys=True))
    return tasks

def get_admins_pending_tasks(admin_id):
    tasks = []
    for task in Task.query.filter_by(admin_id=admin_id, status=1).all():
        tasks.append(task.get_data())
    return tasks

def delete_task(id):
    Task.query.filter_by(id=id).delete()
    db.session.commit()

def update_task(id, status):
    Task.query.filter_by(id=id).first().status = status
    Task.query.filter_by(id=id).first().submited = datetime.now()
    db.session.commit()

def set_task_proof(task_id, image):
    task = Task.query.filter_by(id=task_id, status=0)
    if task:
        task.proof = image
        update_task(task_id, 1)
        db.session.commit()
        return True
    return False