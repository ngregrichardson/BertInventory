let dataField1 = '<div class="item" id="';
let dataField15 = '"><table><tr><td><input type="checkbox" class="item-select"></input></td><td class="itemName"><input type="text" value="';
let dataField2 = '" style="width: 100%;" oninput="save(this)"></input></td><td class="itemLocation"><select style="width: 100%;" oninput="save(this)"><option>';
let dataField3 = '</option></select></td><td class="itemAmount"><input type="number" value="';
let dataField4 = '" style="width: 100%;" oninput="save(this)"></input></td><td class="itemCounter"><select style="width: 100%;" oninput="save(this)"><option selected="selected">';
let dataField5 = '</option></select></td><td class="itemCountedDate"><input type="date" value="';
let dataField6 = '" style="width: 100%;" oninput="save(this)"></input></td><td class="item-reorder"><img src="/form" width="30" height="30" class="button" id="';
let dataField7 = '" style="margin-bottom: -0.3em;" onclick="startOrderForm(this)"/></td></tr></table></div>';

let partOrder;

let dataContainer = $('#data-container');
let orderForm = $('#createOrderForm');
let newItem = $('#newItem');

let data, students, locations, teams, priorities;
$.get('/data', function (_data) {
  data = _data;
  $.get('/students', function (_students) {
    students = _students;
    $.get('/locations', function (_locations) {
      locations = _locations;
      $.get('/teams', function (_teams) {
        teams = _teams;
        $.get('/priorities', function (_priorities) {
          priorities = _priorities;
          displayData();
        });
      });
    });
  });
});

function displayData() {
  for (var i = 0; i < data.length; i++) {
    dataContainer.append(dataField1 + i + dataField15 + data[i].itemName + dataField2 + data[i].itemLocation + dataField3 + data[i].itemAmount + dataField4 + data[i].itemCounter + dataField5 + data[i].itemCountedDate + dataField6 + data[i].itemLink + dataField7);
  }
  var locals = $('.itemLocation');
  for (var j = 0; j < locals.length; j++) {
    for (var k = 0; k < locations.length; k++) {
      if (locals[j].closest(".itemLocation").childNodes[0].childNodes[0].innerHTML != locations[k]) {
        locals[j].childNodes[0].innerHTML += '<option>' + locations[k] + '</option>';
      }
    }
  }
  var counters = $('.itemCounter');
  for (var j = 0; j < counters.length; j++) {
    for (var k = 0; k < students.length; k++) {
      if (counters[j].closest(".itemCounter").childNodes[0].childNodes[0].innerHTML != students[k]) {
        counters[j].childNodes[0].innerHTML += '<option>' + students[k] + '</option>';
      }
    }
  }
  var newItemLocation = $('#new-item-location');
  for (var i = 0; i < locations.length; i++) {
    newItemLocation.append('<option>' + locations[i] + '</option>');
  }
  var newItemStudents = $('#new-item-counter');
  for (var i = 0; i < students.length; i++) {
    newItemStudents.append('<option>' + students[i] + '</option>');
  }
  var orderFormStudents = $('#order-form-creator');
  for (var i = 0; i < students.length; i++) {
    newItemStudents.append('<option>' + students[i] + '</option>');
    orderFormStudents.append('<option>' + students[i] + '</option>');
  }
  var orderFormTeams = $('#order-form-team');
  for (var i = 0; i < teams.length; i++) {
    orderFormTeams.append('<option>' + teams[i] + '</option>');
  }
  var orderFormPriorities = $('#order-form-priority');
  for (var i = 0; i < priorities.length; i++) {
    orderFormPriorities.append('<option>' + priorities[i] + '</option>');
  }
  checkForDuplicates();
}

function startOrderForm(obj) {
  orderForm.toggle();
  partOrder = $(obj.parentNode.parentNode);
}

function search() {
  var term = $('#searchBox').val();
  var items = $('.item');
  for (var i = 1; i < items.length; i++) {
    if (!$(items[i].childNodes[0].childNodes[0].childNodes[0]).children('.itemName').children()[0].value.toLowerCase().includes(term.toLowerCase())) {
      $(items[i]).hide();
    } else {
      $(items[i]).show();
    }
  }
}

