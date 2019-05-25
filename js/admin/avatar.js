$(document).ready(function(){
    $(".verbtn").click(function(){
        timg = $(this).parent().find(".avatar-v").children("img")
        timg.attr("src",timg.data("src"))
    })
    $(".av-accept").click(function(){
        uid = $(this).data("uid")
        var thisbtn = this
        layer.confirm("你确定通过审核吗?",function(){
            layer.closeAll()
        	$(thisbtn).siblings(".av-deny").attr("disabled",true)
        	disableBtn(thisbtn,"正在提交")
        	$.ajax({
        		url: "/avatar.do",
        		type: "POST",
        		data: {action:"accept",uid:uid},
        		dataType: "json",
        		timeout: 5000,
        		success: function(res){
             		if(res.code==100){
                		$("#modal-"+uid).modal("hide")
                		layer.msg(res.msg,{icon: 1, shade: 0.5, time: 1500});
            			setTimeout(function(){history.go(0)},1500)
            		}else{
        				$(thisbtn).siblings(".av-deny").removeAttr("disabled")
        				enableBtn(thisbtn)
                		layer.msg(res.msg,{icon: 2, shade: 0.5, time: 1500});
            		}
    			},
        		error: function(){
        			$(thisbtn).siblings(".av-deny").removeAttr("disabled")
        			enableBtn(thisbtn)
        	    	layer.msg("发生错误,请重试",{icon: 2, time: 1500});
        		}
			})
    	})
    })
    $(".av-deny").click(function(){
        uid = $(this).data("uid")
        var thisbtn = this
        $("#modal-"+uid).modal("hide")
        layer.prompt({title:"请输入拒绝理由",btn:["提交","取消"],value:"违反规定"},function(val,i,el){
            layer.close(i)
    		layer.alert("正在提交",{icon: 16, shade: 0.5, closeBtn: 0, title: 0, btn:[] });
        	$.ajax({
        		url: "/avatar.do",
        		type: "POST",
        		data: {action:"deny",uid:uid},
        		dataType: "json",
        		timeout: 5000,
        		success: function(res){
                    layer.closeAll()
             		if(res.code==100){
                		layer.msg(res.msg,{icon: 1, shade: 0.5, time: 1500});
            			setTimeout(function(){history.go(0)},1500)
            		}else{
                		layer.msg(res.msg,{icon: 2, shade: 0.5, time: 1500});
            		}
    			},
        		error: function(){
        			$(thisbtn).siblings(".av-accept").removeAttr("disabled")
        			enableBtn(thisbtn)
        	    	layer.msg("发生错误,请重试",{icon: 2, time: 1500});
        		}
			})
        },function(){
        	$("#modal-"+uid).modal("show")
        })
    })
})