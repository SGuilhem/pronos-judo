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
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });


    const predictions = await Prediction.find();

    for (const prediction of predictions) {
      prediction.predictions = normalizePredictions(prediction.predictions);

      await prediction.save();
      console.log(`Prédiction ${prediction._id} normalisée avec succès.`);
    }

  } catch (err) {
    console.error('Erreur lors de la normalisation des prédictions :', err);
  } finally {
    mongoose.disconnect();
  }
}

normalizeExistingPredictions();