const express = require('express');
const router = express.Router();
const { protect } = require("../middleware/auth");
const User = require('../models/User');

router.post('/', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

router.get("/", protect, async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).select("-password");
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });


module.exports = router;
