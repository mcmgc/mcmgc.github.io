(function(b,a){if(typeof module==="object"&&typeof module.exports==="object"){module.exports=b.document?a(b,true):function(c){if(!c.document){throw new Error("Geetest requires a window with a document")}return a(c)}}else{a(b)}})(typeof window!=="undefined"?window:this,function(g,t){if(typeof g==="undefined"){throw new Error("Geetest requires browser environment")}var o=g.document;var i=g.Math;var d=o.getElementsByTagName("head")[0];function e(z){this._obj=z}e.prototype={_each:function(A){var B=this._obj;for(var z in B){if(B.hasOwnProperty(z)){A(z,B[z])}}return this}};function h(A){var z=this;new e(A)._each(function(B,C){z[B]=C})}h.prototype={api_server:"api.geetest.com",protocol:"http://",type_path:"/gettype.php",fallback_config:{slide:{static_servers:["static.geetest.com","dn-staticdown.qbox.me"],type:"slide",slide:"/static/js/geetest.0.0.0.js"},fullpage:{static_servers:["static.geetest.com","dn-staticdown.qbox.me"],type:"fullpage",fullpage:"/static/js/fullpage.0.0.0.js"}},_get_fallback_config:function(){var z=this;if(m(z.type)){return z.fallback_config[z.type]}else{if(z.new_captcha){return z.fallback_config.fullpage}else{return z.fallback_config.slide}}},_extend:function(A){var z=this;new e(A)._each(function(B,C){z[B]=C})}};var n=function(z){return(typeof z==="number")};var m=function(z){return(typeof z==="string")};var j=function(z){return(typeof z==="boolean")};var k=function(z){return(typeof z==="object"&&z!==null)};var c=function(z){return(typeof z==="function")};var x={};var q={};var a=function(){return parseInt(i.random()*10000)+(new Date()).valueOf()};var l=function(C,z){var A=o.createElement("script");A.charset="UTF-8";A.async=true;A.onerror=function(){z(true)};var B=false;A.onload=A.onreadystatechange=function(){if(!B&&(!A.readyState||"loaded"===A.readyState||"complete"===A.readyState)){B=true;setTimeout(function(){z(false)},0)}};A.src=C;d.appendChild(A)};var r=function(z){return z.replace(/^https?:\/\/|\/$/g,"")};var w=function(z){z=z.replace(/\/+/g,"/");if(z.indexOf("/")!==0){z="/"+z}return z};var v=function(A){if(!A){return""}var z="?";new e(A)._each(function(B,C){if(m(C)||n(C)||j(C)){z=z+encodeURIComponent(B)+"="+encodeURIComponent(C)+"&"}});if(z==="?"){z=""}return z.replace(/&$/,"")};var p=function(D,B,C,A){B=r(B);var z=w(C)+v(A);if(B){z=D+B+z}return z};var f=function(E,A,D,C,z){var B=function(F){var G=p(E,A[F],D,C);l(G,function(H){if(H){if(F>=A.length-1){z(true)}else{B(F+1)}}else{z(false)}})};B(0)};var y=function(A,C,B,D){if(k(B.getLib)){B._extend(B.getLib);D(B);return}if(B.offline){D(B._get_fallback_config());return}var z="geetest_"+a();g[z]=function(E){if(E.status==="success"){D(E.data)}else{if(!E.status){D(E)}else{D(B._get_fallback_config())}}g[z]=undefined;try{delete g[z]}catch(F){}};f(B.protocol,A,C,{gt:B.gt,callback:z},function(E){if(E){D(B._get_fallback_config())}})};var s=function(A,z){var B={networkError:"网络错误"};if(typeof z.onError==="function"){z.onError(B[A])}else{throw new Error(B[A])}};var u=function(){return !!g.Geetest};if(u()){q.slide="loaded"}var b=function(A,B){var z=new h(A);if(A.https){z.protocol="https://"}else{if(!A.protocol){z.protocol=g.location.protocol+"//"}}y([z.api_server||z.apiserver],z.type_path,z,function(C){var E=C.type;var F=function(){z._extend(C);B(new g.Geetest(z))};x[E]=x[E]||[];var D=q[E]||"init";if(D==="init"){q[E]="loading";x[E].push(F);f(z.protocol,C.static_servers||C.domains,C[E]||C.path,null,function(K){if(K){q[E]="fail";s("networkError",z)}else{q[E]="loaded";var I=x[E];for(var J=0,H=I.length;J<H;J=J+1){var G=I[J];if(c(G)){G()}}x[E]=[]}})}else{if(D==="loaded"){F()}else{if(D==="fail"){s("networkError",z)}else{if(D==="loading"){x[E].push(F)}}}}})};g.initGeetest=b;return b});