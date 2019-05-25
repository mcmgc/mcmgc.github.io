$("#top-global").click(function(){
    $.post("/action/thread.bbs",{tid:$("#tid").val(),action:"top",level:2},function(res){
        if(res.code==100) layer.msg(res.msg,{icon: 1, time: 1500, shade: 0.5});
        else layer.msg(res.msg,{icon: 2, time: 1500, shade: 0.5});
        if(res.code==100) setTimeout(function(){history.go(0)},1500) 
    },"json").error(function (xhr, status, info) {
      	layer.msg("发生错误,请重试",{icon: 2, time: 1500, shade: 0.5});
	});
})
$("#top-forum").click(function(){
    $.post("/action/thread.bbs",{tid:$("#tid").val(),action:"top",level:1},function(res){
        if(res.code==100) layer.msg(res.msg,{icon: 1, time: 1500, shade: 0.5});
        else layer.msg(res.msg,{icon: 2, time: 1500, shade: 0.5});
        if(res.code==100) setTimeout(function(){history.go(0)},1500) 
    },"json").error(function (xhr, status, info) {
      	layer.msg("发生错误,请重试",{icon: 2, time: 1500, shade: 0.5});
	});
})
$("#top-no").click(function(){
    $.post("/action/thread.bbs",{tid:$("#tid").val(),action:"top",level:0},function(res){
        if(res.code==100) layer.msg(res.msg,{icon: 1, time: 1500, shade: 0.5});
        else layer.msg(res.msg,{icon: 2, time: 1500, shade: 0.5});
        if(res.code==100) setTimeout(function(){history.go(0)},1500) 
    },"json").error(function (xhr, status, info) {
      	layer.msg("发生错误,请重试",{icon: 2, time: 1500, shade: 0.5});
	});
})
$("#hidden-hide").click(function(){
    $.post("/action/thread.bbs",{tid:$("#tid").val(),action:"hide"},function(res){
        if(res.code==100) layer.msg(res.msg,{icon: 1, time: 1500, shade: 0.5});
        else layer.msg(res.msg,{icon: 2, time: 1500, shade: 0.5});
        if(res.code==100) setTimeout(function(){history.go(0)},1500) 
    },"json").error(function (xhr, status, info) {
      	layer.msg("发生错误,请重试",{icon: 2, time: 1500, shade: 0.5});
	});
})
$("#hidden-show").click(function(){
    $.post("/action/thread.bbs",{tid:$("#tid").val(),action:"show"},function(res){
        if(res.code==100) layer.msg(res.msg,{icon: 1, time: 1500, shade: 0.5});
        else layer.msg(res.msg,{icon: 2, time: 1500, shade: 0.5});
        if(res.code==100) setTimeout(function(){history.go(0)},1500) 
    },"json").error(function (xhr, status, info) {
      	layer.msg("发生错误,请重试",{icon: 2, time: 1500, shade: 0.5});
	});
})
$("#hidden-delete").click(function(){
    layer.confirm('你确定要删除该帖子吗?(无法恢复)', {title: "删除确认",btn: ['确认','取消'],}, function(){
  	$.post("/action/thread.bbs",{tid:$("#tid").val(),action:"delete"},function(res){
       if(res.code==100) layer.msg(res.msg,{icon: 1, time: 1500, shade: 0.5});
        else layer.msg(res.msg,{icon: 2, time: 1500, shade: 0.5});
        if(res.code==100) setTimeout(function(){history.go(0)},1500) 
    },"json").error(function (xhr, status, info) {
      	layer.msg("发生错误,请重试",{icon: 2, time: 1500, shade: 0.5});
	});
    }, function(){ });
})
$("#replyset-all").click(function(){
    $.post("/action/thread.bbs",{tid:$("#tid").val(),action:"replyset-all"},function(res){
        if(res.code==100) layer.msg(res.msg,{icon: 1, time: 1500, shade: 0.5});
        else layer.msg(res.msg,{icon: 2, time: 1500, shade: 0.5});
        if(res.code==100) setTimeout(function(){history.go(0)},1500) 
    },"json").error(function (xhr, status, info) {
      	layer.msg("发生错误,请重试",{icon: 2, time: 1500, shade: 0.5});
	});
})
$("#replyset-admin").click(function(){
    $.post("/action/thread.bbs",{tid:$("#tid").val(),action:"replyset-admin"},function(res){
        if(res.code==100) layer.msg(res.msg,{icon: 1, time: 1500, shade: 0.5});
        else layer.msg(res.msg,{icon: 2, time: 1500, shade: 0.5});
        if(res.code==100) setTimeout(function(){history.go(0)},1500) 
    },"json").error(function (xhr, status, info) {
      	layer.msg("发生错误,请重试",{icon: 2, time: 1500, shade: 0.5});
	});
})

$("#tool-moveto").click(function(){
    cont='<select id="moveto-list" class="form-control">'
    for(i=0;i<plist.length;i++){
        cont+='<option value="'+plist[i].pid+'">'+plist[i].name+'</option>'
    }
    cont+='</select>';
    layer.confirm(cont,
    	{title:"移动帖子到",btn:["移动","取消"]},
        function(){
        	$.post("/action/thread.bbs",{tid:$("#tid").val(),action:"moveto",pid:$("#moveto-list").val()},function(res){
        		if(res.code==100) layer.msg(res.msg,{icon: 1, time: 1500, shade: 0.5});
        		else layer.msg(res.msg,{icon: 2, time: 1500, shade: 0.5});
        		if(res.code==100) setTimeout(function(){history.go(0)},1500) 
    		},"json").error(function (xhr, status, info) {
      			layer.msg("发生错误,请重试",{icon: 2, time: 1500, shade: 0.5});
			});
        	layer.closeAll()
   		},
        function(){
        	layer.closeAll()
        }
    );
})
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
        disableBtn("#btn-submit",'<i class="fa fa-spinner fa-spin fa-fw"></i> 正在评论')
        $.ajax({
            url: "/action/reply.bbs",
            type: 'POST',
            dataType: 'json',
    		timeout: 5000,
            data: {
                tid: $("#tid").val(),
                content:$("#comment-content").html(),
                gt_challenge: result.geetest_challenge,
                gt_validate: result.geetest_validate,
                gt_seccode: result.geetest_seccode
            },
            success: function (data) {
                if (data.code==100){
                    enableBtn("#btn-submit")
                    layer.msg(data.msg,{icon:1,time:1500})
                    setTimeout(function(){history.go(0)},1500)
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
                layer.msg("提交评论时发生错误,请重试",{icon:2,time:1500})
                captchaObj.reset();
            }
        });
    })
    $('#btn-submit').click(function () {
        if($("#comment-content").html()==""){
            layer.msg("请输入评论内容",{icon: 2, time: 1500});
            return
        }
        var cnt = wordCount($("#comment-content").html(),1)
        if((cnt<10)||(cnt>150)){
            layer.msg("评论内容字数限制: 10-150",{icon: 2, time: 1500});
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


$(document).ready(function(){
    $("img.lazyload").lazyload();
 	loadCaptcha()
 	$(".t-content").find("a").each(function(i,elem){
 	    var link=$(this).attr("href")
 	    $(this).attr("href","/url.html?url="+link)
 	})
})

$(document).keyup(function(event){
    if(event.keyCode==13)
        $("#scBtn").trigger("click")
})