import logging

from qiniu import Auth, put_data
from qiniu import BucketManager

# 需要填写你的 Access Key 和 Secret Key
access_key = '6giozIwl9XHFwPJ56usMqPTtpzNDD3MNIDaPTBm7'
secret_key = 'v6ZZBTkM5PIHushaSSMbVu5cY80Nk79XVg_ERLs_'

# pkbo98zc0.bkt.clouddn.com
# 要上传的空间
bucket_name = 'pk-python34'


def storage(data):
    """七牛云存储上传文件接口"""
    if not data:
        return None
    try:
        # 构建鉴权对象
        q = Auth(access_key, secret_key)

        # 生成上传 Token，可以指定过期时间等
        token = q.upload_token(bucket_name)

        # 上传文件
        ret, info = put_data(token, None, data)

    except Exception as e:
        logging.error(e)
        raise e

    if info and info.status_code != 200:
        raise Exception("上传文件到七牛失败")

    # 返回七牛中保存的图片名，这个图片名也是访问七牛获取图片的路径
    return ret["key"]

# -*- coding: utf-8 -*-
# flake8: noqa


def delete(file_key):


#初始化Auth状态
    q = Auth(access_key, secret_key)

    #初始化BucketManager
    bucket = BucketManager(q)

    #你要测试的空间， 并且这个key在你空

    #删除bucket_name 中的文件 key
    ret, info = bucket.delete(bucket_name,file_key)

    return ret




if __name__ == '__main__':
    delete('FsUGkJ6ep-5zy9OmEXt4SxM6CUTO')