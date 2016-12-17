var express = require( 'express' );
var app = express();
var path = require( 'path' );
var pg = require( 'pg' );
var bodyParser= require( 'body-parser' );
var urlencodedParser = bodyParser.urlencoded( {extended: true } );
var port = process.env.PORT || 8080;
//create a connection string to our database
var connectionString = 'postgres://localhost:5432/restaurant';
// static folder
app.use(express.static('public'));

// spin up server
app.listen( port, function(){
  console.log( 'server up on', port );
});

// base url
app.get('/', function(req, res){
  console.log( 'base url hit' );
  res.sendFile(path.join(__dirname, '../public/views/index.html'));
});

// get both employee and table data
app.get( '/getdata', function( req, res ){
  console.log( 'getdata route hit' );
  //connect to db
  pg.connect( connectionString, function( err, client, done){
    if(err){
      console.log(err);
    } else {
      console.log('connected to DB');
      var query = client.query( 'SELECT * FROM dtable' );
      //array for dtables
      var alltables = [];
      query.on( 'row', function( row ){
        alltables.push (row);
      });
      query.on( 'end', function(){
        var alldata = {
          dtables: alltables
        }
        var query = client.query( 'SELECT * FROM wait_staff' );
        //add to array alltables for wait_staff
        var allstaff = [];
        query.on( 'row', function( row ){
          allstaff.push (row);
        });
        query.on( 'end', function(){
        alldata.wait_staff = allstaff;
        done();
        console.log( alldata);

        res.send( alldata );
        });
      });
    } // end if else
  }); // end connect
}); // end app.get

// add employee to DB
app.post( '/addEmployee', urlencodedParser, function( req, res ){
  console.log( 'addEmployee route hit' );
  //cont to DB
  pg.connect( connectionString, function(err, client, done){
    if( err ){
      console.log(err);
    } else {
      console.log('connected to DB');
      // use wildcards to insert record
      client.query( 'INSERT INTO wait_staff (first_name, last_name, on_duty) VALUES ($1, $2, $3)',
                    [req.body.firstName, req.body.lastName, 'TRUE'] );
      var query = client.query( 'SELECT * FROM wait_staff' );
      //array for wait_staff
      var allWaitStaff = [];
      query.on( 'row', function( row ){
        allWaitStaff.push (row);
      });
      query.on( 'end', function(){
        done();
        console.log( allWaitStaff );

        res.send( allWaitStaff );
      });
    } //end if else
  });// end connect
});

// add table to DB
app.post( '/addTable', urlencodedParser, function( req, res ){
  console.log( 'addTable route hit' );
  //connect to DB
  pg.connect( connectionString, function(err, client, done){
    if( err ){
      console.log(err);
    } else {
      console.log('connected to DB');
      // use wildcards to insert record
      client.query( 'INSERT INTO dtable (name, capacity, status) VALUES ($1, $2, $3)',
                    [req.body.name, req.body.capacity, req.body.status] );
      var query = client.query( 'SELECT * FROM dtable' );
      //array for dtable
      var allDTable = [];
      query.on( 'row', function( row ){
        allDTable.push (row);
      });
      query.on( 'end', function(){
        done();
        console.log( allDTable );

        res.send( allDTable );
      });
    } //end if else
  });// end connect
}); // end post addEmployee

app.post ('/changeStatus', urlencodedParser, function( req, res ){
  console.log('changeStatus hit route');
  //connect to DB
  pg.connect( connectionString, function(err, client, done){
    if(err){
      console.log(err);
    } else {
      console.log('connected to DB');
      //update table at id with new status
      console.log('here is the info: status/tableID = ', req.body.status, req.body.tableID );
      client.query('UPDATE dtable SET status=$1 WHERE id=$2', [req.body.status, req.body.tableID]);
      done();
      res.send('meow');
    }//end if else
  });// end connect
});//end post changeStatus
