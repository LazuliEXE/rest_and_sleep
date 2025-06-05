// middlewares/notFound.js
module.exports = (req, res) => {
    res.status(404).json({ message: 'Route non trouvée.' });
};