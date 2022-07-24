import string
import random
import json
import os
import re
import base64
from flask import current_app as app
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
    avatar = db.Column(db.String(224), default='default.jpeg')
    bitcoin_address = db.Column(db.String(40), default='none')
    confirmedEmail = db.Column(db.Boolean, default=False)
    created = db.Column(db.Date)
    level = db.Column(db.Integer, default=1)
    lastActive = db.Column(db.DateTime)
    invitationCode = db.Column(db.String(10), unique=True)
    invitedFrom = db.Column(db.String(10), default='NOBODY')
    invitationCommision = db.Column(db.Float(10), default=0)
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

    def init_balance(self):
        self.balance = 0
        self.invitationCommision = 0
        self.taskProfit = 0

    def get_data(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'confirmedEmail': self.confirmedEmail,
            'bitcoin_address': self.bitcoin_address,
            'created': self.created,
            'level': self.level,
            'lastActive': self.lastActive,
            'invitationCode': self.invitationCode,
            'invitedFrom': self.invitedFrom,
            'invitationCommision': self.invitationCommision,
            'balance': self.balance,
            'taskProfit': self.taskProfit,
            'tasks': get_user_tasks(self.id)
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
    assigned = db.Column(db.DateTime)
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

    def get_data(self):
        return {
            'id': self.id,
            'admin_id': self.admin_id,
            'user_id': self.user_id,
            'proof': self.proof,
            'vulnerability': self.vulnerability,
            'status': self.status,
            'created': self.created,
            'assigned': self.assigned,
            'days': self.days,
            'url': self.url,
            'submited': self.submited,
            'notes': self.notes
        }

class Admin(db.Model):
    __talblename__ = "admin"

    id = db.Column(db.Integer, primary_key=True)
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

class Payment(db.Model):
    __tablename__ = "payment"

    id = db.Column(db.Integer, primary_key=True)
    admin_id = db.Column(db.Integer, db.ForeignKey('admin.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    amount = db.Column(db.Float(64))
    tx_id = db.Column(db.String(64))
    paid = db.Column(db.Boolean, default=False)
    requested = db.Column(db.DateTime)
    pay_date = db.Column(db.DateTime)
    

    def __init__(self, user_id, amount):
        self.user_id = user_id
        self.amount = amount
        self.requested = datetime.now()

    def __repr__(self):
        return '<Task %r>' % self.id

    def get_data(self):
        return {
            'id': self.id,
            'admin_id': self.admin_id,
            'user_id': self.user_id,
            'amount': self.amount,
            'tx_id': self.tx_id,
            'paid': self.paid
        }

# =========================USER==============================================
def add_user(username, password, email, invitedFrom='NOBODY'):
    """
        Tries to add the new entry
        Returns result or new user id
    """
    try:
        # Check for availability
        email_regex = '^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$'
        if username == '' or password == '' or email == '':
            return 'empty_fields'
        elif User.query.filter_by(username=username).first():
            return 'username_unavailable'
        elif User.query.filter_by(email=email).first() or not re.search(email_regex, email):
            return 'email_unavailable'
        user = User(username=username, password=password, email=email, invitationCode=create_random_code(), invitedFrom=invitedFrom)
        db.session.add(user)
        db.session.commit()
        return user.id
    except Exception as e:
        print(str(e))
        return str(e)

def change_user_password(id, password):
    try:
        user = User.query.filter_by(id=id).first()
        user.password = generate_password_hash(password)
        db.session.commit()
        return True
    except Exception as e:
        print(str(e))
        return False

def get_user_json(id):
    try:
        return json.dumps(User.query.filter_by(id=id).first().get_data(), indent=4, sort_keys=True, default=str)
    except Exception as e:
        print(str(e))
    return False

def user_credentials_valid(password, **kwargs):
    try:
        if kwargs['username']:
            user = User.query.filter_by(username=kwargs['username']).first()
        elif kwargs['id']:
            user = User.query.filter_by(id=kwargs['id']).first()
        if user.validate_password(password):
            return user.id 
    except Exception as e:
        print(str(e))
    return False

def create_random_code():
    try:
        chars=string.ascii_uppercase + string.digits
        size = 10
        code = ''.join(random.choice(chars) for _ in range(size))
        while User.query.filter_by(invitationCode=code).first():
            code = ''.join(random.choice(chars) for _ in range(size))
        return code
    except Exception as e:
        print(str(e))
    return False

def set_user_avatar(id, image):
    user = User.query.filter_by(id=id).first()
    if user:
        # Remove old image if not default
        if user.avatar != 'default.jpeg':
            os.remove(os.path.join(app.config['UPLOAD_FOLDER'], 'avatars/', user.avatar))
        user.avatar = image
        db.session.commit()
        return True
    return False

def get_user_avatar(id):
    try:
        user = User.query.filter_by(id=id).first()
        with open(os.path.join(app.config['UPLOAD_FOLDER']+'avatars/'+user.avatar), 'rb') as image:
            encoded_img = base64.b64encode(image.read())
        return encoded_img.decode('utf-8')
    except Exception as e:
        print(str(e))
    
def set_user_address(id, password, address):
    try:
        user = User.query.filter_by(id=id).first()
        if user.validate_password(password):
            user.bitcoin_address = address
            db.session.commit()
            return True
    except Exception as e:
        print(str(e))
    return False

def request_payment(id):
    try:
        user = User.query.filter_by(id=id).first()
        payment = Payment(user_id=user.id, amount=user.balance)
        user.init_balance()
        db.session.add(payment)
        db.session.commit()
        return True
    except Exception as e:
        print(str(e))
    return False

def get_user_pay_requests(id):
    try:
        payments = []
        for payment in Payment.query.filter_by(user_id=id, paid=False).all():
            payments.append(json.dumps(payment.get_data(), indent=4, default=str, sort_keys=True))
        return payments
    except Exception as e:
        print(str(e))
    return False

def get_user_payments(id):
    try:
        payments = []
        for payment in Payment.query.filter_by(user_id=id, paid=True).all():
            payments.append(json.dumps(payment.get_data(), indent=4, default=str, sort_keys=True))
        return payments
    except Exception as e:
        print(str(e))
    return False

# ========================ADMIN-METHODS=========================================
def add_admin(username, password, email):
    try:
        admin = Admin(username=username, password=password, email=email)
        db.session.add(admin)
        db.session.commit()
        return admin.id
    except Exception as e:
        print(str(e))
    return False

def admin_credentials_valid(username, password):
    try:
        admin = Admin.query.filter_by(username=username).first()
        if admin:
            if admin.validate_password(password):
                return admin.id
    except Exception as e:
        print(str(e))
    return False

# ========================TASKS=================================================
def assign_task(user_id, task_id):
    try:
        # Check if user is privileged to another task
        user = User.query.filter_by(id=user_id).first()
        yesterday = datetime.now() - timedelta(days = 1)
        today_done = len(Task.query.filter(Task.user_id == user_id, Task.created > yesterday).all())
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
            task.assigned = datetime.now()
            db.session.commit()
            return True
    except Exception as e:
        print(str(e))
    return False

def create_task(admin_id, vulnerability, url, days, notes):
    try:
        task = Task(admin_id=admin_id, vulnerability=vulnerability, days=days, url=url, notes=notes)
        db.session.add(task)
        db.session.commit()
        return True
    except Exception as e:
        print(str(e))
    return False

def get_user_tasks(user_id):
    tasks = []
    for task in Task.query.filter_by(user_id = user_id).all():
        tasks.append(json.dumps(task.get_data(), indent=4, default=str, sort_keys=True))
    return tasks

def get_available_tasks(vulnerability):
    tasks = []
    for task in Task.query.filter_by(vulnerability=vulnerability, user_id=None).all():
        tasks.append(json.dumps(task.get_data(), indent=4, default=str, sort_keys=True))
    return tasks

def get_admin_tasks(admin_id, status):
    tasks = []
    for task in Task.query.filter_by(admin_id=admin_id, status=status).all():
        tasks.append(task.get_data())
    return tasks

def delete_task(id):
    try:
        Task.query.filter_by(id=id).delete()
        db.session.commit()
        return True
    except Exception as e:
        print(str(e))
    return False

def update_task(id, status):
    try:
        task = Task.query.filter_by(id=id).first()
        task.status = status
        task.submited = datetime.now()
        if task.proof and status == 3:
            os.remove(os.path.join(app.config['UPLOAD_FOLDER'], 'tasks/', task.proof))
        db.session.commit()
        return True
    except Exception as e:
        print(str(e))
    return False

def set_task_proof(id, image):
    try:
        task = Task.query.filter_by(id=id).first()
        task.proof = image
        db.session.commit()
        update_task(id, 1)
        return True
    except Exception as e:
        print(str(e))
    return False

# ==========================PAYMENTS================================
def get_pending_payments():
    try:
        pending_payments = []
        for payment in Payment.query.filter_by(paid=False).all():
            pending_payments.append(payment.get_data())
        return pending_payments
    except Exception as e:
        print(str(e))
    return False

def update_payment(admin_id, pay_id, tx_id):
    try:
        payment = Payment.query.filter_by(id=pay_id).first()
        payment.admin_id = admin_id
        payment.tx_id = tx_id
        payment.paid = True
        db.session.commit()
        return True
    except Exception as e:
        print(str(e))
    return False