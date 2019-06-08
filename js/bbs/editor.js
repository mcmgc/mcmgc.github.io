function wordCount(str, cnCharByteLen) {
    var byteLen = 0;
    for (var i = 0; i < str.length; i++) {
        if ((/[\x00-\xff]/g).test(str.charAt(i)))
            byteLen += 1;
        else
            byteLen += cnCharByteLen;
    }
    return byteLen;
}
var handler = function (captchaObj) {
    captchaObj.onSuccess(function () {
        var result = captchaObj.getValidate();
        if (!result) {
            layer.msg("请完成安全验证",{icon: 2, time: 1500});
            return false
        }
        disableBtn("#btn-submit",'<i class="fa fa-spinner fa-spin fa-fw"></i> 提交')
        $.ajax({
            url: "/action/editor.bbs",
            type: 'POST',
            dataType: 'json',
    		timeout: 5000,
            data: {
                action: $("#action").val(),
                tid: $("#tid").val(),
                tag: $("#etag").val(),
                title:$("#etitle").val(),
                content:UE.getEditor('econtent').getContent(),
                gt_challenge: result.geetest_challenge,
                gt_validate: result.geetest_validate,
                gt_seccode: result.geetest_seccode
            },
            success: function (data) {
                if (data.code==100){
                    enableBtn("#btn-submit")
                    layer.msg(data.msg,{icon:1,time:1500})
                    setTimeout(function(){location="/bbs/thread-"+data.tid},1500)
                }else if(data.code==201){
                    enableBtn("#btn-submit")
                    layer.msg("安全验证失败,请重试",{icon: 2, time: 1500});
                    captchaObj.reset();
                }else{
                    enableBtn("#btn-submit")
                    layer.msg(data.msg,{icon:2,time:1500})
                    captchaObj.reset();
                }
            },
            error: function(){
                enableBtn("#btn-submit")
                layer.msg("提交帖子时发生错误,请重试",{icon:2,time:1500})
                captchaObj.reset();
            }
        });
    })
    $('#btn-submit').click(function () {
        if($("#etitle").val()==""){
            layer.msg("请输入帖子标题",{icon: 2, time: 1500, shade: 0.5});
            return
        }
        var at = wordCount($("#etitle").val(),1)
        if(at<5||at>100){
            layer.msg("标题字数不符合规定: 5-100",{icon: 2, time: 1500});
            return
        }
        if(!UE.getEditor('econtent').hasContents()){
            layer.msg("请输入帖子内容",{icon: 2, time: 1500});
            return
        }
    	var ac = UE.getEditor('econtent').getPlainTxt()
        if(ac.length<20){
            layer.msg("帖子内容不能少于20字",{icon: 2, time: 1500});
            return
        }if(ac.length>10000){
            layer.msg("帖子内容不能多于10000字",{icon: 2, time: 1500});
            return
        }
        captchaObj.verify();
    })
    window.gt = captchaObj;
};
$(document).ready(function(){
    UE.getEditor('econtent')
    loadCaptcha()
    UE.getEditor('econtent').ready(function(){
        if($("#tid").val()>0)
            loadContent($("#tid").val());
        else
            $("#page-loading").fadeOut(500);
            $("#page-main").fadeIn(500);
    })
})
function loadCaptcha(){
    $.ajax({
        url: "/captcha.do",
        type: "post",
        data: {isPC:isPC()},
        dataType: "json",
        timeout: 5000,
        success: function (data) {
            initGeetest({
                gt: data.gt,
                challenge: data.challenge,
                offline: !data.success,
                new_captcha: data.new_captcha,
                product: "bind",
                https: true
            }, handler);
        },error: function(){
            layer.msg("安全验证加载失败",{icon:2,time:1500})
            setTimeout(function(){loadCaptcha()},1500)
        }
    });
}
var tryt=0;
function loadContent(tid){
    if(++tryt>5){
        layer.alert("无法加载帖子内容,请刷新重试!");
        return;
    }
    $.ajax({
        url: "/action/thread.bbs",
        type: "post",
        data: {action:'getcont',tid:tid},
        dataType: "json",
        timeout: 5000,
        success: function (data) {
            if (data.code==100){
                UE.getEditor('econtent').setContent(data.content);
                $("#page-loading").fadeOut(500);
                $("#page-main").fadeIn(500);
            }else{
                loadContent(tid);
            }
        },
        error: function(){
            loadContent(tid);
        }
    });
}