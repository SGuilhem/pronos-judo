const mongoose = require('mongoose');
const Pronostic = require('./models/Pronostic'); // Vérifie que le chemin est correct

mongoose.connect('mongodb+srv://pronosAdmin:d1kBl3cR9I8UHZ0y@cluster0.a76ee.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

async function checkPronostics() {
    try {
        const pronostics = await Pronostic.find();
        console.log(pronostics);
    } catch (error) {
        console.error("Erreur lors de la récupération des pronostics :", error);
    } finally {
        mongoose.connection.close();
    }
}

checkPronostics();
