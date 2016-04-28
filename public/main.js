$(document).ready(function () {
    var socket = io();
    var user = {};
    var isFirstMsg = true;
    user.joinedAt = Date.now();
    user.Id = user.joinedAt;
    var firstMsg = '';
    
    $('#m').attr('readonly', 'readonly');
    $('#chat-send').attr('disabled', 'disabled');
    
    
    $('form[name="user-form"]').submit(function(){
      console.log('user form submitted');
      user.username = $('#username-input').val();
      socket.emit('userReg', JSON.stringify(user));
      
      $('#m').removeAttr( 'readonly' );
      $('#chat-send').removeAttr('disabled');
      $('#m').focus();
      $('#login-help-text').addClass('obsolete');
      $('#username-input').attr('disabled', 'disabled');
      return false;
    });
  
    $('form[name="chat-form"]').submit(function () {  
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
      var chatMainDiv = $('<div>').attr('class','mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-grid');
      var chatTextDiv = $('<div>').attr('class', 'chat-msg-text').append($('<span>').text(msg));
      var chatMetaDiv = $('<div>').attr('class', 'chat-msg-meta').append($('<span>').text(user.username));
      chatMainDiv.append([chatTextDiv, chatMetaDiv]);
      $('#messages').append(chatMainDiv);
    });
    socket.on('userEntered', function(msg) {
      var userEntered = JSON.parse(msg);
      if (userEntered.userId !== user.Id) {
        console.log(userEntered.msg);
        console.log(userEntered.currentUsers);
      }
    });
    
    
    
});
