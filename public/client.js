var categories = ["What went well?", "What could have gone better?"];
//var categories = ["Mad", "Sad", "Glad"];

var showResultsAlways = false;
var retroID;

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

			if(typeof ui.draggable.attr("id") != 'undefined'){
				var id = ui.draggable.attr("id");
				var json = JSON.stringify({ type: 'updatecategory',  category: category, id: id });
				socket.send(json);
				ui.draggable.remove();
				setTimeout ( "setVoteEvent()", 100 );
				return true;
			}

			
			if (category != previousCategory) {
				var text = ui.draggable.text();
				var id = ui.draggable.attr("id");
				console.log(retroID);
				var json = JSON.stringify({ text: text,  category: category, id: id, retro: retroID });

				socket.send(json);
				ui.draggable.remove();
				setTimeout ( "setVoteEvent()", 100 );
			}else{
				var json = JSON.stringify({ type: 'updatecategory',  category: category, id: id });
				socket.send(json);
			}
		}
	});

	$(".showresults").on('click',function(){
		var json = JSON.stringify({ showResults: true });
		socket.send(json);
	});

	

	$('#addretro').on('submit',function(e){
		e.preventDefault();
		var text = $("#retro-name").val();
		$("#retro-name").val("");

		var json = JSON.stringify({ type: 'add-retro', name: text });
		socket.send(json);
	});

	$("#resetbutton").on('click',function(){
		location.reload();
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

//var socket = new WebSocket('ws://retro.azurewebsites.net/');
var socket = new WebSocket('ws://localhost:8081/');
socket.onopen = function(event) {
}

socket.onmessage = function (event) {
	var json = event.data;
	var obj = JSON.parse(json);

	if(typeof obj.type != 'undefined'){
		switch (obj.type) {
			case 'showresults':
				showResultsAlways = true;
				showResults();
				break;
			case 'retros':
				addRetrosToPage(obj,socket);
				break;
		
			default:
				showResults();
				break;
		}
	}

	if(typeof obj.text == 'undefined'){
		$("#"+obj.id).data('votes',obj.votes);
		if(showResultsAlways){
			showResults();
		}
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


function showResults(){
	$('li .votes').each(function(){
		$(this).remove();
	})
	$('li').each(function(){

		var votes = $(this).data().votes;
		$(this).append('<span class="votes">'+votes+'</span>');
	});
}

function addRetrosToPage(retro,socket){
	var id = retro.id;
	$("#joinretro").append(
		$('<li>').text(retro.text).data('id',id)
	);
	setRetroClickEvent(socket);
}


function setRetroClickEvent(socket){
	$("ul#joinretro li").off('click');
	$("ul#joinretro li").on('click',function(){
		retroID = $(this).data('id');
		$('#welcome').hide();
		$('#retro').show();
		var json = JSON.stringify({type: 'selected-retro', id: retroID });
		socket.send(json);
	});
}