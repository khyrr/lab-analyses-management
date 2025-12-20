# Architecture Technique - Laboratoire d'Analyses Médicales

**Version :** 1.0  
**Date :** Décembre 2025  
**Projet :** Application de gestion de laboratoire d'analyses médicales

---

## 1. Vue d'ensemble

### 1.1 Architecture Globale

L'application suit une architecture **3-tiers** (trois couches) :

```
┌─────────────────────────────────────────────────────────┐
│                   COUCHE PRÉSENTATION                    │
│              (Frontend - React + Vite)                   │
│  - Interface utilisateur                                 │
│  - Gestion de l'état (Context API)                       │
│  - Communication HTTP (Axios)                            │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST
                     │ (JSON)
┌────────────────────▼────────────────────────────────────┐
│                   COUCHE LOGIQUE MÉTIER                  │
│              (Backend - Node.js + Express)               │
│  - API REST                                              │
│  - Authentification & Autorisation (JWT)                 │
│  - Logique métier                                        │
│  - Validation des données                                │
│  - Génération de PDF                                     │
└────────────────────┬────────────────────────────────────┘
                     │ SQL
                     │ (Prisma ORM)
┌────────────────────▼────────────────────────────────────┐
│                   COUCHE DONNÉES                         │
│              (PostgreSQL Database)                       │
│  - Stockage des données                                  │
│  - Intégrité référentielle                               │
│  - Transactions                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Stack Technique

### 2.1 Backend

| Composant | Technologie | Version | Rôle |
|-----------|-------------|---------|------|
| **Runtime** | Node.js | 18+ | Environnement d'exécution JavaScript |
| **Framework Web** | Express | 5.x | Serveur HTTP et routing |
| **ORM** | Prisma | 5.x | Mapping objet-relationnel |
| **Base de données** | PostgreSQL | 15+ | Stockage des données |
| **Authentification** | JWT | 9.x | JSON Web Tokens |
| **Hachage** | bcryptjs | 3.x | Hachage des mots de passe |
| **PDF** | PDFMake | 0.2.x | Génération de documents PDF |
| **Documentation** | Swagger UI | 5.x | Documentation interactive de l'API |
| **Tests** | Jest + Supertest | Latest | Tests unitaires et d'intégration |
| **Validation** | Express Validator | 7.x | Validation des entrées |
| **Sécurité** | Helmet | 8.x | Headers de sécurité HTTP |
| **CORS** | cors | 2.x | Gestion Cross-Origin |
| **Logging** | Morgan | 1.x | Logs HTTP |

### 2.2 Frontend

| Composant | Technologie | Version | Rôle |
|-----------|-------------|---------|------|
| **Framework** | React | 18.x | Bibliothèque UI |
| **Build Tool** | Vite | 5.x | Bundler et dev server |
| **Routing** | React Router | 6.x | Navigation côté client |
| **HTTP Client** | Axios | 1.x | Requêtes HTTP |
| **State Management** | Context API | Built-in | Gestion de l'état global |
| **Styling** | CSS Modules / Tailwind | - | Styles |

### 2.3 DevOps & Outils

| Composant | Technologie | Rôle |
|-----------|-------------|------|
| **Conteneurisation** | Docker | Base de données PostgreSQL |
| **Versioning** | Git + GitHub | Contrôle de version |
| **Package Manager** | npm | Gestion des dépendances |
| **Linting** | ESLint | Qualité du code |
| **Formatting** | Prettier | Formatage du code |

---

## 3. Architecture Backend

### 3.1 Structure des Dossiers

```
backend/
├── prisma/
│   ├── schema.prisma          # Schéma de base de données
│   ├── migrations/            # Migrations SQL
│   └── seed.js                # Données de test
├── src/
│   ├── app.js                 # Configuration Express
│   ├── server.js              # Point d'entrée
│   ├── config/
│   │   ├── prisma.js          # Client Prisma
│   │   └── swagger.js         # Configuration Swagger
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── patientController.js
│   │   ├── analysisController.js
│   │   ├── dashboardController.js
│   │   └── reportController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── patientRoutes.js
│   │   ├── analysisRoutes.js
│   │   └── dashboardRoutes.js
│   ├── middlewares/
│   │   ├── authMiddleware.js      # Vérification JWT
│   │   ├── roleMiddleware.js      # Vérification RBAC
│   │   └── errorHandler.js        # Gestion des erreurs
│   └── utils/
│       └── helpers.js
├── tests/
│   ├── auth.test.js
│   ├── patients.test.js
│   ├── analyses.test.js
│   └── phase7.test.js
├── .env                       # Variables d'environnement
├── .env.example               # Template des variables
├── .gitignore
├── package.json
└── README.md
```

### 3.2 Flux de Requête

```
Client (Frontend)
    │
    ▼
