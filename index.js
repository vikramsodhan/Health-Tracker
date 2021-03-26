// require: when we want to use the externial libary
// can be see as "import"
const cool = require("cool-ascii-faces"); //this is an simple API
const express = require("express"); // this is the Sinatra-like MVC frameworks for Node.js
const path = require("path"); // a libary/PKG; pre-installed with java script
var session = require("express-session"); // used for login
var bodyParser = require("body-parser");
var cors = require("cors"); // cross-origon resourse sharing
const methodOverride = require("method-override"); //html forms only give GET/POST options need override for PUT/DELETE etc
var unirest = require("unirest");

// CRUD functions in a REST API
const db = require("./queries");

const journalRoutes = require("./routes/journalRoutes"); // this is where all of the journal routes are located

const foodRoutes = require("./routes/foodRoutes"); // this is where all of the food/calorie routes are located

// eighter found on env or set it to 5000
const PORT = process.env.PORT || 5000;

// use this module to connect to the database specified
// in DATABASE_URL environment variable
const { Pool } = require("pg");
const pool = new Pool({
  connectionString:
    "postgres://qmhjjvbobislut:296744d793ff9f01b689a6a5dd593b89fc63f4e5659dcc67a9565d5eb6dfbf4f@ec2-52-22-135-159.compute-1.amazonaws.com:5432/ddmnarisnlpo56",
  ssl: {
    rejectUnauthorized: false,
  },
});

// This was used to connect locally to a database
// const pool = new Pool({
//   connectionString: "postgres://postgres@localhost/users",
// });

// this is our app
var app = express();

// the next block will have lots of "use"

// this line give the server the ability to work with JSON
app.use(express.json());
app.use(bodyParser.json());
// this line is also needed for every server
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
// allows pther application to call the route we added
app.use("/", cors());
// the user session
app.use(
  session({
    // secret should be random
    secret: "idfh3l4j5hl98fad9fj34or",
    resave: true,
    saveUninitialized: true,

    //Note about the session expire date:
    // By default cookie.maxAge is null
    // meaning no "expires" parameter is set
    //so the cookie becomes a browser-session cookie.
    //When the user closes the browser the cookie (and session) will be removed.
  })
);

// search for the public folder for file
// the static request, such as a html page in the public folder
app.use(express.static(path.join(__dirname, "public")));

// use ?_method="ENTER METHOD HERE" at the end of action links in forms
app.use(methodOverride("_method"));

//-------------------------------

// the defalt page in heroku weill set in the view folder
app.set("views", path.join(__dirname, "views"));
// the view engine will be ejs; the page will be ejs file
// ejs - embedded java script
app.set("view engine", "ejs");

// journal routes
app.use("/journal", journalRoutes);

app.get("/", (req, res) => res.render("pages/index"));
app.get("/cool", (req, res) => res.send(cool()));
app.get("/times", (req, res) => res.send(showTimes()));

