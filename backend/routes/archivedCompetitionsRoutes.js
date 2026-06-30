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

    const archivedCompetition = await ArchivedCompetitions.findOneAndUpdate(
      { competitionId },                          // filtre
      {
        competitionId,
        title: competitionName,
        date_from: startingDay,
        date_to: endingDay,
        leaderboard,
      },
      { upsert: true, new: true }                 // crée si inexistant, met à jour sinon
    );

    res.status(200).json({
      message: "Compétition archivée / mise à jour avec succès.",
      data: archivedCompetition,
    });
  } catch (error) {
    console.error("Erreur lors de l'archivage :", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
});

module.exports = router;