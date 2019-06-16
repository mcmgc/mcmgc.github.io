$("#btn-upload").click(function(){
    $('#avatar-file').trigger("click");
});
$("#submit-cancel").click(function(){
    $("#step1").show()
    $("#step2").hide()
    $("#avatar-cropper-img").attr("src","")
})
$('#avatar-form').on('change', '#avatar-file', function(){
    var file = this.files[0];
    if(!/image\/\w+/.test(file.type)){
        layer.msg("只能选择图片文件",{icon: 2, time: 1500})
        return false;     
    }
    if(file.size > 5*1024*1024){
        layer.msg("文件大小不能超过5MB",{icon: 2, time: 1500})
        return false;     
    }
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(e){
        var data = this.result;
        var image = new Image();
        image.onload=function(){
            var width = image.width;
            var height = image.height;
            if(width<200||height<200){
                layer.msg("图片尺寸必须大于200*200",{icon: 2, time: 1500})
                return false;     
            }else{
                $("#step1").hide()
                $("#step2").show()
                $("#avatar-cropper-img").hide()
                $("#avatar-cropper-img").attr("src",data)
                $("#avatar-cropper-container > img").cropper('destroy');
                $("#avatar-cropper-container > img").cropper({
                    strict: true,
                    zoomable: false,
                    touchDragZoom: false,
                    mouseWheelZoom: false,
                    dragCrop: false,
                    autoCrop: true,
                    autoCropArea: 1.0,
                    aspectRatio: 1 / 1,
                    crop: function(data) {
                        $(".preview-big").html($(this).cropper('getCroppedCanvas',{width:200,height:200}))
                        $(".preview-normal").html($(this).cropper('getCroppedCanvas',{width:100,height:100}))
                        $(".preview-small").html($(this).cropper('getCroppedCanvas',{width:30,height:30}))
                    },
                });
                $("#avatar-cropper-container > img").cropper('setDragMode','crop');
            }
        };
        image.src=data;
    }
});
$("#cropper-reset").click(function(){
    $("#avatar-cropper-container > img").cropper('reset');
})
$("#submit-confirm").click(function(){
    layer.confirm('你确定将此头像上传审核吗?<br>审核通过前您将无法修改您的头像!', {title: "上传确认",btn: ['上传','取消'],}, function(){
  		submitConfirm()
    });
})
function submitConfirm(){
    layer.alert("正在上传",{icon: 16, shade: 0.5, title: false, closeBtn: 0, btn:[]});
    var result=$("#avatar-cropper-container > img").cropper('getCroppedCanvas',{width:200,height:200})
    fileImg = result.toDataURL('image/png');
    $("#avatar-form").attr("enctype","multipart/form-data");
    var formData = new FormData($("#avatar-form")[0]);  
        formData.append("imgBase64",encodeURIComponent(fileImg));
    disableBtn("#submit-confirm")
    $.ajax({
        url: "/setting_avatar.do",
        type: 'POST',
        data: formData,
        timeout : 10000,
        async: true,
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json",
        success: function (res){
            layer.closeAll()
            if(res.code==100){
                layer.msg(res.msg,{icon: 1, time: 1500})
                setTimeout(function(){history.go(0)},2000)
            }else{
                layer.msg(res.msg,{icon: 2, time: 1500})
                enableBtn("#submit-confirm")
            }
        },error: function (returndata) {
            layer.msg("上传时发生错误",{icon: 2, time: 1500})
            enableBtn("#submit-confirm")
        }
    });  
}

$("#btn-gravatar").click(function(){
    layer.confirm('你确定将此头像上传审核吗?<br>审核通过前您将无法修改您的头像!<br><img src="'+$("#gravatar-url").val()+'" width="200" height="200" alt="正在加载Gravatar头像">', {title: "上传确认",btn: ['上传','取消'],}, function(){
        layer.closeAll()
        layer.alert("正在上传",{icon: 16, shade: 0.5, title: false, closeBtn: 0, btn:[]});
        $.ajax({
        url: "/setting_avatar.do",
        data: {avatar: 'gravatar'},
        type: 'POST',
        timeout : 5000,
        dataType: "json",
        success: function (res){
            layer.closeAll()
            if(res.code==100){
                layer.msg(res.msg,{icon: 1, time: 1500})
                setTimeout(function(){history.go(0)},2000)
            }else{
                layer.msg(res.msg,{icon: 2, time: 1500})
                enableBtn("#submit-confirm")
            }
        },error: function (returndata) {
            layer.msg("上传时发生错误",{icon: 2, time: 1500})
            enableBtn("#submit-confirm")
        }
    });
    });
});
$("#btn-qqavatar").click(function(){
    layer.confirm('你确定将此头像上传审核吗?<br>审核通过前您将无法修改您的头像!<br><img src="'+$("#qqavatar-url").val()+'" width="200" height="200" alt="正在加载QQ头像">', {title: "上传确认",btn: ['上传','取消'],}, function(){
        layer.closeAll()
        layer.alert("正在上传",{icon: 16, shade: 0.5, title: false, closeBtn: 0, btn:[]});
        $.ajax({
        url: "/setting_avatar.do",
        data: {avatar: 'qq'},
        type: 'POST',
        timeout : 5000,
        dataType: "json",
        success: function (res){
            layer.closeAll()
            if(res.code==100){
                layer.msg(res.msg,{icon: 1, time: 1500})
                setTimeout(function(){history.go(0)},2000)
            }else{
                layer.msg(res.msg,{icon: 2, time: 1500})
                enableBtn("#submit-confirm")
            }
        },error: function (returndata) {
            layer.msg("上传时发生错误",{icon: 2, time: 1500})
            enableBtn("#submit-confirm")
        }
    });
    });
});