// test page; will change wen we start the project
app.get("/db", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM test_users");
    // create an object results
    const results = { results: result ? result.rows : null };
    // send in the data into pages/db; render it
    res.render("pages/db", results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// the user login authorization function
// Note: the login html is not there yet
app.post("/auth", async function (request, response) {
  var username = request.body.user_name;
  var password = request.body.password;
  if (username && password) {
    // we might need to change it in the future, from test_users table to a new user table
    var results = await pool.query(
      "SELECT * FROM test_users WHERE name = $1 AND password = $2",
      [username, password]
    );
    if (results.rows.length) {
      request.session.loggedin = true;
      request.session.username = username;
      request.session.uid = results.rows[0].id;
      response.redirect("/dashboard");
    } else {
      response.status(400).send("Incorrect Username and/or Password!");
    }
    response.end();
  } else {
    response.status(400).send("Please enter Username and Password!");
    response.end();
  }
});

// an example for login required page
app.get("/dashboard", function (request, response) {
  if (request.session.loggedin) {
    // response.send('Welcome back, ' + request.session.username + '!');
    //goes to dashboard
    var uname = { name: request.session.username };
    response.render("pages/dashboard", uname);
  } else {
    response
      .status(400)
      .send('Please <a href="login.html"> login</a> to view this page!');
  }
  response.end();
});

app.get("/infoPage", function (request, response) {
  if (request.session.loggedin) {
    response.render("pages/infoPage");
  } else {
    response
      .status(400)
      .send('Please <a href="login.html"> login</a> to view this page!');
  }
  response.end();
});

app.get("/changeUname", function (request, response) {
  if (request.session.loggedin) {
    response.render("pages/changeUname");
  } else {
    response
      .status(400)
      .send('Please <a href="login.html"> login</a> to view this page!');
  }
  response.end();
});

app.get("/changePw", function (request, response) {
  if (request.session.loggedin) {
    response.render("pages/changePw");
  } else {
    response
      .status(400)
      .send('Please <a href="login.html"> login</a> to view this page!');
  }
  response.end();
});

app.get("/changeEmail", function (request, response) {
  if (request.session.loggedin) {
    response.render("pages/changeEmail");
  } else {
    response
      .status(400)
      .send('Please <a href="login.html"> login</a> to view this page!');
  }
  response.end();
});

//if there is a separate page for deleteAccount
// app.get('/deleteAccount', function(request, response){
//   if (request.session.loggedin){
//     response.render('pages/');
//   }
//   else {
//     response.status(400).send('Please login to view this page!');
//   }
//   response.end();

// });

//if there is a separate page for deleteAccount
app.get("/deleteAccount", function (request, response) {
  if (request.session.loggedin) {
    response.render("pages/deleteAccount");
  } else {
    response
      .status(400)
      .send('Please <a href="login.html"> login</a> to view this page!');
  }
  response.end();
});

// the logout function
app.get("/logout", function (request, response) {
  if (request.session.loggedin) {
    request.session.destroy(function (err) {
      response.send(`You are now logged out, redirect to main page after 3 seconds
      <script>
        setTimeout(function () {
          window.location.href = "/";
        }, 3000);
      </script>
      `);
    });
  } else {
    response.send("You already logged out.");
    response.end();
  }
});

// the following set is for testing only
app.get("/users", db.getUsers);
app.get("/users/:id", db.getUserById);

// app.put("/users/:id", db.updateUser);
// app.delete("/users/:id", db.deleteUser);
// end of testing set

// the post request by client. eg. adduser; change the Database,etc
// Have connect to database; will improve in iteration 2
app.post("/createUsers", db.createUser);

app.put("/changeUname", db.changeUname);

app.put("/changePw", db.changePw);

app.put("/changeEmail", db.changeEmail);

app.delete("/deleteUser", db.deleteUser);

// ---- Calorie_Counter_API_backend------
// need a search page
app.get("/food_search", (req, res) => {
  res.render("pages/food/food_search", res);
});

app.get("/food_find/redirect", (req, res) => {
  res.redirect(`/food_find/${req.query.food_item}`);
});

app.post("/food_add", (req, res) => {
  // console.log(req.body);
  req.session.saved_food = req.session.saved_food || [];
  req.session.saved_food.push(req.body);
  res.redirect(`/food_find/${req.body.item_searched}`);
});

app.delete("/food_delete", (req, res) => {
  req.session.saved_food.splice(req.body.item_index, 1);
  res.redirect(`/food_find/${req.body.item_searched}`);
});

app.get("/food_find", function (request, response) {
  var results = { results: null };
  response.render("pages/food_result", results);
});

app.get("/food_find/:item", function (request, response) {
  var food_key = request.params.item;
  var search_string =
    "https://nutritionix-api.p.rapidapi.com/v1_1/search/" + food_key;
  // start of the code snippet with modification
  // changed the "var req" to var APIreq to avoid nameing contracdiction
  var APIreq = unirest("GET", search_string);
  APIreq.query({
    fields: "item_name,brand_name,nf_calories,nf_total_fat",
  });

  APIreq.headers({
    "x-rapidapi-key": "c5ad188f44msh9574928a03a1d31p1b67cejsncca1a8dc9f44",
    "x-rapidapi-host": "nutritionix-api.p.rapidapi.com",
    useQueryString: true,
  });
  // end of the code snippet with modification

  APIreq.end(function (res) {
    if (res.error) {
      throw new Error(req.error); // Is this supposed to be res.error?
    }
    // packge the data, pass to render
    var data = res.body.hits;
    var results = {
      results: data,
      food_searched: food_key,
      saved_food: request.session.saved_food,
    };
    console.log(request.session.saved_food);
    response.render("pages/food_result", results);
  });
});

// app.use("/food", foodRoutes);

// print on the console which port are we listening
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

showTimes = () => {
  let result = "";
  const times = process.env.TIMES || 5;
  for (i = 0; i < times; i++) {
    result += i + " ";
  }
  return result;
};

// modulelized all the functions we created for app
module.exports = app;