[1] HTTP Request (avec JWT dans header)
    │
    ▼
[2] Middleware CORS & Helmet (sécurité)
    │
    ▼
[3] Morgan (logging)
    │
    ▼
[4] Routes (Express Router)
    │
    ▼
[5] authMiddleware (vérification JWT)
    │
    ▼
[6] roleMiddleware (vérification permissions)
    │
    ▼
[7] Controller (logique métier)
    │
    ▼
[8] Prisma ORM (requêtes DB)
    │
    ▼
[9] PostgreSQL Database
    │
    ▼
[10] Response JSON
    │
    ▼
Client (Frontend)
```

---

## 4. Architecture Frontend

### 4.1 Structure des Dossiers

```
frontend/
├── public/
│   └── assets/
├── src/
│   ├── main.jsx               # Point d'entrée
│   ├── App.jsx                # Composant racine
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Footer.jsx
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── patients/
│   │   │   ├── PatientList.jsx
│   │   │   ├── PatientForm.jsx
│   │   │   └── PatientDetails.jsx
│   │   ├── analyses/
│   │   │   ├── AnalysisList.jsx
│   │   │   ├── AnalysisForm.jsx
│   │   │   └── ResultsEntry.jsx
│   │   └── dashboard/
│   │       ├── Dashboard.jsx
│   │       └── StatsCard.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Patients.jsx
│   │   ├── Analyses.jsx
│   │   ├── Dashboard.jsx
│   │   └── Users.jsx
│   ├── context/
│   │   └── AuthContext.jsx    # État d'authentification
│   ├── api/
│   │   └── api.js             # Configuration Axios
│   ├── hooks/
│   │   └── useAuth.js         # Hook d'authentification
│   ├── utils/
│   │   └── helpers.js
│   └── styles/
│       └── main.css
├── index.html
├── vite.config.js
├── package.json
└── .env
```

### 4.2 Flux de Données

```
[User Action]
    │
    ▼
[React Component]
    │
    ▼
[Event Handler]
    │
    ▼
[API Call (Axios)]
    │
    ▼
[Backend API]
    │
    ▼
[Response]
    │
    ▼
[Update State (useState/Context)]
    │
    ▼
[Re-render Component]
```

---

## 5. Sécurité

### 5.1 Authentification (JWT)

```javascript
// Processus de login
User credentials → Backend → Verify password → Generate JWT → Return token

// Structure du JWT
{
  "userId": 1,
  "username": "admin",
  "role": "ADMIN",
  "iat": 1234567890,
  "exp": 1234654290
}

