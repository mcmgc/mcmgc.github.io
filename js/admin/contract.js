var acon
$(document).ready(function () {
    loadContractList()
    UE.getEditor('c-content')
})
function loadContractList(){
    $('#contracts').DataTable().destroy()
  $('#contracts').DataTable({
    ajax: {
      url: '/contract.do?a=list',
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
        data: 'name',
        title: '协议名',
        render: function (data, type, row, meta) {
          return data;
        }
      },
      {
        targets: 2,
        data: 'title',
        title: '标题',
        render: function (data, type, row, meta) {
          return data;
        }
      },
      {
        targets: 3,
        data: 'm',
        title: '管理',
        render: function (data, type, row, meta) {
          return '<a href="javascript:void(0)" onclick="editContract(' + row.id + ')">编辑</a> '+
          '<a href="//mygunclub.cn/contract/' + row.name + '.html" target="_blank">预览</a>';
        }
      },
    ]
  });
}

function editContract(id){
	layer.alert("正在加载协议",{time:5000,icon: 16,btn:[],title:"",closeBtn:false})
    $.ajax({
        url: "/contract.do?a=p",
        type: "POST",
        data: {id:id},
        dataType: "json",
        timeout: 5000,
        success: function(res){
        	layer.closeAll()
        	if(res.code!=100){
           		layer.msg(res.msg,{icon: 2, time: 1500});
        	}else{
            	$("#c-id").val(res.id)
            	$("#c-name").val(res.name)
            	$("#c-title").val(res.title)
            	acon=res.content
  				UE.getEditor('c-content').setContent(acon,false)
            	$("#modal-contract").modal('show')
        	}
    	},
        error: function(){
        	layer.closeAll()
           	layer.msg("加载协议时发生错误",{icon:2,time: 1500})
        }
    })
}
$("#addcontract").click(function(){
	$("#c-id").val(0)
    $("#c-name").val("")
    $("#c-title").val("")
    UE.getEditor('c-content').setContent("",false)
	$("#modal-contract").modal('show')
})
$("#btn-submit").click(function(){
    layer.confirm("你确认要提交吗?",{title:"编辑协议"},function(){
        layer.closeAll()
        disableBtn("#btn-submit","正在提交...")
        $.ajax({
            url: "/contract.do?a=v",
            type: "POST",
            data: {
                id:$("#c-id").val(),
                name:$("#c-name").val(),
                title:$("#c-title").val(),
                content:UE.getEditor('c-content').getContent()
            },
            dataType: "json",
            timeout: 5000,
            success: function(res){
                enableBtn("#btn-submit")
                if(res.code!=100){
                  layer.msg(res.msg,{icon: 2, shade: 0.5, time: 1500});
                }else{
                  $("#modal-contract").modal('hide')
                  loadContractList()
                }
            },
            error: function(){
                enableBtn("#btn-submit")
                layer.msg("发生错误,请重试",{icon: 2, time: 1500});
            }
        })
    })
})