function createOrderForm() {
  var date = new Date();
  var excel = $JExcel.new();
  excel.set(0, 0, undefined, '25');
  excel.set(0, 3, undefined, '20');
  for (var i = 4; i < 7; i++) {
    excel.set(0, i, undefined, 0);
  }
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
  for (var i = 0; i < 9; i++) {
    excel.set({ sheet: 0, row: 0, column: i, value: '', style: underline });
  }
  excel.set({ sheet: 0, row: 0, column: 1, value: 'Purchase Order Request Form', style: header });
  excel.set({ sheet: 0, value: 'Order Form' });
  excel.set({ sheet: 0, row: 1, column: 0, value: 'Name:' });
  excel.set({ sheet: 0, row: 1, column: 1, value: $('#order-form-creator').val(), style: underline });
  for (var i = 2; i < 7; i++) {
    excel.set({ sheet: 0, row: 1, column: i, value: '', style: underline });
  }
  excel.set({ sheet: 0, row: 1, column: 7, value: 'Date:' });
  excel.set({ sheet: 0, row: 1, column: 8, value: (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear(), style: underline });
  excel.set({ sheet: 0, row: 2, column: 0, value: 'Team Proposing Purchase:' });
  excel.set({ sheet: 0, row: 2, column: 1, value: $('#order-form-team').val(), style: underline });
  for (var i = 2; i < 9; i++) {
    excel.set({ sheet: 0, row: 2, column: i, value: '', style: underline });
  }
  excel.set({ sheet: 0, row: 3, column: 0, value: 'Method of Ordering:' });
  excel.set({ sheet: 0, row: 4, column: 0, value: 'Store', style: right });
  excel.set({ sheet: 0, row: 4, column: 1, value: (new URL(partOrder.find('.item-reorder')[0].childNodes[0].id)).hostname.includes('www') ? capitalize((new URL(partOrder.find('.item-reorder')[0].childNodes[0].id)).hostname.split('.')[1]) : capitalize((new URL(partOrder.find('.item-reorder')[0].childNodes[0].id)).hostname.split('.')[0]), style: underline });
  for (var i = 2; i < 9; i++) {
    excel.set({ sheet: 0, row: 4, column: i, value: '', style: underline });
  }
  excel.set({ sheet: 0, row: 5, column: 0, value: 'Website', style: right });
  excel.set({ sheet: 0, row: 5, column: 1, value: partOrder.find('.item-reorder')[0].childNodes[0].id, style: underline });
  for (var i = 2; i < 9; i++) {
    excel.set({ sheet: 0, row: 5, column: i, value: '', style: underline });
  }
  excel.set({ sheet: 0, row: 6, column: 0, value: 'Priority of Purchase:' });
  excel.set({ sheet: 0, row: 6, column: 1, value: $('#order-form-priority').val(), style: underline });
  for (var i = 2; i < 9; i++) {
    excel.set({ sheet: 0, row: 6, column: i, value: '', style: underline });
  }
  excel.set({ sheet: 0, row: 7, column: 1, value: 'Quantity', style: underline_bold });
  excel.set({ sheet: 0, row: 7, column: 2, value: 'Price', style: underline_bold });
  excel.set({ sheet: 0, row: 7, column: 3, value: 'Notes', style: underline_bold });
  excel.set({ sheet: 0, row: 8, column: 1, value: parseInt($('#order-form-amount').val()), style: underline_num });
  excel.set({ sheet: 0, row: 8, column: 2, value: parseFloat($('#order-form-price').val()), style: underline_curr });
  excel.set({ sheet: 0, row: 8, column: 3, value: $('#order-form-notes').val(), style: underline });
  excel.set({ sheet: 0, row: 9, column: 2, value: 'Total:', style: right });
  excel.set({ sheet: 0, row: 9, column: 3, value: parseFloat($('#order-form-amount').val()) * parseFloat($('#order-form-price').val()), style: underline_bold_curr });
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
  excel.set({ sheet: 0, row: 13, column: 1, value: 'DO NOT FILL OUT BELOW THIS POINT', style: header });
  excel.set({ sheet: 0, row: 14, column: 0, value: 'Date Ordered', style: center });
  excel.set({ sheet: 0, row: 14, column: 1, value: '', style: center });
  for (var i = 1; i < 3; i++) {
    excel.set({ sheet: 0, row: 14, column: i, value: '', style: underline });
  }
  excel.set({ sheet: 0, row: 14, column: 3, value: 'Robotics PO Number:' });
  for (var i = 4; i < 9; i++) {
    excel.set({ sheet: 0, row: 14, column: i, value: '', style: underline });
  }
  excel.set({ sheet: 0, row: 15, column: 0, value: 'Total Cost', style: underline_bold_center });
  excel.set({ sheet: 0, row: 15, column: 1, value: 'Tax', style: underline_bold_center });
  excel.set({ sheet: 0, row: 15, column: 2, value: 'Shipping', style: underline_bold_center });
  excel.set({ sheet: 0, row: 15, column: 3, value: 'Grand Total', style: underline_bold_center });
  excel.set({ sheet: 0, row: 16, column: 0, value: 0.00, style: center_curr });
  excel.set({ sheet: 0, row: 16, column: 3, value: '=DOLLAR(A17+B17+C17)', style: overline_bold_center });
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
  excel.set({ sheet: 0, row: 18, column: 0, value: 'Received By:', style: center });
  for (var i = 1; i < 9; i++) {
    excel.set({ sheet: 0, row: 18, column: i, value: '', style: underline });
  }
  excel.generate(partOrder.find('.itemName')[0].childNodes[0].value + ' Order Form by ' + $('#order-form-creator').val() + '.xlsx');
  orderForm.toggle();
  $('#order-form-amount').val('');
  $('#order-form-price').val('');
  $('#order-form-creator').prop('selectedIndex', 0);
  $('#order-form-team').prop('selectedIndex', 0);
  $('#order-form-priority').prop('selectedIndex', 0);
  $('#order-form-notes').val('');
}

function add() {
  var d = new Date();
  dataContainer.append(dataField1 + dataContainer.children().length + dataField15 + $('#new-item-name').val() + dataField2 + $('#new-item-location').val() + dataField3 + $('#new-item-amount').val() + dataField4 + $('#new-item-counter').val() + dataField5 + formatDate() + dataField6 + $('#new-item-link').val() + dataField7);
  if ($('#new-item-amount').val() == 0 || $('#new-item-amount').val() == '') dataContainer.find('div')[dataContainer.children().length - 1].style.borderColor = '#cc0000';
  newItem.toggle();
  data.push({ "itemName": $('#new-item-name').val(), "itemLocation": $('#new-item-location').val(), "itemAmount": $('#new-item-amount').val(), "itemCounter": $('#new-item-counter').val(), "itemCountedDate": formatDate(), "itemLink": $('#new-item-link').val() });
  var loc = dataContainer.find('.itemLocation')[dataContainer.children().length - 1];
  for (var k = 0; k < locations.length; k++) {
    if (!loc.childNodes[0].innerHTML.includes(locations[k])) {
      loc.childNodes[0].innerHTML += '<option>' + locations[k] + '</option>';
    }
  }
  var counter = dataContainer.find('.itemCounter')[dataContainer.children().length - 1];
  for (var k = 0; k < students.length; k++) {
    if (!counter.childNodes[0].innerHTML.includes(students[k])) {
      counter.childNodes[0].innerHTML += '<option>' + students[k] + '</option>';
    }
  }
  write();
  checkForDuplicates();
  $('#new-item-name').val("");
  $('#new-item-location').prop('selectedIndex', 0);
  $('#new-item-amount').val("");
  $('#new-item-counter').prop('selectedIndex', 0);
  $('#new-item-amount').val("");
  $('#new-item-link').val("");
}

function save(obj) {
  checkForDuplicates();
  if (obj.parentNode.className == 'itemAmount' && (obj.value == 0 || obj.value == '')) {
    $(obj).closest('.item')[0].style.borderColor = '#cc0000';
    console.log('ran');
  }
  for (var property in data[$(obj).closest(".item")[0].id]) {
    if (property == obj.parentNode.className) {
      data[$(obj).closest(".item")[0].id][property] = obj.value;
      write();
    }
  }
}

function write() {
  $.post("/save", JSON.stringify(data), function (_data, status) {
    if (status == 'success') {
      $('#message-box').css('background-color', '#4BB543');
      $('#message').text("Saved!");
      if ($('#message-box').css('top') == '15px') return;
      $('#message-box').animate({ top: '15px' }, 'slow').delay(2000);
      $('#message-box').animate({ top: '-30px' }, 'slow');
    } else {
      $('#message-box').css('background-color', '#cc0000');
      $('#message').text('Something went wrong...');
      if ($('#message-box').css('top') == '15px') return;
      $('#message-box').animate({ top: '15px' }, 'slow').delay(2000);
      $('#message-box').animate({ top: '-30px' }, 'slow');
    }
  });
}

function deleteSelected() {
  var checkboxes = $('.item-select');
  var num = 0;
  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      num++;
    }
  }
  if (num == 0) return;
  if (confirm("Are you sure you want to delete " + num + (num == 1 ? " item?" : " items?"))) {
    for (var i = checkboxes.length - 1; i > -1; i--) {
      if (checkboxes[i].checked) {
        checkboxes[i].closest(".item").remove();
        data.splice(i, 1);
      }
    }
    write();
    checkForDuplicates();
  }
}

function formatDate() {
  var d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function checkForDuplicates() {
  var exists = [];
  for (var i = 0; i < $('.item').find('.itemName').length; i++) {
    var name = $('.item').find('.itemName')[i].childNodes[0].value;
    if (exists.includes(name) && exists.indexOf(name) != i) {
      $('.item')[i + 1].style.borderColor = '#ffae42';
      $('#' + exists.indexOf(name)).css('border-color', '#ffae42');
    } else {
      $('.item')[i + 1].style.borderColor = '#d3d3d3';
      $('#' + exists.indexOf(name)).css('border-color', '#d3d3d3');
    }
    exists.push(name);
  }
}
