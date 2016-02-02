
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

var users = [];

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('firstMsg', function(msg) {
      var firstMsg = JSON.parse(msg);
      console.log(firstMsg);
  });
  
  socket.on('userReg', function(msg) {
      var user = JSON.parse(msg);
      users.push(user);
      var userEntered = {'userId': user.Id};
      userEntered.currnetUsers = users;
      userEntered.msg = user.username + " entered the room";
      io.emit('userEntered', JSON.stringify(userEntered) );
      console.log(users);
  });
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});
