const express = require('express');
const router = express.Router();

// Import du contrôleur des utilisateurs
const controller = require('../controllers/hotels.controller');
const verifyToken = require('../middlewares/verifyToken');
const authorizeRoles = require('../middlewares/authorizeRoles');
// Création d’hôtel réservée aux rôles Manager (3) ou PDG (2)
router.post('/', verifyToken, authorizeRoles(2, 3), controller.createHotel);

router.get('/', controller.getAllHotels);

router.get('/:id', controller.getHotelById);

// GET /hotels/:hotelId/chambres
router.get('/:hotelId/chambres' , controller.getChambresByHotelId);

router.delete('/:id', verifyToken, authorizeRoles(2, 3), controller.deleteHotel);

router.put('/:id', verifyToken, authorizeRoles(2, 3), controller.updateHotel);

module.exports = router;