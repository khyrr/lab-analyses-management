const express = require('express');
const { getDashboardStats, getRecentActivity } = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard statistics and activity
 */

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 overview:
 *                   type: object
 *                   properties:
 *                     totalPatients:
 *                       type: integer
 *                     totalUsers:
 *                       type: integer
 *                     totalAnalysisTypes:
 *                       type: integer
 *                     totalAnalysisRequests:
 *                       type: integer
 *                 analyses:
 *                   type: object
 *                   properties:
 *                     pending:
 *                       type: integer
 *                     COMPLÉTÉ:
 *                       type: integer
 *                     validated:
 *                       type: integer
 *                 recent:
 *                   type: object
 *                   properties:
 *                     patientsLast30Days:
 *                       type: integer
 *                     analysesLast30Days:
 *                       type: integer
 */
router.get('/stats', roleMiddleware(['ADMIN', 'MEDECIN']), getDashboardStats);

/**
 * @swagger
 * /dashboard/recent-activity:
 *   get:
 *     summary: Get recent activity
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items to return
 *     responses:
 *       200:
 *         description: Recent activity
 */
router.get('/recent-activity', roleMiddleware(['ADMIN', 'MEDECIN']), getRecentActivity);

module.exports = router;
