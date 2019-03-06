from flask import request, jsonify

from info import db
from info.models import Superlink
from . import superlink_blu

# 增加链接
@superlink_blu.route('/add_link', methods = ['post'])
def add_link():
    data = request.json
    print(data)
    if not data:
        return jsonify({'error_no':400, 'error_ms':'参数错误'})
    try:
        link_name = data['link_name']
        link_url = data['link_url']
        test = Superlink.query.filter(Superlink.link_name == link_name).all()
    except Exception as e:
        return jsonify({'error_no':400, 'error_ms':'参数名错误'})
    if not all([link_url, link_name]):
        return jsonify({'error_no':400, 'error_ms':'参数缺失'})
    if test:
        print(test)
        return jsonify({'error_no':400, 'error_ms':'该名称已存在'})
    link_data = Superlink()
    link_data.link_name = link_name
    link_data.link_url = link_url
    try:
        db.session.add(link_data)
        db.session.commit()
    except Exception as e:
        return jsonify({'error_no':503, 'error_ms':'数据库错误'})
    return jsonify({'error_no':200, 'error_ms':'ok'})

# 删除链接
@superlink_blu.route('/del_link/<int:del_id>', methods=['DELETE'])
def del_link(del_id):
    try:
        del_dat = Superlink.query.get(del_id)
        db.session.delete(del_dat)
        db.session.commit()
    except Exception as e:
        print(e)
        return jsonify({'error_no':503, 'error_ms':'数据库错误'})
    return jsonify({'error_no': 200, 'error_ms': 'ok'})

# 修改链接
@superlink_blu.route('/update_link/<int:update_id>', methods=['put'])
def update_link(update_id):
    data = request.json
    if not data:
        return jsonify({'error_no':400, 'error_ms':'参数错误'})
    try:
        link_name = data['link_name']
        link_url = data['link_url']
        test = Superlink.query.filter(Superlink.link_name == link_name).first()
    except Exception as e:
        return jsonify({'error_no':400, 'error_ms':'参数名错误'})
    if not all([link_url, link_name]):
        return jsonify({'error_no':400, 'error_ms':'参数缺失'})
    try:
        update_dat = Superlink.query.get(update_id)
        if test and (test.link_name != update_dat.link_name):
            return jsonify({'error_no': 400, 'error_ms': '该名称已存在'})
        update_dat.link_name = link_name
        update_dat.link_url = link_url
        db.session.commit()
    except Exception:
        return jsonify({'error_no': 503, 'error_ms': '数据库错误'})
    return jsonify({'error_no': 200, 'error_ms': 'ok'})

# 查询链接
@superlink_blu.route('/list_link', methods=['get'])
def list_link():
    try:
        data = Superlink.query.all()
    except Exception:
        return jsonify({'error_no': 503, 'error_ms': '数据库错误'})
    data_list = []
    for i in data:
        data_list.append(i.to_dic())
    return jsonify(list_link = data_list)