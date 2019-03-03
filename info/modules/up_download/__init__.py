from flask import Blueprint

up_download_blu = Blueprint('up_download',__name__,url_prefix='/up_download')

from . import views