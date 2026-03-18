from app.extensions import db


class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(255), default='')
    user_app_id = db.Column(db.String(255), unique=True)
    user_photo = db.Column(db.Text)
    user_total_score = db.Column(db.BigInteger, default=0)
    user_total_lost_points = db.Column(db.BigInteger, default=0)
    user_current_score = db.Column(db.BigInteger, default=0)


class TaskList(db.Model):
    __tablename__ = 'task_list'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    task = db.Column(db.String(255))
    is_finish = db.Column(db.Integer, default=0)
    is_del = db.Column(db.Integer, default=1)


class DreamStore(db.Model):
    __tablename__ = 'dream_store'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    dream_item = db.Column(db.String(100))
    dream_consume_score = db.Column(db.Integer)
    dream_photo = db.Column(db.Text)
    is_finish = db.Column(db.Integer, default=0)
    is_del = db.Column(db.Integer, default=1)