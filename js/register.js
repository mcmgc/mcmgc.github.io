var timer = 0, inter;
$("#register-form").validator({
    inputs: [{
            id: "register-username",
            msgbox: "register-username-msg",
            validator: {
                require: {
                    message: "必须填写用户名",
                },
                length: {
                    min: 5,
                    max: 30,
                    message: "长度为5-30位",
                },
                regexp: {
                    regexp: /^[a-zA-Z0-9_]*.{5,30}$/,
                    message: "用户名格式不正确",
                },
                ajax: {
                    url: "/register.do?t=" + (new Date()).getTime(),
                    data: {
                        action: 'username'
                    },
                    dataKey: "username",
                }
            }
        }, {
            id: "register-email",
            msgbox: "register-email-msg",
            validator: {
                require: {
                    message: "必须填写邮箱",
                },
                length: {
                    min: 5,
                    max: 30,
                    message: "长度为5-30位",
                },
                regexp: {
                    regexp: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                    message: "邮箱格式不正确",
                },
                focus: function() {
                    disableBtn("#register-sendemailcode")
                },
                ajax: {
                    url: "/register.do",
                    data: {
                        action: 'email'
                    },
                    dataKey: "email",
                    success: function() {
                        email_ = $("#register-email").val()
                        if (timer == 0)
                            enableBtn("#register-sendemailcode")
                    },
                }
            }
        }, {
            id: "register-emailcode",
            msgbox: "register-emailcode-msg",
            validator: {
                require: {
                    message: "必须填写邮箱验证码",
                },
                length: {
                    min: 6,
                    max: 6,
                    message: "长度为6位",
                },
                regexp: {
                    regexp: /^[0-9]*.{6}$/,
                    message: "邮箱验证码格式不正确",
                },
                ajax: {
                    url: "/register.do",
                    data: {
                        action: 'emailcode'
                    },
                    dataKey: "emailcode",
                    specialData: [{
                            key: 'email',
                            input: 'register-email'
                        }
                    ],
                }
            }
        }, {
            id: "register-password",
            msgbox: "register-password-msg",
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
            id: "register-password2",
            msgbox: "register-password2-msg",
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
                    input: 'register-password',
                    message: '两次输入的密码必须相同'
                }
            }
        }
    ]
})
var canSubmit = false
var handler = function(captchaObj) {
    captchaObj.appendTo('#register-captcha');
    captchaObj.onReady(function() {
        $("#register-captcha .gt-wait").hide();
    });
    captchaObj.onSuccess(function() {
        $("#register-captcha").parent().find(".help-block").html('&nbsp;')
    });
    captchaObj.onError(function() {
        $("#register-captcha").parent().find(".help-block").html('<i class="fa fa-exclamation-circle"></i> 验证出错,请重试')
    });
    captchaObj.onClose(function() {
        $("#register-captcha").parent().find(".help-block").html('&nbsp;')
    });
    $('#btn-submit').click(function() {
        var result = captchaObj.getValidate();
        if (!result) {
            $("#register-captcha").parent().find(".help-block").html('<i class="fa fa-exclamation-circle"></i> 请完成安全验证')
            return false
        }
        if (!checkContract())
            return false

        if (!$("#register-form").validator("validate"))
            return false

        disableBtn("#btn-submit", '<i class="fa fa-spinner fa-spin fa-fw"></i> 注册')
        $.ajax({
            url: '/register.do',
            type: 'POST',
            dataType: 'json',
            data: {
                username: $('#register-username').val(),
                email: $('#register-email').val(),
                emailcode: $('#register-emailcode').val(),
                password: $('#register-password').val(),
                gt_challenge: result.geetest_challenge,
                gt_validate: result.geetest_validate,
                gt_seccode: result.geetest_seccode
            },
            success: function(data) {
                if (data.code == 100) {
                    $("#btn-submit").html("已登录")
                    layer.msg(data.msg, { icon: 1, time: 1500 })
                    canSubmit = true
                    $("#login-form").trigger("submit")
                } else if (data.code == 304) {
                    var url = getRequest().url;
                    if (url == undefined) url = "user.html";
                    location.href = url
                } else if (data.code == 201) {
                    enableBtn("#btn-submit")
                    $("#register-captcha").parent().find(".help-block").html('<i class="fa fa-exclamation-circle"></i> 验证出错,请重试')
                    captchaObj.reset();
                } else {
                    enableBtn("#btn-submit")
                    layer.msg(data.msg, {icon: 2, time: 1500})
                    captchaObj.reset();
                }
            },
            error: function() {
                enableBtn("#btn-submit")
                layer.msg("注册时发生错误,请重试", {icon: 2, time: 1500})
                captchaObj.reset();
            }
        });
    })
    window.gt = captchaObj;
};
$('input[type=checkbox],input[type=radio]').iCheck({
    checkboxClass: 'icheckbox_minimal-blue',
    radioClass: 'iradio_minimal-blue',
});

function loadCaptcha() {
    $.ajax({
        url: "/action/captcha.action",
        type: "post",
        data: { isPC: isPC() },
        dataType: "json",
        success: function(data) {
            $('#register-captcha .gt-text').hide();
            $('#register-captcha .gt-wait').show();
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
            $("#register-captcha").parent().find(".help-block").html('<i class="fa fa-exclamation-circle"></i> 安全验证加载失败')
            setTimeout(function() { loadCaptcha() }, 1500)
        }
    });
}
$("#register-email").on('change', function() {
    $("#register-emailcode").val("")
})
$("#register-sendemailcode").on('click', function() {
    if (timer > 0) return
    if ($("#register-email").attr("is-valid") == "false") {
        $("#register-email").trigger("blur")
        $(this).trigger("click")
        return
    }
    layer.confirm("你确定向以下邮箱发送验证码吗?<br>" + $("#register-email").val(), {
        title: "发送邮箱验证码"
    }, function() {
        disableBtn("#register-sendemailcode", "正在发送")
        layer.closeAll()
        $.ajax({
            url: "/register.do",
            type: "POST",
            data: {
                action: 'emailc',
                email: $("#register-email").val()
            },
            dataType: "json",
            timeout: 7000,
            success: function(res) {
                layer.closeAll()
                if (res.code == 100) {
                    layer.msg(res.msg, {icon: 1, time: 1500})
                    timer = 60
                    clearInterval(inter)
                    inter = setInterval(function() {
                        if (timer > 0) {
                            $("#register-sendemailcode").html("重新发送(" + timer + ")")
                            timer--
                        } else {
                            enableBtn("#register-sendemailcode")
                        }
                    }, 1000)
                } else {
                    enableBtn("#register-sendemailcode")
                    layer.msg(res.msg, {icon: 2, time: 1500})
                }
            },
            error: function() {
                enableBtn("#register-sendemailcode")
                layer.msg("请求超时,请重试", {icon: 2, time: 1500})
            }
        })

    }, function() {})

})

$("#register-contract").on("ifChanged", function(event) {
    checkContract()
})

function checkContract() {
    if ($('#register-contract').is(':checked')) {
        $("#register-contract-msg").html('&nbsp;')
        return true
    } else {
        $("#register-contract-msg").html('<i class="fa fa-exclamation-circle"></i> 你必须同意才能继续')
        return false
    }
}
$(document).ready(function(){
    loadCaptcha()
})
$(document).keyup(function(e) {
    if (e.keyCode == 13) {
        $("#btn-submit").trigger("focus")
        $("#btn-submit").trigger("click")
    }
})