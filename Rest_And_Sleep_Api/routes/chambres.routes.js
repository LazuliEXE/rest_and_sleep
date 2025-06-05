const express = require('express');
const router = express.Router();
const db = require('../db');

const controller = require('../controllers/chambres.controller');
const verifyToken = require('../middlewares/verifyToken');
const authorizeRoles = require('../middlewares/authorizeRoles');

// Création d’une chambre d'hôtel réservée aux rôles Manager (3) ou PDG (2)
router.post('/', verifyToken, authorizeRoles(2, 3), controller.createChambre);

// GET /chambres - toutes les chambres
router.get('/', verifyToken, controller.getAllChambres);

// GET /chambres/:chambresId - Récupérer une chambre par son ID
router.get('/:id', controller.getChambreById);

router.delete('/:id', verifyToken, authorizeRoles(2, 3), controller.deleteChambre);

router.put('/:id', verifyToken, authorizeRoles(2, 3), controller.updateChambre);

module.exports = router;