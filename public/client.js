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

		$("#newitems").append($("<div>").addClass("draggable").text(text).draggable({
			stop: function() {
				$(this).remove()
			}
		}));

		$("#description").val("");
	})

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
	var obj = JSON.parse(json);
	var message = JSON.parse(obj.message)
  $("ul").append($("<li>").text(message.text));
}

function hyphenate(text){
	return text.replace(/[^a-zA-Z ]/g, "").replace(/ +/g, '-').toLowerCase();
}
