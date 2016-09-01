
var http = require('http');
var express = require('express');
var WSS = require('ws').Server;

var app = express().use(express.static('public'));
var server = http.createServer(app);
server.listen(8080, '127.0.0.1');

var cards = [];

var wss = new WSS({ port: 8081 });
wss.on('connection', function(socket) {

  for(var i=0; i<cards.length; i++) {
      var item = cards[i];
      var json = JSON.stringify({ text: item.name, category: item.category, id: i, votes: item.votes });
      console.log("Sending to clients: " + json);
      socket.send(json);
  }

  socket.on('message', function(message) {
    console.log("Received: " + message);

    var obj = JSON.parse(message);

    //work out what the user sent to us
    if(typeof obj.text != 'undefined'){
      var text = obj.text;
      var category = obj.category;
      var id = obj.id;

      if (typeof id == 'undefined') {
        id = addCardToArray(text, category);
      } else {
        cards[id] = {name: text, category: category, votes: 0 };
      }

      wss.clients.forEach(function each(client) {
        var json = JSON.stringify({ text: text, category: category, id: id });
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