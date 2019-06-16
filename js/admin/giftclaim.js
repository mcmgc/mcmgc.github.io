$(document).ready(function () {
    laydate.render({ 
  		elem: '#gift-time-start',
  		type: 'datetime',
        min: '2018-1-1 00:00:00',
        max: '2028-1-1 00:00:00'
	});
    laydate.render({ 
  		elem: '#gift-time-end',
  		type: 'datetime',
        min: '2018-1-1 00:00:00',
        max: '2028-1-1 00:00:00'
	});
    getGiftList()
});
function getGiftList(){
    disableBtn("#gift-search")
    disableBtn("#gift-delall")
    $("#loading").show()
    $.ajax({
        url: "/giftclaim.do?a=gs",
        type: "GET",
        dataType: "json",
        timeout: 5000,
        success: function(res){
            $("#loading").hide()
            cont = '<option value="all">全部</option>'
            for(i=0;i<res.length;i++){
                cont += '<option value="'+res[i].name+'">'+res[i].alias+'</option>'
            }
            $("#gift-name").html(cont)
            enableBtn("#gift-search")
            enableBtn("#gift-delall")
        },error: function(){
            layer.msg("礼包加载出错,5秒后重试",{icon: 2, time: 1500});
            setTimeout(function{getGiftList()},5000)
        }
    })
}
$('#giftlog').on( 'init.dt', function () {
    $("#loading").hide()
} );
$("#gift-search").click(function(){
    g_name = $("#gift-name").val()
    g_time_start = $("#gift-time-start").val()
    g_time_end = $("#gift-time-end").val()
    g_username = $("#gift-username").val()
    
    if(requesting)return
    clearTimeout(inter)
    $("#loading").show()
    requesting = true
    timeout = true
    var aurl = '/giftclaim.do?a=list'
    if(g_name!=undefined)aurl += '&n='+g_name
    if(g_time_start!=undefined)aurl += '&st='+g_time_start
    if(g_time_end!=undefined)aurl += '&et='+g_time_end
    if(g_username!=undefined)aurl += '&un='+g_username
    $('#giftlog').DataTable().destroy()
    $('#giftlog').DataTable({
    ajax: {
      url: aurl,
      dataSrc: 'log'
    },
    responsive: true,
    language: {
        "url": "//mcmg.cc/jslib/datatables/1.10.18/language/zh-cn.json"
    },
    ordering: false,
    columnDefs: [
      {
        targets: 0,
        data: 'name',
        title: '礼包名(显示名)',
        render: function (data, type, row, meta) {
          return data;
        }
      },
      {
        targets: 1,
        data: 'time',
        title: '领取时间',
        render: function (data, type, row, meta) {
          return data;
        }
      },
      {
        targets: 2,
        data: 'username',
        title: '领取者',
        render: function (data, type, row, meta) {
          return data;
        }
      },
      {
        targets: 3,
        data: 'm',
        title: '管理',
        render: function (data, type, row, meta) {
            return '<a href="javascript:void(0)" onclick="deleteLog(' + row.id + ')">删除</a>';
        }
      },
    ]
  });
})

$("#gift-delall").click(function(){
    g_name = $("#gift-name").val()
    g_time_start = $("#gift-time-start").val()
    g_time_end = $("#gift-time-end").val()
    g_username = $("#gift-username").val()
    
    layer.confirm("你确认要删除当前所有记录吗?",{title:"删除所有记录"},function(){
        layer.closeAll()
        $("#loading").show()
        var aurl = '/giftclaim.do?a=del'
        if(g_name!=undefined)aurl += '&n='+g_name
        if(g_time_start!=undefined)aurl += '&st='+g_time_start
        if(g_time_end!=undefined)aurl += '&et='+g_time_end
        if(g_username!=undefined)aurl += '&un='+g_username
        $.ajax({
            url: aurl,
            type: "GET",
            dataType: "json",
            timeout: 5000,
            success: function(res){
                $("#loading").hide()
                $("#gift-search").trigger("click")
            },
            error: function(){
                $("#loading").hide()
                setTimeout(function(){$("#gift-delall").trigger("click")},3000)
                layer.msg("发生错误,3秒后重试",{icon: 2, time: 1500});
            }
        })
    
        
})
function deleteLog(id){
    layer.confirm("你确认要删除该条记录吗?",{title:"删除单个记录"},function(){
        layer.closeAll()
        $("#loading").show()
        $.ajax({
            url: "/giftclaim.do?a=d",
            type: "POST",
            data: {id:id},
            dataType: "json",
            timeout: 5000,
            success: function(res){
                $("#loading").hide()
                if(res.code==100){
                    layer.msg(res.msg,{icon: 1, time: 1500});
                    $("#gift-search").trigger("click")
                }else{
                    layer.msg(res.msg,{icon: 2, time: 1500});
                }
            },
            error: function(){
                $("#loading").hide()
                layer.msg("发生错误,请重试",{icon: 2, time: 1500});
            }
        })
    })
}