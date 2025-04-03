const mongoose = require('mongoose');

const rankingSchema = new mongoose.Schema({
  competition: {
    type: String,
    required: true,
  },
  rankings: [{
    position: {
      type: Number,
      required: true,
    },
    player: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
  }],
}, { timestamps: true }); 

const Ranking = mongoose.model('Ranking', rankingSchema);

module.exports = Ranking;
