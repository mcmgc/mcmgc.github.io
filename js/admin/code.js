$(document).ready(function () {
    loadCodeList()
})
$("#addcode").click(function(){
    $("#modal-code-add").modal('show')
})
$("#addCodeSumbit").click(function() {
    layer.confirm("你确认要提交吗?", {title: "生成激活码"}, function() {
        layer.closeAll();
        disableBtn("#addCodeSumbit","正在提交...") 
        $.ajax({
            url: "/code.do?a=a",
        	type: "POST",
        	data: {env: $("#ag-env").val(), content: $("#ag-content").val(), num: $("#ag-num").val()},
        	dataType: "json",
        	timeout: 5000,
        	success: function(res){
                enableBtn("#addCodeSumbit")
                if (res.code != 100) {
                	layer.msg(res.msg, {icon: 2, shade: 0.5, time: 1500});
            	} else {
                	$("#modal-code-add").modal('hide') 
                    loadCodeList()
                    $("#modal-code-add input").val("")
            	}
        	},error: function(){
                layer.msg("出现了一点小错误,请重试", {icon: 2, shade: 0.5, time: 1500});
            }
        })
    })
})
$("#addCodeReset").click(function(){
    layer.confirm("你确认要重置吗?",{title:"重置"},function(){
        layer.closeAll()
    	$("#modal-code-add input").val("")
    })
})


$("#delcode").click(function(){
    $("#modal-code-del").modal('show')
})
$("#delCodeSumbit").click(function(){
    layer.confirm("你确认要提交吗?",{title:"删除激活码"},function(){
    	layer.closeAll()
    	disableBtn("#delCodeSumbit","正在提交...")
        $.ajax({
            url: "/code.do?a=de",
        	type: "POST",
        	data: {env:$("#de-env").val(),content:$("#de-content").val()},
        	dataType: "json",
        	timeout: 5000,
        	success: function(res){
    			enableBtn("#delCodeSumbit")
        		if(res.code!=100){
            		layer.msg(res.msg,{icon: 2, shade: 0.5, time: 1500});
        		}else{
            		$("#modal-code-del").modal('hide')
            		loadCodeList()
            		$("#modal-code-del input").val("")
        		}
    		},error: function(){
                layer.msg("出现了一点小错误,请重试", {icon: 2, shade: 0.5, time: 1500});
            }
        })
    })
})
$("#delCodeReset").click(function(){
    layer.confirm("你确认要重置吗?",{title:"重置"},function(){
        layer.closeAll()
    	$("#modal-code-del input").val("")
    })
})

function loadCodeList(){
  $('#codes').DataTable().destroy()
  $('#codes').DataTable({
    ajax: {
      url: '/code.do?a=list',
      dataSrc: ''
    },
    responsive: true,
    language: {
        "url": "//mcmg.cc/jslib/datatables/1.10.18/language/zh-cn.json"
    },
    ordering: false,
    columnDefs: [
      {
        targets: 0,
        data: 'id',
        title: 'ID',
        render: function (data, type, row, meta) {
          return data;
        }
      },
      {
        targets: 1,
        data: 'env',
        title: '环境',
        render: function (data, type, row, meta) {
          return data;
        }
      },
      {
        targets: 2,
        data: 'code',
        title: '激活码',
        render: function (data, type, row, meta) {
          return data;
        }
      },
      {
        targets: 3,
        data: 'content',
        title: '内容',
        render: function (data, type, row, meta) {
          return data;
        }
      },
      {
        targets: 4,
        data: 'used',
        title: '已使用',
        render: function (data, type, row, meta) {
          if (data) return '<span class="green"><i class="fa fa-check fa-fw"></i></span>';
           else return '<span class="red"><i class="fa fa-times fa-fw"></i></span>';
        }
      },
      {
        targets: 5,
        data: 'm',
        title: '管理',
        render: function (data, type, row, meta) {
          return '<a href="javascript:void(0)" onclick="modifyCode(' + row.id + ')">管理</a>';
        }
      },
    ]
  });
}
function modifyCode(id){
    $(".pinfos").html("")
    $("#modal-code").modal('hide')
    layer.alert("正在加载激活码数据",{icon: 16, shade: 0.5, closeBtn: 0, title: 0, btn:[] });
    $.ajax({
        url: "/code.do?a=p",
        type: "POST",
        data: {id:id},
        dataType: "json",
        timeout: 5000,
        success: function(res){
        layer.closeAll()
        if(res.code!=100){
            layer.msg(res.msg,{icon: 2, shade: 0.5, time: 1500});
        }else{
            $("#msgModal").hide()
            $("#modal-code").data('id',res.id)
            $(".h-id").html(res.id)
            $(".d-id").data("id",res.id)
            $(".h-env").html(res.env)
            $(".h-code").html(res.ccode)
            $(".h-content").html(res.content)
            $(".h-used").html(res.used)
            gid = res.id 
            $("#v-env").editableInput({confirm:true,submit:function(value){
                $.post("/code.do?a=v",{gid:gid,id:"env",val:value},function(res){
                    if(res.code!=100){
                        $("#v-env").editableInput('reset')
                    }
                },"json")
            }})
            $("#v-code").editableInput({confirm:true,submit:function(value){
                $.post("/code.do?a=v",{gid:gid,id:"code",val:value},function(res){
                    if(res.code!=100){
                        $("#v-alias").editableInput('reset')
                    }
                },"json")
            }})
            $("#v-used").editableSelector({confirm:true,options:[0,1],submit:function(value){
                $.post("/code.do?a=v",{gid:gid,id:"used",val:value},function(res){
                    if(res.code!=100){
                        $("#v-used").editableSelector('reset')
                    }
                },"json")
            }})
            $("#v-content").editableInput({confirm:true,submit:function(value){
                $.post("/code.do?a=v",{gid:gid,id:"content",val:value},function(res){
                    if(res.code!=100){
                        $("#v-content").editableInput('reset')
                    }
                },"json")
            }})
            $("#removeCode").unbind("click")
            $("#removeCode").click(function(){
                layer.confirm("你确认要删除激活码吗?",{title:"删除激活码"},function(){
                    $.post("/code.do?a=v",{gid:gid,id:"delete"},function(res){
                        layer.closeAll()
                    	if(res.code==100){
                        	$("#modal-code").modal('hide')
                        	loadCodeList()
                    	}else{
                            layer.msg(res.msg,{icon: 2, time: 1500})
                        }
                	},"json")
                },function(){})
                
            })
            
            $("#modal-code").modal('show')
        }
    },error: function(){
                layer.msg("出现了一点小错误,请重试", {icon: 2, shade: 0.5, time: 1500});
            }
        })
}