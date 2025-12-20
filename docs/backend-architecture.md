# Architecture Backend - Laboratoire d'Analyses Médicales

**Stack :** Node.js + Express + Prisma + PostgreSQL  
**Version :** 1.0  
**Status :** ✅ Production Ready

---

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Stack Technique](#stack-technique)
3. [Structure du Projet](#structure-du-projet)
4. [Architecture API](#architecture-api)
5. [Sécurité & RBAC](#sécurité--rbac)
6. [Base de Données](#base-de-données)
7. [Workflows](#workflows)
8. [Tests](#tests)

---

## Vue d'ensemble

### Description

API REST Backend pour la gestion d'un laboratoire d'analyses médicales.

**Fonctionnalités principales :**
- 🔐 Authentification JWT + Bcrypt
- 👥 Gestion utilisateurs (CRUD + RBAC)
- 🏥 Gestion patients (CRUD + soft delete + recherche)
- 🧪 Gestion analyses (types, demandes, résultats, validation)
- 📊 Dashboard statistiques
- 📄 Génération PDF (rapports analyses + historique patient)
- 📚 Documentation Swagger interactive

### Architecture

```
┌──────────────┐
│   Clients    │  Swagger UI, Frontend, Mobile
└──────┬───────┘
       │ HTTP/JSON
       ▼
┌──────────────┐
│  Middlewares │  Auth JWT, RBAC, Validation, CORS
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Controllers  │  Business Logic
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Prisma ORM   │  Type-safe DB access
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ PostgreSQL   │  Production Database
└──────────────┘
```

---

## Stack Technique

### Core Technologies

| Composant | Technologie | Version | Usage |
|-----------|-------------|---------|-------|
| **Runtime** | Node.js | 18+ | Backend runtime |
| **Framework** | Express.js | 4.x | REST API framework |
| **Database** | PostgreSQL | 15+ | Production database |
| **ORM** | Prisma | 5.x | Type-safe database client |

### Security & Auth

| Composant | Package | Usage |
|-----------|---------|-------|
| **Authentication** | jsonwebtoken | JWT tokens (24h expiry) |
| **Password Hashing** | bcryptjs | Bcrypt (10 rounds) |
| **Security Headers** | helmet | HTTP security headers |
| **CORS** | cors | Cross-origin resource sharing |
| **Validation** | joi | Request validation |

### Utilities

| Composant | Package | Usage |
|-----------|---------|-------|
| **PDF Generation** | pdfmake | Medical reports generation |
| **Logging** | morgan | HTTP request logging |
| **API Docs** | swagger-ui-express | Interactive API documentation |
| **Testing** | jest + supertest | Unit & integration tests |

---

## Structure du Projet

```
backend/
├── src/
│   ├── config/
│   │   ├── prisma.js              # Prisma client singleton
│   │   └── swagger.js             # Swagger/OpenAPI config
│   │
│   ├── controllers/
│   │   ├── authController.js      # Login, register
│   │   ├── userController.js      # Users CRUD
│   │   ├── patientController.js   # Patients CRUD + history
│   │   ├── analysisController.js  # Analyses CRUD + results
│   │   ├── reportController.js    # PDF generation
│   │   └── dashboardController.js # Statistics
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js      # JWT verification
│   │   └── roleMiddleware.js      # RBAC authorization
│   │
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth/*
│   │   ├── userRoutes.js          # /api/users/*
│   │   ├── patientRoutes.js       # /api/patients/*
│   │   ├── analysisRoutes.js      # /api/analyses/*
│   │   └── dashboardRoutes.js     # /api/dashboard/*
│   │
│   ├── app.js                     # Express app configuration
│   └── server.js                  # Server entry point
│
├── prisma/
│   ├── schema.prisma              # Database schema
│   ├── seed.js                    # Seed script
│   └── migrations/                # Migration history
│
├── tests/
│   ├── app.test.js                # Basic tests
│   └── auth.test.js               # Auth tests
│
├── .env                           # Environment variables
├── .env.example                   # Env template
└── package.json
```

---

## Architecture API

### Routes Structure

```
/api
├── /auth
│   ├── POST /login              # Login (public)
│   └── POST /register           # Register user (ADMIN)
│
├── /users                       # All routes: ADMIN only
│   ├── GET  /                   # List all users
│   ├── GET  /:id                # Get user by ID
│   ├── PUT  /:id                # Update user
│   ├── DELETE /:id              # Delete user
│   └── PUT  /:id/password       # Change password
│
├── /patients
│   ├── POST /                   # Create (SECRETARY, ADMIN)
│   ├── GET  /                   # List with pagination + search
│   ├── GET  /:id                # Get patient details
│   ├── PUT  /:id                # Update (SECRETARY, ADMIN)
│   ├── DELETE /:id              # Soft delete (ADMIN)
│   ├── GET  /:id/history        # Analysis history
│   └── GET  /:id/history/pdf    # PDF history (MEDECIN, ADMIN)
│
├── /analyses
│   ├── POST /types              # Create type (ADMIN)
│   ├── GET  /types              # List types
│   ├── POST /                   # Create request (SECRETARY, ADMIN)
│   ├── GET  /                   # List requests
│   ├── PUT  /:id                # Update request (SECRETARY, ADMIN)
│   ├── DELETE /:id              # Delete request (SECRETARY, ADMIN)
│   ├── PUT  /:id/results        # Add results (TECHNICIAN, ADMIN)
│   ├── PATCH /:id/status        # Update status (TECHNICIAN, ADMIN)
│   └── GET  /:id/pdf            # Generate PDF (MEDECIN, ADMIN)
│
└── /dashboard
    ├── GET /stats               # Statistics (ADMIN, MEDECIN)
    └── GET /recent-activity     # Recent activity (ADMIN, MEDECIN)
```

### Middlewares Pipeline

Chaque requête passe par :

1. **Helmet** → Sécurité headers HTTP
2. **CORS** → Cross-origin access
3. **Morgan** → Logging HTTP
4. **express.json()** → Parse JSON body
5. **authMiddleware** → Vérification JWT (routes protégées)
6. **roleMiddleware** → Vérification rôle RBAC
7. **Controller** → Business logic
8. **Error Handler** → Gestion erreurs

---

## Sécurité & RBAC

### Authentication Flow

```
1. Client → POST /api/auth/login {username, password}
2. Backend → Verify credentials (bcrypt.compare)
3. Backend → Generate JWT token (24h expiry)
4. Client ← {token, role, username}
5. Client → Requests with Header: Authorization: Bearer <token>
6. Middleware → Verify & decode JWT
7. Controller → Process request
```

### RBAC Matrix

| Resource | ADMIN | SECRETARY | TECHNICIAN | MEDECIN |
|----------|-------|-----------|------------|---------|
| **Users** |
| Create/Update/Delete | ✅ | ❌ | ❌ | ❌ |
| **Patients** |
| Create/Update | ✅ | ✅ | ❌ | ❌ |
| View | ✅ | ✅ | ✅ | ✅ |
| Delete | ✅ | ❌ | ❌ | ❌ |
| **Analysis Types** |
| Create/Update | ✅ | ❌ | ❌ | ❌ |
| View | ✅ | ✅ | ✅ | ✅ |
| **Analysis Requests** |
| Create/Update/Delete | ✅ | ✅ | ❌ | ❌ |
| View | ✅ | ✅ | ✅ | ✅ |
| **Results** |
| Enter/Update | ✅ | ❌ | ✅ | ❌ |
| Validate | ✅ | ❌ | ✅ | ✅ |
| **PDF Reports** |
| Generate | ✅ | ❌ | ❌ | ✅ |
| **Dashboard** |
| View Stats | ✅ | ❌ | ❌ | ✅ |

### Security Features

- ✅ JWT tokens avec expiration (24h)
- ✅ Bcrypt hashing (10 rounds)
- ✅ Helmet security headers
- ✅ CORS configuré
- ✅ Validation Joi sur tous les inputs
- ✅ SQL Injection protection (Prisma)
- ✅ XSS protection (Helmet)
- ✅ Rate limiting (à implémenter en prod)

---

## Base de Données

### Schéma Prisma

**5 Modèles :**

```prisma
model User {
  id            Int      @id @default(autoincrement())
  username      String   @unique
  password_hash String
  role          Role     @default(TECHNICIAN)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

enum Role {
  ADMIN
  SECRETARY
  TECHNICIAN
  MEDECIN
}

model Patient {
  id          Int       @id @default(autoincrement())
  fullName    String
  dateOfBirth DateTime
  gender      String
  address     String
  phone       String
  email       String?
  cin         String    @unique
  deleted     Boolean   @default(false)
  analyses    AnalysisRequest[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model AnalysisType {
  id            Int      @id @default(autoincrement())
  name          String   @unique
  unit          String
  reference_min Float
  reference_max Float
  price         Float
  results       AnalysisResult[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model AnalysisRequest {
  id         Int             @id @default(autoincrement())
  patientId  Int
  patient    Patient         @relation(fields: [patientId], references: [id])
  doctorName String
  status     AnalysisStatus  @default(PENDING)
  results    AnalysisResult[]
  createdAt  DateTime        @default(now())
  updatedAt  DateTime        @updatedAt
}

enum AnalysisStatus {
  PENDING
  COMPLETED
  VALIDATED
}

model AnalysisResult {
  id             Int           @id @default(autoincrement())
  requestId      Int
  request        AnalysisRequest @relation(fields: [requestId], references: [id], onDelete: Cascade)
  analysisTypeId Int
  analysisType   AnalysisType  @relation(fields: [analysisTypeId], references: [id])
  value          Float
  isAbnormal     Boolean       @default(false)
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
}
```

### Relations

```
Patient (1) ──< (n) AnalysisRequest
AnalysisRequest (1) ──< (n) AnalysisResult
AnalysisType (1) ──< (n) AnalysisResult
```

### Indexes & Constraints

- **Primary Keys** : Auto-increment sur tous les `id`
- **Unique Constraints** : 
  - `User.username`
  - `Patient.cin`
  - `AnalysisType.name`
- **Foreign Keys** : Avec CASCADE/RESTRICT appropriés
- **Soft Delete** : Flag `deleted` sur Patient

---

## Workflows

### 1. Workflow Analyse Complète

```
1. SECRÉTAIRE : Créer demande analyse
   POST /api/analyses
   {
     patientId: 1,
     doctorName: "Dr. Hassan",
     analysisTypeIds: [1, 2, 3]
   }
   → Status: PENDING

2. TECHNICIEN : Saisir résultats
   PUT /api/analyses/1/results
   {
     results: [
       {analysisTypeId: 1, value: 0.95},
       {analysisTypeId: 2, value: 2.5},  // Anormal
       {analysisTypeId: 3, value: 0.55}
     ]
   }
   → Calcul automatique isAbnormal
   → Status: COMPLETED

3. MÉDECIN/TECHNICIEN : Valider
   PATCH /api/analyses/1/status
   {status: "VALIDATED"}
   → Status: VALIDATED

4. MÉDECIN : Générer PDF
   GET /api/analyses/1/pdf
   → PDF avec valeurs anormales en rouge
```

### 2. Calcul isAbnormal

```javascript
// Automatique lors de la saisie
if (value < reference_min || value > reference_max) {
  isAbnormal = true
}
```

### 3. Soft Delete Patient

```javascript
// DELETE /api/patients/:id
// Ne supprime pas physiquement
await prisma.patient.update({
  where: { id },
  data: { deleted: true }
})

// Filtrage dans les requêtes
await prisma.patient.findMany({
  where: { deleted: false }
})
```

---

## Tests

### Configuration Jest

```javascript
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "testEnvironment": "node",
    "coveragePathIgnorePatterns": ["/node_modules/"]
  }
}
```

### Tests Implémentés

**auth.test.js**
- ✅ Login success avec credentials valides
- ✅ Login fail avec credentials invalides
- ✅ Token JWT valide généré
- ✅ Middleware auth vérifie token

**app.test.js**
- ✅ Server démarre correctement
- ✅ Routes configurées
- ✅ Swagger UI accessible

### Commandes

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

---

## Déploiement

### Variables d'Environnement

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# JWT
JWT_SECRET="your-super-secret-key-change-in-production"

# Server
PORT=5000
NODE_ENV=production
```

### PostgreSQL Setup (Docker)

```bash
docker run -d \
  --name lab-postgres \
  -e POSTGRES_USER=lab_user \
  -e POSTGRES_PASSWORD=lab_password \
  -e POSTGRES_DB=lab_db \
  -p 5432:5432 \
  postgres:15
```

### Commandes Production

```bash
# Install dependencies
npm install --production

# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Start server
npm start
```

### Déploiement Options

**Backend :**
- Render (Free tier)
- Railway
- Heroku
- VPS (DigitalOcean, Linode)

**Database :**
- Render PostgreSQL
- AWS RDS
- Supabase
- Railway PostgreSQL

---

## Performance & Optimizations

### Implemented

- ✅ Prisma connection pooling
- ✅ Pagination sur liste patients/analyses
- ✅ Index database sur colonnes de recherche
- ✅ Soft delete au lieu de hard delete
- ✅ Middleware caching (optionnel)

### Production Recommendations

- Rate limiting (express-rate-limit)
- Redis caching pour dashboard stats
- CDN pour assets statiques
- Database read replicas
- Monitoring (Sentry, LogRocket)

---

## Documentation API

**Swagger UI :** `http://localhost:5000/api-docs`

**Fonctionnalités :**
- 📚 Documentation interactive complète
- 🧪 Test des endpoints directement depuis le browser
- 📝 Schémas requêtes/réponses
- 🔐 Support Bearer token authentication
- 📊 Tous les endpoints documentés

---

**Version :** 1.0  
**Status :** ✅ Production Ready  
**Dernière mise à jour :** Décembre 2025
