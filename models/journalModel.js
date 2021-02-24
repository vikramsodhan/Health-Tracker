const { Pool } = require("pg");
const pool = new Pool({
  connectionString: "postgres://postgres@localhost/users",
});

const Journal = {};

Journal.getAllJournal = () => {
  let getUsersQuery = `SELECT * from journals ORDER BY date DESC`;
  return pool.query(getUsersQuery);
  //   return pool.query(getUsersQuery, (error, result) => {
  //     if (error) res.end(error);
  //     const results = { rows: result.rows };
  //     return results;
  //     //res.render("pages/journal/journal-home", results);
  //   });
};

Journal.createJournalEntry = (uid, date, text) => {
  const queryString =
    "INSERT INTO journals (user_id, date, journal) VALUES ($1, $2, $3)";
  const queryParams = [uid, date, text];

  return pool.query(queryString, queryParams);
};

module.exports = Journal;
