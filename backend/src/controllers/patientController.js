const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new patient
const createPatient = async (req, res) => {
  try {
    const { fullName, dateOfBirth, gender, address, phone, email, cin } = req.body;

    // Check if patient with CIN already exists
    const existingPatient = await prisma.patient.findUnique({
      where: { cin },
    });

    if (existingPatient) {
      return res.status(400).json({ error: 'Patient with this CIN already exists' });
    }

    const patient = await prisma.patient.create({
      data: {
        fullName,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        address,
        phone,
        email,
        cin,
      },
    });

    res.status(201).json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Get all patients with pagination and search
const getPatients = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      deleted: false,
      OR: [
        { fullName: { contains: search, mode: 'insensitive' } },
        { cin: { contains: search, mode: 'insensitive' } },
      ],
    };

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.patient.count({ where }),
    ]);

    res.json({
      patients,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      totalPatients: total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Get single patient by ID
const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(id) },
    });

    if (!patient || patient.deleted) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Update patient
const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, dateOfBirth, gender, address, phone, email, cin } = req.body;

    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(id) },
    });

    if (!patient || patient.deleted) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const updatedPatient = await prisma.patient.update({
      where: { id: parseInt(id) },
      data: {
        fullName,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        gender,
        address,
        phone,
        email,
        cin,
      },
    });

    res.json(updatedPatient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Soft delete patient
const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(id) },
    });

    if (!patient || patient.deleted) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    await prisma.patient.update({
      where: { id: parseInt(id) },
      data: { deleted: true },
    });

    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};
