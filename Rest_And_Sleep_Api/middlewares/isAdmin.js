// middlewares/isAdmin.js

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Vérifie si le token est présent
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token manquant ou mal formaté.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Vérifie et décode le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Vérifie si l'utilisateur est admin
        if (decoded.role_id !== 1) {
            return res.status(403).json({ error: 'Accès interdit : administrateur uniquement.' });
        }

        // Ajoute les infos utilisateur à la requête
        req.user = decoded;

        // Passe à l'étape suivante
        next();

    } catch (err) {
        return res.status(401).json({ error: 'Token invalide ou expiré.' });
    }
};
