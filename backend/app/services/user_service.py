from app.models import User
from app.extensions import db
import requests
import jwt
import datetime


def wechat_login(code):
    # 微信登录逻辑
    url = f"https://api.weixin.qq.com/sns/jscode2session?appid={current_app.config['WECHAT_APPID']}&secret={current_app.config['WECHAT_SECRET']}&js_code={code}&grant_type=authorization_code"
    res = requests.get(url).json()

    if 'openid' not in res:
        return {'code': 500, 'message': '登录失败'}, 401

    user = User.query.filter_by(user_app_id=res['openid']).first()
    if not user:
        user = User(user_app_id=res['openid'])
        db.session.add(user)
        db.session.commit()

    # 生成JWT
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)
    }, current_app.config['JWT_SECRET_KEY'], algorithm='HS256')

    return {
        'code': 200,
        'message': '登录成功',
        'data': {
            'token': token,
            'user_info': {
                'user_name': user.user_name,
                'user_photo': user.user_photo
            }
        }
    }