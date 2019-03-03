from flask import render_template
from flask import request, jsonify

from info import db
from info.models import File
from info.utils.qiniu_updown import storage, delete
from . import up_download_blu

# 学习文件上传
@up_download_blu.route('/update',methods=['POST'])
def update_file_st():
    data = request.files.get('files')
    folder = request.form.get('folder')
    if not all([data,folder]):
        return jsonify(error = '参数不全')
    if folder not in ['st','ot']:
        return jsonify(error = '文件夹错误')
    try:
        exist_file = File.query.filter(File.file_name == data.filename).first()
    except Exception as e:
        return jsonify(error = '数据库错误')

    if exist_file:
        return jsonify(error = '文件已存在')

    try:
        data_b = data.read()
        address = storage(data_b)
    except Exception as e:
        return jsonify(error = '上传失败')

    file = File()
    file.file_name = data.filename
    file.file_address = address
    if folder == 'st':
        folder = 1
    else:
        folder = 2
    file.file_folder = folder
    try:
        db.session.add(file)
        db.session.commit()
    except Exception as e:
        return jsonify(error= 'somethingwrong')

    return jsonify(error='上传成功')


# 查询文件列表
@up_download_blu.route('/update_file_list')
def update_file_list():
    try:
        data = File.query.all()
    except Exception as e:
        print(e)
        return 'wrong'
    data_list = []
    for i in data:
        data_list.append(i.to_dic())
    return jsonify(file_list=data_list)

# 删除文件
@up_download_blu.route('/delete_file')
def delete_file():
    file_address = request.args.get('file_address')
    try:
        info = delete(file_address)
    except Exception as e:
        return '连接远程失败'
    if info == None:
        if rmdate(file_address):
            return '删除数据失败'
        return '远程已无文件删除，已更新数据库'
    if rmdate(file_address):
        return '删除数据失败'
    return '成功'

def rmdate(file_address):
    try:
        dat = File.query.filter(File.file_address == file_address).first()
        db.session.delete(dat)
        db.session.commit()
    except Exception as e:
        return 'false'