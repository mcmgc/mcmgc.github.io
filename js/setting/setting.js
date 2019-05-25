$(document).ready(function(){
    new ClipboardJS('#code-qq-btn',{
        text: function(){
            return $("#code-qq").html();
        }
    });
});
$("#code-qq-btn").click(function(){
    if($("#code-qq").html()!="")
        layer.alert("代码已复制到剪贴板<br>请私聊机器人并发送此代码<br>如果未成功复制到剪贴板,请手动复制代码:<br><code>"+$("#code-qq").html()+"</code>",{icon:1,title:"提示"})
    else
        layer.msg("需要登录一次服务器后才能绑定",{icon:2,time:1500})
})