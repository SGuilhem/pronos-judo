const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Prediction = require('../models/Prediction');
const User = require('../models/User');""

// Middleware check token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token invalide' });
    }
    req.user = user;
    next();
  });
}

// POST PREDICTION
router.post('/', authenticateToken, async (req, res) => {
  const { predictions, date, competitionDay, competitionId } = req.body;
  const userId = req.user.userId;

  if (!userId) {
    return res.status(400).json({ message: 'userId manquant' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    const userName = user.username;
    if (!userName) {
      return res.status(400).json({ message: 'Le nom d\'utilisateur est manquant.' });
    }

    const existing = await Prediction.findOne({ userId, competitionDay, competitionId });

    if (existing) {
      existing.predictions = mergePredictions(existing.predictions, predictions);
      existing.date = date || existing.date;
      existing.userName = userName;

      await existing.save();
      return res.status(200).json({ message: 'Prédiction mise à jour avec succès.', prediction: existing });
    }

    const newPrediction = new Prediction({
      userId,
      userName,
      competitionDay,
      competitionId,
      date,
      predictions,
    });
    await newPrediction.save();

    res.status(201).json({ message: 'Prédiction enregistrée avec succès.' });
  } catch (err) {
    console.error("Erreur lors de la sauvegarde de la prédiction :", err);
    res.status(500).json({ message: 'Erreur lors de la sauvegarde de la prédiction.', error: err.message });
  }
});

// PUT PREDICTION (mise à jour d'une prédiction existante)
router.put('/', authenticateToken, async (req, res) => {
  const { predictions, date, competitionDay, competitionId } = req.body;
  const userId = req.user.userId;

  if (!userId) {
    return res.status(400).json({ message: 'userId manquant' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    const userName = user.username;

    
    const existing = await Prediction.findOne({ userId, competitionDay, competitionId });

    if (!existing) {
      return res.status(404).json({ message: 'Aucune prédiction trouvée pour ce jour de compétition.' });
    }

    existing.predictions = mergePredictions(existing.predictions, predictions);
    existing.date = date || existing.date;
    existing.userName = userName;

    await existing.save();
    res.status(200).json({ message: 'Prédiction mise à jour avec succès.', prediction: existing });
  } catch (err) {
    console.error("Erreur lors de la mise à jour de la prédiction :", err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET PREDICTION FOR SPECIFIC USER AND COMPETITION DAY
  router.get('/:competitionId/:competitionDay', authenticateToken, async (req, res) => {
    const competitionId = req.params.competitionId;
    const competitionDay = parseInt(req.params.competitionDay, 10);
    const userId = req.user.userId;
  
    try {
      const existing = await Prediction.findOne({ userId, competitionId, competitionDay });
  
      if (existing) {
        return res.status(200).json({ message: 'Prédiction déjà effectuée.', prediction: existing });
      }
      res.status(404).json({ message: 'Aucune prédiction trouvée.' });
    } catch (err) {
      console.error("Erreur lors de la recherche de prédiction :", err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });router.get('/:competitionId/:competitionDay', authenticateToken, async (req, res) => {
    const competitionId = req.params.competitionId;
    const competitionDay = parseInt(req.params.competitionDay, 10);
    const userId = req.user.userId;
  
    try {
      const existing = await Prediction.findOne({ userId, competitionId, competitionDay });
  
      if (existing) {
        existing.predictions = normalizePredictions(existing.predictions);
        return res.status(200).json({ message: 'Prédiction déjà effectuée.', prediction: existing });
      }
      res.status(404).json({ message: 'Aucune prédiction trouvée.' });
    } catch (err) {
      console.error("Erreur lors de la recherche de prédiction :", err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

// GET ALL PREDICTIONS
router.get('/', authenticateToken, async (req, res) => {
  const { competitionId } = req.query;

  try {
    const query = {};
    if (competitionId) {
      query.competitionId = competitionId;
    }

    const predictions = await Prediction.find(query)
      .populate('userId', 'username') 
      .exec();


    const formattedPredictions = predictions
      .map((prediction) => {
        if (!prediction.userId || !prediction.userId.username) {
          console.warn("Prédiction avec userId ou username invalide :", prediction);
          return null;
        }

        return {
          username: prediction.userId.username,
          competitionDay: prediction.competitionDay,
          predictions: prediction.predictions,
        };
      })
      .filter(Boolean);

    res.status(200).json(formattedPredictions);
  } catch (err) {
    console.error("Erreur lors de la récupération des prédictions :", err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

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

  function mergePredictions(existingPredictions, newPredictions) {
    return {
      womenFirstPlace: newPredictions.womenFirstPlace || existingPredictions.womenFirstPlace || "",
      womenSecondPlace: newPredictions.womenSecondPlace || existingPredictions.womenSecondPlace || "",
      womenThirdPlace1: newPredictions.womenThirdPlace1 || existingPredictions.womenThirdPlace1 || "",
      womenThirdPlace2: newPredictions.womenThirdPlace2 || existingPredictions.womenThirdPlace2 || "",
      menFirstPlace: newPredictions.menFirstPlace || existingPredictions.menFirstPlace || "",
      menSecondPlace: newPredictions.menSecondPlace || existingPredictions.menSecondPlace || "",
      menThirdPlace1: newPredictions.menThirdPlace1 || existingPredictions.menThirdPlace1 || "",
      menThirdPlace2: newPredictions.menThirdPlace2 || existingPredictions.menThirdPlace2 || "",
    };
  }
  

module.exports = router;
