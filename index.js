// require: when we want to use the externial libary
// can be see as "import"
const cool = require('cool-ascii-faces'); //this is an simple API
const express = require('express');  // this is the Sinatra-like MVC frameworks for Node.js
const path = require('path'); // a libary/PKG; pre-installed with java script
var session = require('express-session'); // used for login
var bodyParser = require('body-parser');


// CRUD functions in a REST API
const db = require('./queries')



// eighter found on env or set it to 5000
const PORT = process.env.PORT || 5000;


// use this module to connect to the database specified
// in DATABASE_URL environment variable
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


// this is our app
var app = express();

// the next block will have lots of "use"

// this line give the server the ability to work with JSON
app.use(express.json());
app.use(bodyParser.json());
// this line is also needed for every server
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({extended : true}));
// the user session
app.use(session({
  // secret should be random
	secret: 'idfh3l4j5hl98fad9fj34or',
	resave: true,
	saveUninitialized: true

  //Note about the session expire date:
  // By default cookie.maxAge is null
  // meaning no "expires" parameter is set
  //so the cookie becomes a browser-session cookie.
  //When the user closes the browser the cookie (and session) will be removed.
}));

// search for the public folder for file
// the static request, such as a html page in the public folder
app.use(express.static(path.join(__dirname, 'public')));


//-------------------------------



// the defalt page in heroku weill set in the view folder
app.set('views', path.join(__dirname, 'views'));
// the view engine will be ejs; the page will be ejs file
// ejs - embedded java script
app.set('view engine', 'ejs');




// the get request by client
// get(route , request object, response object)
// response object.rendering(something)
app.get('/', (req, res) => res.render('pages/index'));
app.get('/cool', (req, res) => res.send(cool()));
app.get('/times', (req, res) => res.send(showTimes()));

// test page; will change wen we start the project
app.get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM test_users');
      // create an object results
      const results = { 'results': (result) ? result.rows : null};
      // send in the data into pages/db; render it
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  });


// the user login authorization function
// Note: the login html is not there yet
app.post('/auth', async function(request, response) {
	var username = request.body.user_name;
	var password = request.body.password;
  if (username && password) {
    // we might need to change it in the future, from test_users table to a new user table
    var results = await pool.query('SELECT * FROM test_users WHERE name = $1 AND password = $2', [username, password]);
    if (results.rows.length) {
      request.session.loggedin = true;
      request.session.username = username;
      request.session.uid = results.rows[0].id;
      response.redirect('/home');
    } else {
      response.send('Incorrect Username and/or Password!');
    }
    response.end();
  } else {
    response.send('Please enter Username and Password!');
    response.end();
  }

});


// an example for login required page
app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});



// the following set is for testing only
app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)

app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)
// end of testing set




// the post request by client. eg. adduser; change the Database,etc
// Still in work, not connect to database yet
app.post('/createUsers', db.createUser);




// send() is just sending plain text, if we want to use formated pages(html)
// we need to use the render function
// res.send(`username: ${userName} <br>
//   useremail: ${userEmail} <br>
//   Hello!`);


// print on the console which port are we listening
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

showTimes = () => {
  let result = '';
  const times = process.env.TIMES || 5;
  for (i = 0; i < times; i++) {
    result += i + ' ';
  }
  return result;
}
