var requesting = false, timeout = false
var inter
$(document).ready(function () {
  $('#users').DataTable({
    ajax: {
      url: '/user.do?a=list',
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
        data: 'uid',
        title: 'UID',
        render: function (data, type, row, meta) {
          return data;
        }
      },
      {
        targets: 1,
        data: 'username',
        title: '用户名',
        render: function (data, type, row, meta) {
          return '<a href="javascript:void(0)" onclick="modifyPlayer(' + row.uid + ')">' + data + '</a>';
        }
      },
      {
        targets: 2,
        data: 'email',
        title: '邮箱',
        render: function (data, type, row, meta) {
          if (data) return '<span class="green">已绑定</span>';
           else return '<span class="red">未绑定</span>';
        }
      },
      {
        targets: 3,
        data: 'phone',
        title: '手机',
        render: function (data, type, row, meta) {
          if (data) return '<span class="green">已绑定</span>';
           else return '<span class="red">未绑定</span>';
        }
      },
      {
        targets: 4,
        data: 'points',
        title: '点券',
        render: function (data, type, row, meta) {
          return data;
        }
      },
      {
        targets: 5,
        data: 'money',
        title: '充值金额',
        render: function (data, type, row, meta) {
          return data;
        }
      },
    ],
    initComplete: function () {
      $('#users_length').append(' <span style=\'color:#777;font-size:12px;\'>点击用户名管理玩家</span>');
    }
  });
});
function modifyPlayer(uid){
    if(requesting)return
    clearTimeout(inter)
    $(".pinfos").html("")
    $(".h-avatar").attr("src","")
    $("#modal-user").modal('hide')
    layer.alert("正在加载玩家数据",{icon: 16, shade: 0.5, closeBtn: 0, title: 0, btn:[] });
    $.ajax({
        url: "/user.do?a=p",
        type: "POST",
        data: {uid:uid},
        dataType: "json",
        timeout: 5000,
    	success: function(res){
            layer.closeAll()
        	if(res.code!=100){
            	layer.msg(res.msg,{icon: 2, shade: 0.5, time: 1500});
        	}else{
            $("#modal-user").data('uid',res.uid)
            $(".h-uid").html(res.uid)
            $(".d-uid").data("uid",res.uid)
            $(".h-avatar").attr("src","//avatar.mygunclub.cn/"+res.uid+"/large")
            $(".h-username").html(res.username)
            $(".h-regtime").html(res.regtime)
            $(".h-phone").html(res.phone)
            $(".h-email").html(res.email)
            $(".h-points").html(res.points)
            $(".h-money").html(res.money)
            $(".h-vip").html(res.vip)
            $(".h-viptime").html(res.viptime)
            $(".h-firstpay").html(res.firstpay)
            $(".h-genuine").html(res.genuine)
            uid = res.uid
            $("#v-email").editableInput({confirm:true,submit:function(value){
                $.post("/user.do?a=v",{uid:uid,id:"email",val:value},function(res){
                    if(res.code!=100){
                        $("#v-email").editableInput('reset')
                    }
                },"json")
            }})
            $("#v-phone").editableInput({confirm:true,submit:function(value){
                $.post("/user.do?a=v",{uid:uid,id:"phone",val:value},function(res){
                    if(res.code!=100){
                        $("#v-phone").editableInput('reset')
                    }
                },"json")
            }})
            $("#v-points").editableInput({confirm:true,submit:function(value){
                $.post("/user.do?a=v",{uid:uid,id:"points",val:value},function(res){
                    if(res.code!=100){
                        $("#v-points").editableInput('reset')
                    }
                },"json")
            }})
            $("#v-money").editableInput({confirm:true,submit:function(value){
                $.post("/user.do?a=v",{uid:uid,id:"money",val:value},function(res){
                    if(res.code!=100){
                        $("#v-money").editableInput('reset')
                    }
                },"json")
            }})
            $("#v-vip").editableSelector({confirm:true,options:["default","vip","svip"],submit:function(value){
                $.post("/user.do?a=v",{uid:uid,id:"vip",val:value},function(res){
                    if(res.code!=100){
                        $("#v-vip").editableSelector('reset')
                    }
                },"json")
            }})
            $("#v-viptime").editableInput({confirm:true,submit:function(value){
                $.post("/user.do?a=v",{uid:uid,id:"viptime",val:value},function(res){
                    if(res.code!=100){
                        $("#v-viptime").editableInput('reset')
                    }
                },"json")
            }})
            $("#v-firstpay").editableSelector({confirm:true,options:["0","1"],submit:function(value){
                $.post("/user.do?a=v",{uid:uid,id:"firstpay",val:value},function(res){
                    if(res.code!=100){
                        $("#v-firstpay").editableSelector('reset')
                    }
                },"json")
            }})
            $("#v-genuine").editableSelector({confirm:true,options:["0","1"],submit:function(value){
                $.post("/user.do?a=v",{uid:uid,id:"genuine",val:value},function(res){
                    if(res.code!=100){
                        $("#v-genuine").editableSelector('reset')
                    }
                },"json")
            }})
            $("#btn-ca").unbind("click")
            $("#btn-ca").click(function(){
                uid = $(this).data("uid")
                msg = prompt("请输入删除理由(留空取消)")
                if(msg=="")return
                $.post("/user.do?a=v",{uid:uid,id:"avatar",val:msg},function(res){
                    if(res.code==100){
                        $("#v-av").attr("src","//avatar.mygunclub.cn/0")
                    }
                },"json")
            })
            $("#btn-rp").unbind("click")
            $("#btn-rp").click(function(){
                uid = $(this).data("uid")
                if(!confirm("你确认要重置密码为asdfghjkl吗?"))return
                $.post("/user.do?a=v",{uid:uid,id:"resetpwd"},function(res){
                    if(res.code==100){
                        layer.msg("已重置密码",{icon: 1, time: 1500});
                    }
                },"json")
            })
            
            $("#modal-user").modal('show')
        }
    },
        	error: function(){
        	    layer.msg("发生错误,请重试",{icon: 2, time: 1500});
        	}
    })
}