const express = require('express');
const {
  getAllDoctors,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

/**
 * @swagger
 * /users/doctors:
 *   get:
 *     summary: Get all doctors (MEDECIN role)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 */
router.get('/doctors', authMiddleware, getAllDoctors);

// All other user routes require authentication and admin role
router.use(authMiddleware);
router.use(roleMiddleware(['ADMIN']));

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management (Admin only)
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   role:
 *                     type: string
 *                     enum: [ADMIN, TECHNICIAN, SECRETARY, MEDECIN]
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 */
router.get('/', getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get('/:id', getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [ADMIN, TECHNICIAN, SECRETARY, MEDECIN]
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put('/:id', updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/:id', deleteUser);

/**
 * @swagger
 * /users/{id}/password:
 *   put:
 *     summary: Change user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       404:
 *         description: User not found
 */
router.put('/:id/password', changePassword);

module.exports = router;
