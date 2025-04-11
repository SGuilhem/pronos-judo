const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Erreur lors de l'inscription :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Email ou mot de passe invalide" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Email ou mot de passe invalide" });
    }

    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      

    res.status(200).json({ message: "Connexion réussie", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

exports.verifyToken = (req, res) => {
    const token = req.body.token;
    if (!token) {
      return res.status(401).json({ message: "Token manquant" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return res.status(200).json(decoded);
    } catch (error) {
      console.error("❌ Erreur de vérification du token :", error);
      return res.status(401).json({ message: "Token invalide" });
    }
  };

  exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }
  
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
  
      user.resetPasswordToken = resetTokenHash;
      user.resetPasswordExpires = Date.now() + 3600000;
      await user.save();
  
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
      const message = `
      Bonjour,

      Vous avez demandé une réinitialisation de mot de passe. Cliquez sur le lien suivant pour définir un nouveau mot de passe :
      ${resetUrl}

      Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.

      Merci,
      L'équipe Pronos Judo
    `;
  
      await sendEmail({
        to: user.email,
        subject: "Pronos-Judo: Réinitialisation de mot de passe",
        text: message,
      });
  
      res.status(200).json({ message: "Email de réinitialisation envoyé." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur serveur." });
    }
  };

  exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
  
    try {
      const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");
      const user = await User.findOne({
        resetPasswordToken: resetTokenHash,
        resetPasswordExpires: { $gt: Date.now() },
      });
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }
  
      user.password = newPassword;
      await user.save();
  
      res.status(200).json({ message: "Mot de passe mis à jour avec succès." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur serveur." });
    }
  };