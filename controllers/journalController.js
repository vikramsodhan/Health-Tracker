// journal_all, journal_details, journal_create_get, journal_create_post, journal_delete
const journalModel = require("../models/journalModel");

// Gets all the journals created by that specific user using their user id
const journal_all = (req, res) => {
  journalModel
    .getAllJournal(req.session.uid)
    .then((result) => {
      journals = {
        journals: result.rows,
      };
      res.status(200).render("pages/journal/journal-home", journals);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send("Error occured in journal_all");
    });
};

// renders the a specific journal entry in its entirety
// uses the model to get the information from the database to pass to the view
const show_specific_journal = (req, res) => {
  journalModel
    .getSpecificJournal(req.params.id)
    .then((results) => {
      journal = {
        journal: results.rows[0],
      };
      res.status(200).render("pages/journal/specific-entry", journal);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send("Error occured in show_specific_journal");
    });
};

// This generates the page where we can either update/create new journal entries
// pass dummy data in so we get emtpy field-boxes for the form for new entries
const journal_create_get = (req, res) => {
  if (req.params.id) {
    journalModel
      .getSpecificJournal(req.params.id)
      .then((results) => {
        journal = {
          journal: results.rows[0],
        };
        res.status(200).render("pages/journal/journal-create", journal);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send("Error occured in journal_create_get");
      });
  } else {
    const dummyData = {
      journal: {
        title: "",
        description: "",
        journal: "",
      },
    };
    res.status(200).render("pages/journal/journal-create", dummyData);
  }
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
      res.status(303).redirect("/journal/");
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send("Error occured in Journal_create_post");
    });
};

// using the journal id update the journal entry with requested information given by user
// once done redirects to that specific journal page
const journal_update_post = (req, res) => {
  const { title, description, journal } = req.body;

  journalModel
    .updateJournalEntry(req.params.id, title, description, journal)
    .then((results) => {
      res.status(303).redirect(`/journal/${req.params.id}`);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send("Error occured in journal_update_post");
    });
};

// tells the model to delete the requested journal and then updates view to journal-home
const journal_delete = (req, res) => {
  journalModel
    .deleteJournal(req.params.id)
    .then((results) => {
      res.status(303).redirect("/journal");
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send("Error occured in journal_delete");
    });
};

module.exports = {
  journal_all,
  journal_create_get,
  journal_create_post,
  show_specific_journal,
  journal_update_post,
  journal_delete,
};
