// journal_all, journal_details, journal_create_get, journal_create_post, journal_delete
const journalModel = require("../models/journalModel");

const journal_index = (req, res) => {
  let getUsersQuery = `SELECT * from journals ORDER BY date DESC`;
  pool.query(getUsersQuery, (error, result) => {
    if (error) res.end(error);
    const results = { rows: result.rows };
    res.render("pages/journal/journal-home", results);
  });
};

// Gets all the journals created by that specific user using their user id
const journal_all = (req, res) => {
  journalModel
    .getAllJournal(req.session.uid)
    .then((result) => {
      journals = {
        journals: result.rows,
      };
      res.render("pages/journal/journal-home", journals);
    })
    .catch((err) => {
      console.log(err);
      res.send("Error occured in journal_all");
    });
};

// Using some dummy data to set up the front-end view for the journals
// const journal_all = (req, res) => {
// //   journals = journalModel.dummyJournal();
//   res.render("pages/journal/journal-home", { journals: journals });
// };

// renders the a specific journal entry in its entirety
// uses the model to get the information from the database to pass to the view
const show_specific_journal = (req, res) => {
  journalModel
    .getSpecificJournal(req.params.id)
    .then((results) => {
      journal = {
        journal: results.rows[0],
      };
      console.log(results.rows);
      res.render("pages/journal/specific-entry", journal);
    })
    .catch((err) => {
      console.log(err);
      res.send("Error occured in show_specific_journal");
    });
};

const journal_create_get = (req, res) => {
  res.render("pages/journal/journal-create");
};

// Gets the user_id, journal_title, journal_description, and journal_text to put into the database
// Once done redirects to journal home page
const journal_create_post = (req, res) => {
  const uid = req.session.uid;
  const title = req.body.title;
  const description = req.body.description;
  const journal_text = req.body.journal;
  journalModel
    .createJournalEntry(uid, title, description, journal_text)
    .then((result) => {
      res.redirect("/journal");
    })
    .catch((error) => {
      console.log(error);
      res.send("Error occured in Journal_create_post");
    });
};
module.exports = {
  journal_all,
  journal_create_get,
  journal_create_post,
  show_specific_journal,
};
