import os
import uuid
import json
import logging
import requests
from flask_cors import CORS
from datetime import datetime
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.utils import secure_filename
from flask import Flask, request, jsonify, Blueprint, send_from_directory

# 配置日志记录
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# 创建 Flask 应用实例
app = Flask(__name__)
CORS(app)

# 从环境变量中获取数据库连接信息
DB_USER = os.getenv('DB_USER', 'root')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'WXWTxzlm_123')
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = os.getenv('DB_PORT', '3306')
DB_NAME = os.getenv('DB_NAME', 'dream_store_test')
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'

# 关闭 SQLAlchemy 的跟踪修改功能，减少内存开销
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# 从环境变量中获取微信相关信息
APPID = os.getenv('WECHAT_APPID', 'wx19736cc3951a577b')
SECRET = os.getenv('WECHAT_SECRET', 'cfc7259996778a4d0ca15e87d7beb531')

# 初始化 SQLAlchemy
db = SQLAlchemy(app)
migrate = Migrate(app, db)

app.config['UPLOAD_FOLDER'] = '/DreamStore/static/uploads/'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)


# 定义用户模型
class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_name = db.Column(db.String(255), nullable=False, default='', comment='用户名')
    user_open_id = db.Column(db.String(), nullable=False, comment='用户ID码')
    user_photo = db.Column(db.Text(), comment='用户头像base64')
    user_total_score = db.Column(db.BigInteger, nullable=False, default=0, comment='用户总理想值')
    user_total_lost_points = db.Column(db.BigInteger, nullable=False, default=0, comment='已完成理想值')
    user_current_score = db.Column(db.BigInteger, nullable=False, default=0, comment='当前理想值')

    def update_score(self, score, score_type):
        try:
            if score_type == 1:  # 获取积分
                self.user_total_score += score
                self.user_current_score += score
            elif score_type == 2:  # 消耗积分
                if self.user_current_score < score:
                    return jsonify({"code": 200, "message": "兑换成功", "data": []})
                else:
                    self.user_total_lost_points += score
                    self.user_current_score -= score
            db.session.commit()
        except SQLAlchemyError as e:
            db.session.rollback()
            raise


# 定义任务列表模型
class TaskList(db.Model):
    __tablename__ = 'task_list'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, nullable=False)
    task = db.Column(db.String(255), nullable=False, comment='任务')
    is_finish = db.Column(db.Integer, nullable=False, default=0, comment='是否完成：0：未完成；1：已完成；')
    is_del = db.Column(db.Integer, nullable=False, default=1, comment='是否删除：0：已删除；1：未删除；')
    dream_score = db.Column(db.Integer, nullable=False, default=1, comment='完成任务所获取的理想值')


# 定义任务历史模型
class TaskHistory(db.Model):
    __tablename__ = 'task_history'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, nullable=False)
    task_id = db.Column(db.Integer, nullable=False)
    finish_time = db.Column(db.DateTime, nullable=False)


# 定义物品商店模型
class ItemStore(db.Model):
    __tablename__ = 'item_store'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, nullable=False, comment='用户 ID')
    dream_item = db.Column(db.String(100), nullable=False, comment='理想物品')
    dream_consume_score = db.Column(db.Integer, nullable=False, comment='消耗理想值')
    dream_photo = db.Column(db.Text(), comment='理想照片')
    is_exchange = db.Column(db.Integer, nullable=False, default=0, comment='是否完成兑换：0：未兑换；1：已兑换；')
    is_del = db.Column(db.Integer, nullable=False, default=1, comment='是否删除：0：已删除；1：未删除；')


# 定义理想积分模型
class DreamScore(db.Model):
    __tablename__ = 'dream_score'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(255), nullable=False)
    score_type = db.Column(db.Integer, nullable=False, comment='使用理想值类型：1、获取理想值；2、消耗理想值')
    score_number = db.Column(db.Integer, nullable=False, comment='获取/消耗理想值')
    task_id = db.Column(db.Integer, nullable=True, comment='任务 ID')
    item_id = db.Column(db.Integer, nullable=True, comment='理想 ID')


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'image' not in request.files:
        return jsonify({'success': False, 'error': '未上传文件'})

    file = request.files['image']
    if file.filename == '':
        return jsonify({'success': False, 'error': '空文件名'})

    if file and allowed_file(file.filename):
        # 生成唯一文件名避免冲突
        filename = str(uuid.uuid4()) + '.' + secure_filename(file.filename).split('.')[-1]
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(save_path)

        # 生成可访问的URL（替换为你的域名）
        image_url = f"{request.host_url}get_image/{filename}"
        return jsonify({'success': True, 'url': image_url})

    return jsonify({'success': False, 'error': '文件类型不允许'})


