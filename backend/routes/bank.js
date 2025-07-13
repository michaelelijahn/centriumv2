const express = require('express');
const router = express.Router();
const { registerBank } = require('../controllers/bankController');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/register', registerBank);

module.exports = router;