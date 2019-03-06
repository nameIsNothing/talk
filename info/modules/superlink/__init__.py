from flask import Blueprint

superlink_blu = Blueprint('superlink',__name__,url_prefix='/superlink')

from . import views