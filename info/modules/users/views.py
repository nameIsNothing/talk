from datetime import datetime
import re

from flask import current_app, jsonify
from flask import make_response
from flask import request
from flask import session

from info import redis_store, db
from info.models import Users
from . import zc_register_blu

#验证码
from info.utils.captcha.captcha import captcha


@zc_register_blu.route('/image_code')
def image_code():

    code_id = request.args.get('code_id')
    name, text, image = captcha.generate_captcha()

    try:
        redis_store.setex('ImageCode_'+code_id, 300, text)

    except Exception as e:
        current_app.logger.error(e)
        return jsonify(error=4004, errmsg='保存图片验证码失败')

    resp = make_response(image)
    resp.headers['Content-Type'] = 'image/jpg'

    return resp

# 注册
@zc_register_blu.route('/register', methods=["POST"])
def register():
    data = request.json
    username = data['username']
    password = data['password']
    # image_code = data['image_code']
    # image_code_id = data['image_code_id']

    if not all([username, password]):
        return jsonify(error=404, errmsg='参数不全')

    # try:
    #     get_image_code = redis_store['image_code'+image_code_id]
    #     if get_image_code:
    #         get_image_code = get_image_code.decode()
    #         redis_store.delete('image_code'+image_code_id)
    #
    # except Exception as e:
    #     current_app.logger.error(e)
    #     return jsonify(error=404, errmsg='获取图片验证码失败')
    #
    # if not get_image_code:
    #     return  jsonify(error=404, errmsg='图片验证码已过期')
    #
    # if get_image_code != image_code:
    #     return jsonify(error=404, errmas='验证码不正确')

    if not re.match("^\w{6,16}$", username):
        return jsonify(error=404, errmsg='用户名格式不正确')

    try:
        user = Users.query.filter_by(user_name=username).first()

    except Exception as e:
        return jsonify(error=404, errmsg='数据库查询失败')

    if user:
        return jsonify(error=404, errmsg='用户名已存在')

    if not re.match("(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}", password):
        return jsonify(error=404, errmsg='密码格式不正确')

    # 保存数据

    users = Users()
    users.user_name = username
    users.password = password

    try:
        db.session.add(users)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(e)
        return jsonify(error=404, errmsg='数据库保存错误')


    # 保存用户登陆状态
    session['id'] = users.id
    session['username'] = users.user_name

    return jsonify(error=200, errmas='ok')


@zc_register_blu.route('/login', methods=["POST"])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    if not all ([username,password]):
        return jsonify(error=404, errmsg='参数不全')

    try:
        users = Users.query.filter_by(user_name=username).first()
    except Exception as e:
        current_app.logger.error(e)
        return jsonify(error=404, errmsg='数据库查询错误')

    if not users:
        return jsonify(error=404, errmsg='没有此用户')

    if  users.password != password:
        print(users.password)
        print(password)
        return jsonify(error=404, errmsg='用户名或密码错误')

    # 保存用户登陆状态
    session['id'] = users.id
    session['username'] = users.user_name
    # 最后登陆的时间
    users.last_login = datetime.now()

    try:
        db.session.commit()

    except Exception as e:
        current_app.logger.error(e)

    return jsonify(error=200, errmsg='ok')