$(function(){
    var linkname_list = ["a",'1','a2']
    var marking_parameter = ''  // 标记新增/修改
    var $link_edit_div = $('#link_edit_div')
    var $link_add_div = $('#link_add_div')
    var $link_edit_button = $('#link_edit_button')
    var $link_openaddbox_button = $('#link_openaddbox_button')
    var $link_closeaddbox_button = $('#link_closeaddbox_button')
    var $link_edit_img = $('.link_list li img')
    var $link_box = $('.link_box')
    var $link_add_box = $('.link_add_box')
    var $add_link_button = $('#add_link')
    var $close_linkaddbox = $('#close_linkaddbox')
    var $link_edit_img_clink = $('#link_edit')
    var $link_del_img_clink = $('#del_link')
    // 点击显示编辑
    $link_edit_button.click(function(){
        $link_add_div.show()
        $link_edit_div.hide()
        $link_edit_img.show()
        $link_box.css('width', '260px')
    })
    // 点击取消编辑
    $link_closeaddbox_button.click(function(){
        $link_add_div.hide()
        $link_edit_div.show()
        $link_edit_img.hide()
        $link_box.css('width', '220px')
    })
    // 点击打开新增栏
    $link_openaddbox_button.click(function(){
        marking_parameter = 'add'
        $add_link_button.html('添加')
        $link_add_box.fadeIn()
    })
    // 关闭新增栏
    $close_linkaddbox.click(function(){
        $link_add_box.fadeOut()
        marking_parameter = ''
    })
    // 点击打开修改栏
    $link_edit_img_clink.click(function(){
        marking_parameter = 'edit'
        $add_link_button.html('修改')
        $link_add_box.fadeIn()
    })
    // 点击删除
    $link_del_img_clink.click(function(){
      alert('待写入')
    })
    // 发送新增/修改链接请求
    var $link_name = $('#link_name')
    var $link_url = $('#link_url')
    $add_link_button.click(function(){
        if ($link_name.val() == '' || $link_url.val() == ''){
            alert('输入不能为空')
            return
        }
        for (i in linkname_list){
            if ($link_name.val() == linkname_list[i]){
                alert('该名字已存在，请重新命名')
                return
            }
        }
        
        fc_add_link($link_name.val(), $link_url.val())
    })



    // 新增ajax请求
    function fc_add_link(name, url){
        $.ajax({
            url:'/superlink/add_link',
            headers: {"X-CSRFToken": getCookie("csrf_token")},
            type:'POST',
            dataType:'json',
            data:{'link_name':name,
                  'link_url':url}
        })
        .done(
            function(dat){
                alert(dat['error_no'],data['error_ms'])
            })
        .fail(
            function(){
                alert('请求失败，请检查网络连接')
            }
        )
    }
    // 删除ajax
    function fc_delete_link(id){
        $.ajax({
            url:'/superlink/del_link/'+ id,
            headers: {"X-CSRFToken": getCookie("csrf_token")},
            type:'POST',
            dataType:'json',
            data:{_method:"DELETE"}
        })
        .done(
            function(dat){
                alert('删除成功！')
            })
        .fail(
            function(){
                alert('请求失败，请检查网络连接')
            }
        )
    }
    // 修改ajax请求
    function fc_update_link(id, name, url){
        $.ajax({
            url:'/superlink/update_link/'+ id,
            headers: {"X-CSRFToken": getCookie("csrf_token")},
            type:'POST',
            dataType:'json',
            data:{_method:"PUT", 
                'link_name':name,
                'link_url':url}
        })
        .done(
            function(dat){
                alert(dat['error_no'],data['error_ms'])
            })
        .fail(
            function(){
                alert('请求失败，请检查网络连接')
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
                alert(dat)
            })
        .fail(
            function(){
                alert('请求失败，请检查网络连接')
            }
        )
    }

}) 