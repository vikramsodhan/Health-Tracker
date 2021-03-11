// use mocha to test it, need to install mocha before hand

var chai = require('chai');
var chaiHttp = require('chai-http');
var sever = require('../index'); // remenber the fact we exported the app, the "module.exports = app;"
var should = chai.should(); // a "bunch of assersion" in chai

chai.use(chaiHttp); // if we ever need a http call

// set of test
describe('Users', function(){
  // all of the test assocated with user
  // we will change this test later


  // this test is nolonger usable since we enabled the database connection

  // it('should add a single user on a suscessful POST request for /createUsers', function(done){
  //   chai.request(sever).post('/createUsers').send({'user_name': 'tester', 'user_email': 'tester@example.com', 'pwd': '123456'})
  //     .end(function(error, response){
  //       response.should.have.status(200);
  //       response.should.to.be.html;
  //       response.text.should.be.equal("check suscess, will enable add to database later");
  //       done();
  //     });
  // });

  it('should send user name already exist bad POST request for /createUsers', function(done){
    chai.request(sever).post('/createUsers').send({'user_name': 'Jerry', 'user_email': 'tester@example.com', 'pwd': '123456'})
      .end(function(error, response){
        response.should.have.status(400);
        response.should.to.be.html;
        response.text.should.be.equal("User name already used for registration");
        done();
      });
  });

  it('should send user name already exist bad POST request for /createUsers', function(done){
    chai.request(sever).post('/createUsers').send({'user_name': 'tester', 'user_email': 'jerry@example.com', 'pwd': '123456'})
      .end(function(error, response){
        response.should.have.status(400);
        response.should.to.be.html;
        response.text.should.be.equal("Email already used for registration");
        done();
      });
  });


  it('should send not logged in warning for /dashboard', function(done){
    chai.request(sever).get('/dashboard')
      .end(function(error, response){
        response.should.to.be.html;
        response.should.have.status(400);
        response.text.should.be.equal("Please login to view this page!");
        done();
      });
  });

  it('should send warning for /auth', function(done){
    chai.request(sever).post('/auth').send({'user_name': 'Jerry', 'password': '12356'})
      .end(function(error, response){
        response.should.have.status(400);
        response.should.to.be.html;
        response.text.should.be.equal("Incorrect Username and/or Password!");
        done();
      });
  });


  it('should send already log out', function(done){
    chai.request(sever).get('/logout')
      .end(function(error, response){
        response.should.to.be.html;
        response.text.should.be.equal("You already logged out.");
        done();
      });
  });



});


describe('Guest', function(){
  // all of the test assocated with Guest
  it('should able to see the welcome page', function(done){
    chai.request(sever).get('/')
      .end(function(error, response){
        response.should.have.status(200);
        response.should.to.be.html;
        done();
      });
  });

  it('should get login only warning on change pwd', function(done){
    chai.request(sever).get('/changePw')
      .end(function(error, response){
        response.should.have.status(400);
        response.should.to.be.html;
        response.text.should.be.equal("Please login to view this page!");
        done();
      });
  });

  it('should get login only warning on change user name', function(done){
    chai.request(sever).get('/changeUname')
      .end(function(error, response){
        response.should.have.status(400);
        response.should.to.be.html;
        response.text.should.be.equal("Please login to view this page!");
        done();
      });
  });


  it('should get login only warning on change user email', function(done){
    chai.request(sever).get('/changeEmail')
      .end(function(error, response){
        response.should.have.status(400);
        response.should.to.be.html;
        response.text.should.be.equal("Please login to view this page!");
        done();
      });
  });




});
