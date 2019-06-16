var s1tok
if ($("#data-email").data("bind")) {
    $("#form-step1").validator({
        inputs: [{
            id: "step1-email",
            msgbox: "step1-email-msg",
            validator: {
                require: {
                    message: "必须填写完整邮箱地址",
                },
                length: {
                    min: 5,
                    max: 30,
                    message: "邮箱地址长度为5-30位",
                },
                regexp: {
                    regexp: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                    message: "邮箱格式不正确",
                }
            }
        }]
    })
}
$("#btn-step1-submit").click(function() {
    if ($("#data-email").data("bind")) {
        if($("#form-step1").validator("validate")){
        	disableBtn("#btn-step1-submit",'<i class="fa fa-spinner fa-spin fa-fw"></i> 下一步')
        	$.ajax({
        		url: "/setting_email.do",
        		type: "POST",
        		data: {action:'currentEmail',email:$("#step1-email").val()},
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
    }else{
        disableBtn("#btn-step1-submit",'<i class="fa fa-spinner fa-spin fa-fw"></i> 下一步')
        	$.ajax({
        		url: "/setting_email.do",
        		type: "POST",
        		data: {action:'currentEmail'},
        		dataType: "json",
        		timeout: 5000,
        		success: function(data){
        	    	layer.closeAll()
        	    	if(data.code==100){
        	    		$("#token1").val(data.token)
        				$("#step1").hide()
        				$("#step2").show()
                        loadCaptcha()
        			}else{
        	    	    enableBtn("#btn-step1-submit")
        	    		layer.msg(data.msg,{icon: 2, time: 1500});
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
            url: "/setting_email.do",
            type: 'POST',
            dataType: 'json',
    		timeout: 5000,
            data: {
                action: 'validateCert',
                phone: $("#step2-phone").val(),
                phonecode: $("#step2-phonecode").val(),
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
                    location.href="login.html?url=setting_email.html"
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
    url: "/setting_email.do",
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
if ($("#data-phone").data("bind")) {
    $("#form-step2").validator({
        inputs: [{
            id: "step2-phone",
            msgbox: "step2-phone-msg",
            validator: {
                require: {
                    message: "必须填写手机号",
                },
                length: {
                    min: 11,
                    max: 11,
                    message: "长度为11位",
                },
                regexp: {
                    regexp: /^1[34578]\d{9}$/,
                    message: "手机号格式不正确",
                },
                focus: function(){
                    disableBtn("#step2-sendphonecode")
                },
                ajax: {
                    url: "/setting_email.do",
                    data: {
                        action: "checkPhone"
                    },
                    dataKey: "phone",
                    specialData: [{
                        key: "token",
                        input: "token1"
                    }],
                    success: function() {
                        if (timer == 0) {
                            enableBtn("#step2-sendphonecode")
                        }
                    },
                }
            }
        },{
            id: "step2-phonecode",
            msgbox: "step2-phonecode-msg",
            validator: {
                require: {
                    message: "必须填写手机验证码",
                },
                length: {
                    min: 6,
                    max: 6,
                    message: "长度为6位",
                },
                regexp: {
                    regexp: /^[0-9]*.{6}$/,
                    message: "手机验证码格式不正确",
                },
                ajax: {
                    url: "/setting_email.do",
                    data: {
                        action: "checkPhoneCode"
                    },
                    dataKey: "phonecode",
                    specialData: [{
                        key: "phone",
                        input: "step2-phone"
                    },{
                        key: "token",
                        input: "token1"
                    }],
                }
            }
        }]
    });
    $("#step2-phone").on("change", function() {
        $("#step2-phonecode").val("")
    });
    $("#step2-sendphonecode").on("click", function() {
        if (timer > 0) return
        if ($("#step2-phone").attr("is-valid") == "false") {
            $("#step2-phone").trigger("blur");
            $(this).trigger("click");
            return
        }
        layer.confirm("你确定向以下手机号发送验证码吗?<br>" + $("#step2-phone").val(), { title: "发送手机验证码" },
        function() {
            disableBtn("#step2-sendphonecode", "正在发送");
            layer.closeAll();
            $.ajax({
                url: "/setting_email.do",
                type: "POST",
                data: {
                    action: "sendPhoneCode",
                    phone: $("#step2-phone").val(),
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
                                $("#step2-sendphonecode").html("重新发送(" + timer + ")");
                                timer--
                            } else {
                                enableBtn("#step2-sendphonecode")
                            }
                        },
                        1000)
                    } else {
                        enableBtn("#step2-sendphonecode");
                        layer.msg(res.msg, { icon: 2, time: 1500 });
                    }
                },
                error: function() {
                    enableBtn("#step2-sendphonecode");
                    layer.msg("请求超时,请重试", { icon: 2, time: 1500 });
                }
            })
        },
        function() {})
    })
} else {
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
                }
            }
        }]
    })
}
//setp 2 end

var timer2 = 0,inter2

   $("#form-step3").validator({
        inputs: [{
            id: "step3-email",
            msgbox: "step3-email-msg",
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
                ajax: {
                    url: "/setting_email.do",
                    data: {
                        action: "checkEmail"
                    },
                    dataKey: "email",
                    success: function() {
                        phone_ = $("#step3-phone").val();
                        if (timer2 == 0) {
                            enableBtn("#step3-sendemailcode")
                        }
                    },
                }
            }
        },{
            id: "step3-emailcode",
            msgbox: "step3-emailcode-msg",
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
                    url: "/setting_email.do",
                    data: {
                        action: "checkEmailCode"
                    },
                    dataKey: "emailcode",
                    specialData: [{
                        key: "email",
                        input: "step3-email"
                    }],
                }
            }
        }]
      })
	$("#step3-email").on("change", function() {
        $("#step3-emailcode").val("")
    });
    $("#step3-sendemailcode").on("click", function() {
        if (timer2 > 0) return
        if ($("#step3-email").attr("is-valid") == "false") {
            $("#step3-email").trigger("blur");
            $(this).trigger("click");
            return
        }
        layer.confirm("你确定向以下邮箱发送验证码吗?<br>" + $("#step3-email").val(), { title: "发送邮箱验证码" },
        function() {
            disableBtn("#step3-sendemailcode", "正在发送");
            layer.closeAll();
            $.ajax({
                url: "/setting_email.do",
                type: "POST",
                data: {
                    action: "sendEmailCode",
                    email: $("#step3-email").val()
                },
                dataType: "json",
                timeout: 5000,
                success: function(res) {
                    layer.closeAll();
                    if (res.code == 100) {
                        layer.msg(res.msg, { icon: 1, time: 1500 });
                        timer2 = 60;
                        inter2 = setInterval(function() {
                            if (timer2 > 0) {
                                $("#step3-sendemailcode").html("重新发送(" + timer2 + ")");
                                timer2--
                            } else {
                                enableBtn("#step3-sendemailcode")
                            }
                        },
                        1000)
                    } else {
                        enableBtn("#step3-sendemailcode");
                        layer.msg(res.msg, { icon: 2, time: 1500 });
                    }
                },
                error: function() {
                    enableBtn("#step3-sendemailcode");
                    layer.msg("请求超时,请重试", { icon: 2, time: 1500 });
                }
            })
        },
        function() {})
    })

	$('#btn-step3-submit').click(function () {
        if(!$("#form-step3").validator("validate")){
            return false
        }
        disableBtn("#btn-step3-submit",'<i class="fa fa-spinner fa-spin fa-fw"></i> 正在提交')
        $.ajax({
            url: "/setting_email.do",
            type: 'POST',
            dataType: 'json',
    		timeout: 5000,
            data: {
                email: $("#step3-email").val(),
                emailcode: $("#step3-emailcode").val(),
                token: $("#token2").val(),
            },
            success: function (data) {
                if (data.code==100){
                    $("#btn-step3-submit").html("提交")
                    layer.msg(data.msg,{icon:1,time:1500})
        	    	setTimeout(function(){history.go(0)},1500)
                }else if(data.code==302){
                    location.href="login.html?url=setting_email.html"
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