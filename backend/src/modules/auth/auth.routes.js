const express = require('express');
const authController = require('./auth.controller');
const { authHandler } = require('../../middleware/auth.middleware');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/change-password', authHandler, authController.changePassword);

module.exports = router;