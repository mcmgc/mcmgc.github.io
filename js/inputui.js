$("fieldset.inputui input").on('input',function(e){
    inputuiChange($(this))
})
function inputuiChange(elem){
    if(elem.val()=="")
        elem.parent().removeClass("inputui-filled")
    else
        elem.parent().addClass("inputui-filled")
}