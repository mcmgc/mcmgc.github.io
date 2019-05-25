$(document).ready(function () {
    loadGiftList()
})
$("#addgift").click(function(){
    $("#modal-gift-add").modal('show')
})
$("#addGiftSumbit").click(function(){
    layer.confirm("你确认要提交吗?",{title:"添加礼包"},function(){
        layer.closeAll()
        disableBtn("#addGiftSumbit","正在提交...")
        $.ajax({
            url: "/gift.do?a=a",
            type: "POST",
            data: {
                name:$("#ag-name").val(),
                alias:$("#ag-alias").val(),
                enable:$("#ag-enable").val(),
                introduction:$("#ag-introduction").val(),
                points:$("#ag-points").val()
            },
            dataType: "json",
            timeout: 5000,
            success: function(res){
                enableBtn("#addGiftSumbit")
                if(res.code!=100){
                  layer.msg(res.msg,{icon: 2, shade: 0.5, time: 1500});
                }else{
                  $("#modal-gift-add").modal('hide')
                  loadGiftList()
                  $("#modal-gift-add input").val("")
                }
            },
            error: function(){
                enableBtn("#addGiftSumbit")
                layer.msg("发生错误,请重试",{icon: 2, time: 1500});
            }
        })
    })
})
$("#addGiftReset").click(function(){
    layer.confirm("你确认要重置吗?",{title:"重置"},function(){
        layer.closeAll()
        $("#modal-gift-add input").val("")
    })
})


function loadGiftList(){
    $('#gifts').DataTable().destroy()
  $('#gifts').DataTable({
    ajax: {
      url: '/gift.do?a=list',
      dataSrc: ''
    },
    responsive: true,
    language: {
        "url": "//mygunclub.cn/static/vendor/datatables/1.10.18/language/zh-cn.json"
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
        data: 'name',
        title: '礼包名',
        render: function (data, type, row, meta) {
          return data;
        }
      },
      {
        targets: 2,
        data: 'alias',
        title: '显示名',
        render: function (data, type, row, meta) {
          return data;
        }
      },
      {
        targets: 3,
        data: 'status',
        title: '状态',
        render: function (data, type, row, meta) {
          if (data) return '<span class="green"><i class="fa fa-check fa-fw"></i></span>';
           else return '<span class="red"><i class="fa fa-times fa-fw"></i></span>';
        }
      },
      {
        targets: 4,
        data: 'm',
        title: '管理',
        render: function (data, type, row, meta) {
          return '<a href="javascript:void(0)" onclick="modifyGift(' + row.id + ')">管理</a>';;
        }
      },
    ]
  });
}
function modifyGift(id){
    $(".pinfos").html("")
    $("#modal-gift").modal('hide')
    layer.alert("正在加载礼包数据",{icon: 16, shade: 0.5, closeBtn: 0, title: 0, btn:[] });
    $.ajax({
        url: "/gift.do?a=p",
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
            $("#modal-gift").data('id',res.id)
            $(".h-id").html(res.id)
            $(".d-id").data("id",res.id)
            $(".h-name").html(res.name)
            $(".h-alias").html(res.alias)
            $(".h-enable").html(res.enable)
            $(".h-introduction").html(res.introduction)
            $(".h-points").html(res.points)
            gid = res.id 
            $("#v-name").editableInput({confirm:true,submit:function(value){
                $.post("/gift.do?a=v",{gid:gid,id:"name",val:value},function(res){
                    if(res.code!=100){
                        $("#v-name").editableInput('reset')
                    }
                },"json").error(function (xhr, status, info) {
      				layer.msg("发生错误,请重试",{icon: 2, time: 1500, shade: 0.5});
				});
            }})
            $("#v-alias").editableInput({confirm:true,submit:function(value){
                $.post("/gift.do?a=v",{gid:gid,id:"alias",val:value},function(res){
                    if(res.code!=100){
                        $("#v-alias").editableInput('reset')
                    }
                },"json").error(function (xhr, status, info) {
      				layer.msg("发生错误,请重试",{icon: 2, time: 1500, shade: 0.5});
				});
            }})
            $("#v-enable").editableSelector({confirm:true,options:[0,1],submit:function(value){
                $.post("/gift.do?a=v",{gid:gid,id:"enable",val:value},function(res){
                    if(res.code!=100){
                        $("#v-enable").editableSelector('reset')
                    }
                },"json").error(function (xhr, status, info) {
      				layer.msg("发生错误,请重试",{icon: 2, time: 1500, shade: 0.5});
				});
            }})
            $("#v-introduction").editableInput({confirm:true,submit:function(value){
                $.post("/gift.do?a=v",{gid:gid,id:"introduction",val:value},function(res){
                    if(res.code!=100){
                        $("#v-introduction").editableInput('reset')
                    }
                },"json").error(function (xhr, status, info) {
      				layer.msg("发生错误,请重试",{icon: 2, time: 1500, shade: 0.5});
				});
            }})
            $("#v-points").editableInput({confirm:true,submit:function(value){
                $.post("/gift.do?a=v",{gid:gid,id:"points",val:value},function(res){
                    if(res.code!=100){
                        $("#v-points").editableInput('reset')
                    }
                },"json").error(function (xhr, status, info) {
      				layer.msg("发生错误,请重试",{icon: 2, time: 1500, shade: 0.5});
				});
            }})
            $("#removeGift").unbind("click")
            $("#removeGift").click(function(){
                layer.confirm("你确认要删除礼包吗?",{title:"删除礼包"},function(){
                	$.post("/gift.do?a=v",{gid:gid,id:"delete"},function(res){
                        layer.closeAll()
                    	if(res.code==100){
                        	$("#modal-gift").modal('hide')
                        	loadGiftList()
                    	}else{
                            layer.msg(res.msg,{icon: 2, time: 1500})
                        }
                	},"json").error(function (xhr, status, info) {
                        layer.msg("发生错误,请重试",{icon: 2, time: 1500, shade: 0.5});
                    });
                },function(){})
            })
            
            $("#modal-gift").modal('show')
        }
    },error: function(){
          layer.msg("出现了一点小错误,请重试", {icon: 2, shade: 0.5, time: 1500});
        }
  })
}