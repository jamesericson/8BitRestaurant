// arrays
var tables=[];
var employees=[];

$(document).ready(function(){
  console.log('js & JQ');
  init();
});// end doc ready

var init = function(){
  updateDOM();

  $('#addTable').on('click', createTable);
  $('#addEmployee').on('click', createEmployee);
  $(document).on('click', '.table-status', cycleStatus);
}; // end init()

var createEmployee = function(){
  console.log( 'in createEmployee' );
  // get user input
  // create object for employee
  var newEmployee= {
    firstName : $( '#employeeFirstNameIn' ).val(),
    lastName : $( '#employeeLastNameIn' ).val()
  }; // end object
  // push into employees to DB
  $.ajax({
    type: "POST",
    url: "/addEmployee",
    data: newEmployee,
    success: (function(response){
      console.log('response back: ', response);
      // update display
      employees = response;
      listEmployees();
    }),
    error: (function(err){
      console.log('error from the server:', err);
    })
  });// end ajax

} // end createEmployee

var createTable = function(){
  console.log( 'in createTable' );
  // get user input
  // table object for new table
  var newTable = {
    'name': $('#nameIn').val(),
    'capacity': $('#capacityIn').val(),
    'status': 'empty'
  }
  // push new obejct into tables array
  $.ajax({
    type: "POST",
    url: "/addTable",
    data: newTable,
    success: (function(response){
      console.log('response back: ', response);
      // update display
      tables = response;
      listTables();
    }),
    error: (function(err){
      console.log('error from the server:', err);
    })
  });// end ajax

} // end createTable

var cycleStatus = function( ){
  var index = $(this).attr('name');
  var status = $(this).text();
  console.log( 'in cycleStatus: this tableID' + index + 'is ' + status );
  // move table status to next status
  switch( status ){
    case  'empty':
        status = 'seated';
        break;
    case  'seated':
        status = 'served';
        break;
    case  'served':
        status = 'dirty';
        break;
    case  'dirty':
    default:
      status = 'empty';
  }
  $(this).text(status);
  var toSend = {
    tableID: index,
    status: status
  }
  $.ajax({
    type: "POST",
    url: "/changeStatus",
    data: toSend,
    success: (function(response){
      console.log('back from the server', response);
    }),
    error: (function(err){
      console.log('error from the server: ',err);
    })
  });// end ajax

} // end cycleStatus

var listEmployees = function(){
  console.log( 'in listEmployees', employees );
  var outputHTML = '<ul>';
  // loop through the tables array and display each table
  for( i=0; i< employees.length; i++ ){
    var line = employees[i].first_name + " " + employees[i].last_name + ', id: ' + employees[i].id;
    // add line to output div
    outputHTML += '<li>' + line + '</li>';
  }
  outputHTML += '</ul>';
  $('#employeesOutput').html(outputHTML);

  // update tables display
  listTables();
} // end listEmployees

var listTables = function( ){
  console.log( "in listTables" );
  var outputHTML = '';
  // loop through the tables array and display each table

  // select to assign a server to this table
  var selectText= '<select>';
  for (var i = 0; i < employees.length; i++) {
    selectText+= '<option value=' + i + '>'+ employees[i].first_name + ' ' + employees[i].last_name + '</option>';
  }
  selectText += '</select>';
  // display employees
  for( i=0; i< tables.length; i++ ){
    // status is a button that, when clicked runs cycleStatus for this table
    outputHTML += "<p>" + tables[i].name + " - capacity: " + tables[i].capacity + ', server: ' + selectText +
     ', status: <button class="table-status" name="' + tables[i].id + '">' + tables[i].status + "</button></p>";
  } // end for
  // add line to output div
  $('#tablesOutput').html(outputHTML);
} // end listTables

var updateDOM = function(){
  $.ajax({
    type: "GET",
    url: "/getdata",
    success: (function(response){
      console.log('went and got data', response);
      tables = response.dtables;
      employees = response.wait_staff;
      listEmployees();
    }),
    error: (function(err){
      console.log('error from the server', err);
    })
  });
};
