from functools import wraps
from flask import request, jsonify
import jwt
from app.models import User


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify(make_response(401, '缺少认证令牌')), 401

        try:
            data = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
        except:
            return jsonify(make_response(401, '无效令牌')), 401

        return f(current_user, *args, **kwargs)

    return decorated