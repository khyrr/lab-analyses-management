# Laboratoire d'Analyses Médicales - Backend API

API REST complète pour la gestion d'un laboratoire d'analyses médicales.

## 🎯 Description

Backend Node.js/Express permettant la gestion complète d'un laboratoire :
- ✅ Authentification JWT + RBAC (4 rôles)
- ✅ Gestion utilisateurs (CRUD)
- ✅ Gestion patients (CRUD + soft delete + recherche)
- ✅ Gestion analyses (types, demandes, résultats, validation)
- ✅ Dashboard statistiques
- ✅ Génération PDF (rapports + historique)
- ✅ Documentation Swagger interactive
- ✅ Tests unitaires (Jest + Supertest)

## 🛠️ Stack Technique

| Composant | Technologie |
|-----------|-------------|
| Runtime | Node.js 18+ |
| Framework | Express.js 4.x |
| Database | PostgreSQL 15+ |
| ORM | Prisma 5.x |
| Auth | JWT + Bcrypt |
| PDF | PDFMake |
| Tests | Jest + Supertest |
| Docs | Swagger/OpenAPI |

## 📁 Structure

```
backend/
├── src/
│   ├── controllers/    # Business logic
│   ├── routes/         # API endpoints
│   ├── middlewares/    # Auth, RBAC, validation
│   └── config/         # Prisma, Swagger
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── seed.js         # Test data
└── tests/              # Unit tests
```

## 🚀 Quick Start

### 1. PostgreSQL (Docker)

```bash
docker run -d \
  --name lab-postgres \
  -e POSTGRES_USER=lab_user \
  -e POSTGRES_PASSWORD=lab_password \
  -e POSTGRES_DB=lab_db \
  -p 5432:5432 \
  postgres:15
```

### 2. Backend Setup

```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### 3. Access

- **API :** http://localhost:5000/api
- **Swagger UI :** http://localhost:5000/api-docs

## 🔑 Test Accounts

| Username | Password | Rôle |
|----------|----------|------|
| admin | tech123 | ADMIN |
| secretary | secretary123 | SECRETARY |
| technician | tech123 | TECHNICIAN |
| medecin | medecin123 | MEDECIN |

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [backend-architecture.md](docs/backend-architecture.md) | Architecture technique complète |
| [backend-implementation.md](docs/backend-implementation.md) | Fonctionnalités implémentées |
| [database-schema.md](docs/database-schema.md) | Schéma base de données |
| [api-specification.md](docs/api-specification.md) | Spécifications API REST |

## 🔐 RBAC Permissions

| Ressource | ADMIN | SECRETARY | TECHNICIAN | MEDECIN |
|-----------|-------|-----------|------------|---------|
| Users | ✅ | ❌ | ❌ | ❌ |
| Patients (Create/Update) | ✅ | ✅ | ❌ | ❌ |
| Patients (View) | ✅ | ✅ | ✅ | ✅ |
| Patients (Delete) | ✅ | ❌ | ❌ | ❌ |
| Analysis (Create) | ✅ | ✅ | ❌ | ❌ |
| Results (Enter) | ✅ | ❌ | ✅ | ❌ |
| Results (Validate) | ✅ | ❌ | ✅ | ✅ |
| PDF Reports | ✅ | ❌ | ❌ | ✅ |
| Dashboard | ✅ | ❌ | ❌ | ✅ |

## 🧪 Tests

```bash
cd backend
npm test
npm run test:coverage
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register (ADMIN)

### Users (ADMIN only)
- `GET /api/users` - List all
- `GET /api/users/:id` - Get by ID
- `PUT /api/users/:id` - Update
- `DELETE /api/users/:id` - Delete
- `PUT /api/users/:id/password` - Change password

### Patients
- `POST /api/patients` - Create (SECRETARY, ADMIN)
- `GET /api/patients` - List with search/pagination
- `GET /api/patients/:id` - Get details
- `PUT /api/patients/:id` - Update (SECRETARY, ADMIN)
- `DELETE /api/patients/:id` - Soft delete (ADMIN)
- `GET /api/patients/:id/history` - Analysis history
- `GET /api/patients/:id/history/pdf` - PDF history (MEDECIN, ADMIN)

### Analyses
- `POST /api/analyses/types` - Create type (ADMIN)
- `GET /api/analyses/types` - List types
- `POST /api/analyses` - Create request (SECRETARY, ADMIN)
- `GET /api/analyses` - List requests
- `PUT /api/analyses/:id` - Update (SECRETARY, ADMIN)
- `DELETE /api/analyses/:id` - Delete (SECRETARY, ADMIN)
- `PUT /api/analyses/:id/results` - Enter results (TECHNICIAN, ADMIN)
- `PATCH /api/analyses/:id/status` - Update status (TECHNICIAN, ADMIN)
- `GET /api/analyses/:id/pdf` - Generate PDF (MEDECIN, ADMIN)

### Dashboard
- `GET /api/dashboard/stats` - Statistics (ADMIN, MEDECIN)
- `GET /api/dashboard/recent-activity` - Recent activity (ADMIN, MEDECIN)

## 🔄 Analysis Workflow

```
1. SECRETARY → Create request (PENDING)
2. TECHNICIAN → Enter results (COMPLETED)
                - isAbnormal calculated automatically
3. MEDECIN → Validate (VALIDATED)
4. MEDECIN → Generate PDF report
```

## 🗄️ Database

**5 Tables :**
- `User` - User accounts with roles
- `Patient` - Patient information (soft delete)
- `AnalysisType` - Catalog of available analyses
- `AnalysisRequest` - Analysis requests (PENDING → COMPLETED → VALIDATED)
- `AnalysisResult` - Individual results with isAbnormal flag

**Relations :**
```
Patient → AnalysisRequest → AnalysisResult → AnalysisType
```

## 🎯 Status

✅ **Backend : Production Ready**
- All CRUD operations implemented
- RBAC fully functional
- PDF generation working
- Tests passing
- Swagger documentation complete
- Docker PostgreSQL configured
- Seed data available

- **Product Owner** : Emna Masmoudi
- **Scrum Master** : Mohamed Salem Khairhoum
- **Développeur** : Nada Belloum
- **Encadrant** : Mme. Afef Ghabri

## 📄 Licence

[À définir - Confidentialité des données médicales requise]

---

*Projet développé avec ❤️ pour améliorer la gestion des laboratoires médicaux.*