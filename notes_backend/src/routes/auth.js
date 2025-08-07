const express = require('express');
const controller = require('../controllers/auth');

/**
 * @swagger
 * tags:
 *   - name: auth
 *     description: User authentication
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User signed up successfully with JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *                 user:
 *                   type: object
 *                   properties:
 *                     id: { type: integer }
 *                     username: { type: string }
 *       409:
 *         description: Username already exists
 *       400:
 *         description: Validation error
 * /auth/login:
 *   post:
 *     summary: Login as a user
 *     tags: [auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 * /auth/whoami:
 *   get:
 *     summary: Get current user
 *     tags: [auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns user's info (id/username)
 */

const router = express.Router();
router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.get('/whoami', require('../middleware').requireAuth, controller.whoami);

module.exports = router;
