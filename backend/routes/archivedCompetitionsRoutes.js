const express = require("express");
const router = express.Router();
const ArchivedCompetitions = require("../models/ArchivedCompetitions");

router.get("/", async (req, res) => {
  try {
    const archivedCompetitions = await ArchivedCompetitions.find();
    res.status(200).json(archivedCompetitions);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;