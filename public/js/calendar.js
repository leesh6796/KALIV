var nickname="";
var username="";
var roomID="";
var socket = io();
$.get('/chat/get/my/name', function(res) {
              //console.log(res);
            username = res.username;
            nickname = res.nickname;
            roomID = location.href.split('/')[4];

        
    });
$(function() {
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
          var dateE = moment(dateEnd);
          var eventid = eventname+dateS;
          if (dateS.isValid() && dateE.isValid()) {
            $('#calendar').fullCalendar('renderEvents', {
              id: eventid,
              title: eventname,
              start: dateS,
              end: dateE,
              allDay: true
              

            
            });
            
            var event ={nickname: nickname, roomID: roomID, eventId: eventid, eventName: eventname, startDate: dateS, endDate:dateE, allDay:true}
            socket.emit('new_event',event)

            alert('Great. Now, update your database...');
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
      var event ={nickname: nickname, roomID: roomID, eventId: calEvent._id};
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

