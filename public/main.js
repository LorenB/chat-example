$(document).ready(function () {
    var socket = io();
    var user = {};
    var isFirstMsg = true;
    user.joinedAt = Date.now();
    user.Id = user.joinedAt;
    var firstMsg = '';
    
    $('form').submit(function(){
      console.log('form submitted');
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
      $('#messages').append($('<div class="mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-grid">').text(msg));
      // $('#messages').append($('<li>').text(msg));
    });
    socket.on('userEntered', function(msg) {
      var userEntered = JSON.parse(msg);
      if (userEntered.userId !== user.Id) {
        console.log(userEntered.msg);
        console.log(userEntered.currentUsers);
      }
    });
    
    user.username = prompt("please choose a user name:");
    socket.emit('userReg', JSON.stringify(user));
    
});
