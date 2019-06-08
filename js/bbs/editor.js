var olddata;
$(document).ready(function(){
    UE.getEditor('thread-content')
    ac = UE.getEditor('thread-content').execCommand("getlocaldata")
    if(ac!=undefined && ac!=""){
        $("#thread-recover").show()
        olddata = ac
    }
    $(window).resize()
    loadCaptcha()
    UE.getEditor('thread-content').ready(function(){
        $("#page-loading").fadeOut(800)
        $("#page-main").fadeIn(1200)
    })
    
})
function recoverContent(){
    layer.confirm("你确认要恢复内容吗?当前已编辑的内容将会丢失!\n以下为将要恢复的内容:\n"+olddata, {title: "确认",btn: ['确认','取消'],}, function(){
  		UE.getEditor('thread-content').setContent(olddata,false)
    	UE.getEditor('thread-content').execCommand("clearlocaldata");
    	$("#thread-recover").hide()
        layer.closeAll();
    }, function(){ layer.closeAll()});
}
var handler = function (captchaObj) {
    captchaObj.onSuccess(function () {
        var result = captchaObj.getValidate();
        if (!result) {
            layer.msg("请完成安全验证",{icon: 2, time: 1500});
            return false
        }
        disableBtn("#btn-submit",'<i class="fa fa-spinner fa-spin fa-fw"></i> 正在提交')
        $.ajax({
            url: "/action/editor.bbs",
            type: 'POST',
            dataType: 'json',
    		timeout: 5000,
            data: {
                act: $("#act").val(),
                pid: $("#pid").val(),
                tid: $("#tid").val(),
                atitle:$("#thread-title").val(),
                acontent:UE.getEditor('thread-content').getContent(),
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
        if(!$("#thread-form").validator("validate")){
            return false
        }
        if(!UE.getEditor('thread-content').hasContents()){
            layer.msg("请输入正文内容",{icon: 2, time: 1500, shade: 0.5});
            return
        }
    	var ac = UE.getEditor('thread-content').getPlainTxt()
        if(ac.length<20){
            layer.msg("正文内容不能小于20字",{icon: 2, time: 1500, shade: 0.5});
            return
        }
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