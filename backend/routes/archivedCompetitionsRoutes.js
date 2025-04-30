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


router.post("/", async (req, res) => {
  try {
    const { competitionId, competitionName, leaderboard, startingDay, endingDay } = req.body;

    const existingCompetition = await ArchivedCompetitions.findOne({ competitionId });
    if (existingCompetition) {
      return res.status(400).json({ message: "La compétition est déjà archivée." });
    }

    const archivedCompetition = new ArchivedCompetitions({
      competitionId,
      title: competitionName,
      date_from: startingDay,
      date_to: endingDay,
      leaderboard,
    });

    await archivedCompetition.save();
    res.status(201).json({ message: "Compétition archivée avec succès." });
  } catch (error) {
    console.error("Erreur lors de l'archivage :", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
});

module.exports = router;