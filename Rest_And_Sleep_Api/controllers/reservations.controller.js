const db = require('../db');  // Connexion à la base de données
const bcrypt = require('bcrypt');  // Pour le hashage des mots de passe
const jwt = require('jsonwebtoken'); // Pour le token de connexion
require('dotenv').config();

exports.getAllReservations = async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM reservations');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des réservations' });
    }
};

exports.getReservationById = async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM reservations WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Réservation non trouvée' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération de la réservation' });
    }
};


exports.createReservations = async (req, res) => {
    const { utilisateur_id, chambre_id, date_arrivee, date_depart } = req.body;

    // Vérification des champs
    if (!utilisateur_id || !chambre_id || !date_arrivee || !date_depart) {
        return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }

    try {
        // Optionnel : vérifier que l'utilisateur et la chambre existent avant d’insérer
        const [userCheck] = await db.promise().query('SELECT id FROM utilisateurs WHERE id = ?', [utilisateur_id]);
        if (userCheck.length === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé.' });
        }

        const [conflict] = await db.promise().query(
            `SELECT * FROM reservations 
            WHERE chambre_id = ? 
            AND (
            (date_arrivee <= ? AND date_depart > ?) OR
            (date_arrivee < ? AND date_depart >= ?) OR
            (date_arrivee >= ? AND date_depart <= ?)
        )`,
        [chambre_id, date_arrivee, date_arrivee, date_depart, date_depart, date_arrivee, date_depart]
        );

        if (conflict.length > 0) {
            return res.status(400).json({ error: 'La chambre est déjà réservée sur cette période.' });
        }
        
        const [roomCheck] = await db.promise().query('SELECT id FROM chambres WHERE id = ?', [chambre_id]);
        if (roomCheck.length === 0) {
            return res.status(404).json({ error: 'Chambre non trouvée.' });
        }

        // Insertion
        const [result] = await db.promise().query(
            'INSERT INTO reservations (utilisateur_id, chambre_id, date_arrivee, date_depart, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
            [utilisateur_id, chambre_id, date_arrivee, date_depart]
        );

        res.status(201).json({ message: 'Réservation créée', reservation_id: result.insertId });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la création de la réservation.' });
    }
};

exports.deleteReservation = async (req, res) => {
    const reservationId = req.params.id;
    const userId = req.user.id;
    const roleId = req.user.role_id;

    try {
        const [rows] = await db.promise().query(
            'SELECT * FROM reservations WHERE id = ?', [reservationId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Réservation non trouvée.' });
        }

        const reservation = rows[0];

        // Autorisé si c'est l'utilisateur qui a créé ou si Manager / PDG
        if (reservation.utilisateur_id !== userId && ![2, 3].includes(roleId)) {
            return res.status(403).json({ error: 'Vous n\'avez pas le droit de supprimer cette réservation.' });
        }

        await db.promise().query('DELETE FROM reservations WHERE id = ?', [reservationId]);
        res.json({ message: 'Réservation supprimée avec succès.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la suppression de la réservation.' });
    }
};

exports.updateReservation = async (req, res) => {
    const reservationId = req.params.id;
    const { date_arrivee, date_depart, statut_id } = req.body;
    const userId = req.user.id;
    const roleId = req.user.role_id;

    try {
        const [rows] = await db.promise().query(
            'SELECT * FROM reservations WHERE id = ?', [reservationId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Réservation non trouvée.' });
        }

        const reservation = rows[0];

        if (reservation.utilisateur_id !== userId && ![2, 3].includes(roleId)) {
            return res.status(403).json({ error: 'Accès interdit : vous ne pouvez pas modifier cette réservation.' });
        }

        await db.promise().query(
            'UPDATE reservations SET date_arrivee = ?, date_depart = ?, statut_id = ?, updated_at = NOW() WHERE id = ?',
            [date_arrivee, date_depart, statut_id, reservationId]
        );

        res.json({ message: 'Réservation mise à jour avec succès.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de la réservation.' });
    }
};
