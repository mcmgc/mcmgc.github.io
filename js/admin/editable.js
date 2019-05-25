(function($){
    $.fn.extend({
        "editableInput": function(opt){
            if(opt=="reset"){
            	id = $(this).attr("id")
            	val = $(this).data("old-value")
                $(this).data("old-value",$(this).data("value"))
                $(this).data("value",val)
                $(this).find("#ei-"+id).html(val)
                $(this).find("#eii-"+id).val(val)
                return
            }
            var lang = {change:"修改",submit:"提交",cancel:"取消"}
            if(opt.lang!=undefined){
            	if(opt.lang.change!=undefined)lang.change = opt.lang.change
            	if(opt.lang.submit!=undefined)lang.submit = opt.lang.submit
            	if(opt.lang.cancel!=undefined)lang.cancel = opt.lang.cancel
            }
            id = $(this).attr("id")
            data = $(this).html()
            $(this).data("value",data)
            if(opt.full)full='w80';else full="w60";
            var cont = '<div id="ei1-'+id+'" style="min-height: 30px;"><span id="ei-'+id+'">'+data+'</span> <a href="javascript:void(0)" id="eia-'+id+'">'+lang.change+'</a></div>'
            cont += '<div id="ei2-'+id+'" class="nodisplay" style="min-height: 30px;"><input type="text" value="'+data+'" id="eii-'+id+'" class="form-control input-sm '+full+' inline-block"> <a href="javascript:void(0)" id="eib-'+id+'">'+lang.submit+'</a> <a href="javascript:void(0)" id="eic-'+id+'">'+lang.cancel+'</a> </div>'
            $(this).html(cont)
            $("#eia-"+id).click(function(){
                id = $(this).parent().parent().attr("id")
                $("#ei1-"+id).hide()
                $("#ei2-"+id).show()
                $("#eii-"+id).val($("#ei-"+id).html())
                $("#eii-"+id).focus()
                $("#eii-"+id).select()
            })
            $("#eib-"+id).click(function(){
                id = $(this).parent().parent().attr("id")
                val = $("#eii-"+id).val()
                if($("#"+id).data("value")==val){
                	$("#ei1-"+id).show()
                	$("#ei2-"+id).hide()
                    return
                }
                if(opt.confirm)
                    if(!confirm("你确定要修改该条目的值为'"+val+"'吗?"))return
                $("#ei-"+id).html(val)
                $("#ei1-"+id).show()
                $("#ei2-"+id).hide()
                $("#"+id).data("old-value",$("#"+id).data("value"))
                $("#"+id).data("value",val)
                if(opt.submit!=undefined)opt.submit(val)
            })
            $("#eic-"+id).click(function(){
                id = $(this).parent().parent().attr("id")
                $("#ei1-"+id).show()
                $("#ei2-"+id).hide()
                $("#eii-"+id).val($("#ei-"+id).html())
            })
        },
        "editableSelector": function(opt){
            if(opt=="reset"){
            	id = $(this).attr("id")
            	val = $(this).data("old-value")
                $(this).data("old-value",$(this).data("value"))
                $(this).data("value",val)
                $(this).find("#ei-"+id).html(val)
                $(this).find("#eii-"+id).val(val)
                return
            }
            var lang = {change:"修改",submit:"提交",cancel:"取消"}
            if(opt.lang!=undefined){
            	if(opt.lang.change!=undefined)lang.change = opt.lang.change
            	if(opt.lang.submit!=undefined)lang.submit = opt.lang.submit
            	if(opt.lang.cancel!=undefined)lang.cancel = opt.lang.cancel
            }
            id = $(this).attr("id")
            cur_val = $(this).html()
            $(this).data("value",cur_val)
            var cont = '<div id="ei1-'+id+'" style="min-height: 34px;"><span id="ei-'+id+'">'+cur_val+'</span> <a href="javascript:void(0)" id="eia-'+id+'">'+lang.change+'</a></div>'
            cont += '<div id="ei2-'+id+'" class="nodisplay" style="min-height: 34px;">'
            if(opt.full)full='w80';else full="w60";
            cont += '<select id="eii-'+id+'" class="form-control inline-block '+full+'">'
            $.each(opt.options,function(i,val){
            	cont += '<option value="'+val+'">'+val+'</option>'
            })
            setTimeout(function(){
                $("#eii-"+id).val(cur_val)
            },1)
            cont += '</select>'
            cont += ' <a href="javascript:void(0)" id="eib-'+id+'">'+lang.submit+'</a> <a href="javascript:void(0)" id="eic-'+id+'">'+lang.cancel+'</a> </div>'
            $(this).html(cont)
            $("#eia-"+id).click(function(){
                id = $(this).parent().parent().attr("id")
                $("#ei1-"+id).hide()
                $("#ei2-"+id).show()
                $("#eii-"+id).val($("#ei-"+id).html())
            })
            $("#eib-"+id).click(function(){
                id = $(this).parent().parent().attr("id")
                val = $("#eii-"+id).val()
                if($("#"+id).data("value")==val){
                	$("#ei1-"+id).show()
                	$("#ei2-"+id).hide()
                    return
                }
                if(opt.confirm)
                    if(!confirm("你确定要修改该条目的值为'"+val+"'吗?"))return
                $("#ei-"+id).html(val)
                $("#ei1-"+id).show()
                $("#ei2-"+id).hide()
                $("#"+id).data("old-value",$("#"+id).data("value"))
                $("#"+id).data("value",val)
                if(opt.submit!=undefined)opt.submit(val)
            })
            $("#eic-"+id).click(function(){
                id = $(this).parent().parent().attr("id")
                $("#ei1-"+id).show()
                $("#ei2-"+id).hide()
                $("#eii-"+id).val($("#ei-"+id).html())
            })
        }
    })
})(jQuery)