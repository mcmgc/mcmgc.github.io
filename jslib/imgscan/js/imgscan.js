$("img.scan").click(function() {
	$("#imgsrc").attr('src', this.src);
	$("#imgscan").fadeIn();
});
$("#imgscan").click(function() {
	$("#imgscan").fadeOut();
});
