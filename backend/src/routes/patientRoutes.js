const express = require('express');
const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getPatientHistory,
} = require('../controllers/patientController');
const { generatePatientHistoryPDF } = require('../controllers/reportController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: Patient management
 */

/**
 * @swagger
 * /patients:
 *   post:
 *     summary: Create a new patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - dateOfBirth
 *               - gender
 *               - address
 *               - phone
 *               - cin
 *             properties:
 *               fullName:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               cin:
 *                 type: string
 *     responses:
 *       201:
 *         description: Patient created successfully
 *       400:
 *         description: Patient with this CIN already exists
 */
router.post('/', roleMiddleware(['SECRETARY', 'ADMIN']), createPatient);

/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Obtenir tous les patients
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Nombre d'éléments par page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Rechercher par nom ou CIN
 *     responses:
 *       200:
 *         description: Liste des patients
 */
router.get('/', getPatients);

/**
 * @swagger
 * /patients/{id}:
 *   get:
 *     summary: Obtenir un patient par ID
 *     tags: [Patients]
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
 *         description: Détails du patient
 *       404:
 *         description: Patient non trouvé
 */
router.get('/:id', getPatientById);

/**
 * @swagger
 * /patients/{id}:
 *   put:
 *     summary: Mettre à jour un patient
 *     tags: [Patients]
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
 *             properties:
 *               fullName:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               cin:
 *                 type: string
 *     responses:
 *       200:
 *         description: Patient mis à jour avec succès
 *       404:
 *         description: Patient non trouvé
 */
router.put('/:id', roleMiddleware(['SECRETARY', 'ADMIN']), updatePatient);

/**
 * @swagger
 * /patients/{id}:
 *   delete:
 *     summary: (suppression douce) Supprimer un patient
 *     tags: [Patients]
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
 *         description: Patient supprimé avec succès
 *       404:
 *         description: Patient non trouvé
 */
router.delete('/:id', roleMiddleware(['ADMIN']), deletePatient);

/**
 * @swagger
 * /patients/{id}/history:
 *   get:
 *     summary: Obtenir l'historique des analyses d'un patient
 *     tags: [Patients]
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
 *         description: Historique du patient
 *       404:
 *         description: Patient non trouvé
 */
router.get('/:id/history', getPatientHistory);

/**
 * @swagger
 * /patients/{id}/history/pdf:
 *   get:
 *     summary: Générer l'historique complet du patient en PDF
 *     tags: [Patients]
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
 *         description: PDF de l'historique généré
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Patient non trouvé
 */
router.get('/:id/history/pdf', roleMiddleware(['MEDECIN', 'ADMIN']), generatePatientHistoryPDF);

module.exports = router;
