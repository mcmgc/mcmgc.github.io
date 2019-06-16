var handler = function(captchaObj) {
    captchaObj.appendTo('#jhm-captcha');
    captchaObj.onReady(function() {
        $("#jhm-captcha .gt-wait").hide();
    });
    captchaObj.onSuccess(function() {
        $("#jhm-captcha").parent().find(".help-block").html('&nbsp;')
    });
    captchaObj.onError(function() {
        $("#jhm-captcha").parent().find(".help-block").html('<i class="fa fa-exclamation-circle"></i> 验证出错,请重试')
    });
    captchaObj.onClose(function() {
        $("#jhm-captcha").parent().find(".help-block").html('&nbsp;')
    });
    $('#btn-submit').click(function() {
        var result = captchaObj.getValidate();
        if (!result) {
            $("#jhm-captcha").parent().find(".help-block").html('<i class="fa fa-exclamation-circle"></i> 请完成安全验证')
            return false
        }
        if (!$("#form-jhm").validator("validate")) {
            return false
        }
        disableBtn("#btn-submit", '<i class="fa fa-spinner fa-spin fa-fw"></i> 正在提交')
        $.ajax({
            url: "/jhm.do",
            type: 'POST',
            dataType: 'json',
            timeout: 5000,
            data: {
                action: 'useCode',
                code: $("#jhm-code").val(),
                gt_challenge: result.geetest_challenge,
                gt_validate: result.geetest_validate,
                gt_seccode: result.geetest_seccode
            },
            success: function(data) {
                if (data.code == 100) {
                    layer.msg(data.msg, { icon: 1, time: 1500 })
                    $("#jhm-code").val("")
                    enableBtn("#btn-submit")
                    captchaObj.reset();
                } else if (data.code == 302) {
                    location.href = "login.html?url=jhm.html"
                } else if (data.code == 201) {
                    enableBtn("#btn-submit")
                    $("#step2-captcha").parent().find(".help-block").html('<i class="fa fa-exclamation-circle"></i> 验证出错,请重试')
                    captchaObj.reset();
                } else {
                    enableBtn("#btn-submit")
                    layer.msg(data.msg, { icon: 2, time: 1500 })
                    captchaObj.reset();
                }
            },
            error: function() {
                enableBtn("#btn-submit")
                layer.msg("提交时发生错误,请重试", { icon: 2, time: 1500 })
                captchaObj.reset();
            }
        });
    })
    window.gt = captchaObj;
};

function loadCaptcha() {
    $("#jhm-captcha").parent().find(".help-block").html('&nbsp;')
    $.ajax({
        url: "/captcha.do",
        type: "post",
        data: { isPC: isPC() },
        dataType: "json",
        timeout: 5000,
        success: function(data) {
            $('#jhm-captcha .gt-text').hide();
            $('#jhm-captcha .gt-wait').show();
            $("#jhm-captcha").parent().find(".help-block").html('&nbsp;')
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
            $("#jhm-captcha").parent().find(".help-block").html('<i class="fa fa-exclamation-circle"></i> 安全验证加载失败')
            setTimeout(function() { loadCaptcha() }, 1500)
        }
    });
}
$(document).ready(function() {
    loadCaptcha()
})
$("#form-jhm").validator({
    inputs: [{
            id: "jhm-code",
            msgbox: "jhm-code-msg",
            validator: {
                require: {
                    message: "必须填写激活码",
                },
                length: {
                    min: 4,
                    message: "长度不能小于4位",
                },
                regexp: {
                    regexp: /^[\x21-\x7E]*.{4,28}$/,
                    message: "激活码格式不正确",
                },
                ajax: {
                    url: "/jhm.do",
                    data: {
                        action: "checkCode"
                    },
                    dataKey: "code"
                }
            }
        }
    ]
});