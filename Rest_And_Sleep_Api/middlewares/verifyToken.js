const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];

  // Le token est normalement envoyé sous forme : "Bearer TOKEN"
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
    }

  // Vérification du token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token invalide.' });
        }

    console.log("authorizeRoles → decoded.role_id :", decoded.role_id);
    // Ajouter les infos du token (par ex. l'utilisateur) à la requête
    req.user = decoded;
    next();
    });
}

module.exports = verifyToken;
