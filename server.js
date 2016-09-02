
var http = require('http');
var express = require('express');
var WSS = require('ws').Server;

var app = express().use(express.static('public'));

var server = http.createServer(app);
server.listen(process.env.PORT, 'http://retro.azurewebsites.net/');
//server.listen(8080, '127.0.0.1');

var showResults = false

var cards = [];

var wss = new WSS({ port: process.env.PORT });
wss.on('connection', function(socket) {

  for(var i=0; i<cards.length; i++) {
      var item = cards[i];
      var json = JSON.stringify({ text: item.name, category: item.category, id: i, votes: item.votes });
      console.log("Sending to clients: " + json);
      socket.send(json);
      json = JSON.stringify({type: 'showresults'});
      console.log("Sending to clients: " + json);
      socket.send(json);
  }

  socket.on('message', function(message) {
    console.log("Received: " + message);

    var obj = JSON.parse(message);

    if(typeof obj.type != 'undefined'){
      switch (obj.type) {
        case 'updatecategory':
          updatedCategory(obj.id, obj.category);
          break;
      
        default:
          break;
      }

      return;
    }

    if(typeof obj.showResults != 'undefined'){
      wss.clients.forEach(function each(client) {
        var json = JSON.stringify({type: 'showresults'});
        console.log("Sending to clients: " + json);
        client.send(json);
      });
    }

    //If a vote feature
    if(typeof obj.voted != 'undefined'){
      var id = obj.id;
      console.log(obj.voted + ' = '+ cards[id].votes);

      votes = cards[id].votes + 1;

      cards[id].votes = votes;

      wss.clients.forEach(function each(client) {
        var json = JSON.stringify({id: id, votes: votes });
        console.log("Sending to clients: " + json);
        client.send(json);
      });

      return;
    }

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

function updatedCategory(id, category){
  cards[id].category = category;
  var text = cards[id].name;
  var votes = cards[id].votes;
  wss.clients.forEach(function each(client) {
    var json = JSON.stringify({ text: text, category: category, id: id, votes: votes });
    console.log("Sending to clients: " + json);
    client.send(json);
  });
}


function addCardToArray(text, category){
  cards.push({name: text, category: category, votes: 0 });
  return cards.length-1;  
}