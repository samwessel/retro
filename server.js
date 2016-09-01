
var http = require('http');
var express = require('express');
var WSS = require('ws').Server;

var app = express().use(express.static('public'));
var server = http.createServer(app);
server.listen(8080, '127.0.0.1');

var wss = new WSS({ port: 8081 });
wss.on('connection', function(socket) {

  socket.on('message', function(message) {

    wss.clients.forEach(function each(client) {
      var json = JSON.stringify({ message });
      client.send(json);
    });
  });

  socket.on('close', function() {
  });

});