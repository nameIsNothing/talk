from flask import g
from flask import session


def user_login_data(f):
    import functools
    @functools.wraps(f)
    def wrapper(*args, **kwargs):
        # 获取到当前登录用户的id
        user_id = session.get("id")
        # 通过id获取用户信息
        user = None
        if user_id:
            from info.models import Users
            user = Users.query.get(user_id)

        g.user = user
        return f(*args, **kwargs)

    return wrapper