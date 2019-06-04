var iplist,ipn = 0
$(document).ready(function(){
    if(document.location.protocol == "http:"){
        window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);
        return;
    }
	Messenger.options = {
    	extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right',
    	theme: 'flat'
	}
	genQR()
    loadServerInfo()
    loadIP()
    new ClipboardJS('#serverip');
    $("#page-loading").fadeOut(800);$("#page-main").fadeIn(1200);
    $('#slider').bxSlider({
        auto: true,
        autoControls: false,
        infiniteLoop: true,
        hideControlOnEnd: true,
        slideMargin: 5,
        pause: 7500,
    });
});

$(".fa-clipboard").click(function(){
    Messenger().post({ message: "服务器IP已复制到剪贴板!", hideAfter: 2, hideOnNavigate: true });
})
function loadServerInfo(){
    $.ajax({
        url: "https://api.mygunclub.cn/server/online",
        type: 'GET',
        dataType: 'json',
        timeout: 5000,
        success: function (res) {
            $.each(res.server,function(i,val){setOl("#online-"+i,val); })
            setTimeout(function(){loadServerInfo()},10000)
        },
        error: function(){
            setTimeout(function(){loadServerInfo()},5000)
        }
    });
}
function setOl(sel,val){
    if(val!="offline"){
        $(sel).html(val)
        if($(sel).hasClass("offline")) $(sel).removeClass("offline")
    }else{
        $(sel).html("0")
        if(!$(sel).hasClass("offline")) $(sel).addClass("offline")
    }
}
function loadIP(){
    $.ajax({
        url: "https://api.mygunclub.cn/server/ip",
        type: 'GET',
        dataType: 'json',
        timeout: 5000,
        success: function (res) {
            iplist=res
            setIP()
            setInterval(function(){setIP()},6000)
        },
        error: function(){
            setTimeout(function(){loadIP()},5000)
        }
    });
}
function setIP(){
    var ip=iplist[ipn++]
    if(ipn>=iplist.length)ipn=0
    $("#serverip-txt").val(ip)
}
function genQR(){
	$("#qun1").qrcode({
		render: 'canvas',
		width: 130,
		height: 130,
		text: $("#qun1").data("src"),
	})
	$("#qun2").qrcode({
		render: 'canvas',
		width: 130,
		height: 130,
		text: $("#qun2").data("src"),
	})
}