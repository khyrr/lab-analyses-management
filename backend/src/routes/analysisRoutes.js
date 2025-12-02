const express = require('express');
const {
  createAnalysisType,
  getAnalysisTypes,
  createAnalysisRequest,
  getAnalysisRequests,
  updateAnalysisResults,
  updateAnalysisStatus,
} = require('../controllers/analysisController');
const { generateReport } = require('../controllers/reportController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Analyses
 *   description: Analysis management
 */

/**
 * @swagger
 * /analyses/types:
 *   post:
 *     summary: Create a new analysis type (Admin only)
 *     tags: [Analyses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - unit
 *               - reference_min
 *               - reference_max
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               unit:
 *                 type: string
 *               reference_min:
 *                 type: number
 *               reference_max:
 *                 type: number
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Analysis type created
 *       403:
 *         description: Insufficient permissions
 */
router.post('/types', roleMiddleware(['ADMIN']), createAnalysisType);

/**
 * @swagger
 * /analyses/types:
 *   get:
 *     summary: Get all analysis types
 *     tags: [Analyses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of analysis types
 */
router.get('/types', getAnalysisTypes);

/**
 * @swagger
 * /analyses:
 *   post:
 *     summary: Create a new analysis request
 *     tags: [Analyses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *               - doctorName
 *               - analysisTypeIds
 *             properties:
 *               patientId:
 *                 type: integer
 *               doctorName:
 *                 type: string
 *               analysisTypeIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Analysis request created
 */
router.post('/', createAnalysisRequest);

/**
 * @swagger
 * /analyses:
 *   get:
 *     summary: Get all analysis requests
 *     tags: [Analyses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, COMPLETED, VALIDATED]
 *       - in: query
 *         name: patientId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of analysis requests
 */
router.get('/', getAnalysisRequests);

/**
 * @swagger
 * /analyses/{id}/results:
 *   put:
 *     summary: Update analysis results (Technician/Admin)
 *     tags: [Analyses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - results
 *             properties:
 *               results:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     resultId:
 *                       type: integer
 *                     value:
 *                       type: number
 *     responses:
 *       200:
 *         description: Results updated
 */
router.put('/:id/results', roleMiddleware(['TECHNICIAN', 'ADMIN']), updateAnalysisResults);

/**
 * @swagger
 * /analyses/{id}/status:
 *   patch:
 *     summary: Update analysis status
 *     tags: [Analyses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, COMPLETED, VALIDATED]
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/:id/status', roleMiddleware(['ADMIN', 'TECHNICIAN']), updateAnalysisStatus);

/**
 * @swagger
 * /analyses/{id}/pdf:
 *   get:
 *     summary: Generate PDF report
 *     tags: [Analyses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: PDF file
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/:id/pdf', generateReport);

module.exports = router;
