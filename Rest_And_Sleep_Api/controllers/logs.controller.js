const db = require('../db');  // Connexion à la base de données
const bcrypt = require('bcrypt');  // Pour le hashage des mots de passe
const jwt = require('jsonwebtoken'); // Pour le token de connexion
require('dotenv').config();

exports.getLogs = async (req, res) => {
    try {
        const [logs] = await db.promise().query('SELECT * FROM logs ORDER BY timestamp DESC');
        res.json(logs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des logs.' });
    }
};
