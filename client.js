$(function(){
	$('#add').on('click',function(){
		var text = $("#description").val();
		$("ul").append($("<li>").text(text));
		$("#description").val("");
	})
});