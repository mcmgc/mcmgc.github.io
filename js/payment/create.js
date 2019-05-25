$("#moneySelect .btn").click(function(){
    $("#moneySelect .btn").removeClass("btn-primary")
    $(this).addClass("btn-primary")
    $("#price").val($(this).data("price"))
})
$("#methodSelect .btn").click(function(){
    $("#methodSelect .btn").removeClass("btn-primary")
    $(this).addClass("btn-primary")
    $("#method").val($(this).data("method"))
})
var canSubmit = false
var handler = function (captchaObj) {
    captchaObj.appendTo('#pay-captcha');
    captchaObj.onReady(function () {
        $("#pay-captcha .gt-wait").hide();
    });
    captchaObj.onSuccess(function () {
        $("#pay-captcha").parent().find(".help-block").html('&nbsp;')
    });
    captchaObj.onError(function () {
        $("#pay-captcha").parent().find(".help-block").html('<i class="fa fa-exclamation-circle"></i> 验证出错,请重试')
    });
    captchaObj.onClose(function () {
        $("#pay-captcha").parent().find(".help-block").html('&nbsp;')
    });
    $('#btn-submit').click(function () {
        var result = captchaObj.getValidate();
        if (!result) {
            $("#pay-captcha").parent().find(".help-block").html('<i class="fa fa-exclamation-circle"></i> 请完成安全验证')
            return false
        }
        disableBtn("#btn-submit",'<i class="fa fa-spinner fa-spin fa-fw"></i> 正在创建订单')
        $.ajax({
            url: '/payment/create',
            type: 'POST',
            dataType: 'json',
    		timeout: 5000,
            data: {
                price: $('#price').val(),
                method: $('#method').val(),
                isPC:isPC(),
                gt_challenge: result.geetest_challenge,
                gt_validate: result.geetest_validate,
                gt_seccode: result.geetest_seccode
            },
            success: function (data) {
                if (data.code==100){
                    enableBtn("#btn-submit")
                    layer.msg(data.msg,{icon:1,time:1500})
                    captchaObj.reset();
                    openOrder(data.orderid)
                }else if(data.code==302){
                    location.href="login.html?url=pay.html";
                }else if(data.code==201){
                    enableBtn("#btn-submit")
                    $("#pay-captcha").parent().find(".help-block").html('<i class="fa fa-exclamation-circle"></i> 验证出错,请重试')
                    captchaObj.reset();
                }else{
                    enableBtn("#btn-submit")
                    layer.msg(data.msg,{icon:2,time:1500})
                    captchaObj.reset();
                }
            },
            error: function(){
                enableBtn("#btn-submit")
                layer.msg("创建订单时发生错误,请重试",{icon:2,time:1500})
                captchaObj.reset();
            }
        });
    })
    window.gt = captchaObj;
};
function openOrder(order){
    layer.closeAll()
    layer.open({
        type: 2,
        area: ['390px', '620px'],
        title: '支付 - 订单 '+order,
        content: '/payment/order?order='+order
    });
}
function loadCaptcha(){
    $("#pay-captcha").parent().find(".help-block").html('&nbsp;')
    $.ajax({
        url: "/action/captcha.action",
        type: "post",
        data: {isPC:isPC()},
        dataType: "json",
        timeout: 5000,
        success: function (data) {
            $('#pay-captcha .gt-text').hide();
            $('#pay-captcha .gt-wait').show();
            initGeetest({
                gt: data.gt,
                challenge: data.challenge,
                offline: !data.success,
                new_captcha: data.new_captcha,
                product: "popup",
                width: "100%",
                https: true
            }, handler);
        },error: function(){
            $("#pay-captcha").parent().find(".help-block").html('<i class="fa fa-exclamation-circle"></i> 安全验证加载失败')
            setTimeout(function(){loadCaptcha()},1500)
        }
    });
}
$(document).ready(function(){loadCaptcha()})