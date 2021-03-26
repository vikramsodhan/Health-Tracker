const express = require("express");
// const journalController = require("../controllers/foodController");

const router = express.Router();

// Redirects users to the login page if they are not signed in
redirectLogin = (req, res, next) => {
  if (!req.session.loggedin) {
    res.redirect("/login.html");
  } else {
    next();
  }
};

module.exports = router;
