const express = require('express');
const {
  createAnalysisType,
  getAnalysisTypes,
  createAnalysisRequest,
  getAnalysisRequests,
  updateAnalysisResults,
  updateAnalysisStatus,
  updateAnalysisRequest,
  deleteAnalysisRequest,
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
 *   description: Gestion des analyses
 */

/**
 * @swagger
 * /analyses/types:
 *   post:
 *     summary: creer un nouveau type d'analyse (Admin uniquement)
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
 *         description: Type d'analyse créé
 *       403:
 *         description: Insufficient permissions
 */
router.post('/types', roleMiddleware(['ADMIN']), createAnalysisType);

/**
 * @swagger
 * /analyses/types:
 *   get:
 *     summary: Obtenir tous les types d'analyses
 *     tags: [Analyses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des types d'analyses
 */
router.get('/types', getAnalysisTypes);

/**
 * @swagger
 * /analyses:
 *   post:
 *     summary: Créer une nouvelle demande d'analyse
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
 *         description: Demande d'analyse créée
 */
router.post('/', roleMiddleware(['SECRETARY', 'ADMIN']), createAnalysisRequest);

/**
 * @swagger
 * /analyses:
 *   get:
 *     summary: Obtenir toutes les demandes d'analyses
 *     tags: [Analyses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, COMPLÉTÉ, VALIDATED]
 *       - in: query
 *         name: patientId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des demandes d'analyses
 */
router.get('/', getAnalysisRequests);

/**
 * @swagger
 * /analyses/{id}/results:
 *   put:
 *     summary: Mettre à jour les résultats d'analyse (Technicien/Admin)
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
 *         description: Résultats mis à jour
 */
router.put('/:id/results', roleMiddleware(['TECHNICIAN', 'ADMIN']), updateAnalysisResults);

/**
 * @swagger
 * /analyses/{id}/status:
 *   patch:
 *     summary: mettre à jour le statut d'une demande d'analyse (Technicien/Admin)
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
 *                 enum: [PENDING, COMPLÉTÉ, VALIDATED]
 *     responses:
 *       200:
 *         description: Statut mis à jour
 */
router.patch('/:id/status', roleMiddleware(['ADMIN', 'TECHNICIAN']), updateAnalysisStatus);

/**
 * @swagger
 * /analyses/{id}/pdf:
 *   get:
 *     summary: Générer un rapport PDF
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
 *         description: Rapport PDF généré
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/:id/pdf', roleMiddleware(['MEDECIN', 'ADMIN']), generateReport);

/**
 * @swagger
 * /analyses/{id}:
 *   put:
 *     summary: Mettre à jour une demande d'analyse (Secrétaire/Admin)
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
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctorName:
 *                 type: string
 *               patientId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Demande d'analyse mise à jour
 *       404:
 *         description: Demande d'analyse non trouvée
 */
router.put('/:id', roleMiddleware(['SECRETARY', 'ADMIN']), updateAnalysisRequest);

/**
 * @swagger
 * /analyses/{id}:
 *   delete:
 *     summary: Supprimer une demande d'analyse (Secrétaire/Admin)
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
 *         description: Demande d'analyse supprimée
 *       404:
 *         description: Demande d'analyse non trouvée
 */
router.delete('/:id', roleMiddleware(['SECRETARY', 'ADMIN']), deleteAnalysisRequest);

module.exports = router;
