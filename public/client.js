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

		$("#newitems").append(
			$("<li>")
			.addClass("draggable")
			.text(text)
			.draggable({
				revert: true
			})
		);

		$("#description").val("");
	})

	$( ".droppable" ).droppable({
		hoverClass: "drop-hover",
		drop: function(event, ui) {
			var text = ui.draggable.text();
			var category = $(this).closest(".category").attr("id");
			var id = ui.draggable.attr("id");
			var json = JSON.stringify({ text: text,  category: category, id: id });

			socket.send(json);
			ui.draggable.remove();
			setTimeout ( "setVoteEvent()", 100 );
		}
	});
});


function setVoteEvent(){
	$('.plus').on('click',function(){
		var id = $(this).parent().attr('id');
		var text = $(this).parent().text();
		var category = $(this).closest(".category").attr("id");
		//need to send the vote to the system
		var json = JSON.stringify({ text: text,  category: category, voted: 1, id: id });
		socket.send(json);
	});
}

var socket = new WebSocket('ws://localhost:8081/');
socket.onopen = function(event) {
}

socket.onmessage = function (event) {
	var json = event.data;
	var obj = JSON.parse(json);

	$("#"+obj.id).remove();

  	$("#"+obj.category+" ul").append(
		$("<li>").text(obj.text)
		.attr('id', obj.id)
		.data('votes', obj.votes)
		.draggable({
			revert: true
		})
		.append('<span class="plus"></span>')
	);
	setTimeout ( "setVoteEvent()", 100 );
}

function hyphenate(text){
	return text.replace(/[^a-zA-Z ]/g, "").replace(/ +/g, '-').toLowerCase();
}
