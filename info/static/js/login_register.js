/**
 * Created by python on 19-3-9.
 */
$(function(){
            var $login_box = $('#login_box')
            var $register_box = $('#register_box')
            var $enter_register = $('#enter_register')
            var $enter_login = $('#enter_login')
            var $code_img = $('#code_img')
            var $create_username = $('#create_username')
            var $username = $('#username')
            var $password = $('#password')
            var $submit = $('#submit')
            var $password1 = $('#password_1')
            var $password2 = $('#password_2')
            var $phone_no = $('#phone_no')
            var $send_ph_sms = $('#send_ph_sms')
            var $input_img_code = $('#input_img_code')
            var $phone_sms = $('#phone_sms')
            var $register = $('#register')
            var uuid = null
            var submit_test = {username:false, password:false}
            var register_test = {username:false, password1:false,password2:false, phone:false,img_code:false,phone_sms:false}

            $enter_register.click(fc_enter_register)// 点击进入注册
            $enter_login.click(fc_enter_login) // 点击进入登录
            // 登陆相关
            // 1用户名存在检测
            $username.blur(function (){
                var re_test = /^[a-z][\w]{4,19}$/
                var re_test2 = /^1[3578][\d]{9}$/
                var username = $(this).val()
                if (re_test.test(username)){
                    $(this).next().hide()
                    submit_test.username = true
                }
                else if (re_test2.test(username)){
                    $(this).next().hide()
                    submit_test.username = true
                }
                else {
                    $(this).next().show()
                    submit_test.username = false
                }
            })
            // 2密码存在检测
            $password.blur(function (){
                var len = $(this).val().length
                if (len < 8 || len > 20){
                    $(this).next().show()
                }
                else {
                    $(this).next().hide()
                    submit_test.password = true
                }
            })
            // 3登陆
            $submit.click(function () {
                if (submit_test.username == false || submit_test.password == false){
                    $.MsgBox.Alert('温馨提醒', '请确认以上信息填写完全')
                }
                else {
                    $.ajax({
                        url:'/zc_register/login',
                        headers: {"X-CSRFToken": getCookie("csrf_token")},
                        contentType: "application/json; charset=utf-8",
                        type:'POST',
                        dataType:'json',
                        data:JSON.stringify({
                        'username':$username.val(),
                        'password':$password.val()
                        })
                    })
                    .done(
                    function(dat){
                        if(dat['error'] == 404){

                           $.MsgBox.Alert('消息',dat['errmsg'])
                        }
                        else if (dat['error'] == 200){
                            $.MsgBox.Alert('消息','成功')
                            window.location.href = "/";
                        }
                    })
                    .fail(
                    function(){
                        $.MsgBox.Alert('提醒','网络连接错误，请检查下网络连接后重试')
                    })
                }
            })
            // 注册相关
            // 1离开用户名编辑检查是否存在
            $create_username.blur(function(){
                var re_test = /^[a-z][\w]{4,19}$/
                var username = $(this).val()
                if (re_test.test(username)){
                    fc_test_username(username)
                }
                else if (username.length < 6 || username.length >16){
                    $(this).next().show().html('长度应在6～16位之间')
                    $(this).prop('class', 'ng_station')
                    register_test_test.username = false
                }
                else {
                    $(this).next().show().html('第一位为字母，其他由大小字母，数字，下划线组成')
                    $(this).prop('class', 'ng_station')
                    register_test_test.username = false
                }
            })
            // 2检查密码
            $password1.blur(function(){
                var a =$(this).val().length
                if (8 <= a && a <= 20) {
                    $(this).prop('class', 'ok_station')
                    $(this).next().hide()
                    register_test.password1 = true
                    if ($(this).val() != $password2.val()) {
                        $password2.prop('class', 'ng_station')
                        $password2.next().show().html('两次密码不一致')
                        register_test.password2 = false
                    }
                    else if ($(this).val() === $password2.val()){
                        $password2.prop('class', 'ok_station')
                        $password2.next().hide()
                        register_test.password2 = true
                    }

                }
                else {
                    $(this).prop('class', 'ng_station')
                    $(this).next().show()
                    register_test.password1 = false
                }
            })
            // 3检查密码相同
            $password2.blur(function(){
                var pw1 = $password1.val()
                var pw2 =$(this).val()
                if (pw2 == ''){
                    $(this).prop('class', 'ng_station')
                    $(this).next().html('请填写确认密码').show()
                    register_test.password2 = false
                }
                else if (pw1 === pw2) {
                    $(this).prop('class', 'ok_station')
                    $(this).next().hide()
                    register_test.password2 = true
                }
                else {
                    $(this).prop('class', 'ng_station')
                    $(this).next().show().html('两次密码不一致')
                    register_test.password2 = false
                }
            })
            // 4检查手机号码格式
            $phone_no.blur(function () {
                var re_text = /^1[3578][\d]{9}$/
                var phone_gt = $(this).val()
                if (re_text.test(phone_gt)) {
                    $(this).prop('class', 'ok_station')
                    $(this).next().hide()
                    register_test.phone = true
                }
                else {
                    $(this).prop('class', 'ng_station')
                    $(this).next().show()
                    register_test.phone = false
                }
            })
            // 5检查图形验证码
            $input_img_code.blur(function () {
                var len = $(this).val().length
                if (len == 4) {
                    $(this).prop('class', 'ok_station')
                    $(this).next().hide()
                    register_test.img_code = true
                }
                else {
                    $(this).prop('class', 'ng_station')
                    $(this).next().show()
                    register_test.img_code = false
                }
            })
            // 点击更新验证码
            $code_img.click(fc_get_code_img)
            // 6发送手机验证码
            $send_ph_sms.click(function () {
                register_test.phone_sms = true
                for ( i in register_test){
                    if (register_test[i] == false ) {
                        $.MsgBox.Alert('温馨提醒', '请确认以上信息填写完全')
                        return
                    }
                }
                $.ajax({
                    url:'/zc_register/sms',
                    headers: {"X-CSRFToken": getCookie("csrf_token")},
                    contentType: "application/json; charset=utf-8",
                    type:'POST',
                    dataType:'json',
                    data:JSON.stringify({
                        'mobile':$phone_no.val(),
                        'image_code':$input_img_code.val(),
                        'image_code_id':uuid
                    })
                })
                    .done(function (dat) {
                    if (dat['error'] == 404) {
                        $.MsgBox.Alert('提醒',dat['errmsg'])
                        fc_get_code_img()
                    }
                    else {
                        //  写入倒计时
                        fc_sendsms_time()
                    }
                })
                    .fail(function () {
                        $.MsgBox.Alert('温馨提醒', '请确认网络是否异常')
                    })
            })
            // 6检查手机验证码
            $phone_sms.blur(function () {
                var len = $(this).val().length
                if (len == 6) {
                    $(this).prop('class', 'ok_station')
                    $(this).next().hide()
                    register_test.phone_sms = true
                }
                else {
                    $(this).prop('class', 'ng_station')
                    $(this).next().show()
                    register_test.phone_sms = false
                }
            })
            // 7注册
            $register.click(function () {
               for ( i in register_test){
                    if (register_test[i] == false ) {
                        $.MsgBox.Alert('温馨提醒', '请确认以上信息填写完全')
                        return
                    }
                }
                $.ajax({
                url:'/zc_register/register',
                headers: {"X-CSRFToken": getCookie("csrf_token")},
                contentType: "application/json; charset=utf-8",
                type:'POST',
                dataType:'json',
                data:JSON.stringify({
                    'username':$create_username.val(),
                    'mobile':$phone_no.val(),
                    'smscode':$phone_sms.val(),
                    'password':$password1.val(),
                    'password_2':$password2.val(),
                })
                })
                .done(
                    function(dat){
                        if(dat['error'] == 404){

                           $.MsgBox.Alert('消息',dat['errmsg'])
                        }
                        else if (dat['error'] == 200){
                            $.MsgBox.Alert('消息','成功')
                            window.location.href = "/";
                        }
                    })
                .fail(
                    function(){
                        $.MsgBox.Alert('提醒','网络连接错误，请检查下网络连接后重试')
                    })
            })

            function fc_enter_register(){
                $login_box.hide()
                fc_get_code_img()
                $register_box.fadeIn()
            }
            function fc_enter_login(){
                $login_box.fadeIn()
                $register_box.hide()
            }
            // 获取验证码图片
            function fc_get_code_img(){
                uuid = fc_generate_uuid()
                var url = 'http://127.0.0.1:5000/zc_register/image_code?code_id=' + uuid
                $code_img.prop('src', url)
            }
            // 重发验证码倒计时
            function fc_sendsms_time(){
                $send_ph_sms.css("pointer-events","none")
                var time = 60
                var time_str = ''
                var time_ = setInterval(function(){
                    time_str = time + '秒后重发短信'
                    time--
                    $send_ph_sms.html(time_str)
                    if (time == 0){
                        $send_ph_sms.html("发送手机验证码")
                        $send_ph_sms.css("pointer-events","")
                        clearInterval(time_)
                    }
                }, 1000)
            }
            // 生成uuid
            function fc_generate_uuid(){
                var d = new Date().getTime();
                if(window.performance && typeof window.performance.now === "function"){d += performance.now()}
                var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
                    function(c){
                    var r = (d + Math.random()*16)%16 | 0;d = Math.floor(d/16);
                    return (c =='x' ? r : (r&0x3|0x8)).toString(16);
                    });
                return uuid;
            }
            // 发送验证用户名ajax
            function fc_test_username(name) {
                $.ajax({
                url:'/zc_register/username_s',
                headers: {"X-CSRFToken": getCookie("csrf_token")},
                contentType: "application/json; charset=utf-8",
                type:'POST',
                dataType:'json',
                data:JSON.stringify({'username':name})
                })
                .done(
                    function(dat){
                        if(dat['error'] == 404){
                            $create_username.next().show().html('用户名已存在')
                            $create_username.prop('class', 'ng_station')
                            register_test.username = false
                        }
                        else if (dat['error'] == 200){
                            $create_username.next().hide()
                            $create_username.prop('class', 'ok_station')
                            register_test.username = true
                        }
                    })
                .fail(
                    function(){
                        $.MsgBox.Alert('提醒','网络连接错误，请检查下网络连接后重试')
                    })
            }
            function getCookie(name) {
                var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
                return r ? r[1] : undefined;
            }
        })