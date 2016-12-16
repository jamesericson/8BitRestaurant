var express = require( 'express' );
var app = express();
var path = require( 'path' );
var pg = require( 'pg' );
var bodyParser= require( 'body-parser' );
var urlencodedParser = bodyParser.urlencoded( {extended: true } );
var port = process.env.PORT || 8080;
//create a connection string to our database
var connectionString = 'postgres://localhost:5432/koalaHolla';
// static folder
app.use( express.static( 'public' ) );

// spin up server
app.listen( port, function(){
  console.log( 'server up on', port );
});

// base url
app.get( '/', function( req, res ){
  console.log( 'base url hit' );
  res.sendFile( 'index.html' );
});

// get koalas
app.get( '/getKoalas', function( req, res ){
  console.log( 'getKoalas route hit' );
  //connect to db
  pg.connect( connectionString, function( err, client, done){
    if(err){
      console.log(err);
    } else {
      console.log('connected to DB');
      var query = client.query( 'SELECT * FROM koalas' );
      //array for koalas
      var allKoalas = [];
      query.on( 'row', function( row ){
        allKoalas.push (row);
      });
      query.on( 'end', function(){
        done();
        console.log( allKoalas );

        res.send( allKoalas );
      });
    } // end if else
  }); // end connect
}); // end app.get

// add koala
app.post( '/addKoala', urlencodedParser, function( req, res ){
  console.log( 'addKoala route hit' );
  //cont to DB
  pg.connect( connectionString, function(err, client, done){
    if( err ){
      console.log(err);
    } else {
      console.log('connected to DB');
      // use wildcards to insert record
      client.query( 'INSERT INTO koalas (name, age, sex, ready_for_transfer, notes) VALUES ($1, $2, $3, $4, $5)',
                    [req.body.name, req.body.age, req.body.sex, req.body.ready_for_transfer, req.body.notes] );
      done();
      res.send('meow');
    } //end if else
  });// end connect
});

// add koala
app.post( '/editKoala', urlencodedParser, function( req, res ){
  console.log( 'editKoala route hit' );
  //assemble object to send
  var objectToSend={
    response: 'from editKoala route'
  }; //end objectToSend
  //send info back to client
  res.send( objectToSend );
});
