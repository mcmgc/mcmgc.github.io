$(document).ready(function(){
    $("#newwin").show()
    $("input[type=checkbox]").iCheck({
        checkboxClass: 'icheckbox_minimal-blue',
    })
    
    if($.cookie("open_in_new_window")!=undefined){
        $("#newwin").iCheck(transCheckedToVal($.cookie("open_in_new_window")))
        if($.cookie("open_in_new_window")=="true")$(".thread-a").attr("target","_blank")
        else $(".thread-a").attr("target","_self")
    }
    
    $("#newwin").on('ifChanged',function(){
        $.cookie("open_in_new_window",$(this)[0].checked)
        if($(this)[0].checked)$(".thread-a").attr("target","_blank")
        else $(".thread-a").attr("target","_self")
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

function searchCheck(){
    return $("#search-text").val() != "";
}