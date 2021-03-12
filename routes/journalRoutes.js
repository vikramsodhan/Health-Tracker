const express = require("express");
const journalController = require("../controllers/journalController");

const router = express.Router();

// Redirects users to the login page if they are not signed in
redirectLogin = (req, res, next) => {
  if (!req.session.loggedin) {
    res.redirect("/login.html");
  } else {
    next();
  }
};

router.get("/", redirectLogin, journalController.journal_all);

router.get("/create", redirectLogin, journalController.journal_create_get);

router.post("/create", redirectLogin, journalController.journal_create_post);

router.get("/edit/:id", redirectLogin, journalController.journal_create_get);

// In the form_fields_partials I handle the difference between post(creating) and put(updating) data.
// In the ternary operator
router.put("/edit/:id", redirectLogin, journalController.journal_update_post);

router.get("/:id", redirectLogin, journalController.show_specific_journal);

router.delete("/delete/:id", redirectLogin, journalController.journal_delete);

module.exports = router;
