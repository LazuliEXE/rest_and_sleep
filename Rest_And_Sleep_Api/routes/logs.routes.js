const express = require('express');
const router = express.Router();

// Import du contrôleur des utilisateurs
const controller = require('../controllers/logs.controller');
const verifyToken = require('../middlewares/verifyToken');
const authorizeRoles = require('../middlewares/authorizeRoles');

// Lecture des logs uniquement pour ADMIN
router.get('/', verifyToken, authorizeRoles(1), controller.getLogs);

module.exports = router;
