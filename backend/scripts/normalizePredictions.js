require('dotenv').config();

const mongoose = require('mongoose');
const Prediction = require('../models/Prediction');

function normalizePredictions(predictions) {
  return {
    womenFirstPlace: predictions.womenFirstPlace || "",
    womenSecondPlace: predictions.womenSecondPlace || "",
    womenThirdPlace1: predictions.womenThirdPlace1 || "",
    womenThirdPlace2: predictions.womenThirdPlace2 || "",
    menFirstPlace: predictions.menFirstPlace || "",
    menSecondPlace: predictions.menSecondPlace || "",
    menThirdPlace1: predictions.menThirdPlace1 || "",
    menThirdPlace2: predictions.menThirdPlace2 || "",
  };
}

async function normalizeExistingPredictions() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const predictions = await Prediction.find();

    for (const prediction of predictions) {
      prediction.predictions = normalizePredictions(prediction.predictions);

      await prediction.save();
    }

  } catch (err) {
  } finally {
    mongoose.disconnect();
  }
}

normalizeExistingPredictions();