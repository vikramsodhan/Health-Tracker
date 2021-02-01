// require: when we want to use the externial libary
// can be see as "import"
const cool = require('cool-ascii-faces'); //this is an simple API
const express = require('express');  // this is the Sinatra-like MVC frameworks for Node.js
const path = require('path'); // a libary/PKG; pre-installed with java script

// CRUD functions in a REST API
const db = require('./queries')



// eighter found on env or set it to 5000
const PORT = process.env.PORT || 5000;





// this is our app
const app = express();
// this line give the server the ability to work with JSON
app.use(express.json());
// this line is also needed for every server
app.use(express.urlencoded({extended: false}));


// search for the public folder for file
// the static request, such as a html page in the public folder
app.use(express.static(path.join(__dirname, 'public')));


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



// the following set is for testing only
app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)
// end of testing set




// the post request by client. eg. adduser; change the Database,etc
// Still in work, not connect to database yet
app.post('/adduser', (req, res) => {
  console.log("post reques for /adduser");
  // the resquest body is an json object
  var userName = req.body.user_name;
  var userEmail = req.body.user_email;

  // send is just text, if we want to use formated pages(html)
  // we need to use the render function
  res.send(`username: ${userName} <br>
    useremail: ${userEmail} <br>
    Hello!`);
});


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
