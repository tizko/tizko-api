const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const { authenticateSchema, revokeTokenSchema, registerSchema, verifyEmailSchema, forgotPasswordSchema, resetPasswordSchema } = require('../validations/auth.validation');
const { authenticate, refreshToken, revokeToken, register, verifyEmail, forgotPassword, resetPassword } = require('../controllers/auth');

router.post('/login', authenticateSchema, authenticate);
router.post('/refresh-token', refreshToken);
router.post('/revoke-token', authorize(), revokeTokenSchema, revokeToken);
router.post('/register', registerSchema, register);
router.post('/verify-email', verifyEmailSchema, verifyEmail);
router.post('/forgot-password', forgotPasswordSchema, forgotPassword);
router.post('/reset-password', resetPasswordSchema, resetPassword);

module.exports = router;