var socket;
$(document).ready(function(){
	if($("#errMsg .text").html()==""){
		$("img.lazy").lazyload({effect:"fadeIn"})
		timer()
	}
	connectNotify()
})
$("#closePage").click(function(){
	parent.layer.closeAll()
})
function timer() {
    if(remtime<=0)return
    myTimer = window.setInterval(function () {
        var hour = 0,
            minute = 0,
            second = 0;
        if (remtime > 0) {
            hour = Math.floor(remtime / (60 * 60));
            minute = Math.floor(remtime / 60) - (hour * 60);
            second = Math.floor(remtime) - (hour * 60 * 60) - (minute * 60);
        }
        if (hour <= 9) hour = '0' + hour;
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;
        $('#t-h').html(hour);
        $('#t-m').html(minute);
        $('#t-s').html(second);
        if (hour <= 0 && minute <= 0 && second <= 0) {
            showErrMsg("订单支付超时<br>请在订单有效期内支付")
            clearInterval(myTimer);
        }
        remtime--;
    }, 1000);
}
function showErrMsg(msg){
	$("#errMsg .text").html(msg)
	$("#page").hide()
	$("#errMsg").show()
}
function connectNotify(){
	socket = io('wss://msg.mygunclub.cn');
	socket.on('connect', function(data){
    	socket.emit('setNotify', {type:1,key:notify_key});
	});
	socket.on('connect_failed', function(data){
    	parent.layer.msg("无法连接到通知服务",{time:1500})
	});
	socket.on('disconnect', function(data){
    	parent.layer.msg("已与通知服务断开连接",{time:1500})
	});
	socket.on('success', function(data){
    	showErrMsg('订单已支付<br>请在用户中心查看点券余额是否正确<div class="info">支付时间<span>'+data.pay_time+'</span></div>');
        remtime=99999999999
	});
	socket.on('timeout', function(data){
        showErrMsg("订单支付超时<br>请在订单有效期内支付")
        remtime=0
	});
	socket.on('timer', function(data){
        remtime=data.remtime
	});
}
$("#checkStatus").click(function(){

})