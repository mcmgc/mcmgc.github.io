$('#msg-table .msg-select-all').iCheck({
    checkboxClass: 'icheckbox_minimal-blue',
});
$("#msg-table .msg-select-all").on('ifChecked',function(){
    $("#msg-table .msg-select").iCheck("check")
    $("#msg-table .msg-select-all").iCheck("check")
    enableBtn("#msg-act-del")
    enableBtn("#msg-act-read")
})
$("#msg-table .msg-select-all").on('ifUnchecked',function(){
    $("#msg-table .msg-select").iCheck("uncheck")
    $("#msg-table .msg-select-all").iCheck("uncheck")
    if(isSelectNone()){
        disableBtn("#msg-act-del")
        disableBtn("#msg-act-read")
    }
})
$(document).ready(function(){
    loadMsg(1)
    Pagination.init($("#msg-table .msg-pagination"), pageChange);
})
function isSelectAll(){
    var re = true
    $("#msg-table .msg-select").each(function(){
        if(!$(this).is(":checked")){re=false;return false;}
    })
    return re
}
function isSelectNone(){
    var re = true
    $("#msg-table .msg-select").each(function(){
        if($(this).is(":checked")){re=false;return false;}
    })
    return re
}
var totalNum, numPage, currentPage
function loadMsg(page){
    if(page===undefined)page=1
    if(page<1)page=1
    $("#msg-table .msg-select").iCheck('destroy');
    $("#loading").show()
    $("#msgs").hide()
    $.ajax({
        url: "/message.do",
        type: "POST",
        data: {action:"get",page:page},
        dataType: "json",
        timeout: 5000,
        success: function(res){
        layer.closeAll()
        if(res.code!=100){
            layer.msg(res.msg,{icon: 2, time: 1500});
            setTimeout(function(){loadMsg(res.page)},5000)
        }else{
            $("#loading").hide()
    		$("#msgs").show()
        	disableBtn("#msg-act-del")
        	disableBtn("#msg-act-read")
            $("#msg-table .msg-select-all").iCheck("uncheck")
            if(res.count==0){
            	$("#msg-table tbody").html("")
                $("#msg-table #no-msg").show()
                $("#msg-table #has-msg").hide()
            }else{
                $("#msg-table #no-msg").hide()
                $("#msg-table #has-msg").show()
                
            	totalNum = res.nums
            	numPage = res.num
            	currentPage = res.page
            	Pagination.Page($("#msg-table .msg-pagination"), currentPage-1, totalNum, numPage);
            	var cont = ""
        		for(i=0;i<res.count;i++){
            	    nms = res.msgs[i]
            	    if(nms.isread=="1")unread="";else unread=" unread";
            	    cont+='<tr><td><input type="checkbox" class="msg-select" data-id="'+nms.mid+'"></td>'
                    cont+='<td><a href="javascript:void(0)" class="msg-title'+unread+'" onclick="showMsg('+nms.mid+')" mid="'+nms.mid+'">'+nms.title+'</a></td><td class="msg-time">'+nms.time+'</td></tr>'
            	}
            	$("#msg-table tbody").html(cont)
            	$('#msg-table .msg-select').iCheck({
        			checkboxClass: 'icheckbox_minimal-blue',
   	 			});
            	$("#msg-table .msg-select").on('ifChecked',function(){
    				enableBtn("#msg-act-del")
    				enableBtn("#msg-act-read")
                    if(isSelectAll())
    					$("#msg-table .msg-select-all").iCheck("check")
                        
				})
				$("#msg-table .msg-select").on('ifUnchecked',function(){
    				$("#msg-table .msg-select-all").iCheck("uncheck")
    				if(isSelectNone()){
    				    disableBtn("#msg-act-del")
    				    disableBtn("#msg-act-read")
    				}
				})
            }
        }
    	},
        error: function(){
            layer.msg("消息加载出错",{icon:2,time: 1500})
            setTimeout(function(){loadMsg(page)},1500)
        }
    })
}
function pageChange(i) {
    if(currentPage==i+1)return;
    loadMsg(i+1)
}
$("#msg-act-del").click(function(){
    var ar = new Array()
    $("#msg-table .msg-select").each(function(i,val){
    	if($(this).is(":checked"))ar.push($(this).data("id"))
    })
    if(ar.length==0){layer.msg("你没有选择任何消息");return;}
    layer.confirm("你确定要删除选中的"+(ar.length)+"条消息吗?",{btn:["确定","取消"],title:"删除消息",icon:0},function(){
        layer.closeAll()
        layer.alert("正在删除选中消息",{time:5000,icon: 16,shade:0.5,btn:[],title:"",closeBtn:false})
        $.ajax({
        	url: "/message.do",
        	type: "POST",
        	data: {action:"delmsg",list:ar},
        	dataType: "json",
        	timeout: 5000,
        	success: function(res){
        		layer.closeAll()
        		if(res.code!=100){
            		layer.msg(res.msg,{icon: 2, time: 1500});
        		}else{
            		loadMsg(currentPage)
        		}
    		},
        	error: function(){
        		layer.closeAll()
            	layer.msg("删除选中消息时发生错误",{icon:2,time: 1500})
        	}
    	})
    },function(){})
})
$("#msg-act-read").click(function(){
    var ar = new Array()
    $("#msg-table .msg-select").each(function(i,val){
    	if($(this).is(":checked"))ar.push($(this).data("id"))
    })
    if(ar.length==0){layer.msg("你没有选择任何消息");return;}
    layer.confirm("你确定要标记选中的"+(ar.length)+"条消息为已读吗?",{btn:["确定","取消"],title:"标记已读",icon:0},function(){
        layer.closeAll()
        layer.alert("正在标记选中消息为已读",{time:5000,icon: 16,shade:0.5,btn:[],title:"",closeBtn:false})
        $.ajax({
        	url: "/message.do",
        	type: "POST",
        	data: {action:"readmsg",list:ar},
        	dataType: "json",
        	timeout: 5000,
        	success: function(res){
        		layer.closeAll()
        		if(res.code!=100){
            		layer.msg(res.msg,{icon: 2, time: 1500});
        		}else{
            		$("#msg-table .msg-select:checked").find(".unread").removeClass("unread")
        		}
    		},
        	error: function(){
        		layer.closeAll()
            	layer.msg("标记选中消息为已读时发生错误",{icon:2,time: 1500})
        	}
    	})
    },function(){})
})
$("#msg-act-readall").click(function(){
    layer.confirm("你确定要标记全部消息为已读吗?",{btn:["确定","取消"],title:"全部已读",icon:0},function(){
        layer.closeAll()
        layer.alert("正在标记全部消息为已读",{time:5000,icon: 16,shade:0.5,btn:[],title:"",closeBtn:false})
        $.ajax({
        	url: "/action/message.action",
        	type: "POST",
        	data: {action:"readall"},
        	dataType: "json",
        	timeout: 5000,
        	success: function(res){
        		layer.closeAll()
        		if(res.code!=100){
            		layer.msg(res.msg,{icon: 2, time: 1500});
        		}else{
            		$(".unread").removeClass("unread")
        		}
    		},
        	error: function(){
        		layer.closeAll()
            	layer.msg("标记全部消息为已读时发生错误",{icon:2,time: 1500})
        	}
    	})
        
    },function(){})
})
function showMsg(id){
    layer.alert("正在加载消息",{time:5000,icon: 16,shade:0.5,btn:[],title:"",closeBtn:false})
    $.ajax({
        url: "/message.do",
        type: "POST",
        data: {action:"read",mid:id},
        dataType: "json",
        timeout: 5000,
        success: function(res){
        	layer.closeAll()
        	if(res.code!=100){
           		layer.msg(res.msg,{icon: 2, time: 1500});
        	}else{
           		$(".msg-title[mid="+id+"]").removeClass("unread")
                ms=res.msg
                layer.open({
            		type: 1,
            		title: "消息查看",
            		shadeClose: true,
            		shade: 0.3,
            		area: ["600px","400px"],
            		content: '<div class="ms-title">'+ms.title+'</div><div class="ms-info">来自:'+ms.sender+' 时间:'+ms.time+'</div><hr class="ms-hr"><div class="ms-content">'+ms.content+'</div>'
        		});
        	}
    	},
        error: function(){
        	layer.closeAll()
           	layer.msg("加载消息时发生错误",{icon:2,time: 1500})
        }
    })
}