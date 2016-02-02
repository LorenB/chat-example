$(document).ready(function () {
    var socket = io();
    var isFirstMsg = true;
    var userId = Date.now();
    var firstMsg = '';
    $('form').submit(function(){
      socket.emit('chat message', $('#m').val());
      firstMsg = JSON.stringify({"isFirstMsg": isFirstMsg, "userId": userId})
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
