import redis

class Config(object):
    DEBUG = True

    SQLALCHEMY_DATABASE_URI = 'mysql://root:136136@127.0.0.1/minitalk_sec'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    redis_host = 'localhost'
    redis_port = 6379

    SECRET_KEY = "-D\xfcw\x00o\xfa9\x86\xba\xcc6\xc0.\xc6\t\xc3ki\r\xba\xfd\xfec"
    SESSION_TYPE = "redis"  # 指定 session 保存到 redis 中
    SESSION_USE_SIGNER = True  # 让 cookie 中的 session_id 被加密签名处理
    SESSION_REDIS = redis.StrictRedis(host=redis_host, port=redis_port)  # 使用 redis 的实例
    PERMANENT_SESSION_LIFETIME = 86400