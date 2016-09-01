var categories = ["What went well?", "What could have gone better?"];
//var categories = ["Mad", "Sad", "Glad"];

$(function(){
	categories.forEach(function(category) {
		$("#wall").append(
			$("<div>").addClass("category").attr("id", hyphenate(category))
			.append($("<h2>").text(category))
			.append($("<ul>"))
		);
	});

	$('form').on('submit',function(e){
		e.preventDefault();
		var text = $("#description").val();
		if(text == ''){
			return;
		}

		$("#myitems").append(
			$("<li>")
			.addClass("draggable")
			.text(text)
			.draggable({
				revert: true,
				zIndex: 100
			})
		);

		$("#description").val("");
	})

	$(".category").droppable({
		hoverClass: "drop-hover",
		drop: function(event, ui) {
			var category = $(this).attr("id");
			var previousCategory = ui.draggable.closest(".category").attr("id")
			
			if (category != previousCategory) {
				var text = ui.draggable.text();
				var id = ui.draggable.attr("id");
				var json = JSON.stringify({ text: text,  category: category, id: id });

				socket.send(json);
				ui.draggable.remove();
				setTimeout ( "setVoteEvent()", 100 );
			}
		}
	});
});


function setVoteEvent(){
	$('.plus').off('click');
	$('.plus').on('click',function(){
		var id = $(this).parent().attr('id');
		var json = JSON.stringify({voted: 1, id: id });
		socket.send(json);
	});
}

var socket = new WebSocket('ws://localhost:8081/');
socket.onopen = function(event) {
}

socket.onmessage = function (event) {
	var json = event.data;
	var obj = JSON.parse(json);

	if(typeof obj.text == 'undefined'){
		$("#"+obj.id).attr('data-votes',obj.votes);
		return;
	}

	$("#"+obj.id).remove();

  	$("#"+obj.category+" ul").append(
		$("<li>").text(obj.text).attr('id', obj.id).data('votes', obj.votes).draggable({ revert: true, zIndex: 100 })
		.append('<span class="plus"></span>')
	);
	setTimeout ( "setVoteEvent()", 100 );
}

function hyphenate(text){
	return text.replace(/[^a-zA-Z ]/g, "").replace(/ +/g, '-').toLowerCase();
}
