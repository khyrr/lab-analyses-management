const request = require('supertest');
const app = require('../src/app');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

let authToken;
let adminToken;
let userId;

beforeAll(async () => {
  // Clean up test data
  await prisma.user.deleteMany({
    where: {
      username: {
        in: ['testadmin', 'testuser'],
      },
    },
  });

  // Create admin user
  const adminRes = await request(app)
    .post('/api/auth/register')
    .send({
      username: 'testadmin',
      password: 'password123',
      role: 'ADMIN',
    });

  // Login as admin
  const adminLogin = await request(app)
    .post('/api/auth/login')
    .send({
      username: 'testadmin',
      password: 'password123',
    });

  adminToken = adminLogin.body.token;
});

afterAll(async () => {
  // Clean up test data
  await prisma.user.deleteMany({
    where: {
      username: {
        in: ['testadmin', 'testuser', 'testmedecin'],
      },
    },
  });
  await prisma.$disconnect();
});

describe('User Management', () => {
  test('Admin can create a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        username: 'testuser',
        password: 'password123',
        role: 'TECHNICIAN',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('userId');
    userId = res.body.userId;
  });

  test('Admin can get all users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('Admin can get user by ID', async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('username', 'testuser');
  });

  test('Admin can update user role', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        role: 'MEDECIN',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.role).toBe('MEDECIN');
  });

  test('Admin can change user password', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}/password`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        newPassword: 'newpassword123',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Password changed successfully');
  });

  test('Admin can delete user', async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'User deleted successfully');
  });
});

describe('Analysis Request Management', () => {
  let patientId;
  let analysisRequestId;
  let analysisTypeId;

  beforeAll(async () => {
    // Create a test patient
    const patient = await prisma.patient.create({
      data: {
        fullName: 'Test Patient',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'M',
        address: '123 Test St',
        phone: '1234567890',
        cin: 'TEST123456',
      },
    });
    patientId = patient.id;

    // Create an analysis type
    const analysisType = await prisma.analysisType.create({
      data: {
        name: 'Test Analysis',
        unit: 'mg/dL',
        reference_min: 70,
        reference_max: 100,
        price: 50,
      },
    });
    analysisTypeId = analysisType.id;

    // Create an analysis request
    const request = await prisma.analysisRequest.create({
      data: {
        patientId,
        doctorName: 'Dr. Test',
        status: 'PENDING',
      },
    });
    analysisRequestId = request.id;
  });

  afterAll(async () => {
    // Clean up
    await prisma.analysisResult.deleteMany({ where: { requestId: analysisRequestId } });
    await prisma.analysisRequest.deleteMany({ where: { id: analysisRequestId } });
    await prisma.analysisType.deleteMany({ where: { id: analysisTypeId } });
    await prisma.patient.deleteMany({ where: { id: patientId } });
  });

  test('Admin can update analysis request', async () => {
    const res = await request(app)
      .put(`/api/analyses/${analysisRequestId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        doctorName: 'Dr. Updated',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.doctorName).toBe('Dr. Updated');
  });

  test('Admin can delete analysis request', async () => {
    const res = await request(app)
      .delete(`/api/analyses/${analysisRequestId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Analysis request deleted successfully');
  });
});

describe('Dashboard Statistics', () => {
  test('Admin can get dashboard stats', async () => {
    const res = await request(app)
      .get('/api/dashboard/stats')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('overview');
    expect(res.body).toHaveProperty('analyses');
    expect(res.body).toHaveProperty('recent');
  });

  test('Admin can get recent activity', async () => {
    const res = await request(app)
      .get('/api/dashboard/recent-activity')
      .set('Authorization', `Bearer ${adminToken}`)
      .query({ limit: 5 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('recentPatients');
    expect(res.body).toHaveProperty('recentAnalyses');
    expect(res.body).toHaveProperty('recentResults');
  });
});
