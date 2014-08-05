function sendEmails() 
{
 
  var sheet = SpreadsheetApp.getActiveSheet();

  var numRows = sheet.getLastRow();  

  var dataRange = sheet.getRange(1, 1, numRows, 2)

  var data = dataRange.getValues();
  for (var i = 0; i < data.length; ++i) 
  {
    var row = data[i];
    var name = row[0]; 
    var email = row[1];        
    var subject = "Тема письма";
    var message = "Здравствуйте, " + name + "!";    

    MailApp.sendEmail(email, subject, message);
  }
}
//
