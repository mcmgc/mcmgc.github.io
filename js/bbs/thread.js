
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
        disableBtn("#btn-reply",'<i class="fa fa-spinner fa-spin fa-fw"></i> 发表评论')
        $.ajax({
            url: "/action/reply.bbs",
            type: 'POST',
            dataType: 'json',
    		timeout: 5000,
            data: {
                tid: $("#tid").html(),
                content:$("#replytxt").val(),
                gt_challenge: result.geetest_challenge,
                gt_validate: result.geetest_validate,
                gt_seccode: result.geetest_seccode
            },
            success: function (data) {
                if (data.code==100){
                    enableBtn("#btn-reply")
                    layer.msg(data.msg,{icon:1,time:1500})
                    setTimeout(function(){history.go(0)},1500)
                }else if(data.code==201){
                    enableBtn("#btn-reply")
                    layer.msg("安全验证失败,请重试",{icon: 2, time: 1500});
                    captchaObj.reset();
                }else{
                    enableBtn("#btn-reply")
                    layer.msg(data.msg,{icon:2,time:1500})
                    captchaObj.reset();
                }
            },
            error: function(){
                enableBtn("#btn-reply")
                layer.msg("发表评论时发生错误,请重试",{icon:2,time:1500})
                captchaObj.reset();
            }
        });
    })
    $('#btn-reply').click(function () {
        if(!checkReply()){
            layer.msg("评论字数不符合规定",{icon: 2, time: 1500});
            return
        }
        captchaObj.verify();
    })
    window.gt = captchaObj;
};
function loadCaptcha(){
    $.ajax({
        url: "/action/captcha.action",
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
    var c = wordCount($("#replytxt").val(),1)
    $("#wordCount").html(500-c)
    return c<=500 && c>0;
}
$(document).ready(function(){
    loadCaptcha();
    $("#replytxt").on('change',checkReply)
    $("#replytxt").on('keyup',checkReply)
    $("#replytxt").on('mouseup',checkReply)
})
$(document).keyup(function(event){
    if(event.keyCode==13)
        $("#btn-reply").trigger("click")
})
function admin_tool(tid){
    layer.open({
        type: 2,
        title: '管理工具',
        shadeClose: false,
        area: ['400px', '300px'],
        content: '/bbs/admin?tid='+tid
    }); 
}
function removeReply(rid){
    layer.confirm("你确认删除这条评论吗?",{title:'删除确认?'},function(){
        layer.closeAll()
        layer.load(1,{shade: 0.3});
        $.ajax({
            url: "/action/reply.bbs",
            type: 'POST',
            dataType: 'json',
            timeout: 5000,
            data: {
                action: 'remove',
                rid: rid
            },
            success: function (data) {
                if (data.code==100){
                    layer.closeAll("loading");
                    layer.msg(data.msg,{icon:1,time:1500})
                    setTimeout(function(){history.go(0)},1500)
                }else{
                    layer.closeAll("loading");
                    layer.msg(data.msg,{icon:2,time:1500})
                    captchaObj.reset();
                }
            },
            error: function(){
                layer.closeAll("loading");
                layer.msg("删除评论时发生错误,请重试",{icon:2,time:1500})
                captchaObj.reset();
            }
        });
    },function(){})
}