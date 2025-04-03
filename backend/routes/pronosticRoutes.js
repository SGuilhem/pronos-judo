const express = require('express');
const Pronostic = require('../models/Pronostic');

const router = express.Router();

// New pronostic
router.post('/', async (req, res) => {
    try {
        const pronostic = new Pronostic(req.body);
        await pronostic.save();
        res.status(201).json(pronostic);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get pronostic user
router.get('/:userId', async (req, res) => {
    try {
        const pronostics = await Pronostic.find({ user: req.params.userId });
        res.json(pronostics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
