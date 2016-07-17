$(document).ready(function(){

  //Socket stuff
  (function(){
    var getNode = function(s){
      return document.querySelector(s);
    },

    textarea = getNode('.tb-integrate'),
    chatName = getNode('.nameTemp');
    messagescont = getNode('.messages-container');

    setStatus = function(s){
      /*
        0 = All is good, message should post.
        1 = There was a user input error.
        2 = There was a connection/ user error.

      */
      $('.notify').removeClass( "good" );
      $('.notify').removeClass( "bad" );

      if(s == 0)
      {
        $('.notify').addClass("good");
        $('.notify').html("Your message has been posted.");
      }
      else if(s == 1)
      {
        $('.notify').addClass("bad");
        $('.notify').html("Ensure your message is not empty.");
      }
      else if(s == 2)
      {
        $('.notify').setClass("bad");
        $('.notify').html("There was a server error when posting your message.");
      }
    }

    try{
      var socket = io.connect('http://178.62.77.130:8080');
    }catch(e){
      //warn user of error
      console.log("Error connecting to socket.");
    }

    if(socket !== undefined){
      //listen for new messahes
      console.log("in defined socket.");

      socket.on('output', function(data){
        if(data.length){
          for(var x = 0; x < data.length; x= x+1){
            var message = document.createElement('div');
            var content = document.createElement('div');
            var pic = document.createElement('div');
            var img = document.createElement('img');
            var p = document.createElement('p');
            message.setAttribute('class', 'cbox');
            content.setAttribute('class', 'content');
            pic.setAttribute('class', 'pic');
            img.setAttribute('src', 'img/avatar_2.png');
            p.setAttribute('class', 'message');

            if(chatName.value !== data[x].name){
              message.setAttribute('class', 'cbox receive');
            }

            p.textContent = data[x].message;
            messagescont.appendChild(message);
            message.appendChild(content);
            content.appendChild(pic);
            content.appendChild(p);

            messagescont.insertBefore(message, messagescont.firstChild)

          }
        }
      });

      //status checks
      socket.on('status', function(data){
        console.log("In socketonstatus.");
        if(typeof data == 'object') {
          console.log("Is type of data.");
          setStatus(0);
        } else {
          console.log("Is NOT type of data.");
          setStatus(1);
        }
      });

      $('.send-btn').click(function(){
        var msg = textarea.value,
            name = chatName.value;
        socket.emit('input', {
          name: name,
          message: msg
        });

        showNotify();

        //For our testing environment, just make it so user can't change their username.
        $(".nameTemp").attr("disabled", "disabled");
        $(".tb-integrate").val("");

      });
    }

  })();

  //UI stuff

  $(".view").click(function(event)
  {
    var url = $(this).attr('url')
    $(".popup").html("<img src='"+url+"' alt=''>");
    $(".popup").dialog();
  });

  function showNotify(){
    var audio = document.getElementsByTagName("audio")[0];
    audio.play();
    $(".notify").slideDown();
    $(".notify").css("display" , "inline");
    $(".notify").delay(1400).slideUp();
  };

});
