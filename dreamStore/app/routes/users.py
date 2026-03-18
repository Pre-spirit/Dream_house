from flask import Blueprint, request
from app.services.user_service import *
from app.utils.auth import token_required

user_bp = Blueprint('user', __name__, url_prefix='/user')

@user_bp.route('/login', methods=['POST'])
def login():
    code = request.json.get('user')
    return wechat_login(code)

@user_bp.route('/up_photo', methods=['POST'])
@token_required
def upload_avatar(current_user):
    user_id = current_user.id
    photo_data = request.json.get('photo')
    return update_avatar(user_id, photo_data)

@user_bp.route('/dream_score', methods=['POST'])
@token_required
def get_score(current_user):
    return get_user_score(current_user.id)