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

const journal_all = (req, res) => {
  journalModel
    .getAllJournal()
    .then((result) => {
      res.render("pages/journal/journal-home", result);
    })
    .catch((err) => {
      console.log(err);
      res.send("Error occured in journal_all");
    });
};

const journal_create_get = (req, res) => {
  res.render("pages/journal/journal-create");
};

const journal_create_post = (req, res) => {
  const uid = 5;
  const date = req.body.date;
  const journal_text = req.body.journal;
  console.log("uid", uid);
  console.log("date", date);
  console.log("journal_text", journal_text);
  journalModel
    .createJournalEntry(uid, date, journal_text)
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
};
