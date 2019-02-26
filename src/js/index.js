/* Parts of the item template to inject into HTML */
let dataField1 = '<div class="item" id="';
let dataField15 = '"><table><tr><td><input type="checkbox" class="item-select"></input></td><td class="itemName"><input type="text" value="';
let dataField2 = '" style="width: 100%;" oninput="save(this)"></input></td><td class="itemLocation"><select style="width: 100%;" oninput="save(this)"><option>';
let dataField3 = '</option></select></td><td class="itemAmount"><input type="number" value="';
let dataField4 = '" style="width: 100%;" oninput="save(this)"></input></td><td class="itemCounter"><select style="width: 100%;" oninput="save(this)"><option selected="selected">';
let dataField5 = '</option></select></td><td class="itemCountedDate"><input type="date" value="';
let dataField6 = '" style="width: 100%;" oninput="save(this)"></input></td><td class="item-reorder"><img src="/form" width="30" height="30" class="button" id="';
let dataField7 = '" style="margin-bottom: -0.3em;" onclick="startOrderForm(this)"/></td></tr></table></div>';

let dataContainer = $('#data-container'); // This is the container we append each item to
let orderForm = $('#createOrderForm'); // This is the order form modal
let newItem = $('#newItem'); // This is the new item modal
let itemToOrder; // Holds the part when the order form button is clicked on

let data, students; // These are gloabl variables to hold the values for lists
let locations = ["The Dungeon", "Electrical HQ"]; // Our array of possible locations
let teams = ["Mechanical", "Electrical", "Software", "Business"]; // Our array of possible sub-teams
let priorities = ["Whenever", "As soon as possible", "I needed it yesterday"]; // Our array of possible priorities

/**
 * Reads all of our JSON files to load our data, then calls displayData to show it on the screen
 */
$.get('/data', function (_data) { // Read the stored inventory data
  data = _data; // Widen scope
  $.get('/students', function (_students) { // Read the list of students
    students = _students; // Widen scope
    displayData(); // Display the data one all the data is read
  });
});

/**
 * Takes the saved data and displays it for the user
 */
function displayData() {
  for (var i = 0; i < data.length; i++) { // For each item in our saved data
    dataContainer.append(dataField1 + i + dataField15 + data[i].itemName + dataField2 + data[i].itemLocation + dataField3 + data[i].itemAmount + dataField4 + data[i].itemCounter + dataField5 + data[i].itemCountedDate + dataField6 + data[i].itemLink + dataField7); // Format and append the item to our data container
    var local = $('.itemLocation')[$('.itemLocation').length - 1]; // Get the location select
    for (var j = 0; j < locations.length; j++) { // For each location
      if (local.closest(".itemLocation").childNodes[0].childNodes[0].innerHTML != locations[j]) { // If it is not already an option
        local.childNodes[0].innerHTML += '<option>' + locations[j] + '</option>'; // Append it to the dropdown
      }
    }
    var counter = $('.itemCounter')[$('.itemCounter').length - 1]; // Get the counter select
    for (var j = 0; j < students.length; j++) { // For each student
      if (counter.closest(".itemCounter").childNodes[0].childNodes[0].innerHTML != students[j]) { // If it is not already an option
        counter.childNodes[0].innerHTML += '<option>' + students[j] + '</option>'; // Apend it to the dropdown
      }
    }
  }
  for (var i = 0; i < locations.length; i++) { // For each location
    $('#new-item-location').append('<option>' + locations[i] + '</option>'); // Append it to the new item modal dropdown
  }
  for (var i = 0; i < students.length; i++) { // For each student
    $('#new-item-counter').append('<option>' + students[i] + '</option>'); // Append it to the new item modal dropdown
    $('#order-form-creator').append('<option>' + students[i] + '</option>'); // Append it to the order form modal dropdown
  }
  for (var i = 0; i < teams.length; i++) { // For each team
    $('#order-form-team').append('<option>' + teams[i] + '</option>'); // Append it to the order form modal dropdown
  }
  for (var i = 0; i < priorities.length; i++) { // For each priority
    $('#order-form-priority').append('<option>' + priorities[i] + '</option>'); // Append it to the order form modal dropdown
  }
  checkForDuplicates(); // Highlight any duplicates on load
}

