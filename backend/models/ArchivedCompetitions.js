const mongoose = require("mongoose");

const archivedCompetitionsSchema = new mongoose.Schema({
  competitionId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  date_to: { type: String, required: true },
  date_from: { type: String, required: true },
  leaderboard: [
    {
      username: { type: String, required: true },
      points: { type: Number, required: true },
    },
  ],
});

module.exports =
  mongoose.models.ArchivedCompetitions ||
  mongoose.model("ArchivedCompetitions", archivedCompetitionsSchema);