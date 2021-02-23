const { Pool } = require("pg");
const pool = new Pool({
  connectionString: "postgres://postgres@localhost/users",
});

const Journal = {};

Journal.getAllJournal = () => {
  let getUsersQuery = `SELECT * from user_journals ORDER BY date DESC`;
  return pool.query(getUsersQuery);
  //   return pool.query(getUsersQuery, (error, result) => {
  //     if (error) res.end(error);
  //     const results = { rows: result.rows };
  //     return results;
  //     //res.render("pages/journal/journal-home", results);
  //   });
};

module.exports = Journal;
