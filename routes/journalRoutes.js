const express = require("express");
const journalController = require("../controllers/journalController");

const router = express.Router();

router.get("/", journalController.getJournals);
module.exports = router;
