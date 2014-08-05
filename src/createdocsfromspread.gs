/**
 * Generate Google Docs based on a template document and data incoming from a Google Spreadsheet
 *
 * License: MIT
 *
 * Copyright 2013 Mikko Ohtamaa, http://opensourcehacker.com
 */

// Row number from where to fill in the data (starts as 1 = first row)
var CUSTOMER_ID = 1;

// Google Doc id from the document template
// (Get ids from the URL)
var SOURCE_TEMPLATE = "xxx";

// In which spreadsheet we have all the customer data
var CUSTOMER_SPREADSHEET = "yyy";

// In which Google Drive we toss the target documents
var TARGET_FOLDER = "zzz";

/**


 Source http://opensourcehacker.com/2013/01/21/script-for-generating-google-documents-from-google-spreadsheet-data-source/
 * Return spreadsheet row content as JS array.
 *
 * Note: We assume the row ends when we encounter
 * the first empty cell. This might not be 
 * sometimes the desired behavior.
 *
 * Rows start at 1, not zero based!!! :( 
 *
 */
function getRowAsArray(sheet, row) {
  var dataRange = sheet.getRange(row, 1, 1, 99);
  var data = dataRange.getValues();
  var columns = [];

  for (i in data) {
    var row = data[i];

    Logger.log("Got row", row);

    for(var l=0; l<99; l++) {
        var col = row[l];
        // First empty column interrupts
        if(!col) {
            break;
        }

        columns.push(col);
    }
  }

  return columns;
}

/**
 * Duplicates a Google Apps doc
 *
 * @return a new document with a given name from the orignal
 */
function createDuplicateDocument(sourceId, name) {
    var source = DocsList.getFileById(sourceId);
    var newFile = source.makeCopy(name);

    var targetFolder = DocsList.getFolderById(TARGET_FOLDER);
    newFile.addToFolder(targetFolder);

    return DocumentApp.openById(newFile.getId());
}

/**
 * Search a paragraph in the document and replaces it with the generated text 
 */
function replaceParagraph(doc, keyword, newText) {
  var ps = doc.getParagraphs();
  for(var i=0; i<ps.length; i++) {
    var p = ps[i];
    var text = p.getText();

    if(text.indexOf(keyword) >= 0) {
      p.setText(newText);
      p.setBold(false);
    }
  } 
}

/**
 * Script entry point
 */
function generateCustomerContract() {

  var data = SpreadsheetApp.openById(CUSTOMER_SPREADSHEET);

  // XXX: Cannot be accessed when run in the script editor?
  // WHYYYYYYYYY? Asking one number, too complex?
  //var CUSTOMER_ID = Browser.inputBox("Enter customer number in the spreadsheet", Browser.Buttons.OK_CANCEL);
  if(!CUSTOMER_ID) {
      return; 
  }

  // Fetch variable names
  // they are column names in the spreadsheet
  var sheet = data.getSheets()[0];
  var columns = getRowAsArray(sheet, 1);

  Logger.log("Processing columns:" + columns);

  var customerData = getRowAsArray(sheet, CUSTOMER_ID);  
  Logger.log("Processing data:" + customerData);

  // Assume first column holds the name of the customer
  var customerName = customerData[0];

  var target = createDuplicateDocument(SOURCE_TEMPLATE, customerName + " agreement");

  Logger.log("Created new document:" + target.getId());

  for(var i=0; i<columns.length; i++) {
      var key = columns[i] + ":"; 
      // We don't replace the whole text, but leave the template text as a label
      var text = customerData[i] || ""; // No Javascript undefined
      var value = key + " " + text;
      replaceParagraph(target, key, value);
  }

}