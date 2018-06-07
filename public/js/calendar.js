// JavaScript Document

// JavaScript Document

var socket = io();
var username = '';
var nickname = '';
var roomID = '';
var messageList = []; // json List
var messageCount = 0; // json Count
var memberset = [];
var roomname="";
var events =[];
$(document).ready(function() {
    var elements;
    //add chat memebers
    //console.log(<%=enterChatRoom%>);
    $.get("/chat/get/enter/roomlist", function(roomlist) {
        for(var i=0;i< roomlist.length;i++)
        {
            document.getElementById("mySidenav").innerHTML = document.getElementById("mySidenav").innerHTML + '<a onclick=\"redirectroom(\''+roomlist[i]+ '\')\"><img src=\"https://static.licdn.com/scds/common/u/images/themes/katy/ghosts/person/ghost_person_200x200_v1.png\" style=\"height: 34px; width: 34px; margin-right:10px;\" class=\"img-circle\">' + roomlist[i] + '</a>';
        }
    });
    

    $(".mytext").on("keyup", function(e){

        if ((e.keyCode || e.which) == 13){
            sendMessage();
         document.getElementById('mytext').value = "";
        }
    });
    
    // 채팅방 세팅
    $.get('/chat/get/my/name', function(res) {
        //console.log(res);
        username = res.username;
        nickname = res.nickname;
        roomID = location.href.split('/')[4];

        socket.emit('join', {roomID: roomID, username: username});
    });

    socket.on('exit_success', function(params) {
        location.href = '/';
    });

    socket.on('load_message', function(params) {
        let messages = params;

        messageList = messages;
        messageCount = messageList.length;

        let i;
        for(i=0; i<messageList.length; i++)
        {
            let msg = messageList[i];
            let sender = msg.nickname === nickname ? "me" : msg.nickname;
            insertChat(sender, msg.text, 0, true);
        }

        var element = document.getElementById("chatroom");
        $("#chatroom").scrollTop(element.scrollHeight);
    });

    socket.on('room_name', function(params) {
        let roomName = params.roomName;
        roomname = roomName;
        console.log(roomname);
        document.getElementById("chatroomname").innerHTML = roomname;
    });

    socket.on('new_message', function(params) {
        let sender = params.nickname;
        let text = params.text;

        messageList.push(params);
        messageCount++;

        if(sender === nickname) 
        {
            sender = "me";
            insertChat(sender, text, 0,true);
        }
        else
        {
            insertChat(sender, text, 0,false);
        }
    });

    socket.on('chat_member_change', function(params) {
        let type = params.type;

        if(type === 'join') // 새로운 멤버가 채팅방에 접속
        {
            let newMember = params.nickname;
            if(memberset.indexOf(newMember) < 0)
            {
                memberset.push(newMember);
                makememberlist();
            }
        }
        else if(type === 'exit') // 한 멤버가 퇴장
        {
            let exitMember = params.nickname;
            let index = memberset.indexOf(exitMember);
            memberset.splice(index, 1);
            makememberlist();
        }
        else if(type === 'update') // 채팅방 처음 접속했을 때 참여자 목록 받기
        {
            let members = params.members;
            memberset = members;
            makememberlist();
        }
    });
    socket.on('load_event', function(params) {
      let eventlist = params;
      events = eventlist;
      console.log(events);
      for(var i=0;i<events.length;i++)
      {
        $('#calendar').fullCalendar('renderEvent', {
              id: events[i].eventID,
              title: events[i].name,
              start: events[i].startDate,
              end: events[i].endDate,
              allDay: true
              

            
            });
      }
    });
    
    $('#calendar').fullCalendar({
      // emphasizes business hours

// header
header: {
  left: 'prev,next today addEventButton',
  center: 'title',
  right: 'month,agendaWeek,agendaDay'
},
customButtons: {
      addEventButton: {
        text: 'add event',
        click: function() {
          var eventname = prompt('Enter a event name');
          var dateStart = prompt('Enter a start date in YYYY-MM-DD format');
          var dateEnd = prompt('Enter a end date in YYYY-MM-DD format');
          var dateS = moment(dateStart);
          var dateE = moment(dateEnd).add(24, 'hours')
          var eventid = eventname+dateS;
          if (dateS.isValid() && dateE.isValid()) {
            $('#calendar').fullCalendar('renderEvent', {
              id: eventid,
              title: eventname,
              start: dateS,
              end: dateE,
              allDay: true
              

            
            });
            
            var event ={nickname: nickname, roomID: roomID, eventID: eventid, eventName: eventname, startDate: dateS, endDate:dateE, allDay:true}
            socket.emit('new_event',event);
            //alert('Great. Now, update your database...');
          } else {
            alert('Invalid date.');
          }
        }
      }
    },
    eventClick: function(calEvent, jsEvent, view) {

    /*alert('Event: ' + calEvent.title);
    alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
    alert('View: ' + view.name);

    // change the border color just for fun
    $(this).css('border-color', 'red');*/
    var remove = confirm("Do you want to remove?");
    if(remove)
    {
      $('#calendar').fullCalendar('removeEvents', calEvent._id);
      var event ={nickname: nickname, roomID: roomID, eventID: calEvent._id};
      console.log(event);
      socket.emit('remove_event',event)
    }

  }
    
  });

      var elements;
    //add chat memebers
   
    $.get("/chat/get/enter/roomlist", function(roomlist) {
        for(var i=0;i< roomlist.length;i++)
        {
            document.getElementById("mySidenav").innerHTML = document.getElementById("mySidenav").innerHTML + '<a onclick=\"redirectroom(\''+roomlist[i]+ '\')\"><img src=\"https://static.licdn.com/scds/common/u/images/themes/katy/ghosts/person/ghost_person_200x200_v1.png\" style=\"height: 34px; width: 34px; margin-right:10px;\" class=\"img-circle\">' + roomlist[i] + '</a>';
        }
    });
    for(var i=0; i< 2;i++)
    {
        elements = '<li class="chatmembox"><img class="chat-img2 img-circle" alt="User Avatar"  src="https://static.licdn.com/scds/common/u/images/themes/katy/ghosts/person/ghost_person_200x200_v1.png"> &nbsp me &nbsp&nbsp <i class = "fa fa-thumbs-up"></i> &nbsp<i class = "fa fa-thumbs-down"></i></li>';
        $("#chatmember").append(elements);
    }

    $(".mytext").on("keyup", function(e){

        if ((e.keyCode || e.which) == 13){
            myfunction();
         document.getElementById('mytext').value = "";
        }
    });
});


