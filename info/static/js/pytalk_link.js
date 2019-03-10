$(function(){
    var linkname_list = ["a",'1','a2']
    var marking_parameter = ''  // 标记新增/修改
    var marking_id = null   // 标记修改链接id
    var $link_list = $('.link_list')
    var $link_edit_div = $('#link_edit_div')
    var $link_add_div = $('#link_add_div')
    var $link_edit_button = $('#link_edit_button')
    var $link_openaddbox_button = $('#link_openaddbox_button')
    var $link_closeaddbox_button = $('#link_closeaddbox_button')
    var $link_edit_img = null
    var $link_box = $('.link_box')
    var $link_add_box = $('.link_add_box')
    var $add_link_button = $('#add_link')
    var $close_linkaddbox = $('#close_linkaddbox')
    var $link_name = $('#link_name')
    var $link_url = $('#link_url')
    // 更新链接列表
    fc_get_linkdata()
    // 点击显示编辑
    $link_edit_button.click(fc_show_edit)
    // 点击取消编辑
    $link_closeaddbox_button.click(fc_close_edit)
    // 点击打开新增栏
    $link_openaddbox_button.click(fc_open_addlink)
    // 点击关闭新增/修改栏
    $close_linkaddbox.click(fc_close_addOrEditlink)
    // 点击打开修改栏(委托)
    $link_list.delegate('#link_edit', 'click',function(){
        marking_parameter = 'edit'
        var link_data = $(this).prev().prev()
        marking_id = link_data.prop('id')
        $link_name.prop({value:link_data.html()})
        $link_url.prop({value:link_data.prop('href')})
        $add_link_button.html('修改')
        $link_add_box.fadeIn()
    })
    // 点击删除（委托）
    $link_list.delegate('#del_link', 'click',function(){
        var id = $(this).prev().prop('id')
        $.MsgBox.Confirm('温馨提醒','删除后将无法撤回，确认删除？',function () {
            fc_delete_link(id)
            fc_get_linkdata()
        })
    })

    // 发送新增/修改链接请求
    $add_link_button.click(function(){
        if ($link_name.val() == '' || $link_url.val() == ''){
            $.MsgBox.Alert('温馨提示','输入内容不能为空')
            return
        }
        for (i in linkname_list){
            if ($link_name.val() == linkname_list[i]){
                $.MsgBox.Alert('温馨提示','该链接名称已存在')
                return
            }
        }
        if (marking_parameter == 'add'){
            fc_add_link($link_name.val(), $link_url.val())
            fc_get_linkdata()
            }
        else if (marking_parameter == 'edit'){
            fc_update_link(marking_id, $link_name.val(), $link_url.val())
            fc_get_linkdata()
            }
        else {
            $.MsgBox.Alert('消息','标记位错误')
            }

    })

    // 新增ajax请求
    function fc_add_link(name, url){
        $.ajax({
            url:'/superlink/add_link',
            headers: {"X-CSRFToken": getCookie("csrf_token")},
            contentType: "application/json; charset=utf-8",
            type:'POST',
            dataType:'json',
            data:JSON.stringify( {'link_name':name,
                  'link_url':url})
        })
        .done(
            function(dat){
                $.MsgBox.Alert('消息',dat['error_ms'])
                fc_close_addOrEditlink()
                fc_close_edit()
            })
        .fail(
            function(){
                $.MsgBox.Alert('温馨提示','网络连接失败，请检查网络连接')
            }
        )
    }
    // 删除ajax
    function fc_delete_link(id){
        $.ajax({
            url:'/superlink/del_link/'+ id,
            headers: {"X-CSRFToken": getCookie("csrf_token")},
            type:'DELETE',
            dataType:'json',
        })
        .done(
            function(dat){
                $.MsgBox.Alert('消息','删除成功！')
                fc_close_addOrEditlink()
                fc_close_edit()
            })
        .fail(
            function(){
                $.MsgBox.Alert('温馨提示','网络连接失败，请检查网络连接')
            }
        )
    }
    // 修改ajax请求
    function fc_update_link(id, name, url){
        $.ajax({
            url:'/superlink/update_link/'+ id,
            headers: {"X-CSRFToken": getCookie("csrf_token")},
            contentType: "application/json; charset=utf-8",
            type:'PUT',
            dataType:'json',
            data:JSON.stringify({_method:"PUT",
                'link_name':name,
                'link_url':url})
        })
        .done(
            function(dat){
                $.MsgBox.Alert('消息','修改成功！')
                fc_close_addOrEditlink()
                fc_close_edit()
            })
        .fail(
            function(){
                $.MsgBox.Alert('温馨提示','网络连接失败，请检查网络连接')
            }
        )
    }
    // 查询链接列表ajax
    function fc_get_linkdata(){
        $.ajax({
            url:'/superlink/list_link',
            headers: {"X-CSRFToken": getCookie("csrf_token")},
            type:'GET',
            dataType:'json',
        })
        .done(
            function(dat){
                var list_link = dat['list_link']
                var list_link_date = ''
                for (i in list_link){
                    var id = list_link[i]['link_id']
                    var name = list_link[i]['link_name']
                    var url = list_link[i]['link_url']
                    list_link_date = list_link_date + '<li><a id="'+ id + '" href="' + url + '" target="_blank">' + name + '</a><img id="del_link" class="link_edit_img" src="../static/picture/delete.png" alt="删除" title="删除">&nbsp;<img id="link_edit" class="link_edit_img" src="../static/picture/update.png" alt="修改" title="修改"></li>'
                $link_list.html(list_link_date)
                  $link_edit_img=$('.link_list li img')

                }

            })
        .fail(
            function(){
                $.MsgBox.Alert('温馨提示','网络连接失败，请检查网络连接')
            }
        )
    }
    // 显示编辑栏
    function fc_show_edit(){
        $link_add_div.show()
        $link_edit_div.hide()
        $link_edit_img.show()
        $link_box.css('width', '260px')
    }
    // 关闭编辑栏
    function fc_close_edit(){
        $link_add_div.hide()
        $link_edit_div.show()
        $link_edit_img.hide()
        $link_box.css('width', '220px')
    }
    // 打开新增栏
    function fc_open_addlink(){
        marking_parameter = 'add'
        $add_link_button.html('添加')
        $link_add_box.fadeIn()
    }
    // 关闭新增/修改栏
    function fc_close_addOrEditlink(){
        $link_add_box.fadeOut()
        marking_parameter = ''
        marking_id = ''
    }
}) 