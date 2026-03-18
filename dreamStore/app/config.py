import os


class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI', 'mysql+pymysql://user:password@localhost/dream_store')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET', 'your_jwt_secret')
    WECHAT_APPID = os.getenv('WECHAT_APPID')
    WECHAT_SECRET = os.getenv('WECHAT_SECRET')


