from flask import Blueprint

zc_register_blu = Blueprint('register_blu', __name__, url_prefix='/zc_register')

from . import views