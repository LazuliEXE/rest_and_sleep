const express = require('express');
const router = express.Router();

// Import du contrôleur des utilisateurs
const controller = require('../controllers/users.controller');
const verifyToken = require('../middlewares/verifyToken');
const authorizeRoles = require('../middlewares/authorizeRoles');

// Création
router.post('/', controller.createUser);
router.post('/login', controller.loginUser);

// Lecture
router.get('/', verifyToken, authorizeRoles(1), controller.getAllUsers);
router.get('/:id', verifyToken, controller.getUserById);

// Mise à jour rôle
router.put('/:id/role', verifyToken, authorizeRoles(1), controller.updateUserRole);

// Mise à jour utilisateur
router.put('/:id', verifyToken, controller.updateUser);

// Suppression
router.delete('/:id', verifyToken, authorizeRoles(1), controller.deleteUser);

module.exports = router;
