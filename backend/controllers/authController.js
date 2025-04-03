const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    const user = new User({
      username,
      email,
      password,
      role,
    });

    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ 
      message: "Utilisateur créé avec succès", 
      token 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur interne du serveur" });
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
        expiresIn: "1h",
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
      console.log("Token décodé :", decoded);
      return res.status(200).json(decoded);
    } catch (error) {
      console.error("❌ Erreur de vérification du token :", error);
      return res.status(401).json({ message: "Token invalide" });
    }
  };