const { Pool } = require("pg");
const pool = new Pool({
  connectionString: "postgres://postgres@localhost/users",
});

const Journal = {};

// Gets all the journals by the specified user
Journal.getAllJournal = (uid) => {
  let getUsersQuery = `SELECT * from journals WHERE user_id = ${uid} ORDER BY date DESC`;
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

module.exports = Journal;
