import string
import random
import json
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    username = db.Column(db.String(25), unique=True)
    password = db.Column(db.String(512))
    email = db.Column(db.String(50), unique=True)
    confirmedEmail = db.Column(db.Boolean, default=False)
    created = db.Column(db.Date)
    level = db.Column(db.Integer, default=1)
    lastActive = db.Column(db.DateTime)
    invitationCode = db.Column(db.String(10), unique=True)
    invitationCommision = db.Column(db.Float(10), default=0)
    invitedFrom = db.Column(db.String(10), default='NOBODY')
    taskProfit = db.Column(db.Float(10), default=0)
    picUrl = db.Column(db.String(10), default='none')
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
            'picUrl': self.picUrl,
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

    def get_json(self):
        return json.dumps({
            'id': self.id,
            'admin_id': self.admin_id,
            'user_id': self.user_id,
            'vulnerability': self.vulnerability,
            'status': self.status,
            'created': self.created,
            'days': self.days,
            'url': self.url,
            'submited': self.submited,
            'notes': self.notes
        }, indent=4, default=str, sort_keys=True)

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
    user = User(username=username, password=password, email=email, invitationCode=create_random_code(), invitedFrom=invitedFrom)
    db.session.add(user)
    db.session.commit()
    return user.id

def change_user_password(username, password):
    user = User.query.filter_by(username=username).first()
    user.password = generate_password_hash(password)
    db.session.commit()

def get_user_data(id):
    return User.query.filter_by(id=id).first().get_data()

def get_user_id(username):
    return User.query.filter_by(username=username).first().id

def credentials_valid(username, password):
    user = User.query.filter_by(username=username).first()
    if user:
        return user.validate_password(password)
    return False

def username_exists(username):
    return User.query.filter_by(username=username).first()

def email_exists(email):
    return User.query.filter_by(email=email).first()

def create_random_code():
    chars=string.ascii_uppercase + string.digits
    size = 10
    code = ''.join(random.choice(chars) for _ in range(size))
    while User.query.filter_by(invitationCode=code).first():
        code = ''.join(random.choice(chars) for _ in range(size))
    return code



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
def assign_task(username, social, days=3):
    # Check if user is privileged to another task
    user = User.query.filter_by(username=username).first()
    today_done = len(get_user_tasks(username))
    if (user.level == 1 and today_done == 3) or \
           (user.level == 2 and today_done == 5) or \
           (user.level == 3 and today_done == 8) or \
           (user.level == 4 and today_done == 15) or \
           (user.level == 5 and today_done == 22) or \
           (user.level == 6 and today_done == 60):
        return 0
    else:
        task = Task(user_id=user.id, social=social, days=days, url='https://www.facebook.com')
        db.session.add(task)
        db.session.commit()
        return 1

def create_task(admin_id, vulnerability, url, days, notes):
    task = Task(admin_id=admin_id, vulnerability=vulnerability, days=days, url=url, notes=notes)
    db.session.add(task)
    db.session.commit()
    return task.id

def get_user_tasks(username):
    user = User.query.filter_by(username=username).first()
    tasks = Task.query.filter_by(user_id=user.id).all()
    daily_tasks = []

    # Query tasks where the created datetime is bigger than yesterday 
    yesterday = datetime.now() - timedelta(days = 1)
    last_week = datetime.now() - timedelta(days = 7)
    last_3_days = datetime.now() - timedelta(seconds=15)#days = 3) # TODO custom timeout threshold
    random_past_time = datetime.now() - timedelta(seconds=15)#days = random.randint(0, 9)) 
    final_tasks = []

    # Delete very old tasks
    for task in Task.query.filter(Task.user_id == user.id, Task.created < last_week).all():
        db.session.delete(task)
        db.session.commit()

    # Update to timeout timeouted tasks
    for task in Task.query.filter(Task.user_id == user.id, Task.created < last_3_days, Task.status == 0).all():
        update_task(task.id, 3)

    # Update to finished and pay user
    for task in Task.query.filter(Task.user_id == user.id, Task.status == 1, Task.submited < random_past_time).all():
        update_task(task.id, 2)
        user_to_pay = User.query.filter(User.id == task.user_id).first()
        if user_to_pay.level == 1:
            amount = 0.5
        elif user_to_pay.level == 2:
            amount = 0.8
        elif user_to_pay.level == 3:
            amount = 1.5
        elif user_to_pay.level == 4:
            amount = 1.7
        elif user_to_pay.level == 5:
            amount = 2
        elif user_to_pay.level == 6:
            amount = 2.3
        user_to_pay.get_paid(amount, 'task')
        db.session.commit()

    # Return tasks from last 24h
    for task in Task.query.filter(Task.user_id == user.id, Task.created > yesterday).all():
        final_tasks.append(task.get_json())
    return final_tasks

def get_task_list(vulnerability):
    tasks = []
    for task in Task.query.filter_by(vulnerability=vulnerability).all():
        tasks.append(task.get_json())
    return tasks

def delete_task(id):
    Task.query.filter_by(id=id).delete()
    db.session.commit()

def update_task(id, status):
    Task.query.filter_by(id=id).first().status = status
    Task.query.filter_by(id=id).first().submited = datetime.now()
    db.session.commit()