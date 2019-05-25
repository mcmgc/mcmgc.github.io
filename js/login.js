$("#login-form").validator({
    inputs: [{
        id: "login-identity",
        msgbox: "login-identity-msg",
        validator: {
            require: {
                message: "必须填写用户名/邮箱",
            },
            length: {
                min: 5,
                max: 30,
                message: "长度为5-30位",
            }
        }
    },{
        id: "login-password",
        msgbox: "login-password-msg",
        validator: {
            require: {
                message: "必须填写密码",
            },
            length: {
                min: 8,
                max: 30,
                message: "长度为8-30位",
            },
            regexp: {
                regexp: /^[\x21-\x7E]*.{8,30}$/,
                message: "密码格式不正确",
            }
        }
    }]
})
var canSubmit = false
var handler = function (captchaObj) {
    captchaObj.appendTo('#login-captcha');
    captchaObj.onReady(function () {
        $("#login-captcha .gt-wait").hide();
    });
    captchaObj.onSuccess(function () {
        $("#login-captcha").parent().find(".help-block").html('&nbsp;')
    });
    captchaObj.onError(function () {
        $("#login-captcha").parent().find(".help-block").html('<i class="fa fa-exclamation-circle"></i> 验证出错,请重试')
    });
    captchaObj.onClose(function () {
        $("#login-captcha").parent().find(".help-block").html('&nbsp;')
    });
    $('#btn-submit').click(function () {
        var result = captchaObj.getValidate();
        if (!result) {
            $("#login-captcha").parent().find(".help-block").html('<i class="fa fa-exclamation-circle"></i> 请完成安全验证')
            return false
        }
        if(!$("#login-form").validator("validate")){
            return false
        }
        disableBtn("#btn-submit",'<i class="fa fa-spinner fa-spin fa-fw"></i> 正在登录')
        $.ajax({
            url: '/login.do',
            type: 'POST',
            dataType: 'json',
    		timeout: 5000,
            data: {
                identity: $('#login-identity').val(),
                password: $('#login-password').val(),
                gt_challenge: result.geetest_challenge,
                gt_validate: result.geetest_validate,
                gt_seccode: result.geetest_seccode
            },
            success: function (data) {
                if (data.code==100){
                    $("#btn-submit").html("已登录")
                    layer.msg(data.msg,{icon:1,time:1500})
                    canSubmit = true
                    $("#login-form").trigger("submit")
                }else if(data.code==304){
                    var url=getRequest().url;
                    if(url==undefined)url="user.html";
                    location.href=url
                }else if(data.code==201){
                    enableBtn("#btn-submit")
                    $("#pay-captcha").parent().find(".help-block").html('<i class="fa fa-exclamation-circle"></i> 验证出错,请重试')
                    captchaObj.reset();
                }else{
                    enableBtn("#btn-submit")
                    layer.msg(data.msg,{icon:2,time:1500})
                    captchaObj.reset();
                }
            },
            error: function(){
                enableBtn("#btn-submit")
                layer.msg("登录时发生错误,请重试",{icon:2,time:1500})
                captchaObj.reset();
            }
        });
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
        $('#login-captcha .gt-text').hide();
        $('#login-captcha .gt-wait').show();
        $("#login-captcha").parent().find(".help-block").html('&nbsp;')
        initGeetest({
            gt: data.gt,
            challenge: data.challenge,
            offline: !data.success,
            new_captcha: data.new_captcha,
            product: "popup",
            width: "100%",
            https: true
        }, handler);
    },error: function(){
        $("#login-captcha").parent().find(".help-block").html('<i class="fa fa-exclamation-circle"></i> 安全验证加载失败')
        setTimeout(function(){loadCaptcha()},1500)
    }
});
}
$(document).keyup(function(e){
	if(e.keyCode==13){
        $("#btn-submit").trigger("focus")
        $("#btn-submit").trigger("click")
    }
})
$(document).ready(function(){
    loadCaptcha();
})