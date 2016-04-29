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
      if(user.username){
        appendMessageElem(msg, user);
      }
    });
    socket.on('userEntered', function(msg) {
      // if the user is logged in (selected a username) present new info
      if(user.username){
        $('.users-list').empty();
        var userElem;
        var userEntered = JSON.parse(msg);
        updateUserList(userEntered);
        
        if (userEntered.userId !== user.Id) {
          appendMessageElem(userEntered.text);
        }        
      }
    });
    socket.on('userLeft', function(msg) {
      if(user.username){
        console.log(msg);
        appendMessageElem(msg.text);
        updateUserList(msg);
      }
    });
    function updateUserList(msgObj){
      $('.users-list').empty();
      var userElem;
      for(var userIndex=0; userIndex < msgObj.currentUsers.length; userIndex+=1){
        if(msgObj.currentUsers[userIndex]['Id'] !== user.Id){
          userElem = $('<li>').append($('<a class="mdl-navigation__link" href="#">')).text(msgObj.currentUsers[userIndex].username);
          $('.users-list').append(userElem);          
        }
      }      
    }
    
    function appendMessageElem(msg, user){

      var chatMainDiv = $('<div>').attr('class','mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-grid');
      var chatTextDiv = $('<div>').attr('class', 'chat-msg-text').append($('<span>').text(msg));
      var chatMetaDiv = $('<div>').attr('class', 'chat-msg-meta')
      // if the message was user generated
      if(user){
        chatMetaDiv.append($('<span>').text(user.username));        
      } else { // if the message was system generated
        chatMetaDiv.append($('<span>').text('system'));
      }

      chatMainDiv.append([chatTextDiv, chatMetaDiv]);
      $('#messages').append(chatMainDiv);
    }
    
});
