const express = require('express');
const {
  createAnalysisType,
  getAnalysisTypes,
  createAnalysisRequest,
  getAnalysisRequests,
  updateAnalysisResults,
  updateAnalysisStatus,
} = require('../controllers/analysisController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(authMiddleware);

// Analysis Types
router.post('/types', roleMiddleware(['ADMIN']), createAnalysisType);
router.get('/types', getAnalysisTypes);

// Analysis Requests
router.post('/', createAnalysisRequest);
router.get('/', getAnalysisRequests);

// Results & Status
router.put('/:id/results', roleMiddleware(['TECHNICIAN', 'ADMIN']), updateAnalysisResults);
router.patch('/:id/status', roleMiddleware(['ADMIN', 'TECHNICIAN']), updateAnalysisStatus);

module.exports = router;
