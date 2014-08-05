function eventstospreadsheet(){
 
  var cal = CalendarApp.getDefaultCalendar();
  var sheet = SpreadsheetApp.getActiveSheet();
   
  var events = cal.getEvents(new Date("March 8, 2010"), new Date("March 14, 2010"));
  for (var i=0;i<events.length;i++) {
     var details=[[events[i].getTitle(), events[i].getDescription(), events[i].getStartTime(), events[i].getEndTime()]];
    var row=i+1;
    var range=sheet.getRange(row,1,1,4);
    range.setValues(details);
  }
}
