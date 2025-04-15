const express = require("express");
const router = express.Router();
const ArchivedCompetitions = require("../models/ArchivedCompetitions");

router.get("/", async (req, res) => {
  try {
    console.log("Requête reçue pour /api/archived-competitions");
    const archivedCompetitions = await ArchivedCompetitions.find();
    console.log("Données récupérées :", archivedCompetitions);
    res.status(200).json(archivedCompetitions);
  } catch (err) {
    console.error("Erreur lors de la récupération des compétitions archivées :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;