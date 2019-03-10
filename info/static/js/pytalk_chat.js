/**
 * Created by python on 18-12-25.
 */


function getCookie(name) {
        var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
        return r ? r[1] : undefined;
        }

$(function(){



        var otalk_contant = document.getElementById('talk_con')
        var history_data = null
        var sign_index = ''
        var oTime = null
        // 第一步先获取连接，获取初始信息交互
        $.ajax({url:'/pytalk/set_up',
            dataType:'json',
            headers: {"X-CSRFToken": getCookie("csrf_token")}})
            .done(function(dat){
                sign_index = dat['index']
                history_data = dat['history_data']})
                // alert('返回'+ dat['index'])
            .fail(function(){
                $.MsgBox.Alert('消息','网络连接异常，请检查后重试')
                })

        oTime = setInterval(get_talk_data,1000)
        // 持续获取消息
        function get_talk_data(){
            $.ajax({
                url:'/pytalk/keep_get_data',
                headers: {"X-CSRFToken": getCookie("csrf_token")},
                type:'GET',
                dataType:'json',
                data:{"sign_index":sign_index}})
            .done(
                function(dat){
                    var id_name = $('#id_name').val()
                    var talk_con = $('#talk_con')
                    var list = dat['talk_data']
                    if (list == undefined){return}
                    list = list.split('($)&($)')
                    list.splice(0,1)
                    sign_index = parseInt(dat['index'])

                    var info = null
                    for (i in list){
                        var information = list[i].split('(+&+)')
                        if (information[0] == id_name){
                         var info ='<div class="btalk"><span>' +information[1] +'</span><p>' +information[2] + '</p></div>'
                        }
                        // else{ var info ='<div class="atalk"><span>'+ information[0] + ': ' +information[1] +'</span><p>' +information[2] + '</p></div>'}
                        else{ var info ='<div class="atalk"><span class="username">'+ information[0] + ':</span><br><span>' +information[1] +'</span><p>' +information[2] + '</p></div>'}
                        talk_con.append($(info))
                        otalk_contant.scrollTop = otalk_contant.scrollHeight}
                    })
            .fail(function(){
                $.MsgBox.Alert('消息','网络连接异常，请检查后重试')
                clearInterval(oTime)})
        }
        // 点击发送
        var $send_bt = $('#send_bt')
        $send_bt.click(send)
            function send(){
                var send_data = $('#send_data').val()
                var id_name = $('#id_name').val()
                if (send_data == ''){
                    $.MsgBox.Alert('温馨提示','输入内容不能为空')
                    return}
                else if (id_name == ''){
                    $.MsgBox.Alert('温馨提示','您还没有输入名字')
                    return}
                $send_bt.css("pointer-events","none")
                $.ajax({
                    url:'/pytalk/send_date',
                    headers: {"X-CSRFToken": getCookie("csrf_token")},
                    type:'GET',
                    dataType:'json',
                    data:{'data':send_data,'id_name':id_name}
                })
                .done(
                    function(dat){
                        var dat1 = dat['data']
                        console.log(dat1)
                        $('#send_data').val('').focus()
                        $send_bt.css("pointer-events","")

                    })
                .fail(
                    function(){
                    $.MsgBox.Alert('消息','发送失败，请检查网络连接')
                    $send_bt.css("pointer-events","")
                    })
            }
        // 回车发送快捷键
        $(document).keypress(
            function(event){
            if (event.keyCode == 13){send()}
            })


        // 查看历史记录
        $('#history').click(
            function(){
            var id_name = $('#id_name').val()
            var $history = $('#history')
            var list = history_data
            if (list == null){
                $.MsgBox.Alert('温馨提示','无更多历史消息')
                return}
            list = list.split('($)&($)')
            list.splice(0,1)
            list.reverse()
            var info = null
            for (i in list){
                var information = list[i].split('(+&+)')
                if (information[0] == id_name){
                    var info ='<div class="btalk"><span>' +information[1] +'</span><p>' +information[2] + '</p></div>'
                }
                else{ var info ='<div class="atalk"><span class="username">'+ information[0] + ':</span><br><span>' +information[1] +'</span><p>' +information[2] + '</p></div>'
                }
                $history.after($(info))
                otalk_contant.scrollTop = otalk_contant.scrollHeight
                }
            $history.remove()})


    })
