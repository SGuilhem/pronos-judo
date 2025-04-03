const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register); 
router.post("/login", authController.login);

router.post("/verify-token", (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token décodé :", decoded); 
    res.json(decoded);
  } catch (error) {
    res.status(401).json({ message: "Token invalide" });
  }
});

module.exports = router;
