$(document).ready(function(){
    loadCaptcha()
})
$("#form-step1").validator({
    inputs: [{
            id: "step1-identity",
            msgbox: "step1-identity-msg",
            validator: {
                require: {
                    message: "必须填写" + vfmethod_cn,
                },
                length: {
                    min: 5,
                    max: 30,
                    message: "长度为5-30位",
                },
                regexp: {
                    regexp: vfregexp,
                    message: vfmethod_cn + "格式不正确",
                }
            }
        }
    ]
})
var handler = function(captchaObj) {
    captchaObj.appendTo('#step1-captcha');
    captchaObj.onReady(function() {
        $("#step1-captcha .gt-wait").hide();
    });
    captchaObj.onSuccess(function() {
        $("#step1-captcha").parent().find(".help-block").html('&nbsp;')
    });
    captchaObj.onError(function() {
        $("#step1-captcha").parent().find(".help-block").html('<i class="fa fa-exclamation-circle"></i> 验证出错,请重试')
    });
    captchaObj.onClose(function() {
        $("#step1-captcha").parent().find(".help-block").html('&nbsp;')
    });
    $('#btn-step1-submit').click(function() {
        var result = captchaObj.getValidate();
        if (!result) {
            $("#step1-captcha").parent().find(".help-block").html('<i class="fa fa-exclamation-circle"></i> 请完成安全验证')
            return false
        }
        if (!$("#form-step1").validator("validate"))
            return false

        disableBtn("#btn-step1-submit", '<i class="fa fa-spinner fa-spin fa-fw"></i> 下一步')
        $.ajax({
            url: '/action/forgot.action',
            type: 'POST',
            dataType: 'json',
            data: {
                action: 'checkIdentity',
                identity: $('#step1-identity').val(),
                gt_challenge: result.geetest_challenge,
                gt_validate: result.geetest_validate,
                gt_seccode: result.geetest_seccode
            },
            success: function(data) {
                if (data.code == 100) {
                    $("#token").val(data.token)
                    $("#txt-identity").html($("#step1-identity").val())
                    $("#step1").slideUp(250)
                    $("#step2").slideDown(250)
                } else if (data.code == 304) {
                    location.href = "user.html";
                } else if (data.code == 201) {
                    enableBtn("#btn-step1-submit")
                    $("#forgot-captcha").parent().find(".help-block").html('<i class="fa fa-exclamation-circle"></i> 验证出错,请重试')
                    captchaObj.reset();
                } else {
                    enableBtn("#btn-step1-submit")
                    layer.msg(data.msg, {icon: 2,time: 1500})
                    captchaObj.reset();
                }
            },
            error: function() {
                enableBtn("#btn-step1-submit")
                layer.msg("系统错误,请重试", {icon: 2,time: 1500})
                captchaObj.reset();
            }
        });
    })
    window.gt = captchaObj;
};

function loadCaptcha() {
    $.ajax({
        url: "/action/captcha.action",
        type: "post",
        data: {isPC: isPC()},
        dataType: "json",
        success: function(data) {
            $('#step1-captcha .gt-text').hide();
            $('#step1-captcha .gt-wait').show();
            initGeetest({
                gt: data.gt,
                challenge: data.challenge,
                offline: !data.success,
                new_captcha: data.new_captcha,
                product: "popup",
                width: "100%",
                https: true
            }, handler);
        },
        error: function() {
            $("#step1-captcha").parent().find(".help-block").html('<i class="fa fa-exclamation-circle"></i> 安全验证加载失败')
            setTimeout(function() { loadCaptcha(); }, 1500)
        }
    });
}
$("#form-step2").validator({
    inputs: [{
            id: "step2-code",
            msgbox: "step2-code-msg",
            validator: {
                require: {
                    message: "必须填写验证码",
                },
                length: {
                    min: 6,
                    max: 6,
                    message: "长度为6位",
                },
                regexp: {
                    regexp: /^[0-9]*.{6}$/,
                    message: "验证码格式不正确",
                }
            }
        }
    ]
})

$('#btn-step2-submit').click(function() {
    if (!$("#form-step2").validator("validate")) {
        return false
    }
    disableBtn("#btn-step2-submit", '<i class="fa fa-spinner fa-spin fa-fw"></i> 下一步')
    $.ajax({
        url: "/action/forgot.action",
        type: 'POST',
        dataType: 'json',
        timeout: 5000,
        data: {
            action: 'checkCode',
            code: $("#step2-code").val(),
            token: $("#token").val(),
        },
        success: function(data) {
            if (data.code == 100) {
                $("#token2").val(data.token)
                $("#step2").slideUp(250)
                $("#step3").slideDown(250)
            } else if (data.code == 304) {
                location.href = "user.html"
            } else {
                enableBtn("#btn-step2-submit")
                layer.msg(data.msg, {icon: 2,time: 1500})
            }
        },
        error: function() {
            enableBtn("#btn-step2-submit")
            layer.msg("系统错误,请稍后重试", {icon: 2,time: 1500})
        }
    });
})

$("#form-step3").validator({
    inputs: [{
            id: "step3-password",
            msgbox: "step3-password-msg",
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
        }, {
            id: "step3-password2",
            msgbox: "step3-password2-msg",
            validator: {
                require: {
                    message: "必须填写确认密码",
                },
                length: {
                    min: 8,
                    max: 30,
                    message: "长度为8-30位",
                },
                regexp: {
                    regexp: /^[\x21-\x7E]*.{8,30}$/,
                    message: "确认密码格式不正确",
                },
                same: {
                    input: 'step3-password',
                    message: '两次输入的密码必须相同'
                }
            }
        }
    ]
})

$('#btn-step3-submit').click(function() {
    if (!$("#form-step3").validator("validate")) {
        return false
    }
    disableBtn("#btn-step3-submit", '<i class="fa fa-spinner fa-spin fa-fw"></i> 提交')
    $.ajax({
        url: "/action/forgot.action",
        type: 'POST',
        dataType: 'json',
        timeout: 5000,
        data: {
            password: $("#step3-password").val(),
            token: $("#token2").val(),
        },
        success: function(data) {
            if (data.code == 100) {
                layer.msg(data.msg, {icon: 1,time: 1500})
                setTimeout(function() { location.href = "/login.html" }, 1500)
            } else if (data.code == 304) {
                location.href = "user.html"
            } else {
                enableBtn("#btn-step3-submit")
                layer.msg(data.msg, {icon: 2,time: 1500})
            }
        },
        error: function() {
            enableBtn("#btn-step3-submit")
            layer.msg("系统错误,请重试", {icon: 2,time: 1500})
        }
    });
})