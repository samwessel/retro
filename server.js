
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

    var obj = JSON.parse(message);

    //work out what the user sent to use
    if(typeof obj.text != 'undefined'){
      var text = obj.text;
      console.log(addCardToArray(text));
      wss.clients.forEach(function each(client) {
        var json = JSON.stringify({ text: text });
        client.send(json);
      });
    }
  });

  socket.on('close', function() {
  });
});


function addCardToArray(text){
  cards.push({name: text, number: "0"});
  console.log(cards);
  return cards.length;  
}