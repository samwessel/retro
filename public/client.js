var categories = ["What went well?", "What could have gone better?"];
//var categories = ["Mad", "Sad", "Glad"];

$(function(){
	categories.forEach(function(category) {
		var e = $('<div class="category" id="'+hyphenate(category)+'"></div>');
		e.append($("<h2>").text(category))
		e.append($('<ul>'));
		e.append($('<div class="droppable"></div>'))
		$("#container").append(e);
	});

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

	$( ".draggable" ).draggable({
		revert: true
	});
	
	$( ".droppable" ).droppable({
		drop: function(event, ui) {
			alert("dropped in category " + $(this).closest(".category").attr("id"));

			var text = ui.draggable.text();
			var json = JSON.stringify({text });
			console.log(json);
			socket.send(json);
		}
	});
});

var socket = new WebSocket('ws://localhost:8081/');
socket.onopen = function(event) {
  
}

socket.onmessage = function (event) {
	var json = event.data;
	console.log(json);
	var obj = JSON.parse(json);
	console.log(obj);
  $("ul").append($("<li>").text(obj.text));
}

function hyphenate(text){
	return text.replace(/[^a-zA-Z ]/g, "").replace(/ +/g, '-').toLowerCase();
}
