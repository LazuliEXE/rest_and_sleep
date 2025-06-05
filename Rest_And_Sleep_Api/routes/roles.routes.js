const express = require('express');
const router = express.Router();

// Import du contrôleur des utilisateurs
const controller = require('../controllers/roles.controller');
const verifyToken = require('../middlewares/verifyToken');
const authorizeRoles = require('../middlewares/authorizeRoles');

// Toutes les routes sont réservées aux ADMIN (id: 1)
router.get('/', verifyToken, authorizeRoles(1), controller.getAllRoles);
router.post('/', verifyToken, authorizeRoles(1), controller.createRole);
router.put('/:id', verifyToken, authorizeRoles(1), controller.updateRole);
router.delete('/:id', verifyToken, authorizeRoles(1), controller.deleteRole);

module.exports = router;
