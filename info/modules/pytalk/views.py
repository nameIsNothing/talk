import datetime
from threading import Lock
from flask import jsonify
from flask import request
from . import pytalk_blu

lock = Lock()
A_contant = []
B_contant = []
talk_index = 0

@pytalk_blu.route('/set_up')
def set_up():
    list = B_contant + A_contant[:talk_index]
    talk_str = ''
    for i in list:
        talk_str = talk_str + '($)&($)' + i
    set_up_info = {"index":talk_index,"history_data": talk_str}
    return jsonify(set_up_info)


@pytalk_blu.route('/send_date',methods=['GET','POST'])
def recive():
    get_idname = request.args.get('id_name')
    get_dat = request.args.get('data')

    global A_contant,B_contant,talk_index
    lock.acquire()
    if len(A_contant) == 50:
        # connect_mysql(B_contant)
        B_contant = A_contant
        A_contant =[]
        talk_index = 0
    get_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    all_dat = get_idname + '(+&+)' + get_dat + '(+&+)' + get_time
    A_contant.append(all_dat)
    talk_index += 1
    lock.release()
    return jsonify({'data':'已收到'})


@pytalk_blu.route('/keep_get_data')
def keep_get():
    get_index = request.args.get('sign_index')
    print(get_index)
    get_index = int(get_index)
    try:
        if  get_index == talk_index:
            return jsonify({"info":"标签相等"})
        elif get_index < talk_index:
            # lock.acquire()
                list = A_contant[get_index:talk_index]
            # lock.release()
        else:
            list = B_contant + A_contant[:talk_index]
    except Exception as e:
        return jsonify({"info":"列表读取冲突"})
    talk_str = ''
    for i in list:
        talk_str = talk_str + '($)&($)' + i
    return jsonify({"index":talk_index,"talk_data":talk_str})


