$(document).ready(function(){
	document.write('<div id="imgscan"><div class="imgcontent"><div class="imgrow"><img src="" id="imgsrc"></div></div></div>')
})
$("img.scan").click(function() {
	$("#imgsrc").attr('src', this.src);
	$("#imgscan").fadeIn();
});
$("#imgscan").click(function() {
	$("#imgscan").fadeOut();
});