@app.route('/get_image/<filename>')
def get_image(filename):
    # 从上传目录返回图片
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


# 统一错误处理
@app.errorhandler(Exception)
def handle_exception(e):
    logging.error(f"发生错误: {str(e)}")
    if isinstance(e, SQLAlchemyError):
        db.session.rollback()
    return jsonify({"code": 500, "message": str(e)}), 500


# 创建蓝图
task_bp = Blueprint('task', __name__)
item_bp = Blueprint('item', __name__)
user_bp = Blueprint('user', __name__)


# 获取任务列表
@task_bp.route('/task_list', methods=['GET', 'POST'])
def get_task_list():
    user_id = request.args.get('user_id')
    if not user_id:
        raise ValueError("user_id is required")
    tasks = TaskList.query.filter_by(user_id=user_id, is_del=1).all()
    task_list = []
    for task in tasks:
        task_info = {
            "id": task.id,
            "task": task.task,
            "dream_score": task.dream_score,
            "finish": task.is_finish
        }
        task_list.append(task_info)
    return jsonify({"code": 200, "message": "获取成功", "data": task_list})


# 添加任务
@task_bp.route('/add_task', methods=['GET', 'POST'])
def add_task():
    user_id = request.args.get('user_id')
    task = request.args.get('task')
    dream_score = request.args.get('dream_score')
    if not user_id or not task or not dream_score:
        raise ValueError("user_id, task and dream_score are required")
    new_task = TaskList(user_id=user_id, task=task, dream_score=dream_score)
    db.session.add(new_task)
    db.session.commit()
    return jsonify({"code": 200, "message": "添加成功", "data": []})


# 完成任务
@task_bp.route('/finish_task', methods=['GET', 'POST'])
def finish_task():
    task_id = request.args.get('task_id')
    user_id = request.args.get('user_id')

    if not task_id:
        raise ValueError("task_id is required")

    task = TaskList.query.get(task_id)
    if not task:
        raise ValueError("Task not found")

    user = User.query.get(user_id)
    new_dream = DreamScore(user_id=user_id, score_type=1, score_number=task.dream_score, task_id=task_id)
    new_task_history = TaskHistory(user_id=user_id, task_id=task_id, finish_time=datetime.now())

    db.session.add_all([new_dream, new_task_history])
    task.is_finish = 1
    user.update_score(task.dream_score, 1)

    return jsonify({"code": 200, "message": "任务已完成", "data": []})


# 删除任务
@task_bp.route('/del_task', methods=['GET', 'POST'])
def del_task():
    task_id = request.args.get('task_id')
    if not task_id:
        raise ValueError("task_id is required")
    task = TaskList.query.get(task_id)
    if not task:
        raise ValueError("Task not found")
    task.is_del = 0
    db.session.commit()
    return jsonify({"code": 200, "message": "删除成功", "data": []})


# 获取理想列表
@item_bp.route('/item_list', methods=['GET', 'POST'])
def get_item_list():
    user_id = request.args.get('user_id')
    if not user_id:
        raise ValueError("user_id is required")
    items = ItemStore.query.filter_by(user_id=user_id, is_del=1).all()
    item_list = []
    for item in items:
        item_info = {
            "item_id": item.id,
            "dream_item": item.dream_item,
            "dream_consume_score": item.dream_consume_score,
            "dream_photo": item.dream_photo,
            "is_exchange": item.is_exchange
        }
        item_list.append(item_info)
    return jsonify({"code": 200, "message": "获取成功", "data": item_list})


# 添加理想
@item_bp.route('/add_item', methods=['GET', 'POST'])
def add_item():
    user_id = request.args.get('user_id')
    dream_item = request.args.get('dream_item')
    dream_consume_score = request.args.get('dream_consume_score')
    dream_photo = request.args.get('dream_photo')

    if not user_id or not dream_item or not dream_consume_score:
        raise ValueError("user_id, dream_item and dream_consume_score are required")

    new_item = ItemStore(user_id=user_id, dream_item=dream_item,
                         dream_consume_score=dream_consume_score, dream_photo=dream_photo)
    db.session.add(new_item)
    db.session.commit()
    return jsonify({"code": 200, "message": "添加成功", "data": []})


