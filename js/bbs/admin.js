function showDialog(title,content){
    var v=~(-new Date()/36e5);
    $('body').append('<div class="dialogDiv" id="dialog-'+v+'"><div class="dialogHead">'+title+
        '<span></span><a onclick="$(this).parent().parent().fadeOut(200)" title="关闭"><i class="fa fa-times"></i></a></div>'+
        '<div class="dialogBody">'+content+'</div></div>')
}
$(".tools-box button").click(function(){
    layer.closeAll();
    layer.load(1,{shade: 0.3});
    $.ajax({
        url: '/action/admin.bbs',
        type: 'POST',
        dataType: 'json',
        timeout: 5000,
        data: { a: 'menu', tid: tid, setting: $(this).data("setting") },
        success: function (data) {
            if (data.code==100){
                layer.closeAll("loading");
                showDialog(data.title,data.content)
            }else if(data.code==302){
                location.href="/login.html";
            }else{
                layer.closeAll("loading");
                layer.msg(data.msg,{time:1500});
            }
        },
        error: function(){
            layer.closeAll("loading");
            layer.msg("加载菜单时出现错误",{time:1500});
        }
    });
})
function submitHandler(tid,setting,elem){
    var val = "";
    
    if(typeof elem !="undefined")
        val=$(elem).val()
    layer.load(1,{shade: 0.3});
    $.ajax({
        url: '/action/admin.bbs',
        type: 'POST',
        dataType: 'json',
        timeout: 5000,
        data: { a: 'submit', tid: tid, setting: setting , val: val},
        success: function (data) {
            if (data.code==100){
                layer.closeAll("loading");
                layer.msg(data.msg,{icon:1,time:1500});
                $('.dialogDiv').fadeOut(200)
            }else if(data.code==302){
                location.href="/login.html";
            }else{
                layer.closeAll("loading");
                layer.msg(data.msg,{time:1500});
            }
        },
        error: function(){
            layer.closeAll("loading");
            layer.msg("提交时出现错误",{time:1500});
        }
    });
}