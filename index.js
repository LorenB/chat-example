
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
  });
  
  socket.on('userReg', function(msg) {
      var user = JSON.parse(msg);
      user['socketId'] = socket.id;
      users.push(user);
      var userEntered = {'userId': user.Id};
      userEntered.currentUsers = users;
      userEntered.text = user.username + " entered the room";
      io.emit('userEntered', JSON.stringify(userEntered) );
  });
  socket.on('disconnect', function(){
    for(var userIndex=0; userIndex < users.length; userIndex+=1){
      if(users[userIndex]['socketId'] === socket.id){
        var msgObj = {};
        // get leaving users name before removing user form list
        msgObj.text = users[userIndex]['username'] + ' left the room';
        users.splice(userIndex, 1);
        // emit message with the leaving user removed from the list of users
        msgObj['currentUsers'] = users;
        console.log('msgObj: ');
        console.log(msgObj);
        io.emit('userLeft', msgObj );
      }
    }
    
    console.log(socket.id + ' disconnected');
    
  });
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});
