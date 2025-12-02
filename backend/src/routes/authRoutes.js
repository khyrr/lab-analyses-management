const express = require('express');
const { register, login } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Public routes
router.post('/login', login);

// Protected routes (Only Admin can register new users)
router.post('/register', authMiddleware, roleMiddleware(['ADMIN']), register);

module.exports = router;
