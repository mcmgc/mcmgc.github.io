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
                action: 'reply',
                rid: $("#rid").val(),
                content:$("#econtent").val(),
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
        captchaObj.verify();
    })
    window.gt = captchaObj;
};
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
function checkReply(e){
    var c = wordCount($("#econtent").val(),1)
    $("#wordCount").html(500-c)
    return c<=500 && c>0;
}
$(document).ready(function(){
    loadCaptcha();
    checkReply();
    $("#econtent").on('change',checkReply)
    $("#econtent").on('keyup',checkReply)
    $("#econtent").on('mouseup',checkReply)
    $("#page-loading").fadeOut(500)
    $("#page-main").fadeIn(500);
})