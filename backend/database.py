from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
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
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    social = db.Column(db.Integer)
    status = db.Column(db.Integer)
    created = db.Column(db.DateTime)
    duration = db.Column(db.Integer)
    requirements = db.Column(db.Integer)
    link = db.Column(db.String(64))
    submited = db.Column(db.DateTime, default=None)

    def __init__(self, user_id, social, link, hours=0):
        self.user_id = user_id
        self.social = social
        self.status = 0
        self.created = datetime.now()
        self.duration = hours
        self.requirements = 1
        self.link = link
        self.submited = None

    def __repr__(self):
        return '<Task %r>' % self.id

    def get_json(self):
        return json.dumps({
            'id': self.id,
            'user_id': self.user_id,
            'social': self.social,
            'status': self.status,
            'created': self.created,
            'duration': self.duration,
            'requirements': self.requirements,
            'link': self.link,
            'submited': self.submited,
        }, indent=4, default=str, sort_keys=True)

def get_user_data(username):
    return User.query.filter_by(username=username).first().get_data()
    
def get_user_id(username):
    return User.query.filter_by(username=username).first().id

def credentials_valid(username, password):
    user = User.query.filter_by(username=username).first()
    if user:
        return user.validate_password(password)
    return False