require('./models/User');
require('./models/Pronostic');
require('./models/Ranking');
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const userRoutes = require('./routes/userRoutes');
const pronosticRoutes = require('./routes/pronosticRoutes');
const rankingRoutes = require('./routes/rankingRoutes');

const app = express();

// Connexion à MongoDB
connectDB();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connecté'))
    .catch(err => console.log('Erreur de connexion MongoDB :', err));

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}));

// Logger pour voir les requêtes reçues
app.use((req, res, next) => {
    console.log(`Requête reçue: ${req.method} ${req.url}`);
    next();
});

// Définition des routes
app.use("/api/auth", authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pronostics', pronosticRoutes);
app.use('/api/rankings', rankingRoutes);

// Route de test
app.get('/', (req, res) => {
    res.send('API Judo Pronostics en ligne !');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
