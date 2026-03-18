def make_response(code=200, message='success', data=None):
    return {
        'code': code,
        'message': message,
        'data': data or {}
    }