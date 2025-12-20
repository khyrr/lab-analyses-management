const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...\n');

  // Create users
  console.log('👥 Creating users...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  const technicianPassword = await bcrypt.hash('tech123', 10);
  const secretaryPassword = await bcrypt.hash('secretary123', 10);
  const medecinPassword = await bcrypt.hash('medecin123', 10);

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password_hash: adminPassword,
      role: 'ADMIN',
    },
  });

  const technician = await prisma.user.upsert({
    where: { username: 'technician' },
    update: {},
    create: {
      username: 'technician',
      password_hash: technicianPassword,
      role: 'TECHNICIAN',
    },
  });

  const secretary = await prisma.user.upsert({
    where: { username: 'secretary' },
    update: {},
    create: {
      username: 'secretary',
      password_hash: secretaryPassword,
      role: 'SECRETARY',
    },
  });

  const medecin = await prisma.user.upsert({
    where: { username: 'medecin' },
    update: {},
    create: {
      username: 'medecin',
      password_hash: medecinPassword,
      role: 'MEDECIN',
    },
  });

  console.log(`✅ Created ${4} users`);

  // Create analysis types
  console.log('\n🧪 Creating analysis types...');
  const analysisTypes = [
    {
      name: 'Glycémie',
      unit: 'g/L',
      reference_min: 0.7,
      reference_max: 1.1,
      price: 50,
    },
    {
      name: 'Cholestérol Total',
      unit: 'g/L',
      reference_min: 1.5,
      reference_max: 2.0,
      price: 60,
    },
    {
      name: 'Triglycérides',
      unit: 'g/L',
      reference_min: 0.5,
      reference_max: 1.5,
      price: 55,
    },
    {
      name: 'Créatinine',
      unit: 'mg/L',
      reference_min: 7,
      reference_max: 13,
      price: 45,
    },
    {
      name: 'Urée',
      unit: 'g/L',
      reference_min: 0.15,
      reference_max: 0.45,
      price: 40,
    },
    {
      name: 'ASAT (TGO)',
      unit: 'UI/L',
      reference_min: 10,
      reference_max: 40,
      price: 70,
    },
    {
      name: 'ALAT (TGP)',
      unit: 'UI/L',
      reference_min: 10,
      reference_max: 40,
      price: 70,
    },
    {
      name: 'Hémoglobine',
      unit: 'g/dL',
      reference_min: 12,
      reference_max: 16,
      price: 35,
    },
    {
      name: 'Globules Blancs',
      unit: '10³/µL',
      reference_min: 4,
      reference_max: 10,
      price: 30,
    },
    {
      name: 'Plaquettes',
      unit: '10³/µL',
      reference_min: 150,
      reference_max: 400,
      price: 30,
    },
  ];

  for (const type of analysisTypes) {
    await prisma.analysisType.upsert({
      where: { name: type.name },
      update: {},
      create: type,
    });
  }

  console.log(`✅ Created ${analysisTypes.length} analysis types`);

  // Create sample patients
  console.log('\n🏥 Creating sample patients...');
  const patients = [
    {
      fullName: 'Mohammed Ben Ali',
      dateOfBirth: new Date('1985-03-15'),
      gender: 'M',
      address: '123 Rue de la Liberté, Casablanca',
      phone: '0612345678',
      email: 'mohammed.benali@email.com',
      cin: 'AB123456',
    },
    {
      fullName: 'Fatima Zahra El Amrani',
      dateOfBirth: new Date('1990-07-22'),
      gender: 'F',
      address: '456 Avenue Hassan II, Rabat',
      phone: '0623456789',
      email: 'fatima.elamrani@email.com',
      cin: 'CD234567',
    },
    {
      fullName: 'Ahmed Khalil',
      dateOfBirth: new Date('1978-11-08'),
      gender: 'M',
      address: '789 Boulevard Zerktouni, Marrakech',
      phone: '0634567890',
      email: 'ahmed.khalil@email.com',
      cin: 'EF345678',
    },
    {
      fullName: 'Sanaa Bennani',
      dateOfBirth: new Date('1995-01-30'),
      gender: 'F',
      address: '321 Rue Mohammed V, Fès',
      phone: '0645678901',
      email: 'sanaa.bennani@email.com',
      cin: 'GH456789',
    },
    {
      fullName: 'Youssef Alaoui',
      dateOfBirth: new Date('1982-09-12'),
      gender: 'M',
      address: '654 Avenue des FAR, Tanger',
      phone: '0656789012',
      email: null,
      cin: 'IJ567890',
    },
  ];

  const createdPatients = [];
  for (const patient of patients) {
    const created = await prisma.patient.upsert({
      where: { cin: patient.cin },
      update: {},
      create: patient,
    });
    createdPatients.push(created);
  }

  console.log(`✅ Created ${createdPatients.length} patients`);

  // Create sample analysis requests with results
  console.log('\n📋 Creating analysis requests with results...');
  
  const allAnalysisTypes = await prisma.analysisType.findMany();

  // Request 1: Complete blood work for patient 1
  const request1 = await prisma.analysisRequest.create({
    data: {
      patientId: createdPatients[0].id,
      doctorName: 'Dr. Hassan Mouline',
      status: 'VALIDATED',
    },
  });

  await prisma.analysisResult.createMany({
    data: [
      {
        requestId: request1.id,
        analysisTypeId: allAnalysisTypes.find(t => t.name === 'Glycémie').id,
        value: 0.95,
        isAbnormal: false,
      },
      {
        requestId: request1.id,
        analysisTypeId: allAnalysisTypes.find(t => t.name === 'Cholestérol Total').id,
        value: 1.8,
        isAbnormal: false,
      },
      {
        requestId: request1.id,
        analysisTypeId: allAnalysisTypes.find(t => t.name === 'Hémoglobine').id,
        value: 14.2,
        isAbnormal: false,
      },
    ],
  });

  // Request 2: Liver function test for patient 2 (abnormal results)
  const request2 = await prisma.analysisRequest.create({
    data: {
      patientId: createdPatients[1].id,
      doctorName: 'Dr. Amina Benjelloun',

      status: 'COMPLÉTÉ',
    },
  });

  await prisma.analysisResult.createMany({
    data: [
      {
        requestId: request2.id,
        analysisTypeId: allAnalysisTypes.find(t => t.name === 'ASAT (TGO)').id,
        value: 55,
        isAbnormal: true,
      },
      {
        requestId: request2.id,
        analysisTypeId: allAnalysisTypes.find(t => t.name === 'ALAT (TGP)').id,
        value: 48,
        isAbnormal: true,
      },
    ],
  });

  // Request 3: Pending request for patient 3
  const request3 = await prisma.analysisRequest.create({
    data: {
      patientId: createdPatients[2].id,
      doctorName: 'Dr. Karim El Fassi',
      status: 'PENDING',
    },
  });

  await prisma.analysisResult.createMany({
    data: [
      {
        requestId: request3.id,
        analysisTypeId: allAnalysisTypes.find(t => t.name === 'Créatinine').id,
        value: 0,
        isAbnormal: false,
      },
      {
        requestId: request3.id,
        analysisTypeId: allAnalysisTypes.find(t => t.name === 'Urée').id,
        value: 0,
        isAbnormal: false,
      },
    ],
  });

  // Request 4: Complete metabolic panel for patient 4
  const request4 = await prisma.analysisRequest.create({
    data: {
      patientId: createdPatients[3].id,
      doctorName: 'Dr. Leila Idrissi',
      status: 'VALIDATED',
    },
  });

  await prisma.analysisResult.createMany({
    data: [
      {
        requestId: request4.id,
        analysisTypeId: allAnalysisTypes.find(t => t.name === 'Glycémie').id,
        value: 1.35,
        isAbnormal: true,
      },
      {
        requestId: request4.id,
        analysisTypeId: allAnalysisTypes.find(t => t.name === 'Triglycérides').id,
        value: 1.8,
        isAbnormal: true,
      },
      {
        requestId: request4.id,
        analysisTypeId: allAnalysisTypes.find(t => t.name === 'Cholestérol Total').id,
        value: 2.3,
        isAbnormal: true,
      },
    ],
  });

  // Request 5: Blood count for patient 5
  const request5 = await prisma.analysisRequest.create({
    data: {
      patientId: createdPatients[4].id,
      doctorName: 'Dr. Omar Tazi',
      status: 'COMPLÉTÉ',
    },
  });

  await prisma.analysisResult.createMany({
    data: [
      {
        requestId: request5.id,
        analysisTypeId: allAnalysisTypes.find(t => t.name === 'Hémoglobine').id,
        value: 13.5,
        isAbnormal: false,
      },
      {
        requestId: request5.id,
        analysisTypeId: allAnalysisTypes.find(t => t.name === 'Globules Blancs').id,
        value: 7.2,
        isAbnormal: false,
      },
      {
        requestId: request5.id,
        analysisTypeId: allAnalysisTypes.find(t => t.name === 'Plaquettes').id,
        value: 280,
        isAbnormal: false,
      },
    ],
  });

  console.log(`✅ Created 5 analysis requests with results`);

  console.log('\n✨ Database seeding COMPLÉTÉ successfully!\n');
  console.log('📊 Summary:');
  console.log('  - Users: 4 (admin, technician, secretary, medecin)');
  console.log('  - Analysis Types: 10');
  console.log('  - Patients: 5');
  console.log('  - Analysis Requests: 5');
  console.log('\n🔐 Login credentials:');
  console.log('  Admin:      username: admin      password: admin123');
  console.log('  Technician: username: technician password: tech123');
  console.log('  Secretary:  username: secretary  password: secretary123');
  console.log('  Médecin:    username: medecin    password: medecin123\n');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
