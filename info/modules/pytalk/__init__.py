from flask import Blueprint

pytalk_blu = Blueprint('pytalk', __name__,url_prefix='/pytalk')

from . import views