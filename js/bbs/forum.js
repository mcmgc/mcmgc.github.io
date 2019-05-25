$(document).ready(function(){
    $("input[type=checkbox]").iCheck({
        checkboxClass: 'icheckbox_minimal-blue',
    })
    
    if($.cookie("open_in_new_window")!=undefined){
        $("#newwin").iCheck(transCheckedToVal($.cookie("open_in_new_window")))
        if($.cookie("open_in_new_window")=="true")$(".viewthread").attr("target","_blank")
        else $(".viewthread").attr("target","_self")
    }
    
    $("#newwin").on('ifChanged',function(){
        $.cookie("open_in_new_window",$(this)[0].checked)
        if($(this)[0].checked)$(".viewthread").attr("target","_blank")
        else $(".viewthread").attr("target","_self")
    })
})


$(document).keyup(function(event){
    if(event.keyCode==37)
        $(".prevPage").trigger("click")
    if(event.keyCode==38)
        $(".nextPage").trigger("click")
})

function transCheckedToVal(c){
    if(c=="true")return "check"
    else return "uncheck"
}