// Durée de vie : 24 heures
```

### 5.2 Autorisation (RBAC - Role-Based Access Control)

| Rôle | Permissions |
|------|-------------|
| **ADMIN** | - Toutes les opérations<br>- Gestion des utilisateurs<br>- Suppression de patients |
| **SECRETARY** | - CRUD Patients<br>- Créer/Modifier demandes d'analyses<br>- Consulter résultats |
| **TECHNICIAN** | - Saisir les résultats<br>- Mettre à jour statuts des analyses<br>- Consulter demandes |
| **MEDECIN** | - Consulter tous les résultats<br>- Générer des PDFs<br>- Voir dashboard et statistiques |

### 5.3 Mesures de Sécurité

#### Backend
- ✅ Mots de passe hachés avec bcrypt (10 rounds)
- ✅ JWT pour l'authentification stateless
- ✅ Middleware de vérification des rôles (RBAC)
- ✅ Helmet.js pour les headers de sécurité
- ✅ CORS configuré
- ✅ Validation des entrées
- ✅ Soft delete pour les patients (intégrité des données)
- ✅ Protection contre les injections SQL (Prisma ORM)

#### Frontend
- ✅ Token stocké en localStorage (ou httpOnly cookie)
- ✅ Routes protégées (ProtectedRoute component)
- ✅ Redirection automatique si non authentifié
- ✅ Validation côté client (pré-validation)

---

## 6. Base de Données

### 6.1 PostgreSQL via Docker

```bash
docker run -d \
  --name lab-postgres \
  -e POSTGRES_USER=lab_user \
  -e POSTGRES_PASSWORD=lab_password \
  -e POSTGRES_DB=lab_db \
  -p 5432:5432 \
  postgres:15
```

### 6.2 Prisma ORM

**Avantages :**
- Type-safety avec TypeScript/JavaScript
- Migrations automatiques
- Génération de client
- Relations faciles à gérer
- Excellent support des transactions

**Workflow :**
```bash
# Modifier le schéma
prisma/schema.prisma

# Créer une migration
npx prisma migrate dev --name migration_name

# Générer le client
npx prisma generate

# Voir les données
npx prisma studio
```

---

## 7. API REST

### 7.1 Convention de Nommage

- **Ressources au pluriel** : `/api/patients`, `/api/analyses`
- **HTTP Methods sémantiques** :
  - `GET` - Lecture
  - `POST` - Création
  - `PUT` - Mise à jour complète
  - `PATCH` - Mise à jour partielle
  - `DELETE` - Suppression

### 7.2 Format des Réponses

**Succès :**
```json
{
  "id": 1,
  "fullName": "Mohammed Ben Ali",
  "createdAt": "2025-12-20T10:00:00Z"
}
```

**Erreur :**
```json
{
  "error": "Message d'erreur descriptif"
}
```

### 7.3 Codes HTTP

| Code | Signification | Usage |
|------|---------------|-------|
| 200 | OK | Succès GET, PUT, PATCH |
| 201 | Created | Succès POST |
| 400 | Bad Request | Validation échouée |
| 401 | Unauthorized | Non authentifié |
| 403 | Forbidden | Pas les permissions |
| 404 | Not Found | Ressource inexistante |
| 500 | Internal Server Error | Erreur serveur |

---

## 8. Génération de PDF

### 8.1 PDFMake

**Fonctionnalités :**
- Génération côté serveur (Node.js)
- Support des tableaux
- Mise en forme (couleurs, gras, italique)
- Headers et footers personnalisés

**Structure du PDF :**
```
┌─────────────────────────────────────────┐
│  LABORATOIRE D'ANALYSES MÉDICALES       │
│         Rapport d'Analyses              │
├─────────────────────────────────────────┤
│  Patient: Mohammed Ben Ali              │
│  Date: 20/12/2025                       │
│  Médecin: Dr. Hassan Mouline            │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐   │
│  │ Analyse | Résultat | Référence  │   │
│  │ Glycémie│ 0.95 g/L│ 0.7-1.1    │   │
│  │ ASAT    │ 55 UI/L │ 10-40 ⚠️   │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  Signature du Biologiste                │
└─────────────────────────────────────────┘
```

---

## 9. Tests

### 9.1 Stratégie de Test

```
Tests Unitaires (60%)
├── Controllers
├── Middlewares
└── Utilities

Tests d'Intégration (30%)
├── API Endpoints
├── Database Operations
└── Authentication Flow

