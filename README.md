### Project main page

[Project main page](https://cmpt276-spring-group-project.herokuapp.com)

### Project abstract
Health Tracker is a web application which allows users to monitor and track their health. Users will sign up which includes creating a profile of where they are at currently. Features of this application will be that the users can set up their individual weekly workout plans and have pre-set calories for the day. The application will also have tracking of the calories they consume. This will help the user achieve their health goals while providing an insight to their fitness. Other possible features include having reminders if goals are met or asking if they have done the work.


### Associate the Heroku app with the repository

```
$ heroku git:remote -a cmpt276-spring-group-project
```

### Connect to the remote database
Assuming that you have [Postgres installed locally](https://devcenter.heroku.com/articles/heroku-postgresql#local-setup), use this command to connect to the remote database.

```
$ heroku pg:psql
```


#### Note and reference
_this web application is build using the "node-js-getting-started" template on Heroku. Below is the origional README information:_

# node-js-getting-started

A barebones Node.js app using [Express 4](http://expressjs.com/).

This application supports the [Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs) article - check it out.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.

```sh
$ git clone https://github.com/heroku/node-js-getting-started.git # or clone your own fork
$ cd node-js-getting-started
$ npm install
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```



or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)
