
$("#btn-step1-submit").click(function() {
        if($("#form-step1").validator("validate")){
        	disableBtn("#btn-step1-submit",'<i class="fa fa-spinner fa-spin fa-fw"></i> 下一步')
        	$.ajax({
        		url: "action/setting_genuine.action?t=" + (new Date()).getTime(),
        		type: "POST",
        		data: {action:'start'},
        		dataType: "json",
        		timeout: 5000,
        		success: function(res){
        	    	layer.closeAll()
        	    	if(res.code==100){
        	    		$("#token1").val(res.token)
        				$("#step1").hide()
        				$("#step2").show()
                        loadCaptcha()
        			}else{
        	    	    enableBtn("#btn-step1-submit")
        	    		layer.msg(res.msg,{icon: 2, time: 1500});
        			}
    			},
        		error: function(){
        		    enableBtn("#btn-step1-submit")
        		    layer.msg("验证失败,请重试",{icon: 2, time: 1500});
        		}
        	})
        }
    
});
// step 1 end


function loadCaptcha(){
var handler = function (captchaObj) {
    captchaObj.appendTo('#step2-captcha');
    captchaObj.onReady(function () {
        $("#step2-captcha .gt-wait").hide();
    });
    captchaObj.onSuccess(function () {
        $("#step2-captcha").parent().find(".help-block").html('&nbsp;')
    });
    captchaObj.onError(function () {
        $("#step2-captcha").parent().find(".help-block").html('<i class="fa fa-exclamation-circle"></i> 验证出错,请重试')
    });
    captchaObj.onClose(function () {
        $("#step2-captcha").parent().find(".help-block").html('&nbsp;')
    });
    $("#step2-sendcode").on("click", function() {
        if (timer > 0) return;
        var result = captchaObj.getValidate();
        if (!result) {
            $("#step2-captcha").parent().find(".help-block").html('<i class="fa fa-exclamation-circle"></i> 请完成安全验证')
            return false
        }
        var aamethod = $("#step2-method").val()
        var aamsg,aatitle
        if(aamethod=="email"){
            aamsg="你确定向以下邮箱发送验证码吗?<br>" + $("#data-email").data("value")
            aatitle="发送邮箱验证码"
        }else if(aamethod=="phone"){
            aamsg="你确定向以下手机号发送验证码吗?<br>" + $("#data-phone").data("value")
            aatitle="发送手机验证码"
        }
        layer.confirm(aamsg, { title: aatitle },
        function() {
            disableBtn("#step2-sendcode", "正在发送");
            layer.closeAll();
            $.ajax({
                url: "action/setting_genuine.action?t=" + (new Date()).getTime(),
                type: "POST",
                data: {
                    action: "sendCode",
                    method: $("#step2-method").val(),
                    token: $("#token1").val(),
                },
                dataType: "json",
                timeout: 5000,
                success: function(res) {
                    layer.closeAll();
                    if (res.code == 100) {
                        layer.msg(res.msg, { icon: 1, time: 1500 });
                        timer = 60;
                        inter = setInterval(function() {
                            if (timer > 0) {
                                $("#step2-sendcode").html("重新发送(" + timer + ")");
                                timer--
                            } else {
                                enableBtn("#step2-sendcode")
                            }
                        },
                        1000)
                    } else {
                        enableBtn("#step2-sendcode");
                        layer.msg(res.msg, { icon: 2, time: 1500 });
                    }
                },
                error: function() {
                    enableBtn("#step2-sendcode");
                    layer.msg("请求超时,请重试", { icon: 2, time: 1500 });
                }
            })
        },
        function() {})
    })
    $('#btn-step2-submit').click(function () {
        var result = captchaObj.getValidate();
        if (!result) {
            $("#step2-captcha").parent().find(".help-block").html('<i class="fa fa-exclamation-circle"></i> 请完成安全验证')
            return false
        }
        if(!$("#form-step2").validator("validate")){
            return false
        }
        disableBtn("#btn-step2-submit",'<i class="fa fa-spinner fa-spin fa-fw"></i> 正在验证')
        $.ajax({
            url: "action/setting_genuine.action?t=" + (new Date()).getTime(),
            type: 'POST',
            dataType: 'json',
    		timeout: 5000,
            data: {
                action: 'validateCert',
                method: $("#step2-method").val(),
                code: $("#step2-code").val(),
                password: $("#step2-password").val(),
                token: $("#token1").val(),
                gt_challenge: result.geetest_challenge,
                gt_validate: result.geetest_validate,
                gt_seccode: result.geetest_seccode
            },
            success: function (data) {
                if (data.code==100){
                    $("#btn-step2-submit").html("下一步")
                    layer.msg(data.msg,{icon:1,time:1500})
        	    	$("#token2").val(data.token)
                    $("#step2").hide()
                    $("#step3").show()
                }else if(data.code==302){
                    location.href="login.html?url=setting_genuine.html"
                }else if(data.code==201){
                    enableBtn("#btn-step2-submit")
                    $("#step2-captcha").parent().find(".help-block").html('<i class="fa fa-exclamation-circle"></i> 验证出错,请重试')
                    captchaObj.reset();
                }else{
                    enableBtn("#btn-step2-submit")
                    layer.msg(data.msg,{icon:2,time:1500})
                    captchaObj.reset();
                }
            },
            error: function(){
                enableBtn("#btn-step2-submit")
                layer.msg("验证身份时发生错误,请重试",{icon:2,time:1500})
                captchaObj.reset();
            }
        });
    })
    window.gt = captchaObj;
};

$.ajax({
    url: "action/setting_genuine.action?t=" + (new Date()).getTime(),
    type: "post",
    data: {isPC:isPC(),action: "captcha"},
    dataType: "json",
    timeout: 5000,
    success: function (data) {
        $('#step2-captcha .gt-text').hide();
        $('#step2-captcha .gt-wait').show();
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
        layer.msg("安全验证加载失败",{icon:2,time:1500})
        setTimeout(function(){loadCaptcha()},1500)
    }
});
}
var timer = 0, inter;
if ($("#data-mb").data("value")>0) {
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
                },
                ajax: {
                    url: "action/setting_genuine.action?t=" + (new Date()).getTime(),
                    data: {
                        action: "checkCode"
                    },
                    dataKey: "code",
                    specialData: [{
                        key: "method",
                        input: "step2-method"
                    }],
                }
            }
        }]
    });
}else{
    $("#form-step2").validator({
        inputs: [{
            id: "step2-password",
            msgbox: "step2-password-msg",
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
                },
            }
        }]
    });
}
    
