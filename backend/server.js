require('./models/User');
require('./models/Pronostic');
require('./models/Ranking');
require('dotenv').config();
console.log("MONGO_URI:", process.env.MONGO_URI);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

//Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
  }));

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connecté'))
    .catch(err => console.log('❌ Erreur de connexion MongoDB :', err));

//Routes
console.log("Chargement des routes users...");
const userRoutes = require('./routes/userRoutes');
const pronosticRoutes = require('./routes/pronosticRoutes');
const rankingRoutes = require('./routes/rankingRoutes');

app.use('/api/users', userRoutes);
app.use('/api/pronostics', pronosticRoutes);
app.use('/api/rankings', rankingRoutes);


// Basic route
app.get('/', (req, res) => {
    res.send('API Judo Pronostics en ligne !');
});

// Boot server
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
