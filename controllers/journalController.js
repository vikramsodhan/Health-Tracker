// journal_index, journal_details, journal_create_get, journal_create_post, journal_delete
const journalModel = require("../models/journalModel");

const journal_index = (req, res) => {
  let getUsersQuery = `SELECT * from journals ORDER BY date DESC`;
  pool.query(getUsersQuery, (error, result) => {
    if (error) res.end(error);
    const results = { rows: result.rows };
    res.render("pages/journal/journal-home", results);
  });
};

const getJournals = (req, res) => {
  journalModel
    .getAllJournal()
    .then((result) => {
      res.render("pages/journal/journal-home", result);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  getJournals,
};
