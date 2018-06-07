$(document).ready(function() {
  // page is ready
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

          if (dateS.isValid() && dateE.isValid()) {
            $('#calendar').fullCalendar('renderEvent', {
              id: eventname+dateS,
              title: eventname,
              start: dateS,
              end: dateE,
              allDay:true

            
            });

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
    }

  }
    
  })
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
