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

    // Initialize empty results for the requested analysis types (value null = not yet measured)
    if (analysisTypeIds && analysisTypeIds.length > 0) {
      const resultsData = analysisTypeIds.map((typeId) => ({
        requestId: request.id,
        analysisTypeId: parseInt(typeId),
        value: null, // not set yet
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
        const numericValue = result.value !== null && result.value !== undefined ? parseFloat(result.value) : null;
        const isAbnormal = numericValue !== null && (
          numericValue < currentResult.analysisType.reference_min ||
          numericValue > currentResult.analysisType.reference_max
        );

        await prisma.analysisResult.update({
          where: { id: result.resultId },
          data: {
            value: numericValue,
            isAbnormal,
            measuredBy: req.user?.id || null,
            measuredAt: numericValue !== null ? new Date() : null,
          },
        });
      }
    }

    // After updating results, check if all non-void results have values
    const allResults = await prisma.analysisResult.findMany({ where: { requestId: parseInt(id) } });
    const requiredResults = allResults.filter(r => !r.isVoided);
    const allFilled = requiredResults.length === 0 || requiredResults.every(r => r.value !== null && r.value !== undefined);

    if (allFilled) {
      await prisma.analysisRequest.update({
        where: { id: parseInt(id) },
        data: { status: 'COMPLETE' },
      });
    }

    res.json({ message: 'Results updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Get results for a single analysis request
const getAnalysisResults = async (req, res) => {
  try {
    const { id } = req.params; // Request ID
    const results = await prisma.analysisResult.findMany({
      where: { requestId: parseInt(id) },
      include: { analysisType: true },
      orderBy: { id: 'asc' },
    });
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Get all results with filters & pagination
const getAllResults = async (req, res) => {
  try {
    const { page = 1, limit = 50, analysisTypeId, requestId, patientId, isAbnormal, from, to } = req.query;
    const where = {};

    if (analysisTypeId) where.analysisTypeId = parseInt(analysisTypeId);
    if (requestId) where.requestId = parseInt(requestId);
    if (typeof isAbnormal !== 'undefined') where.isAbnormal = isAbnormal === 'true';

    // By default, exclude voided results unless explicitly requested
    if (typeof req.query.isVoided !== 'undefined') {
      where.isVoided = req.query.isVoided === 'true';
    } else {
      where.isVoided = false;
    }

    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    // If patientId is provided, join via request
    let results;
    let total;
    const take = Math.min(100, parseInt(limit));
    const skip = (parseInt(page) - 1) * take;

    if (patientId) {
      const requestIds = (await prisma.analysisRequest.findMany({ where: { patientId: parseInt(patientId) }, select: { id: true } })).map(r => r.id);
      where.requestId = { in: requestIds };
    }

    total = await prisma.analysisResult.count({ where });

    results = await prisma.analysisResult.findMany({
      where,
      include: { analysisType: true, request: { include: { patient: true } } },
      orderBy: { createdAt: 'desc' },
      take,
      skip,
    });

    res.json({ page: parseInt(page), limit: take, total, results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Void (soft-delete) a specific analysis result
const voidAnalysisResult = async (req, res) => {
  try {
    const { id } = req.params; // resultId
    const { reason } = req.body;
    const userId = req.user?.id || null;

    const existing = await prisma.analysisResult.findUnique({ where: { id: parseInt(id) } });
    if (!existing) return res.status(404).json({ error: 'Result not found' });

    const updated = await prisma.analysisResult.update({
      where: { id: parseInt(id) },
      data: {
        isVoided: true,
        voidReason: reason || null,
        voidedBy: userId,
        voidedAt: new Date(),
      },
    });

    // After voiding, re-evaluate parent request completeness
    const allResults = await prisma.analysisResult.findMany({ where: { requestId: updated.requestId } });
    const requiredResults = allResults.filter(r => !r.isVoided);
    const allFilled = requiredResults.length === 0 || requiredResults.every(r => r.value !== null && r.value !== undefined);
    if (allFilled) {
      await prisma.analysisRequest.update({ where: { id: updated.requestId }, data: { status: 'COMPLETE' } });
    }

    res.json(updated);
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
  getAnalysisResults,
  getAllResults,
  voidAnalysisResult,
  updateAnalysisStatus,
  updateAnalysisRequest,
  deleteAnalysisRequest,
};
