const cron = require('node-cron');
const db = require('../db');

// Planifie la tâche : tous les jours à 00:00
cron.schedule('0 0 * * *', async () => {
    try {
        const [result] = await db.promise().query(
            'DELETE FROM reservations WHERE start_date < DATE_SUB(NOW(), INTERVAL 7 DAY)'
        );
        console.log(`${result.affectedRows} réservations supprimées automatiquement.`);
    } catch (err) {
        console.error('Erreur CRON suppression réservations :', err.message);
    }
});
