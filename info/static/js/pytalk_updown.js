/**
 * Created by python on 18-12-25.
 */


$(function () {

    function getCookie(name) {
        var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
        return r ? r[1] : undefined;
        }

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
        // 点击加号触发
        var $up_box = $('.update_box')
        var position = null   // 标记上传位置
        $('#st_up').click(function(){position = 'st';$up_box.fadeIn()})
        $('#or_up').click(function(){position = 'ot';$up_box.fadeIn()})
        // 上传面板功能
        var $up_bt = $('#up_bt')
        $up_bt.click(function(){
            var fd = $('#up_file')[0].files[0]
            if (fd == undefined){
                alert('未选定文件，请重试！')
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
                alert(dat.error)
                $up_box.fadeOut(500)
                update_list()
                $up_bt.css("pointer-events","")
            })
            .fail(function(){
                alert('上传失败')
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
                    var info = '<li><a href="http://down.python34.top/'+ date[i].file_address +'?attname='+ date[i].file_name +'">'+ date[i].file_name +'</a></li>'
                    if (date[i].file_folder == '1'){
                        $st_list.append($(info))
                    }
                    else {
                        $oth_list.append($(info))
                    }
                }
            })
            .fail(function(){alert('下载列表更新失败')})
            }


})