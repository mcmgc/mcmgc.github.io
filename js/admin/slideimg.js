$(document).ready(function () {
    loadImgList()
})
$("#addslide").click(function(){
    $("#modal-slideimg-add").modal('show')
})
$("#addSlideSumbit").click(function(){
    layer.confirm("你确认要提交吗?",{title:"添加图片"},function(){
        layer.closeAll()
        disableBtn("#addSlideSumbit","正在提交...")
        $.ajax({
          url: "/slide.do?a=a",
          type: "POST",
          data: {img:$("#ag-img").val(),link:$("#ag-link").val(),enable:$("#ag-enable").val(),title:$("#ag-title").val()},
          dataType: "json",
          timeout: 5000,
          success: function(res){
    	       enableBtn("#addSlideSumbit")
            if(res.code!=100){
              layer.msg(res.msg,{icon: 2, shade: 0.5, time: 1500});
            }else{
              $("#modal-gift-add").modal('hide')
              loadImgList()
              $("#modal-gift-add input").val("")
            }
          },
          error: function(){
              layer.msg("发生错误,请重试",{icon: 2, time: 1500});
          }
        })
    },function(){})
})
$("#addSlideReset").click(function(){
    layer.confirm("你确认要重置吗?",{title:"重置"},function(){
        layer.closeAll()
    	 $("#modal-slideimg-add input").val("")
    })
})


function loadImgList(){
  $('#slides').DataTable().destroy()
  $('#slides').DataTable({
    ajax: {
      url: '/slide.do?a=list',
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
        data: 'img',
        title: '图片',
        render: function (data, type, row, meta) {
          return data;
        }
      },
      {
        targets: 2,
        data: 'link',
        title: '链接',
        render: function (data, type, row, meta) {
          return data;
        }
      },
        {
        targets: 3,
        data: 'title',
        title: '标题',
        render: function (data, type, row, meta) {
          return data;
        }
      },
      {
        targets: 4,
        data: 'enable',
        title: '启用',
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
          return '<a href="javascript:void(0)" onclick="modifySlide(' + row.id + ')">管理</a>';;
        }
      },
    ]
  });
}
function modifySlide(id){
    $(".pinfos").html("")
    $("#modal-slide").modal('hide')
    layer.alert("正在加载图片数据",{icon: 16, shade: 0.5, closeBtn: 0, title: 0, btn:[] });
    $.ajax({
      url: "/slide.do?a=p",
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
            $("#modal-slide").data('id',res.id)
            $(".h-id").html(res.id)
            $(".d-id").data("id",res.id)
            $(".h-img").html(res.img)
            $(".h-link").html(res.link)
            $(".h-title").html(res.title)
            $(".h-enable").html(res.enable)
            gid = res.id 
            $("#v-img").editableInput({confirm:true,submit:function(value){
                $.post("/slide.do?a=v",{gid:gid,id:"img",val:value},function(res){
                    if(res.code!=100){
                        $("#v-img").editableInput('reset')
                    }
                },"json").error(function (xhr, status, info) {
      				layer.msg("发生错误,请重试",{icon: 2, time: 1500, shade: 0.5});
				});
            }})
            $("#v-link").editableInput({confirm:true,submit:function(value){
                $.post("/slide.do?a=v",{gid:gid,id:"link",val:value},function(res){
                    if(res.code!=100){
                        $("#v-link").editableInput('reset')
                    }
                },"json").error(function (xhr, status, info) {
      				layer.msg("发生错误,请重试",{icon: 2, time: 1500, shade: 0.5});
				});
            }})
            $("#v-enable").editableSelector({confirm:true,options:[0,1],submit:function(value){
                $.post("/slide.do?a=v",{gid:gid,id:"enable",val:value},function(res){
                    if(res.code!=100){
                        $("#v-enable").editableSelector('reset')
                    }
                },"json").error(function (xhr, status, info) {
      				layer.msg("发生错误,请重试",{icon: 2, time: 1500, shade: 0.5});
				});
            }})
            $("#v-title").editableInput({confirm:true,submit:function(value){
                $.post("/slide.do?a=v",{gid:gid,id:"title",val:value},function(res){
                    if(res.code!=100){
                        $("#v-title").editableInput('reset')
                    }
                },"json").error(function (xhr, status, info) {
      				layer.msg("发生错误,请重试",{icon: 2, time: 1500, shade: 0.5});
				});
            }})
            $("#removeSlide").unbind("click")
            $("#removeSlide").click(function(){
                layer.confirm("你确认要删除图片吗?",{title:"删除图片"},function(){
                	$.post("/slide.do?a=v",{gid:gid,id:"delete"},function(res){
                        layer.closeAll()
                    	if(res.code==100){
                        	$("#modal-gift").modal('hide')
                        	loadImgList()
                    	}else{
                            layer.msg(res.msg,{icon: 2, time: 1500})
                        }
                	},"json").error(function (xhr, status, info) {
      					layer.msg("发生错误,请重试",{icon: 2, time: 1500, shade: 0.5});
					});
                },function(){})
            })
            
            $("#modal-slide").modal('show')
        }
    },error: function(){
              layer.msg("发生错误,请重试",{icon: 2, time: 1500});
          }
        })
}