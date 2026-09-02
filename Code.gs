function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Prevent errors if pinged without data
    if (!e || !e.postData || !e.postData.contents) {
       return ContentService.createTextOutput(JSON.stringify({"error": "No data received"})).setMimeType(ContentService.MimeType.JSON);
    }
    
    var data = JSON.parse(e.postData.contents);
    
    // Structure the payload to match Columns A through J
    var rowData = [
      data.status || "Need to Apply", 
      data.company || "",
      data.title || "",
      data.location || "",
      "", // Date Applied 
      "", // Closing Date
      data.url || "",
      data.interest || "Medium",
      "", // Salary
      data.notes || ""
    ];
    
    // Start scanning at Row 13 to bypass the dashboard and headers
    var startRow = 13;
    var columnBValues = sheet.getRange("B" + startRow + ":B").getValues();
    var targetRow = startRow;
    
    // Loop through Column B until we find an empty cell
    for (var i = 0; i < columnBValues.length; i++) {
      if (columnBValues[i][0] === "") {
        targetRow = startRow + i;
        break;
      }
    }
    
    // Insert the array into the exact row found, across 10 columns
    sheet.getRange(targetRow, 1, 1, 10).setValues([rowData]);
    
    return ContentService.createTextOutput(JSON.stringify({"result": "success", "row": targetRow}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({"error": error.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