//setp 2 end

var timer2 = 0,inter2

   $("#form-step3").validator({
        inputs: [{
            id: "step3-account",
            msgbox: "step3-account-msg",
            validator: {
                require: {
                    message: "必须填写Mojang账号",
                },
                length: {
                    min: 8,
                    max: 30,
                    message: "长度为8-30位",
                },
                regexp: {
                    regexp: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                    message: "Mojang账号格式不正确",
                }
            }
        },{
            id: "step3-password",
            msgbox: "step3-password-msg",
            validator: {
                require: {
                    message: "必须填写Mojang密码",
                },
                length: {
                    min: 8,
                    max: 30,
                    message: "长度为8-30位",
                },
                regexp: {
                    regexp: /^[\x21-\x7E]*.{8,30}$/,
               		message: "Mojang密码格式不正确",
                },
            }
        }]
      })
	

	$('#btn-step3-submit').click(function () {
        if(!$("#form-step3").validator("validate")){
            return false
        }
        disableBtn("#btn-step3-submit",'<i class="fa fa-spinner fa-spin fa-fw"></i> 正在提交')
        $.ajax({
            url: "action/setting_genuine.action?t=" + (new Date()).getTime(),
            type: 'POST',
            dataType: 'json',
    		timeout: 5000,
            data: {
                account: $("#step3-account").val(),
                password: $("#step3-password").val(),
                token: $("#token2").val(),
            },
            success: function (data) {
                if (data.code==100){
                    $("#btn-step3-submit").html("提交")
                    layer.msg(data.msg,{icon:1,time:1500})
        	    	setTimeout(function(){history.go(0)},1500)
                }else if(data.code==302){
                    location.href="login.html?url=setting_genuine.html"
                }else{
                    enableBtn("#btn-step3-submit")
                    layer.msg(data.msg,{icon:2,time:1500})
                }
            },
            error: function(a1,a2,a3){
                enableBtn("#btn-step3-submit")
                layer.msg("提交时发生错误,请重试",{icon:2,time:1500})
            }
        });
    })