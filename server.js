
var http = require('http');
var express = require('express');
var WSS = require('ws').Server;

var app = express().use(express.static('public'));
var server = http.createServer(app);
server.listen(8080, '127.0.0.1');

var cards = [];

var wss = new WSS({ port: 8081 });
wss.on('connection', function(socket) {

  socket.on('message', function(message) {
    console.log("Received: " + message);

    var obj = JSON.parse(message);

    //work out what the user sent to us
    if(typeof obj.text != 'undefined'){
      var text = obj.text;
      var category = obj.category;
      var id = obj.id;
      var votes = 0;

      if (typeof id == 'undefined') {
        id = addCardToArray(text, category);
      } else {
        cards[id] = {name: text, category: category};
      }
      console.log(votes);

      if(typeof obj.voted != 'undefined'){
        
      console.log(obj.voted + ' = '+ cards[id].votes);
        if(typeof cards[id].votes == 'undefined'){
          votes = 1;
        }else{
          votes = cards[id].votes;
          votes += 1;
        }
        cards[id] = {name: text, category: category, id: id, votes: votes };
      }
      console.log(votes);

      wss.clients.forEach(function each(client) {
        var json = JSON.stringify({ text: text, category: category, id: id, votes: votes });
        console.log("Sending to clients: " + json);
        client.send(json);
      });
    }
  });

  socket.on('close', function() {
  });
});


function addCardToArray(text, category){
  cards.push({name: text, category: category, votes: 0 });
  return cards.length-1;  
}

function isNaN(x)
{ 
    return x != x; 
}