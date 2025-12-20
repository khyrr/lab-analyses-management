const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new analysis type (Admin only usually, but open for now)
const createAnalysisType = async (req, res) => {
  try {
    const { name, unit, reference_min, reference_max, price } = req.body;

    const analysisType = await prisma.analysisType.create({
      data: {
        name,
        unit,
        reference_min: parseFloat(reference_min),
        reference_max: parseFloat(reference_max),
        price: parseFloat(price),
      },
    });

    res.status(201).json(analysisType);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Get all analysis types
const getAnalysisTypes = async (req, res) => {
  try {
    const types = await prisma.analysisType.findMany();
    res.json(types);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Create a new analysis request
const createAnalysisRequest = async (req, res) => {
  try {
    const { patientId, doctorName, analysisTypeIds } = req.body;

    // Create the request
    const request = await prisma.analysisRequest.create({
      data: {
        patientId: parseInt(patientId),
        doctorName,
        status: 'EN_ATTENTE',
      },
    });

    // Initialize empty results for the requested analysis types
    if (analysisTypeIds && analysisTypeIds.length > 0) {
      const resultsData = analysisTypeIds.map((typeId) => ({
        requestId: request.id,
        analysisTypeId: parseInt(typeId),
        value: 0, // Default value, to be filled later
      }));

      await prisma.analysisResult.createMany({
        data: resultsData,
      });
    }

    res.status(201).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Get all analysis requests (with filters)
const getAnalysisRequests = async (req, res) => {
  try {
    const { status, patientId } = req.query;

    const where = {};
    if (status) where.status = status;
    if (patientId) where.patientId = parseInt(patientId);

    const requests = await prisma.analysisRequest.findMany({
      where,
      include: {
        patient: true,
        results: {
          include: {
            analysisType: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Update results for an analysis request
const updateAnalysisResults = async (req, res) => {
  try {
    const { id } = req.params; // Request ID
    const { results } = req.body; // Array of { resultId, value }

    // Loop through results and update them
    for (const result of results) {
      const currentResult = await prisma.analysisResult.findUnique({
        where: { id: result.resultId },
        include: { analysisType: true },
      });

      if (currentResult) {
        const isAbnormal =
          result.value < currentResult.analysisType.reference_min ||
          result.value > currentResult.analysisType.reference_max;

        await prisma.analysisResult.update({
          where: { id: result.resultId },
          data: {
            value: parseFloat(result.value),
            isAbnormal,
          },
        });
      }
    }

    // Check if all results are filled to update status to COMPLETE
    // For simplicity, we just update status to COMPLETE if it was EN_ATTENTE
    await prisma.analysisRequest.update({
      where: { id: parseInt(id) },
      data: { status: 'COMPLETE' },
    });

    res.json({ message: 'Results updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Update status (e.g., Validate)
const updateAnalysisStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const request = await prisma.analysisRequest.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Update analysis request
const updateAnalysisRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { doctorName, patientId } = req.body;

    const existingRequest = await prisma.analysisRequest.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingRequest) {
      return res.status(404).json({ error: 'Analysis request not found' });
    }

    const updatedRequest = await prisma.analysisRequest.update({
      where: { id: parseInt(id) },
      data: {
        ...(doctorName && { doctorName }),
        ...(patientId && { patientId: parseInt(patientId) }),
      },
      include: {
        patient: true,
        results: {
          include: {
            analysisType: true,
          },
        },
      },
    });

    res.json(updatedRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update analysis request' });
  }
};

// Delete analysis request
const deleteAnalysisRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const existingRequest = await prisma.analysisRequest.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingRequest) {
      return res.status(404).json({ error: 'Analysis request not found' });
    }

    // Delete associated results first (cascade delete)
    await prisma.analysisResult.deleteMany({
      where: { requestId: parseInt(id) },
    });

    // Delete the request
    await prisma.analysisRequest.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Analysis request deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete analysis request' });
  }
};

module.exports = {
  createAnalysisType,
  getAnalysisTypes,
  createAnalysisRequest,
  getAnalysisRequests,
  updateAnalysisResults,
  updateAnalysisStatus,
  updateAnalysisRequest,
  deleteAnalysisRequest,
};
