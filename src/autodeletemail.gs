function auto_delete_mails() {  
  var label = GmailApp.getUserLabelByName("Delete Me");  
  if(label == null){
    GmailApp.createLabel('Delete Me');
  }
  else{
    var delayDays = 2 // Enter # of days before messages are moved to trash   
    var maxDate = new Date(); 
    maxDate.setDate(maxDate.getDate()-delayDays);    
    var threads = label.getThreads();  
    for (var i = 0; i < threads.length; i++) {  
      if (threads[i].getLastMessageDate()<maxDate){  
        threads[i].moveToTrash();
      } 
    } 
  }
}
//write by http://www.maketecheasier.com/autor/Damienof