Tests End-to-End (10%)
└── User Workflows
```

### 9.2 Outils

- **Jest** : Framework de test
- **Supertest** : Tests HTTP
- **Prisma Test Environment** : Base de test isolée

---

## 10. Variables d'Environnement

### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://lab_user:lab_password@localhost:5432/lab_db?schema=public"

# JWT
JWT_SECRET="your-super-secret-key-change-in-production"
JWT_EXPIRES_IN="24h"

# CORS
ALLOWED_ORIGINS="http://localhost:5173"
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 11. Déploiement

### 11.1 Environnements

| Environnement | Backend | Frontend | Database |
|---------------|---------|----------|----------|
| **Development** | localhost:5000 | localhost:5173 | Docker local |
| **Staging** | staging.api.com | staging.app.com | PostgreSQL cloud |
| **Production** | api.lab.com | app.lab.com | PostgreSQL cloud |

### 11.2 CI/CD (Recommandé)

```yaml
# GitHub Actions Workflow
name: CI/CD Pipeline

on: [push, pull_request]

jobs:
  test:
    - Install dependencies
    - Run linters
    - Run tests
    - Generate coverage report
  
  build:
    - Build backend
    - Build frontend
  
  deploy:
    - Deploy to staging (on dev branch)
    - Deploy to production (on main branch)
```

---

## 12. Performance

### 12.1 Optimisations Backend

- ✅ Index sur les colonnes fréquemment recherchées (cin, username)
- ✅ Pagination des résultats (patients, analyses)
- ✅ Lazy loading des relations Prisma
- ✅ Compression gzip des réponses
- ✅ Caching (Redis optionnel pour amélioration future)

### 12.2 Optimisations Frontend

- ✅ Code splitting (React lazy loading)
- ✅ Minification (Vite production build)
- ✅ Optimisation des images
- ✅ Debouncing des recherches
- ✅ Mémorisation avec useMemo/useCallback

---

## 13. Évolutivité Future

### 13.1 Améliorations Possibles

- [ ] **Notifications en temps réel** (WebSocket / Server-Sent Events)
- [ ] **Upload de fichiers** (résultats scannés, images)
- [ ] **Export Excel** des analyses
- [ ] **Historique des modifications** (audit trail)
- [ ] **Multi-laboratoires** (architecture multi-tenant)
- [ ] **Application mobile** (React Native)
- [ ] **BI Dashboard** avancé (graphiques de tendances)
- [ ] **API publique** pour intégrations tierces

### 13.2 Scalabilité

```
Load Balancer
    │
    ├─── Backend Instance 1
    ├─── Backend Instance 2
    └─── Backend Instance 3
            │
            ▼
    PostgreSQL (Primary/Replica)
```

---

## 14. Maintenance et Monitoring

### 14.1 Logs

- **Morgan** : Logs HTTP (requêtes/réponses)
- **Console.error** : Erreurs applicatives
- **Production** : Winston ou Pino (recommandé)

### 14.2 Monitoring (Production)

- **Uptime** : Ping régulier des endpoints
- **Performance** : Temps de réponse API
- **Erreurs** : Taux d'erreur 5xx
- **Database** : Connexions actives, slow queries

---

## 15. Documentation

| Document | Emplacement | Audience |
|----------|-------------|----------|
| **Architecture** | `docs/architecture.md` | Développeurs |
| **API Specification** | `docs/api-specification.md` | Frontend/Backend |
| **Database Schema** | `docs/database-schema.md` | Backend |
| **User Stories** | `docs/user-stories.md` | Équipe complète |
| **README** | `README.md` | Tous |
| **API Interactive** | `/api-docs` (Swagger) | Développeurs |

---

## 16. Contacts et Support

| Rôle | Responsabilité |
|------|----------------|
| **Product Owner** | Vision produit, priorités |
| **Scrum Master** | Facilitation, blocages |
| **Backend Lead** | Architecture backend, API |
| **Frontend Lead** | Architecture frontend, UX |
| **DevOps** | Infrastructure, déploiement |

---

**Dernière mise à jour :** Décembre 2025  
**Version :** 1.0
