const express = require('express');
const router = express.Router();

// Import du contrôleur des utilisateurs
const controller = require('../controllers/reservations.controller');
const verifyToken = require('../middlewares/verifyToken');
const authorizeRoles = require('../middlewares/authorizeRoles');

router.post('/', verifyToken, controller.createReservations)

router.get('/', verifyToken, controller.getAllReservations);

router.get('/:id', verifyToken, controller.getReservationById);

router.delete('/:id', verifyToken, controller.deleteReservation);

router.put('/reservations/:id', verifyToken, controller.updateReservation);

module.exports = router;