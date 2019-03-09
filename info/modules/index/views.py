from flask import render_template

from info.models import File
from . import index_blu

@index_blu.route('/')
def index():
    return render_template('index.html')

@index_blu.route('/pytalk')
def chat():
    return render_template('PK_Chat.html')

@index_blu.route('/login')
def login():
    return render_template('login.html')