const express = require("express");
const journalController = require("../controllers/journalController");

const router = express.Router();

router.get("/", journalController.journal_all);

router.get("/create", journalController.journal_create_get);

router.post("/create", journalController.journal_create_post);

module.exports = router;
