const express = require('express');
const app = express();
require('dotenv').config({ path: './config/.env' });
require('./cron/deleteOldReservations');
const db = require('./db/index');

//middlewares
app.use(express.json());
const logger = require('./middlewares/logger'); // ✅ Import du logger
app.use(logger); // ✅ Utilisation du middleware de log

// Import des routes
const hotelsRoutes = require('./routes/hotels.routes');
const chambresRoutes = require('./routes/chambres.routes');
const reservationsRoutes = require('./routes/reservations.routes');
const usersRoutes = require('./routes/users.routes');
const rolesRoutes = require('./routes/roles.routes');
const logsRoutes = require('./routes/logs.routes');

// Utilisation des routes
app.use('/hotels', hotelsRoutes);
app.use('/chambres', chambresRoutes);
app.use('/reservations', reservationsRoutes);
app.use('/users', usersRoutes);
app.use('/roles', rolesRoutes);
app.use('/logs', logsRoutes);

app.get('/', (req, res) => {
    res.send('Bienvenue sur l’API de réservation hôtelière 🏨');
});

// ✅ Middleware 404
const notFound = require('./middlewares/notFound');
app.use(notFound);


// ✅ Middleware d'erreur 500
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

if (require.main === module) {
    app.listen(process.env.PORT, () => {
        console.log(`✅ Serveur démarré sur http://localhost:${process.env.PORT} 🚀`);
    });
}
