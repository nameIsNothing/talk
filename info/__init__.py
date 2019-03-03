from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.wtf import CSRFProtect
from redis import StrictRedis
from flask_session import Session

from config import Config

db = SQLAlchemy()
redis_store = None

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    global redis_store
    redis_store = StrictRedis(Config.redis_host, Config.redis_port)

    # CSRFProtect(app)
    # Session(app)

    # 导入蓝图
    from info.modules.index import index_blu
    app.register_blueprint(index_blu)
    from info.modules.pytalk import pytalk_blu
    app.register_blueprint(pytalk_blu)
    from info.modules.up_download import up_download_blu
    app.register_blueprint(up_download_blu)
    from info.modules.superlink import superlink_blu
    app.register_blueprint(superlink_blu)


    from flask_wtf.csrf import generate_csrf
    @app.after_request
    def set_servername(response):
        response.headers['server'] = 'PK.SER 1.0'
        csrf_token = generate_csrf()
        response.set_cookie("csrf_token", csrf_token)
        return response

    return app