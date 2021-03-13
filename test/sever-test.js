// use mocha to test it, need to install mocha before hand

var chai = require('chai');
var chaiHttp = require('chai-http');
var sever = require('../index'); // remenber the fact we exported the app, the "module.exports = app;"
var should = chai.should(); // a "bunch of assersion" in chai
var expect = chai.expect;
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

  it('should log in', function(done){
    var agent = chai.request.agent(sever);

    agent.post('/auth').send({'user_name': 'Jerry', 'password': '123456'})
      .end(function(error, response){
        response.should.to.redirect;
        response.should.to.be.html;
        agent.close()
        done();
      });
  });


  it('should send log out', function(done){
    var agent = chai.request.agent(sever);

    agent.post('/auth').send({'user_name': 'Jerry', 'password': '123456'})
      .then(function(response){
        return agent.get('/logout');
      })
      .then(function(response){
        expect(response).to.be.html;
        expect(response.text).be.equal("You are now logged out");
        done();
      }).catch(done);
  });


  it('should send already log out', function(done){
    chai.request(sever).get('/logout')
      .end(function(error, response){
        response.should.to.be.html;
        response.text.should.be.equal("You already logged out.");
        done();
      });
  });


  it('should be able to see journal page', function(done){
    var agent = chai.request.agent(sever);

    agent.post('/auth').send({'user_name': 'Jerry', 'password': '123456'})
      .then(function(response){
        return agent.get('/journal');
      })
      .then(function(response){
        expect(response).to.be.html;
        expect(response).to.have.status(200);
        done();
      }).catch(done);
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

  it('should get login only warning on seeing user info', function(done){
    chai.request(sever).get('/infoPage')
      .end(function(error, response){
        response.should.have.status(400);
        response.should.to.be.html;
        response.text.should.be.equal("Please login to view this page!");
        done();
      });
  });

  it('should redirect to login page', function(done){
    chai.request(sever).get('/journal')
      .end(function(error, response){
        response.should.to.be.html;
        response.should.to.redirect;
        done();
      });
  });


});
