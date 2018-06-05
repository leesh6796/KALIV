// JavaScript Document

// JavaScript Document




$(document).ready(function() {
    var elements;
    //add chat memebers
    //console.log(<%=enterChatRoom%>);
    $.get("/chat/get/enter/roomlist", function(roomlist) {
        for(var i=0;i< roomlist.length;i++)
        {
            document.getElementById("mySidenav").innerHTML = document.getElementById("mySidenav").innerHTML+ '<a onclick="redirectroom('+roomlist[i]+')"><img src="https://static.licdn.com/scds/common/u/images/themes/katy/ghosts/person/ghost_person_200x200_v1.png" style="height: 34px; width: 34px; margin-right:10px;"class="img-circle">'+roomlist[i]+'</a>';
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
    //add chatroom list
    
   
});
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
function insertChat(who, text, time){
    if (time === undefined){
        time = 0;
    }
    var control = "";
    var date = formatAMPM(new Date());
    
    if (who == "me"){
        control = '<li  class="left clearfix admin_chat">' +
                        
                        '<span class="chat-img1 pull-right"><img class="img-circle" alt="User Avatar"  src="'+ me.avatar +'" />'+'<div style="text-align:center;">'+me.username+'</div></span>' 
                        +
                            '<div class="bubble you clearfix">' +
                                '<p >'+ text +'</p>' +
                                '<div class="chat_time pull-left">'+date+'</div>' +
                        
                            '</div>'+

                    '</li>';                    
    }else{
        control = '<li class="left clearfix admin_chat">' +
                        
                        '<span class="chat-img1 pull-left"><img class="img-circle" alt="User Avatar" src="'+ you.avatar +'" /></span>' +
                            '<div class="bubble me clearfix">' +
                                '<p>'+ text +'</p>' +
                                '<div class="chat_time pull-right">'+date+'</div>' +
                            '</div>' +
                        
                    '</li>';
    }
    setTimeout(
        function(){ 
            var element = document.getElementById("chatroom");                       
            $("#chatroom").append(control).animate({scrollTop : element.scrollHeight });

            
        }, time);

    
}




function resetChat(){
    $("ul").empty();
}

$(".mytext").on("keydown", function(e){
    if (e.which == 13){
        var text = $(this).val();
        if (text !== ""){
            insertChat("me", text);              
            $(this).val('');
        }
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

function myfunction()
{

    var inserttext = document.getElementById('mytext').value;
    console.log(inserttext);
    if(inserttext != '\n' && inserttext !="")
    {
    insertChat("me",inserttext,0);
    document.getElementById('mytext').value="";
    }

}

function redirectroom(roomname)
{
    $.post('/chat/enter', {roomName: roomname, username:'leesh6796'}, function(res) {
        location.href = res;
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


<<<<<<< HEAD
//-- NOTE: No use time on insertChat.

function test()
{
    $.post('/chat/enter', {roomName: 'First Chat Room', username:'leesh6796'}, function(res) {
        location.href = res;
    });
}
=======
    

//-- NOTE: No use time on insertChat.
>>>>>>> 47334c888b3b14b59d718eda6285b4bb56a1ad74
