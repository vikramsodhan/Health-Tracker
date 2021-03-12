const { Pool } = require("pg");
const pool = new Pool({
  connectionString: "postgres://postgres@localhost/users",
});

const Journal = {};

// Gets all the journals by the specified user
Journal.getAllJournal = (uid) => {
  let getUsersQuery = `SELECT * from journals WHERE user_id = ${uid} ORDER BY journal_id DESC`;
  return pool.query(getUsersQuery);
  //   return pool.query(getUsersQuery, (error, result) => {
  //     if (error) res.end(error);
  //     const results = { rows: result.rows };
  //     return results;
  //     //res.render("pages/journal/journal-home", results);
  //   });
};

// Just returns some dummy data for front-end work
Journal.dummyJournal = () => {
  return [
    {
      title: "Journal Title",
      date: new Date().toLocaleDateString(),
      description: "This right here is test description babyyyyy",
    },
  ];
};

// Adds the new journal to the database
Journal.createJournalEntry = (uid, title, description, journal_text) => {
  const queryString =
    "INSERT INTO journals (user_id, date, title, description, journal) VALUES ($1, $2, $3, $4, $5)";
  const date = new Date().toLocaleDateString();
  const queryParams = [uid, date, title, description, journal_text];

  return pool.query(queryString, queryParams);
};

// Gets a specified journal based on the primary_key of journal_id
Journal.getSpecificJournal = (journal_id) => {
  const queryString = `SELECT * from journals WHERE journal_id = ${journal_id}`;
  return pool.query(queryString);
};

// Updates a journal entry with the given inputs
Journal.updateJournalEntry = (journal_id, title, description, journal_text) => {
  const queryString =
    "UPDATE journals SET (title, description, journal) = ($1, $2, $3) WHERE journal_id = $4";
  const queryParams = [title, description, journal_text, journal_id];

  return pool.query(queryString, queryParams);
};

// Deletes a the requested journal from the database
Journal.deleteJournal = (journal_id) => {
  const queryString = `DELETE FROM journals WHERE journal_id = ${journal_id}`;
  return pool.query(queryString);
};

module.exports = Journal;
