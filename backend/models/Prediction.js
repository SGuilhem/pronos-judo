const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  competitionDay: { type: Number, required: true },
  competitionId: { type: String, required: true },
  date: { type: String, required: true },
  predictions: { type: Object, required: true },
});

predictionSchema.index({ userId: 1, competitionDay: 1, competitionId: 1 }, { unique: true });

module.exports = mongoose.model('Prediction', predictionSchema);