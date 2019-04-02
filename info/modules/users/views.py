import random
from datetime import datetime
import re

from flask import current_app, jsonify
from flask import make_response
from flask import request
from flask import session

from info import redis_store, db
from info.models import Users
from info.utils.yuntongxun.sms import CCP
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
        return jsonify(error=404, errmsg='保存图片验证码失败')

    resp = make_response(image)
    resp.headers['Content-Type'] = 'image/jpg'

    return resp

#发送短信
@zc_register_blu.route('/sms', methods=['POST'])
def smscode():
    data = request.json
    try:
        mobile = data['mobile']
    except Exception as e:
        current_app.logger.error(e)
        return jsonify(error=404, errmsg='参数不全')

    try:
        image_code = data['image_code']
    except Exception as e:
        current_app.logger.error(e)
        return jsonify(error=404, errmsg='参数不全')

    try:
        image_code_id = data['image_code_id']
    except Exception as e:
        current_app.logger.error(e)
        return jsonify(error=404, errmsg='图片验证码获取失败')

    if not all([mobile, image_code, image_code_id]):
        return jsonify(error=404, errmsg='参数不全')

    if not re.match("^1[3578][0-9]{9}$", mobile):
        return jsonify(error=404, errmsg='手机号码格式不正确')

    try:
        get_image_code = redis_store.get('ImageCode_' + image_code_id)
        if get_image_code:
            get_image_code = get_image_code.decode()
            redis_store.delete('ImageCode_' + image_code_id)

    except Exception as e:
        current_app.logger.error(e)
        return jsonify(error=404, errmsg='图片验证码获取失败')

    if not get_image_code:
        return jsonify(error=404, errmsg='验证码已过期')

    if image_code.lower() != get_image_code.lower():
        return jsonify(error=404, errmsg='验证码不正确')

    try:
        mobiles = Users.query.filter_by(mobile=mobile).first()
    except Exception as e:
        return jsonify(error=404, errmsg='数据库查询失败')
    if mobiles:
        return  jsonify(error=404, errmsg='手机号已注册')

    result = random.randint(0,999999)
    sms_code = "%06d" % result
    print(sms_code)
    current_app.logger.debug("您的短信验证码内容为：%s" %sms_code)
    result_code = CCP().send_template_sms(mobile, [sms_code, 5], "1")

    if result_code != 0:
        return jsonify(error=404, errmsg='发送短信失败')

    try:
        redis_store.set("SMS_" + mobile, sms_code, 300)
    except Exception as e:
        current_app.logger.error(e)
        return jsonify(error=404, errmsg='保存失败')

    return jsonify(error=200, errmsg='OK')

# 注册
@zc_register_blu.route('/register', methods=["POST"])
def register():
    data = request.json
    try:
        username = data['username']
        mobile = data['mobile']
        smscode = data['smscode']
        password = data['password']
        password_2 = data['password_2']
    except Exception as e:
        current_app.logger.error(e)
        return jsonify(error=404, errmsg='参数不全')

    if not all([username, password, password_2,  mobile]):
        return jsonify(error=404, errmsg='参数不全')

    if password_2 != password:
        return jsonify(error=404, errmsg='两次密码输入不一致')

    try:
        get_smscode = redis_store.get('SMS_'+mobile)

    except Exception as e:
        current_app.logger.error(e)
        return jsonify(error=404, errmsg='数据库查询失败')

    if not get_smscode:
        return jsonify(error=404, errmsg='短信验证码已过期')

    if get_smscode.decode() != smscode:
        return jsonify(error=404, errmsg='短信验证码错误')

    if not re.match(r"^[a-z][\w]{4,19}$", username):
        return jsonify(error=404, errmsg='用户名格式不正确')

    try:
        user = Users.query.filter_by(user_name=username).first()

    except Exception as e:
        return jsonify(error=404, errmsg='数据库查询失败')

    if user:
        return jsonify(error=404, errmsg='用户名已存在')

    if not re.match(r"^[\w]{8,16}", password):
        return jsonify(error=404, errmsg='密码格式不正确')

    # 保存数据

    users = Users()
    users.nickname = username
    users.user_name = username
    users.password = password
    users.mobile = mobile

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

#用户名验证
@zc_register_blu.route('/username_s', methods = ['POST'])
def username_s():
    data = request.json

    try:
        username = data['username']
    except Exception as e:
        current_app.logger.error(e)
        return jsonify(error=404, errmsg='用户名不能为空')

    if not re.match(r"^\w{6,16}$", username):
        return jsonify(error=404, errmsg='用户名格式不正确')
    try:
        user = Users.query.filter_by(user_name=username).first()

    except Exception as e:
        return jsonify(error=404, errmsg='数据库查询失败')

    if user:
        return jsonify(error=404, errmsg='用户名已存在')
    return jsonify(error=200, errmsg='ok')

# 登录
@zc_register_blu.route('/login', methods=["POST"])
def login():
    data = request.json
    try:
        username = data['username']
    except Exception as e:
        current_app.logger.error(e)
        return jsonify(error=404, errmsg='参数不全')

    try:
        password = data['password']
    except Exception as e:
        current_app.logger.error(e)
        return jsonify(error=404, errmsg='参数不全')

    if not all ([username,password]):
        return jsonify(error=404, errmsg='参数不全')

    try:
        users = Users.query.filter_by(user_name=username).first()
    except Exception as e:
        current_app.logger.error(e)
        return jsonify(error=404, errmsg='数据库查询错误')

    if not users:
        try:
            users = Users.query.filter_by(mobile=username).first()
        except Exception as e:
            current_app.logger.error(e)
            return jsonify(error=404, errmsg='数据库查询失败')
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

@zc_register_blu.route('/login_out', methods=["POST"])
def login_out():
    session.pop('id', None)
    session.pop('username', None)
    return jsonify(error = 200, errmsg = 'ok')