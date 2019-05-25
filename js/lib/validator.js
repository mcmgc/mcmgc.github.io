if (typeof jQuery === 'undefined') {
    throw new Error('Validator requires jQuery');
}

(function($) {
    var version = $.fn.jquery.split(' ')[0].split('.');
    if ((+version[0] < 2 && +version[1] < 9) || (+version[0] === 1 && +version[1] === 9 && +version[2] < 1)) {
        throw new Error('Validator requires jQuery version 1.9.1 or higher');
    }
}(window.jQuery));
var success;
(function($){
    $.prototype.validate = $.prototype.validatep  = {
        require: {message: "你必须填写此项"},
        length: {min: 1, max: 2147483647, message: "长度不正确"},
        regexp: {regexp: /^[\x21-\x7E]*$/, message: "格式不正确"},
        same: {input: "", message: "输入不相同"},
        ajax: {url: "", data: {}, success_code: 100, success: function(){}, error: function(){}}
    }
    $.fn.extend({
        "validator": function(opts){
            if(opts==undefined)
                throw new Error('Validator requires options');
            if(typeof opts === "object"){
            for(i=0;i<opts.inputs.length;i++){
                var inp = opts.inputs[i]
                var inpu = $("#"+inp.id)
                var vv = inp.validator
                if(inpu===undefined || vv===undefined)continue;
                inpu.attr("vv-msg",inp.msgbox)
                inpu.attr("has-validate",true)
                inpu.attr("is-valid",false)
                inpu[0].validate = vv
                inpu.on("focus",function(){
                    var input = $("#"+$(this).attr("id"))
                    input.parent().removeClass("has-success")
                    input.parent().removeClass("has-error")
                    input.parent().removeClass("has-warning")
                    input.attr("is-valid",false)
                    $("#"+$(this).attr("vv-msg")).html("&nbsp;")
                    if(input[0].validate.focus!==undefined)input[0].validate.focus()
                })
                inpu.on("blur",function(){
                    var input = $("#"+$(this).attr("id"))
                    input.attr("is-valid",false)
                    var validate = input[0].validate
                    var validatep = input.validatep
                    var icon_msg = '<i class="fa fa-exclamation-circle"></i> '
                    if(validate.require!==undefined){
                        var vmsg = (validate.require.message!==undefined) ? validate.require.message : validatep.require.message
                        if(input.val().trim()==""){
                            input.parent().addClass("has-error")
                            $("#"+$(this).attr("vv-msg")).html(icon_msg + vmsg)
                            return
                        }
                    }
                    if(validate.length!==undefined){
                        var vmsg = (validate.length.message!==undefined) ? validate.length.message : validatep.length.message
                        var vmin = (validate.length.min!==undefined) ? validate.length.min : validatep.length.min
                        var vmax = (validate.length.max!==undefined) ? validate.length.max : validatep.length.max
                        var vlen = input.val().length
                        if(vlen<vmin || vlen>vmax){
                   	 		input.parent().addClass("has-error")
                    		$("#"+$(this).attr("vv-msg")).html(icon_msg + vmsg)
                    		return
                        }
                    }
                    if(validate.regexp!==undefined){
                        if(validate.regexp.regexp!==undefined){
                        	var vmsg = (validate.regexp.message!==undefined) ? validate.regexp.message : validatep.regexp.message
                        	var regexp = validate.regexp.regexp
                        	if(!regexp.test(input.val().trim())){
                   	 			input.parent().addClass("has-error")
                    			$("#"+$(this).attr("vv-msg")).html(icon_msg + vmsg)
                    			return
                            }
                        }
                    }
                    if(validate.same!==undefined){
                        if(validate.same.input!==undefined){
                            if($("#"+validate.same.input)!==null){
                        		var vmsg = (validate.same.message!==undefined) ? validate.same.message : validatep.same.message
                        		var input2 = $("#"+validate.same.input)
                        		if(input2.val().trim() != input.val().trim()){
                   	 				input.parent().addClass("has-error")
                    				$("#"+$(this).attr("vv-msg")).html(icon_msg + vmsg)
                    				return
                                }
                        	}
                        }
                    }
                    input.attr("is-valid",true)
        			input.parent().addClass("has-success")
                    if(validate.ajax!==undefined){
                    	input.attr("is-valid",false)
        				input.parent().removeClass("has-success")
                    	input.parent().addClass("has-warning")
                        var vurl = (validate.ajax.url!==undefined) ? validate.ajax.url : validatep.ajax.url
                        var vdata = (validate.ajax.data!==undefined) ? validate.ajax.data : validatep.ajax.data
                        var vsuccess = (validate.ajax.success!==undefined) ? validate.ajax.success : validatep.ajax.success
                        var vscode = (validate.ajax.success_code!==undefined) ? validate.ajax.success_code : validatep.ajax.success_code
                        var verror = (validate.ajax.error!==undefined) ? validate.ajax.error : validatep.ajax.error
                        if(validate.ajax.dataKey!==undefined)
                            vdata[validate.ajax.dataKey]=input.val()
                        if(validate.ajax.specialData!==undefined)
                        	for(i=0;i<validate.ajax.specialData.length;i++)
                            	vdata[validate.ajax.specialData[i].key]=$("#"+validate.ajax.specialData[i].input).val()
                        $.ajax({
       	 					url: vurl,
        					type: "POST",
        					data: vdata,
        					dataType: "json",
        					timeout: 6000,
        					success: function(data){
        						if(data.code==vscode){
        							input.parent().addClass("has-success")
    								input.parent().removeClass("has-warning")
                    				input.attr("is-valid",true)
                                    vsuccess()
        						}else{
                					$("#"+input.attr("vv-msg")).html('<i class="fa fa-exclamation-circle"></i> '+data.msg)
        							input.parent().addClass("has-error")
                                    verror()
        						}
    						},
        					error: function(){
            					input.trigger("blur")
                                verror()
        					}
    					})
                    }
                })
            }
                
            
            }else if(typeof opts === "string"){
                if(opts == "validate"){
                    if($(this).is("form")){
                   		success = true
                    	$(this).find("input").each(function(i,elem){
                    		if($(elem).attr("has-validate")=="false")return
                        	if($(elem).attr("is-valid")=="false"){
                        	    success = false
                        	    $(elem).trigger("blur")
                        	}
                    	})
                    	if(!success){
                        	success = true
                    		$(this).find("input").each(function(i,elem){
                    			if($(elem).attr("has-validate")=="false")return
                    		    if($(elem).attr("is-valid")=="false"){
                    		        success = false
                    		        return false
                    		    }
                    		})
                    	}
                    	return success
                    }else if($(this).is("input")){
                        elem = this
                        if($(elem).attr("has-validate")=="false")return
                    	if($(elem).attr("is-valid")=="false"){
                    		$(elem).trigger("blur")
                    	}else return true
                        return $(elem).attr("is-valid")=="true"
                    }
                }
            }
            else throw new Error('Validator requires option list or an action');
        }
    })
})(jQuery)