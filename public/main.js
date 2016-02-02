$(document).ready(function () {
    var socket = io();
    var user = {};
    var isFirstMsg = true;
    user.joinedAt = Date.now();
    user.Id = user.joinedAt;
    var firstMsg = '';
    socket.emit('userReg', JSON.stringify(user));
    $('form').submit(function(){
      socket.emit('chat message', $('#m').val());
      firstMsg = JSON.stringify({"isFirstMsg": isFirstMsg, "userId": user.Id})
      if(isFirstMsg){
        socket.emit('firstMsg', firstMsg);
      }
      $('#m').val('');
      isFirstMsg = false;
      return false;
    });
    socket.on('chat message', function(msg){
      $('#messages').append($('<li>').text(msg));
    });
});
