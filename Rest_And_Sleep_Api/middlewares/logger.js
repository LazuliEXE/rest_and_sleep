const db = require('../db'); // ajuste le chemin selon ton projet

const logger= (req, res, next) => {
    // On ignore les requêtes OPTIONS
    if (req.method === 'OPTIONS') return next();

    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const log = {
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            duration,
            timestamp: new Date()
        };

        db.query(
            'INSERT INTO logs (method, url, status_code, duration_ms, timestamp) VALUES (?, ?, ?, ?, ?)',
            [log.method, log.url, log.statusCode, log.duration, log.timestamp],
            (err) => {
                if (err) {
                    console.error('Erreur lors de l’insertion du log :', err);
                }
            }
        );
    });

    next();
};


module.exports = logger;
