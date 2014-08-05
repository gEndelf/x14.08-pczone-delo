function Gmail_send_sms(){
  var label = GmailApp.getUserLabelByName("Send Text");  
  if(label == null){
    GmailApp.createLabel('Send Text');
  }
  else{
    var threads = label.getThreads();  
    var now = new Date().getTime();
    for (var i = 0; i < threads.length; i++) {  
      var message = threads[i].getMessages()[0];
      var from = message.getFrom();
      var subject = message.getSubject();
      CalendarApp.createEvent(subject, new Date(now+60000), new Date(now+60000), {location: from}).addSmsReminder(0);
    }
    label.removeFromThreads(threads);
  }
}
//write by http://www.maketecheasier.com/autor/Damienof