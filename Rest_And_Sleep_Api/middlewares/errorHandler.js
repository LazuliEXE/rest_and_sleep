// middlewares/errorHandler.js
module.exports = (err, req, res, next) => {
    console.error('Erreur serveur :', err.stack);
    res.status(500).json({ message: 'Erreur serveur' });
};