# 兑换理想
@item_bp.route('/exchange_item', methods=['GET', 'POST'])
def exchange_item():
    user_id = request.args.get('user_id')
    item_id = request.args.get('item_id')

    if not item_id:
        raise ValueError("item_id are required")

    item = ItemStore.query.get(item_id)
    if not item:
        raise ValueError("Item not found")

    user = User.query.get(user_id)
    new_dream = DreamScore(user_id=user_id, score_type=2, item_id=item_id, score_number=item.dream_consume_score)

    db.session.add(new_dream)
    item.is_exchange = 1
    user.update_score(item.dream_consume_score, 2)

    return jsonify({"code": 200, "message": "兑换成功", "data": []})


# 删除理想
@item_bp.route('/del_item', methods=['GET', 'POST'])
def del_item():
    item_id = request.args.get('item_id')
    if not item_id:
        raise ValueError("item_id is required")
    item = ItemStore.query.get(item_id)
    if not item:
        raise ValueError("Item not found")
    item.is_del = 0
    db.session.commit()
    return jsonify({"code": 200, "message": "删除成功", "data": []})


# 登录账号
@user_bp.route('/login', methods=['GET', 'POST'])
def login():
    # data = request.get_json(force=True)
    code = request.args.get('code')
    user_name = "微信用户"

    if not code:
        raise ValueError("code 是必需的")

    # 调用微信的 code2Session 接口换取 openid
    url = f'https://api.weixin.qq.com/sns/jscode2session?appid={APPID}&secret={SECRET}&js_code={code}&grant_type=authorization_code'
    try:
        response = requests.get(url)
        response.raise_for_status()
        result = response.json()
    except requests.RequestException as e:
        raise Exception(f"微信请求失败: {str(e)}")

    if 'errcode' in result:
        raise Exception(f"微信登录失败: {result.get('errmsg')}")

    openid = result.get('openid')

    # 检查用户是否已存在
    user = User.query.filter_by(user_open_id=openid).first()
    if not user:
        # 若用户不存在，创建新用户
        user = User(user_open_id=openid, user_name=user_name)
        db.session.add(user)
        db.session.commit()

    response_data = {
        "user_id": user.id,
        "user_name": user.user_name,
        "user_photo": user.user_photo,
        "user_open_id": user.user_open_id,
        "user_total_score": user.user_total_score,
        "user_total_lost_points": user.user_total_lost_points,
        "user_current_score": user.user_current_score,
    }

    return jsonify({"code": 200, "message": "登录成功", "data": response_data})


# 上传头像
@user_bp.route('/up_data', methods=['GET', 'POST'])
def upload_photo():
    user_id = request.args.get('user_id')
    user_name = request.args.get('user_name')
    user_photo = request.args.get('user_photo')

    if not user_id:
        raise ValueError("用户 ID 是必需的")
    user = User.query.get(user_id)
    if not user:
        raise ValueError("用户未找到")

    if user_photo:
        user.user_photo = user_photo

    if user_name:
        user.user_name = user_name
    db.session.commit()
    response_data = {
        "user_name": user.user_name,
        "user_photo": user.user_photo
    }
    return jsonify({"code": 200, "message": "头像上传成功", "data": response_data})


# 获取积分
@user_bp.route('/dream_score', methods=['GET', 'POST'])
def get_dream_score():
    user_id = int(request.args.get('user_id'))
    if not user_id:
        raise ValueError("用户 ID 是必需的")
    user = User.query.get(user_id)
    if not user:
        raise ValueError("用户未找到")
    response_data = {
        "total_score": user.user_total_score,
        "total_lost_points": user.user_total_lost_points,
        "current_score": user.user_current_score
    }

    return jsonify({"code": 200, "message": "理想值获取成功", "data": response_data})


# 获取用户列表
@user_bp.route('/user_list', methods=['GET'])
def get_user_list():
    users = User.query.all()
    user_list = []
    for user in users:
        user_info = {
            "user_id": user.id,
            "user_name": user.user_name,
            "user_photo": user.user_photo
        }
        user_list.append(user_info)
    return jsonify({"code": 200, "message": "获取成功", "data": user_list})


@app.route('/hello', methods=['GET', 'POST'])
def hello():
    if request.method == 'POST':
        raw_data = request.data
        json_data = json.loads(raw_data)
        return jsonify({"code": 200, "message": "通信成功", "post_data": json_data})
    else:
        return jsonify({"code": 200, "message": "通信成功", "data": request.headers.get('User-Agent')})


# 注册蓝图
app.register_blueprint(task_bp, url_prefix='/task')
app.register_blueprint(item_bp, url_prefix='/item')
app.register_blueprint(user_bp, url_prefix='/user')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
    # app.run(port=5000)

