const db = require('../db');  // Connexion à la base de données
const bcrypt = require('bcrypt');  // Pour le hashage des mots de passe
const jwt = require('jsonwebtoken'); // Pour le token de connexion
require('dotenv').config();

// Fonction pour créer un utilisateur
exports.createUser = (req, res) => {
    const { nom, email, mot_de_passe, role_id } = req.body;

  // Validation des données
    if (!nom || !email || !mot_de_passe || !role_id) {
        return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }

    // Vérification si l'email existe déjà dans la base de données
    db.query('SELECT * FROM utilisateurs WHERE email = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la vérification de l\'email.' });
        }
        if (results.length > 0) {
            return res.status(400).json({ error: 'Un utilisateur avec cet email existe déjà.' });
        }

        // Vérification que le role_id existe dans la table des rôles
        db.query('SELECT * FROM roles WHERE id = ?', [role_id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur lors de la vérification du rôle.' });
            }
            if (results.length === 0) {
                return res.status(400).json({ error: 'Rôle invalide.' });
            }

            // Hashage du mot de passe
            bcrypt.hash(mot_de_passe, 10, (err, hashedPassword) => {
                if (err) {
                    return res.status(500).json({ error: 'Erreur lors du hashage du mot de passe.' });
                }

                // Requête pour insérer un nouvel utilisateur dans la base de données
                db.query(
                    'INSERT INTO utilisateurs (nom, email, mot_de_passe, role_id) VALUES (?, ?, ?, ?)',
                    [nom, email, hashedPassword, role_id],
                    (err, result) => {
                        if (err) {
                            return res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur.' });
                        }
                        res.status(201).json({ message: 'Utilisateur créé', id: result.insertId });
                    }
                );
            });
        });
    });
};

// Fonction pour récupérer tous les utilisateurs
exports.getAllUsers = (req, res) => {
    db.query('SELECT u.id, u.nom, u.email, r.nom as role FROM utilisateurs u JOIN roles r ON u.role_id = r.id', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs.' });
        }
        res.status(200).json(results);
    });
};

// Fonction pour récupérer un utilisateur par son ID
exports.getUserById = (req, res) => {
    const requestedId = parseInt(req.params.id);
    const requesterId = req.user.id;
    const requesterRole = req.user.role_id;

    if (requesterId !== requestedId && requesterRole !== 1) {
        return res.status(403).json({ error: 'Accès refusé.' });
    }

    db.query(
        `SELECT u.id, u.nom, u.email, r.nom AS role 
            FROM utilisateurs u 
            JOIN roles r ON u.role_id = r.id 
            WHERE u.id = ?`,
        [requestedId],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur.' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Utilisateur non trouvé.' });
            }
            res.status(200).json(results[0]);
        }
    );
};


// Fonction pour supprimer un utilisateur par son ID
exports.deleteUser = (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM utilisateurs WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé.' });
        }
        res.status(200).json({ message: 'Utilisateur supprimé.' });
    });
};




exports.loginUser = (req, res) => {
  const { email, mot_de_passe } = req.body;
  console.log("Reçu :", email, mot_de_passe);

  if (!email || !mot_de_passe) {
    return res.status(400).json({ error: 'Email et mot de passe requis.' });
  }

  db.query('SELECT * FROM utilisateurs WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error("Erreur SQL :", err);
      return res.status(500).json({ error: 'Erreur serveur.' });
    }

    if (results.length === 0) {
      console.log("Aucun utilisateur trouvé avec cet email");
      return res.status(401).json({ error: 'Utilisateur non trouvé.' });
    }

    const user = results[0];
    console.log("Utilisateur trouvé :", user);

    bcrypt.compare(mot_de_passe, user.mot_de_passe, (err, isMatch) => {
      if (err) {
        console.error("Erreur bcrypt :", err);
        return res.status(500).json({ error: 'Erreur lors de la comparaison.' });
      }

      console.log("Mot de passe match :", isMatch);
      if (!isMatch) return res.status(401).json({ error: 'Mot de passe incorrect.' });

      const token = jwt.sign(
        { id: user.id, role_id: user.role_id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ message: 'Connexion réussie', token });
    });
  });
};


exports.updateUser = async (req, res) => {
    const userIdToUpdate = parseInt(req.params.id, 10);
    const { nom, email, mot_de_passe } = req.body;
    const userId = req.user.id;
    const roleId = req.user.role_id;

    // Vérifie s'il s'agit du bon utilisateur ou d'un admin
    if (userId !== userIdToUpdate && roleId !== 1) {
        return res.status(403).json({ error: "Accès interdit : vous ne pouvez modifier que votre propre profil." });
    }

    try {
        // On vérifie si l'utilisateur existe
        const [rows] = await db.promise().query('SELECT * FROM utilisateurs WHERE id = ?', [userIdToUpdate]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Utilisateur non trouvé." });
        }

        // Hash du mot de passe si fourni
        let hashedPassword = rows[0].mot_de_passe;
        if (mot_de_passe) {
            const saltRounds = 10;
            hashedPassword = await bcrypt.hash(mot_de_passe, saltRounds);
        }

        await db.promise().query(
            'UPDATE utilisateurs SET nom = ?, email = ?, mot_de_passe = ?, updated_at = NOW() WHERE id = ?',
            [nom || rows[0].nom, email || rows[0].email, hashedPassword, userIdToUpdate]
        );

        res.json({ message: "Utilisateur mis à jour avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la mise à jour de l'utilisateur." });
    }
};

exports.updateUserRole = async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const { role_id } = req.body;

    if (!role_id) {
        return res.status(400).json({ error: "Le champ 'role_id' est requis." });
    }

    try {
        const [rows] = await db.promise().query('SELECT * FROM utilisateurs WHERE id = ?', [userId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Utilisateur non trouvé." });
        }

        await db.promise().query('UPDATE utilisateurs SET role_id = ?, updated_at = NOW() WHERE id = ?', [role_id, userId]);

        res.json({ message: "Rôle de l'utilisateur mis à jour avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la mise à jour du rôle de l'utilisateur." });
    }
};
