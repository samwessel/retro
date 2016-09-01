$(function(){
	$('form').on('submit',function(e){
		e.preventDefault();
		var text = $("#description").val();
		if(text == ''){
			return;
		}
		var json = JSON.stringify({text });
		console.log(json);
		socket.send(json);
		$("#description").val("");
	})
});

var socket = new WebSocket('ws://localhost:8081/');
socket.onopen = function(event) {
  
}

socket.onmessage = function (event) {
	var json = event.data;
	var obj = JSON.parse(json);
	var message = JSON.parse(obj.message)
  $("ul").append($("<li>").text(message.text));
}
