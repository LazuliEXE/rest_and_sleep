const db = require('../db');  // Connexion à la base de données
const bcrypt = require('bcrypt');  // Pour le hashage des mots de passe
const jwt = require('jsonwebtoken'); // Pour le token de connexion
require('dotenv').config();

// Obtenir tous les hôtels
exports.getAllHotels = async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM hotels');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la récupération des hôtels." });
    }
};

// Obtenir un hôtel par son ID
exports.getHotelById = async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM hotels WHERE id = ?', [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Hôtel non trouvé." });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la récupération de l'hôtel." });
    }
};

// Créer un nouvel hôtel
exports.createHotel = async (req, res) => {
    const { nom, adresse, description = '', photo_url = null } = req.body;

    if (!nom || !adresse) {
        return res.status(400).json({ error: "Le nom et l'adresse de l'hôtel sont obligatoires." });
    }

    try {
        const [result] = await db.promise().query(
            'INSERT INTO hotels (nom, adresse, description) VALUES (?, ?, ?)',
            [nom, adresse, description]
        );

        res.status(201).json({ message: "Hôtel créé avec succès.", hotel_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la création de l'hôtel." });
    }
};

// Supprimer un hôtel
exports.deleteHotel = async (req, res) => {
    try {
        const [result] = await db.promise().query(
            'DELETE FROM hotels WHERE id = ?', [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Hôtel non trouvé." });
        }

        res.json({ message: "Hôtel supprimé avec succès." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la suppression de l'hôtel." });
    }
};

exports.getChambresByHotelId = async (req, res) => {
    const hotelId = req.params.hotelId;

    try {
        const [rows] = await db.promise().query(
            'SELECT * FROM chambres WHERE hotel_id = ?', [hotelId]
        );

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la récupération des chambres pour l'hôtel spécifié." });
    }
};

exports.updateHotel = async (req, res) => {
    const { nom, adresse, description } = req.body;
    const hotelId = req.params.id;
    const roleId = req.user.role_id;

    if (![2, 3].includes(roleId)) {
        return res.status(403).json({ error: 'Accès refusé.' });
    }

    try {
        await db.promise().query(
            'UPDATE hotels SET nom = ?, adresse = ?, description = ?, updated_at = NOW() WHERE id = ?',
            [nom, adresse, description, hotelId]
        );
        res.json({ message: 'Hôtel mis à jour avec succès.' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l’hôtel.' });
    }
};
