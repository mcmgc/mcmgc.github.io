function timer(intDiff) {
    var i = 0;
    if(intDiff<=0)return
    myTimer = window.setInterval(function () {
        i++;
        var hour = 0,
            minute = 0,
            second = 0;
        if (intDiff > 0) {
            hour = Math.floor(intDiff / (60 * 60));
            minute = Math.floor(intDiff / 60) - (hour * 60);
            second = Math.floor(intDiff) - (hour * 60 * 60) - (minute * 60);
        }
        if (hour <= 9) hour = '0' + hour;
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;
        $('#time_h').html(hour);
        $('#time_m').html(minute);
        $('#time_s').html(second);
        if (hour <= 0 && minute <= 0 && second <= 0) {
            order_timeout()
            clearInterval(myTimer);
        }
        intDiff--;
    }, 1000);
}
order_timeout = function(){
    try{
        if (notifyServer && notifyServer.started)notifyServer.emit('notify_out', {});
    }catch(e){}
    $("#qrcode").attr("src", '');
    $("#qrcode").attr("alt", '二维码失效');
    $("#pay-tip").html("支付超时 请重新提交订单");
    history.go(0)
}
initialize = function(){
    if(!pdat)return
    if(pdat.endTime>pdat.serverTime){
    	timer(pdat.endTime-pdat.serverTime)
    	startNotiry(pdat)
    }
}
var notifyServer;
function startNotiry(data) {
    notifyServer = notify = io.connect(data.notiry_host);
    notify.emit('notify', data);
    notify.on('notify', function (o) {
        //log(o);
        notifyServer.started = true;
        if (!o)return;
        /*if (user_data && user_data.qrcode_url && o.money) {
            o.qrcode = user_data.qrcode_url + '?money=' + o.money + '&type=' + o["type"] + '&tag=' + o.tag;
        }*/
        //if (o.qrcode && $("#show_qrcode").src != o.qrcode)$("#show_qrcode").attr("src", o.qrcode); //二维码
       /* if (o.money){
            $("#money").html("￥"+o.money); //金额改变
            $("#copy").attr("data-clipboard-text",o.money); //金额改变
        }*/
        if (o.msg)$("#pay-tip").html(o.msg); //过期
        if (o.outTime) {
            try {
                clearInterval(myTimer);
            } catch (e) {
            }
            timer(parseInt(o.outTime));
        }

    });
    notify.on('sussecc', function (o) { //成功后跳转
        //log(o);
        var status = parseInt(o.status);
        $("#qrcode").attr("src", '');
        if (!isNaN(status) && status > 1)$("#pay-tip").html('支付成功 3秒后自动跳转');
        setTimeout(function () {
            location.href = '/pay_wait.html?order='+data.order_id;
        }, 3000);

    });
    notify.on('disconnect', function (o) {
        layer.msg("无法连接通知服务,支付成功后无法跳转")
    });
    notify.on('warning', function (o) {
        if (o.msg)$("#pay-tip").html(o.msg);
    });
}