/**
 * Opens the order form modal
 * @param {*} obj item
 */
function startOrderForm(obj) {
  orderForm.toggle(); // Opens the order form modal
  itemToOrder = $(obj.parentNode.parentNode); // Selects the item that you clicked on as the one that will be ordered
}

/**
 * Searches the list of items
 */
function search() {
  var term = $('#searchBox').val(); // Gets the search term
  var items = $('.item'); // Gets every item
  for (var i = 0; i < items.length; i++) { // For each item
    if (!$(items[i].childNodes[0].childNodes[0].childNodes[0]).children('.itemName').children()[0].value.toLowerCase().includes(term.toLowerCase())) { // If the item name does not contain the search term
      $(items[i]).hide(); // Hide the item
    } else { // Otherwise
      $(items[i]).show(); // Show the item
    }
  }
}

/**
 * Generates an Excel spreadsheet order form
 */
function createOrderForm() {
  var date = new Date(); // Gets the current date
  var excel = $JExcel.new(); // Creates an Excel spreadsheet

  /* Set column widths */
  excel.set(0, 0, undefined, '25');
  excel.set(0, 3, undefined, '20');
  for (var i = 4; i < 7; i++) {
    excel.set(0, i, undefined, 0);
  }

  /* Create styles */
  var underline = excel.addStyle({ border: 'none, none, none, thin #333333' });
  var underline_curr = excel.addStyle({ border: 'none, none, none, thin #333333', format: '$#,##0.00', isstring: 'false' });
  var underline_num = excel.addStyle({ border: 'none, none, none, thin #333333', format: '@', isstring: 'false' });
  var underline_bold = excel.addStyle({ border: 'none, none, none, thin #333333', font: 'Arial 10 #333333 B' });
  var underline_bold_curr = excel.addStyle({ border: 'none, none, none, thin #333333', font: 'Arial 10 #333333 B', format: '$#,##0.00', isstring: 'false' });
  var overline_bold_center = excel.addStyle({ border: 'none, none, thin #333333, none', font: 'Arial 10 #333333 B', align: 'C' });
  var overline_bold_curr_center = excel.addStyle({ border: 'none, none, thin #333333, none', font: 'Arial 10 #333333 B', format: '$#,##0.00', isstring: 'false' });
  var underline_bold_center = excel.addStyle({ border: 'none, none, none, thin #333333', font: 'Arial 10 #333333 B', align: 'C' });
  var header = excel.addStyle({ font: 'Arial 20 #333333 B', border: 'none, none, none, thin #333333' });
  var right = excel.addStyle({ align: 'R' });
  var center = excel.addStyle({ align: 'C' });
  var center_curr = excel.addStyle({ format: '$#,##0.00', align: 'C' });

  /* Sheet name */
  excel.set({ sheet: 0, value: 'Order Form' });

  /* Header */
  for (var i = 0; i < 9; i++) {
    excel.set({ sheet: 0, row: 0, column: i, value: '', style: underline });
  }
  excel.set({ sheet: 0, row: 0, column: 1, value: 'Purchase Order Request Form', style: header });

  /* Name, date */
  excel.set({ sheet: 0, row: 1, column: 0, value: 'Name:' });
  excel.set({ sheet: 0, row: 1, column: 1, value: $('#order-form-creator').val(), style: underline });
  for (var i = 2; i < 7; i++) {
    excel.set({ sheet: 0, row: 1, column: i, value: '', style: underline });
  }
  excel.set({ sheet: 0, row: 1, column: 7, value: 'Date:' });
  excel.set({ sheet: 0, row: 1, column: 8, value: (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear(), style: underline });

  /* Team */
  excel.set({ sheet: 0, row: 2, column: 0, value: 'Team Proposing Purchase:' });
  excel.set({ sheet: 0, row: 2, column: 1, value: $('#order-form-team').val(), style: underline });
  for (var i = 2; i < 9; i++) {
    excel.set({ sheet: 0, row: 2, column: i, value: '', style: underline });
  }

  /* Method */
  excel.set({ sheet: 0, row: 3, column: 0, value: 'Method of Ordering:' });

  /* Store */
  excel.set({ sheet: 0, row: 4, column: 0, value: 'Store', style: right });
  excel.set({ sheet: 0, row: 4, column: 1, value: (new URL(itemToOrder.find('.item-reorder')[0].childNodes[0].id)).hostname.includes('www') ? capitalize((new URL(itemToOrder.find('.item-reorder')[0].childNodes[0].id)).hostname.split('.')[1]) : capitalize((new URL(itemToOrder.find('.item-reorder')[0].childNodes[0].id)).hostname.split('.')[0]), style: underline });
  for (var i = 2; i < 9; i++) {
    excel.set({ sheet: 0, row: 4, column: i, value: '', style: underline });
  }

  /* Website */
  excel.set({ sheet: 0, row: 5, column: 0, value: 'Website', style: right });
  excel.set({ sheet: 0, row: 5, column: 1, value: itemToOrder.find('.item-reorder')[0].childNodes[0].id, style: underline });
  for (var i = 2; i < 9; i++) {
    excel.set({ sheet: 0, row: 5, column: i, value: '', style: underline });
  }

  /* Priority */
  excel.set({ sheet: 0, row: 6, column: 0, value: 'Priority of Purchase:' });
  excel.set({ sheet: 0, row: 6, column: 1, value: $('#order-form-priority').val(), style: underline });
  for (var i = 2; i < 9; i++) {
    excel.set({ sheet: 0, row: 6, column: i, value: '', style: underline });
  }

  /* Quantity, price, notes */
  excel.set({ sheet: 0, row: 7, column: 1, value: 'Quantity', style: underline_bold });
  excel.set({ sheet: 0, row: 7, column: 2, value: 'Price', style: underline_bold });
  excel.set({ sheet: 0, row: 7, column: 3, value: 'Notes', style: underline_bold });
  excel.set({ sheet: 0, row: 8, column: 1, value: parseInt($('#order-form-amount').val()), style: underline_num });
  excel.set({ sheet: 0, row: 8, column: 2, value: parseFloat($('#order-form-price').val()), style: underline_curr });
  excel.set({ sheet: 0, row: 8, column: 3, value: $('#order-form-notes').val(), style: underline });

  /* Total */
  excel.set({ sheet: 0, row: 9, column: 2, value: 'Total:', style: right });
  excel.set({ sheet: 0, row: 9, column: 3, value: parseFloat($('#order-form-amount').val()) * parseFloat($('#order-form-price').val()), style: underline_bold_curr });

  /* Confirmation number, additional information */
  excel.set({ sheet: 0, row: 10, column: 0, value: 'Order Confirmation Number:' });
  for (var i = 1; i < 9; i++) {
    excel.set({ sheet: 0, row: 10, column: i, value: '', style: underline });
  }
  excel.set({ sheet: 0, row: 11, column: 0, value: 'Additional Information:' });
  for (var i = 1; i < 9; i++) {
    excel.set({ sheet: 0, row: 11, column: i, value: '', style: underline });
  }
  for (var i = 0; i < 9; i++) {
    excel.set({ sheet: 0, row: 13, column: i, value: '', style: underline });
  }

  /* Mentor form */
  excel.set({ sheet: 0, row: 13, column: 1, value: 'DO NOT FILL OUT BELOW THIS POINT', style: header });

  /* Date ordered, PO number */
  excel.set({ sheet: 0, row: 14, column: 0, value: 'Date Ordered', style: center });
  excel.set({ sheet: 0, row: 14, column: 1, value: '', style: center });
  for (var i = 1; i < 3; i++) {
    excel.set({ sheet: 0, row: 14, column: i, value: '', style: underline });
  }
  excel.set({ sheet: 0, row: 14, column: 3, value: 'Robotics PO Number:' });
  for (var i = 4; i < 9; i++) {
    excel.set({ sheet: 0, row: 14, column: i, value: '', style: underline });
  }

  /* Total, tax, shipping, grand total */
  excel.set({ sheet: 0, row: 15, column: 0, value: 'Total Cost', style: underline_bold_center });
  excel.set({ sheet: 0, row: 15, column: 1, value: 'Tax', style: underline_bold_center });
  excel.set({ sheet: 0, row: 15, column: 2, value: 'Shipping', style: underline_bold_center });
  excel.set({ sheet: 0, row: 15, column: 3, value: 'Grand Total', style: underline_bold_center });
  excel.set({ sheet: 0, row: 16, column: 0, value: 0.00, style: center_curr });
  excel.set({ sheet: 0, row: 16, column: 3, value: '=DOLLAR(A17+B17+C17)', style: overline_bold_center });

  /* Date recieved, BE PO number */
  excel.set({ sheet: 0, row: 17, column: 0, value: 'Date Item Recieved', style: center });
  for (var i = 1; i < 3; i++) {
    excel.set({ sheet: 0, row: 16, column: i, value: 0.00, style: underline_curr });
  }
  for (var i = 1; i < 3; i++) {
    excel.set({ sheet: 0, row: 17, column: i, value: '', style: underline });
  }
  excel.set({ sheet: 0, row: 17, column: 3, value: 'BE PO Number:' });
  for (var i = 4; i < 9; i++) {
    excel.set({ sheet: 0, row: 17, column: i, value: '', style: underline });
  }

  /* Recieved by */
  excel.set({ sheet: 0, row: 18, column: 0, value: 'Received By:', style: center });
  for (var i = 1; i < 9; i++) {
    excel.set({ sheet: 0, row: 18, column: i, value: '', style: underline });
  }

  /* Generate and download */
  excel.generate(itemToOrder.find('.itemName')[0].childNodes[0].value + ' Order Form by ' + $('#order-form-creator').val() + '.xlsx');

  /* Cleanup */
  orderForm.toggle(); // Close the modal
  $('#order-form-amount').val(''); // Reset values
  $('#order-form-price').val(''); // Reset values
  $('#order-form-creator').prop('selectedIndex', 0); // Reset values
  $('#order-form-team').prop('selectedIndex', 0); // Reset values
  $('#order-form-priority').prop('selectedIndex', 0); // Reset values
  $('#order-form-notes').val(''); // Reset values
}

/**
 * Adds a new item
 */
function add() {
  dataContainer.append(dataField1 + dataContainer.children().length + dataField15 + $('#new-item-name').val() + dataField2 + $('#new-item-location').val() + dataField3 + $('#new-item-amount').val() + dataField4 + $('#new-item-counter').val() + dataField5 + formatDate() + dataField6 + $('#new-item-link').val() + dataField7); // Format and append the item to our data container
  data.push({ "itemName": $('#new-item-name').val(), "itemLocation": $('#new-item-location').val(), "itemAmount": $('#new-item-amount').val(), "itemCounter": $('#new-item-counter').val(), "itemCountedDate": formatDate(), "itemLink": $('#new-item-link').val() }); // Add the new item to the data
  var local = dataContainer.find('.itemLocation')[dataContainer.children().length - 1]; // Get the location dropdown
  for (var i = 0; i < locations.length; i++) { // For each location
    if (!local.childNodes[0].innerHTML.includes(locations[i])) { // If the location is not already an option
      local.childNodes[0].innerHTML += '<option>' + locations[i] + '</option>'; // Append the location to the dropdown
    }
  }
  var counter = dataContainer.find('.itemCounter')[dataContainer.children().length - 1]; // Get the counter dropdown
  for (var i = 0; i < students.length; i++) { // For each student
    if (!counter.childNodes[0].innerHTML.includes(students[i])) { // If the counter is not already an option
      counter.childNodes[0].innerHTML += '<option>' + students[i] + '</option>'; // Append the counter to the dropdown
    }
  }
  write(); // Write the changes
  checkForDuplicates(); // Check for duplicates
  checkIfOut(); // Check for any amounts that are 0 or blank
  newItem.toggle(); // Close the modal
  $('#new-item-name').val(""); // Reset values
  $('#new-item-location').prop('selectedIndex', 0); // Reset values
  $('#new-item-amount').val(""); // Reset values
  $('#new-item-counter').prop('selectedIndex', 0); // Reset values
  $('#new-item-amount').val(""); // Reset values
  $('#new-item-link').val(""); // Reset values
}

/**
 * Saves the changed property
 * @param {*} obj 
 */
function save(obj) {
  for (var property in data[$(obj).closest(".item")[0].id]) { // For each property in our saved data
    if (property == obj.parentNode.className) { // If the property is the same as the property we've changed
      data[$(obj).closest(".item")[0].id][property] = obj.value; // Change the value in our saved data
      write(); // Write the changes
    }
  }
  checkForDuplicates(); // Check for duplicates
  checkIfOut(); // Check for any amounts that are 0 or blank
}

/**
 * Writes the data to data.json
 */
function write() {
  $.post("/save", JSON.stringify(data), function (_data, status) { // Send the data to the server to save
    if (status == 'success') { // If successful
      $('#message-box').css('background-color', '#4BB543'); // Turn status box green
      $('#message').text("Saved!"); // Say saved
      if ($('#message-box').css('top') == '15px') return; // If the status box is already displayed, return
      $('#message-box').animate({ top: '15px' }, 'slow').delay(1000); // Slide the status box on screen, then wait
      $('#message-box').animate({ top: '-30px' }, 'slow'); // Slide the status box off screen
    } else { // Otherwise
      $('#message-box').css('background-color', '#cc0000'); // Turn the status box red
      $('#message').text('Something went wrong...'); // Say an error
      if ($('#message-box').css('top') == '15px') return; // If the status box is already displayed, return
      $('#message-box').animate({ top: '15px' }, 'slow').delay(1000); // Slide the status box on screen, then wait
      $('#message-box').animate({ top: '-30px' }, 'slow'); // Slide the status box off screen
    }
  });
}

/**
 * Deletes the selected items
 */
function deleteSelected() {
  var checkboxes = $('.item-select'); // Gets all checkboxes
  var checked = 0; // Stores amount of checked checkboxes
  for (var i = 0; i < checkboxes.length; i++) { // For each checkbox
    if (checkboxes[i].checked) { // If it is checked
      checked++; // Increment number of checked checkbox
    }
  }
  if (checked == 0) return; // If no checkboxes are checked, return
  if (confirm("Are you sure you want to delete " + checked + (checked == 1 ? " item?" : " items?") + " This cannot be undone.")) { // Confirm the deletion
    for (var i = checkboxes.length - 1; i > -1; i--) { // For each checked checkbox
      if (checkboxes[i].checked) { // If it is checked
        checkboxes[i].closest(".item").remove(); // Remove the item
        data.splice(i, 1); // Splice the item from the saved data
      }
    }
    write(); // Write the changes
    checkForDuplicates(); // Check for duplicates
  }
}

/**
 * Highlights duplicate items
 */
function checkForDuplicates() {
  var exists = []; // Empty array
  var color = '#d3d3d3'; // Default color
  var otherColor = '#d3d3d3'; // Default other color
  for (var i = 0; i < $('.item').length; i++) { // For each item
    var name = $('.item').find('.itemName')[i].childNodes[0].value; // Get the item name
    var amount = $('.item').find('.itemAmount')[i].childNodes[0].value; // Get the item amount
    if (exists.includes(name) && exists.indexOf(name) != i) { // If the name exists already
      color = '#ffae42'; // Set the color to yellow
      otherColor = '#ffae42';
      if (amount == '' || amount == 0) { // If the amount is 0
        color = '#cc0000'; // Set the color to red
      }
      $('.item')[i].style.borderColor = color; // Change the border color
      $('#' + exists.indexOf(name)).css('border-color', otherColor); // Change the border color of the other item
    } else { // Otherwise
      color = '#d3d3d3';
      otherColor = '#d3d3d3';
      if (amount == '' || amount == 0) { // If the amount is blank or is equal to 0
        color = '#cc0000'; // Set the color to red
      }
      $('.item')[i].style.borderColor = color; // Change the border color
      $('#' + exists.indexOf(name)).css('border-color', otherColor); // Change the border color of the other item
    }
    exists.push(name); // Add the item name to exists
  }
}

/**
 * Highlights any out of stock items
 */
function checkIfOut() {
  for (var i = 0; i < $('.item').find('.itemAmount').length; i++) { // For each item
  }
}

/**
 * Formats a date into a HTML DOM-readable date
 */
function formatDate() {
  var d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear(); // Get the date, month, day, and year

  if (month.length < 2) month = '0' + month; // If it is a single digit, add a 0
  if (day.length < 2) day = '0' + day; // If it is a single digit, add a 0

  return [year, month, day].join('-'); // Return the date appended by dashes
}

/**
 * Capitalizes the first letter of the string
 * @param {*} string 
 */
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
