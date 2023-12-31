// authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { handleImageUpload } = require('../middlewares/uploadsMiddleware')

router.post('/register', handleImageUpload, register);
router.post('/login', login);

module.exports = router;