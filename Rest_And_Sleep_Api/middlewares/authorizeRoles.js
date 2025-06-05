// middlewares/authorizeRoles.js

const jwt = require('jsonwebtoken');

module.exports = (...allowedRoles) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token manquant ou mal formaté.' });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("authorizeRoles → decoded.role_id :", decoded.role_id);

            // Vérifie si le rôle est autorisé
            if (!allowedRoles.includes(decoded.role_id)) {
                return res.status(403).json({ error: 'Accès interdit : rôle non autorisé.' });
            }

            // Attache les infos utilisateur à la requête
            req.user = decoded;

            next();
        } catch (err) {
            return res.status(401).json({ error: 'Token invalide ou expiré.' });
        }
    };
};
