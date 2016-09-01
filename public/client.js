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
			revert: true
		}));

		$("#description").val("");
	})

	$( ".droppable" ).droppable({
		hoverClass: "drop-hover",
		drop: function(event, ui) {
			var cat = $(this).closest(".category").attr("id");

			var text = ui.draggable.text();
			var json = JSON.stringify({text });
			console.log(json);
			socket.send(json);
			
			ui.draggable.remove();
			setTimeout ( "setVoteEvent()", 100 );
		}
	});
});


function setVoteEvent(){
	$('.plus').on('click',function(){
		var id = $(this).parent().data('id');
		console.log(id);
	});
}

var socket = new WebSocket('ws://localhost:8081/');
socket.onopen = function(event) {
  
}

socket.onmessage = function (event) {
	var json = event.data;
	console.log(json);
	var obj = JSON.parse(json);
	console.log(obj);
  	$("ul").append(
		$("<li>").text(obj.text)
		.attr('data-id', obj.id)
		.append('<span class="plus"></span>')
	);
}

function hyphenate(text){
	return text.replace(/[^a-zA-Z ]/g, "").replace(/ +/g, '-').toLowerCase();
}