function makememberlist()
{
    $('#chatmember').empty();
    for(var i=0; i< memberset.length;i++)
    {
        elements = '<li class="chatmembox"><img class="chat-img2 img-circle" alt="User Avatar"  src="https://static.licdn.com/scds/common/u/images/themes/katy/ghosts/person/ghost_person_200x200_v1.png"> &nbsp'+ memberset[i]+'&nbsp&nbsp <i class = "fa fa-thumbs-up"></i> &nbsp<i class = "fa fa-thumbs-down"></i></li>';
        $("#chatmember").append(elements);
    }
}

var me = {};
me.avatar = "https://static.licdn.com/scds/common/u/images/themes/katy/ghosts/person/ghost_person_200x200_v1.png";
me.username="me";
var you = {};
you.avatar = "https://static.licdn.com/scds/common/u/images/themes/katy/ghosts/person/ghost_person_200x200_v1.png";
you.username="you";

function enter(name)
{
    roomName.value=name;
    roomForm.submit();
}
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}            

//-- No use time. It is a javaScript effect.
function insertChat(who, text, time, noScroll=false){
    if (time === undefined){
        time = 0;
    }
    var control = "";
    var date = formatAMPM(new Date());
    
    if (who == "me"){
        
            control = '<li  class="left clearfix admin_chat">' +
                        
                        '<span class="chat-img1 pull-right"><img class="img-circle" alt="User Avatar"  src="'+ me.avatar +'" />'+'<div style="text-align:center; font-size:5px">'+nickname+'</div></span>' 
                        +
                            '<div class="bubble you clearfix">' +
                                '<p >'+ text +'</p>' +
                                '<div class="chat_time pull-left">'+date+'</div>' +
                        
                            '</div>'+

                    '</li>'; 
                                     
    }else{
        control = '<li class="left clearfix admin_chat">' +
                        
                        '<span class="chat-img1 pull-left"><img class="img-circle" alt="User Avatar" src="'+ you.avatar +'" />'+'<div style="text-align:center;font-size:5px">'+who+'</div></span>' +
                            '<div class="bubble me clearfix">' +
                                '<p>'+ text +'</p>' +
                                '<div class="chat_time pull-right">'+date+'</div>' +
                            '</div>' +
                        
                    '</li>';
    }

    
    setTimeout(
        function(){ 
            var element = document.getElementById("chatroom"); 
                                  
            $("#chatroom").append(control);//.animate({scrollTop : element.scrollHeight });
            if(noScroll)
            {
                $("#chatroom").scrollTop(element.scrollHeight);

            }
            else
            {
                 $("#chatroom").scrollTop($("#chatroom").scrollTop());
            }
    })
}





function resetChat(){
    $("ul").empty();
}

$(".mytext").on("keydown", function(e){
    if (e.which == 13){
        sendMessage();
    }
});

$('body > div > div > div:nth-child(2) > span').click(function(){
    $(".mytext").trigger({type: 'keydown', which: 13, keyCode: 13});
})



//-- Clear Chat
resetChat();
// Get the input field
/*var input = document.getElementById("mytext");

// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
  // Cancel the default action, if needed
  event.preventDefault();
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Trigger the button element with a click
    myfunction();
  }
});*/

function outroom()
{
    var out = confirm("Are you sure to go out?");
    if(out)
    {
        socket.emit('exit', {
            roomID: roomID,
            username: username
        });
    }
}

function sendMessage()
{
    /*var inserttext = document.getElementById('mytext').value;
    console.log(inserttext);
    if(inserttext != '\n' && inserttext !="")
    {
    insertChat("me",inserttext,0);
    document.getElementById('mytext').value="";
    }*/
    let text = $('#mytext').val();
    if(text !== '\n' && text !== '')
    {
        let params = {username:username, roomID: roomID, message:text};
        socket.emit('new_message', params);

        $('#mytext').val('');
    }
}

function redirectroom(roomname)
{
    $.get('/chat/get/my/name', function(res) {
        let username = res.username;
        $.post('/chat/enter', {roomName: roomname, username:username}, function(res) {
            location.href = res;
        });
    });
}
/* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";

}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";

}
//-- Print Messages
/*insertChat("me", "Hello Tom...", 0);  
insertChat("you", "Hi, Pablo", 1500);
insertChat("me", "What would you like to talk about today?", 3500);
insertChat("you", "Tell me a joke",7000);
insertChat("me", "Spaceman: Computer! Computer! Do we bring battery?!", 9500);
insertChat("you", "LOL", 12000);*/


//-- NOTE: No use time on insertChat.




