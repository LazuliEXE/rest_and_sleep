const db = require('../db');  // Connexion à la base de données
const bcrypt = require('bcrypt');  // Pour le hashage des mots de passe
const jwt = require('jsonwebtoken'); // Pour le token de connexion
require('dotenv').config();

// Récupérer toutes les chambres avec leur type
exports.getAllChambres = async (req, res) => {
    try {
        const [rows] = await db.promise().query(`
            SELECT chambres.*, types_chambres.nom AS type_nom 
            FROM chambres 
            JOIN types_chambres ON chambres.type_id = types_chambres.id
        `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la récupération des chambres." });
    }
};

// Récupérer une chambre par son ID avec son type
exports.getChambreById = async (req, res) => {
    try {
        const [rows] = await db.promise().query(`
            SELECT chambres.*, types_chambres.nom AS type_nom 
            FROM chambres 
            JOIN types_chambres ON chambres.type_id = types_chambres.id 
            WHERE chambres.id = ?
        `, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Chambre non trouvée." });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la récupération de la chambre." });
    }
};

// Créer une nouvelle chambre
exports.createChambre = async (req, res) => {
    const { numero_chambre, type_id, tarif, disponibilite = true, hotel_id, photo_url = null } = req.body;

    if (!numero_chambre || !type_id || !tarif || !hotel_id) {
        return res.status(400).json({ error: "Les champs obligatoires sont manquants." });
    }

    try {
        const [result] = await db.promise().query(`
            INSERT INTO chambres (numero_chambre, type_id, tarif, disponibilite, hotel_id, photo_url)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [numero_chambre, type_id, tarif, disponibilite, hotel_id, photo_url]);

        res.status(201).json({ message: "Chambre créée avec succès.", chambre_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la création de la chambre." });
    }
};

// Supprimer une chambre
exports.deleteChambre = async (req, res) => {
    try {
        const [result] = await db.promise().query(
            'DELETE FROM chambres WHERE id = ?', [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Chambre non trouvée." });
        }

        res.json({ message: "Chambre supprimée avec succès." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la suppression de la chambre." });
    }
};


exports.updateChambre = async (req, res) => {
    const chambreId = req.params.id;
    const { numero_chambre, type_id, tarif, disponibilite, hotel_id, photo_url } = req.body;
    const roleId = req.user.role_id;

    if (![2, 3].includes(roleId)) {
        return res.status(403).json({ error: 'Accès refusé.' });
    }

    try {
        await db.promise().query(
            'UPDATE chambres SET numero_chambre = ?, type_id = ?, tarif = ?, disponibilite = ?, hotel_id = ?, photo_url = ?, updated_at = NOW() WHERE id = ?',
            [numero_chambre, type_id, tarif, disponibilite, hotel_id, photo_url, chambreId]
        );
        res.json({ message: 'Chambre mise à jour avec succès.' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la chambre.' });
    }
};
