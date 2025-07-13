const express = require('express');
const router = express.Router();
const { registerBank } = require('../controllers/bankController');

router.post('/register', registerBank);

module.exports = router;