/**
 * Created by python on 18-12-25.
 */


$(function () {

    function getCookie(name) {
        var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
        return r ? r[1] : undefined;
        }

    var $st_up = $('#st_up')
    var $ot_up = $('#ot_up')
    var $st_file_edit_div = $('#st_file_edit_div')
    var $st_file_out_edit_button = $('#st_file_out_edit_button')
    var $file_openadd_st_box_button = $('#file_openadd_st_box_button')
    var $ot_file_edit_div = $('#ot_file_edit_div')
    var $ot_file_out_edit_button = $('#ot_file_out_edit_button')
    var $file_openadd_ot_box_button = $('#file_openadd_ot_box_button')
    var $all_file_list = $('#all_file_list')
    var $del_file_img = null
    var $up_box = $('.update_box')
    var position = null

    // 更新下载列表
    update_list()
     // 下载栏滑动
        var $level1 = $('.level1')
        var $download_box = $('#download_box')
            $level1.click(function(){
                 $(this).next().slideDown().parent().siblings().children('ul').slideUp()
            })
            $download_box.mouseleave(function(){
                $level1.parent().children('ul').slideUp()
            })

        // 文件上传功能
        // 显示知识文件编辑栏
        $st_up.click(function(){$st_file_edit_div.show();$st_up.hide();$del_file_img.show()})
        // 取消知识文件编辑
        $st_file_out_edit_button.click(fc_out_st_edit)
        // 打开知识文件上传
        $file_openadd_st_box_button.click(function(){position = 'st';$up_box.fadeIn()})
        // 显示其他文件编辑栏
        $ot_up.click(function(){$ot_file_edit_div.show();$ot_up.hide();$del_file_img.show()})
        // 取消其他文件编辑
        $ot_file_out_edit_button.click(fc_out_ot_edit)
        // 打开其他文件上传
        $file_openadd_ot_box_button.click(function(){position = 'ot';$up_box.fadeIn()})
        // 点击删除文件
        $all_file_list.delegate('#del_file', 'click', function(){
            var id = $(this).prev().prop('id')
            $.MsgBox.Confirm('温馨提醒','文件一旦删除后不可恢复，确认删除？',function () {
                fc_del_file_ajax(id)
            })
        })
        // 上传面板功能
        var $up_bt = $('#up_bt')
        $up_bt.click(function(){
            var fd = $('#up_file')[0].files[0]
            if (fd == undefined){
                $.MsgBox.Alert('温馨提示','未选定文件，请选定文件后重试！')
                $up_box.fadeOut(500)
                return}
            $up_bt.css("pointer-events","none")
            var form_data = new FormData()
            form_data.append('files',fd)
            form_data.append('folder',position)
            $.ajax({
                url:'/up_download/update',
                headers: {"X-CSRFToken": getCookie("csrf_token")},
                type:'POST',
                data:form_data,
                processData:false,
                contentType:false,
            })
            .done(function(dat){
                $.MsgBox.Alert('消息',dat.error)
                $up_box.fadeOut(500)
                update_list()
                $up_bt.css("pointer-events","")
                fc_out_st_edit()
                fc_out_ot_edit()
            })
            .fail(function(){
                $.MsgBox.Alert('消息','上传失败！')
                $up_bt.css("pointer-events","")
            })

        })

        $('#up_out').click(function(){
            $up_box.fadeOut(500)
        })
        // 更新下载目录
        function update_list(){
            $.ajax({
                url:'/up_download/update_file_list',
                headers: {"X-CSRFToken": getCookie("csrf_token")},
                type:'GET',
                dataType:'json'
            })
            .done(function(dat){
                var date = dat.file_list
                var $st_list = $('#st_list')
                var $oth_list = $('#oth_list')
                $st_list.empty()
                $oth_list.empty()
                for (i in date){
                    var info = '<li><a id="' +date[i].file_id + '" href="http://down.python34.top/'+ date[i].file_address +'?attname='+ date[i].file_name +'">'+ date[i].file_name +'</a><img id="del_file" class="link_edit_img" src="../static/picture/delete.png" alt="删除" title="删除"></li>'
                    if (date[i].file_folder == '1'){
                        $st_list.append($(info))
                    }
                    else {
                        $oth_list.append($(info))
                    }
                }
                $del_file_img = $('#download_box img')
            })
            .fail(function(){$.MsgBox.Alert('消息','更新列表失败！')})
            }

    function fc_del_file_ajax(id){
        $.ajax({
            url:'/up_download/delete_file/'+ id,
            headers: {"X-CSRFToken": getCookie("csrf_token")},
            type:'DELETE',
            dataType:'json',
        })
        .done(
            function(dat){
                fc_out_ot_edit()
                fc_out_st_edit()
                update_list()
                $.MsgBox.Alert('消息',dat['error_ms'])
            })
        .fail(
            function(){
                $.MsgBox.Alert('消息','网络连接失败，请检查网络连接后重试！')
            }
        )
    }
    // 退出学习文件编辑
    function fc_out_st_edit(){$st_file_edit_div.hide();$st_up.show();$del_file_img.hide()}
    // 退出其他文件编辑
    function fc_out_ot_edit(){$ot_file_edit_div.hide();$ot_up.show();$del_file_img.hide()}
})