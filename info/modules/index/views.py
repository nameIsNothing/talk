from flask import render_template

from info.models import File
from . import index_blu

@index_blu.route('/')
def index():
    return render_template('index.html')

@index_blu.route('/pytalk')
def chat():
    return render_template('pyMiniTalk.html')

@index_blu.route('/delete')
def delete_file():
    try:
        data = File.query.all()
    except Exception as e:
        print(e)
        return 'wrong'
    data_list = []
    for i in data:
        data_list.append(i.to_dic())
    return render_template('delete.html',data=data_list)