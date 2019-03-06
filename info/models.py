from datetime import datetime

from werkzeug.security import generate_password_hash, check_password_hash

from info import db


class BaseModel(object):
    """模型基类，为每个模型补充创建时间与更新时间"""
    create_time = db.Column(db.DateTime, default=datetime.now)  # 记录的创建时间
    update_time = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)  # 记录的更新时间


class File(BaseModel,db.Model):

    __tablename__ = 'info_file'

    id = db.Column(db.Integer, primary_key = True)
    file_name = db.Column(db.String(32), unique=True,nullable=False)
    file_address = db.Column(db.String(35),nullable=False)
    file_folder = db.Column(db.Integer,nullable=False)

    def to_dic(self):
        dic = {
            'file_name':self.file_name,
            'file_address':self.file_address,
            'file_folder':self.file_folder
        }
        return dic

class Superlink(BaseModel, db.Model):
    __tablename__ = 'info_superlink'

    id = db.Column(db.Integer, primary_key= True)
    link_name = db.Column(db.String(32), unique=True, nullable=False)
    link_url = db.Column(db.Text(200), nullable=False)

    def to_dic(self):
        dic = {
            'link_name':self.link_name,
            'link_url':self.link_url
        }
        return dic


class Users(BaseModel, db.Model):
    __tablename__ = 'user_info'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), unique=True)
    user_name = db.Column(db.String(16), unique=True, nullable=False)
    password = db.Column(db.String(16), nullable=False)
    mobile = db.Column(db.Integer)

    # @property
    # def password(self):
    #     raise AttributeError("当前属性不可读")
    #
    # @password.setter
    # def password(self, value):
    #     self.password_hash = generate_password_hash(value)
    #
    # def check_passowrd(self, password):
    #     return check_password_hash(self.password_hash, password)