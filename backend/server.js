require('./models/User');
require('./models/Pronostic');
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const userRoutes = require('./routes/userRoutes');
const pronosticRoutes = require('./routes/pronosticRoutes');
const predictionsRoutes = require('./routes/predictionsRoutes');
const archivedCompetitionsRoutes = require("./routes/archivedCompetitionsRoutes");

const app = express();

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

app.use(express.static(path.join(__dirname, "public")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });

  const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});


app.use((req, res, next) => {
    console.log(`Requête reçue: ${req.method} ${req.url}`);
    next();
});

app.use("/api/auth", authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pronostics', pronosticRoutes);
app.use('/api/predictions', predictionsRoutes);
app.use("/api/archived-competitions", archivedCompetitionsRoutes);

// Route de test
app.get('/', (req, res) => {
    res.send('API Judo Pronostics en ligne !');
});
