from flask import current_app
from flask import g
from flask import redirect
from flask import render_template
from flask import session

from info.models import Users
from info.utils.common import user_login_data
from . import index_blu

@index_blu.route('/')
@user_login_data
def index():
    user = g.user
    return render_template('index.html',data={"user_info": user.to_dic() if user else None})

@index_blu.route('/pytalk')
@user_login_data
def chat():
    user = g.user
    if user:
        return render_template('PK_Chat.html', data={"user_info": user.to_dic()})
    else:
        return redirect('/login')


@index_blu.route('/login')
def login():
    return render_template('login.html')