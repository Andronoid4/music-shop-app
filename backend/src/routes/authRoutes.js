const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');

router.post('/register', auth.register);
router.post('/login', auth.login);
router.get('/users', auth.authenticateToken, auth.getUsers);
router.put('/users/:userId/ban', auth.authenticateToken, auth.banUser);

module.exports = router;