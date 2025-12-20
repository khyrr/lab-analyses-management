const prisma = require('../config/prisma');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const totalPatients = await prisma.patient.count({
      where: { deleted: false },
    });

    const totalUsers = await prisma.user.count();

    const totalAnalysisTypes = await prisma.analysisType.count();

    const totalAnalysisRequests = await prisma.analysisRequest.count();

    // Get analysis requests by status
    const pendingAnalyses = await prisma.analysisRequest.count({
      where: { status: 'PENDING' },
    });

    const COMPLÉTÉAnalyses = await prisma.analysisRequest.count({
      where: { status: 'COMPLÉTÉ' },
    });

    const validatedAnalyses = await prisma.analysisRequest.count({
      where: { status: 'VALIDATED' },
    });

    // Get recent statistics (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentPatients = await prisma.patient.count({
      where: {
        deleted: false,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    const recentAnalyses = await prisma.analysisRequest.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    // Get users by role
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true,
      },
    });

    const stats = {
      overview: {
        totalPatients,
        totalUsers,
        totalAnalysisTypes,
        totalAnalysisRequests,
      },
      analyses: {
        pending: pendingAnalyses,
        COMPLÉTÉ: COMPLÉTÉAnalyses,
        validated: validatedAnalyses,
      },
      recent: {
        patientsLast30Days: recentPatients,
        analysesLast30Days: recentAnalyses,
      },
      users: {
        byRole: usersByRole.reduce((acc, item) => {
          acc[item.role] = item._count.role;
          return acc;
        }, {}),
      },
    };

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
};

// Get recent activity
const getRecentActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Get recent patients
    const recentPatients = await prisma.patient.findMany({
      where: { deleted: false },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        fullName: true,
        createdAt: true,
      },
    });

    // Get recent analysis requests
    const recentAnalyses = await prisma.analysisRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        patient: {
          select: {
            fullName: true,
          },
        },
      },
    });

    // Get recent analysis results updates
    const recentResults = await prisma.analysisResult.findMany({
      orderBy: { updatedAt: 'desc' },
      take: limit,
      include: {
        request: {
          include: {
            patient: {
              select: {
                fullName: true,
              },
            },
          },
        },
        analysisType: {
          select: {
            name: true,
          },
        },
      },
    });

    const activity = {
      recentPatients: recentPatients.map((p) => ({
        type: 'patient_created',
        id: p.id,
        description: `Nouveau patient: ${p.fullName}`,
        createdAt: p.createdAt,
      })),
      recentAnalyses: recentAnalyses.map((a) => ({
        type: 'analysis_request',
        id: a.id,
        description: `Demande d'analyse pour ${a.patient.fullName} - Statut: ${a.status}`,
        createdAt: a.createdAt,
      })),
      recentResults: recentResults.map((r) => ({
        type: 'result_updated',
        id: r.id,
        description: `Résultat mis à jour: ${r.analysisType.name} pour ${r.request.patient.fullName}`,
        updatedAt: r.updatedAt,
      })),
    };

    res.json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
};

module.exports = {
  getDashboardStats,
  getRecentActivity,
};
