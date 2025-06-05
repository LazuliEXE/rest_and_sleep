const db = require('../db');  // Connexion à la base de données
const bcrypt = require('bcrypt');  // Pour le hashage des mots de passe
const jwt = require('jsonwebtoken'); // Pour le token de connexion
require('dotenv').config();

exports.getAllRoles = async (req, res) => {
    try {
        const [roles] = await db.promise().query('SELECT * FROM roles');
        res.json(roles);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des rôles.' });
    }
};

exports.createRole = async (req, res) => {
    const { nom } = req.body;
    if (!nom) return res.status(400).json({ error: 'Le nom est requis.' });

    try {
        await db.promise().query('INSERT INTO roles (nom) VALUES (?)', [nom]);
        res.status(201).json({ message: 'Rôle ajouté avec succès.' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de l\'ajout du rôle.' });
    }
};

exports.updateRole = async (req, res) => {
    const { id } = req.params;
    const { nom } = req.body;

    try {
        await db.promise().query('UPDATE roles SET nom = ? WHERE id = ?', [nom, id]);
        res.json({ message: 'Rôle mis à jour.' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du rôle.' });
    }
};

exports.deleteRole = async (req, res) => {
    const { id } = req.params;

    try {
        await db.promise().query('DELETE FROM roles WHERE id = ?', [id]);
        res.json({ message: 'Rôle supprimé.' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression du rôle.' });
    }
};
