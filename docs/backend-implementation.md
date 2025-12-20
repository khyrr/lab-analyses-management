# Backend Implementation - Laboratoire d'Analyses Médicales

**Projet :** Système de Gestion de Laboratoire d'Analyses Médicales - Backend API  
**Stack :** Node.js + Express + Prisma + PostgreSQL  
**Status :** ✅ Implémenté et Testé

---

## Fonctionnalités Implémentées

### 🔐 Authentification & Sécurité

**Statut :** ✅ Complet

**Implémentation :**
- JWT authentication avec tokens 24h
- Bcrypt password hashing (10 rounds)
- Middleware d'authentification
- RBAC (Role-Based Access Control)
- 4 rôles : ADMIN, SECRETARY, TECHNICIAN, MEDECIN

**Endpoints :**
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/register` - Création compte (ADMIN only)

**Tests :** ✅ Jest + Supertest

---

### 👥 Gestion des Utilisateurs

**Statut :** ✅ Complet

**Implémentation :**
- CRUD complet pour utilisateurs
- Gestion des rôles
- Changement de mot de passe
- Validation Joi

**Endpoints :**
- `GET /api/users` - Liste tous les utilisateurs (ADMIN)
- `GET /api/users/:id` - Détails utilisateur (ADMIN)
- `PUT /api/users/:id` - Modifier utilisateur (ADMIN)
- `DELETE /api/users/:id` - Supprimer utilisateur (ADMIN)
- `PUT /api/users/:id/password` - Changer mot de passe (ADMIN)

**Permissions :** ADMIN uniquement

---

### 🏥 Gestion des Patients

**Statut :** ✅ Complet

**Implémentation :**
- CRUD complet pour patients
- Soft delete (deleted flag)
- Recherche par nom/CIN
- Pagination
- Historique des analyses
- Génération PDF historique complet

**Endpoints :**
- `POST /api/patients` - Créer patient (SECRETARY, ADMIN)
- `GET /api/patients` - Liste avec pagination et recherche
- `GET /api/patients/:id` - Détails patient
- `PUT /api/patients/:id` - Modifier patient (SECRETARY, ADMIN)
- `DELETE /api/patients/:id` - Soft delete patient (ADMIN)
- `GET /api/patients/:id/history` - Historique analyses
- `GET /api/patients/:id/history/pdf` - PDF historique (MEDECIN, ADMIN)

**Permissions :** Varie selon endpoint

---

### 🧪 Gestion des Analyses

**Statut :** ✅ Complet

**Implémentation :**
- Types d'analyses (catalogue)
- Demandes d'analyses
- Saisie des résultats
- Mise à jour statuts (PENDING → COMPLETED → VALIDATED)
- Calcul automatique isAbnormal
- Génération PDF rapport

**Endpoints :**

**Types d'analyses :**
- `POST /api/analyses/types` - Créer type (ADMIN)
- `GET /api/analyses/types` - Liste types

**Demandes d'analyses :**
- `POST /api/analyses` - Créer demande (SECRETARY, ADMIN)
- `GET /api/analyses` - Liste demandes avec filtres
- `PUT /api/analyses/:id` - Modifier demande (SECRETARY, ADMIN)
- `DELETE /api/analyses/:id` - Supprimer demande (SECRETARY, ADMIN)

**Résultats :**
- `PUT /api/analyses/:id/results` - Saisir résultats (TECHNICIAN, ADMIN)
- `PATCH /api/analyses/:id/status` - Changer statut (TECHNICIAN, ADMIN)

**Rapports :**
- `GET /api/analyses/:id/pdf` - Générer PDF rapport (MEDECIN, ADMIN)

---

### 📊 Dashboard & Statistiques

**Statut :** ✅ Complet

**Implémentation :**
- Statistiques laboratoire
- Activité récente
- Compteurs par statut

**Endpoints :**
- `GET /api/dashboard/stats` - Statistiques (ADMIN, MEDECIN)
- `GET /api/dashboard/recent-activity` - Activité récente (ADMIN, MEDECIN)

**Données retournées :**
- Total patients
- Total analyses
- Analyses par statut (PENDING, COMPLETED, VALIDATED)

---

## Architecture Backend

### Structure des Dossiers

```
backend/
├── src/
│   ├── config/
│   │   ├── prisma.js          # Client Prisma
│   │   └── swagger.js         # Config Swagger
│   ├── controllers/
│   │   ├── authController.js      # Login, register
│   │   ├── userController.js      # CRUD users
│   │   ├── patientController.js   # CRUD patients
│   │   ├── analysisController.js  # CRUD analyses
│   │   ├── reportController.js    # Génération PDF
│   │   └── dashboardController.js # Stats
│   ├── middlewares/
│   │   ├── authMiddleware.js  # JWT verification
│   │   └── roleMiddleware.js  # RBAC
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── patientRoutes.js
│   │   ├── analysisRoutes.js
│   │   └── dashboardRoutes.js
│   ├── app.js                 # Express app
│   └── server.js              # Server entry point
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.js                # Seed data
│   └── migrations/            # Migration history
├── tests/
│   ├── app.test.js
│   └── auth.test.js
├── .env                       # Environment variables
└── package.json
```

---

### Stack Technique

| Layer | Technologie | Version | Usage |
|-------|-------------|---------|-------|
| **Runtime** | Node.js | 18+ | Backend runtime |
| **Framework** | Express.js | 4.x | REST API |
| **Database** | PostgreSQL | 15+ | Données |
| **ORM** | Prisma | 5.x | Database access |
| **Auth** | JWT | jsonwebtoken | Authentication |
| **Password** | Bcrypt | bcryptjs | Hashing |
| **Validation** | Joi | - | Input validation |
| **PDF** | PDFMake | - | Report generation |
| **Docs** | Swagger | swagger-ui-express | API documentation |
| **Testing** | Jest + Supertest | - | Unit/Integration tests |
| **Security** | Helmet | - | HTTP headers |
| **CORS** | cors | - | Cross-origin |
| **Logging** | Morgan | - | HTTP logging |

---

## Base de Données

### Modèles Prisma

**5 Tables principales :**

1. **User** - Comptes utilisateurs
   - id, username, password_hash, role
   - Rôles : ADMIN, SECRETARY, TECHNICIAN, MEDECIN

2. **Patient** - Dossiers patients
   - id, fullName, dateOfBirth, gender, address, phone, email, cin
   - Soft delete avec flag `deleted`

3. **AnalysisType** - Catalogue analyses
   - id, name, unit, reference_min, reference_max, price

4. **AnalysisRequest** - Demandes d'analyses
   - id, patientId, doctorName, status
   - Statuts : PENDING, COMPLETED, VALIDATED

5. **AnalysisResult** - Résultats individuels
   - id, requestId, analysisTypeId, value, isAbnormal

**Relations :**
- Patient → AnalysisRequest (1:n)
- AnalysisRequest → AnalysisResult (1:n)
- AnalysisType → AnalysisResult (1:n)

---

## Sécurité & RBAC

### Matrice de Permissions

| Endpoint | ADMIN | SECRETARY | TECHNICIAN | MEDECIN |
|----------|-------|-----------|------------|---------|
| **Auth** |
| Login | ✅ | ✅ | ✅ | ✅ |
| Register | ✅ | ❌ | ❌ | ❌ |
| **Users** |
| Liste/CRUD | ✅ | ❌ | ❌ | ❌ |
| **Patients** |
| Créer/Modifier | ✅ | ✅ | ❌ | ❌ |
| Voir | ✅ | ✅ | ✅ | ✅ |
| Supprimer | ✅ | ❌ | ❌ | ❌ |
| **Analyses** |
| Créer demande | ✅ | ✅ | ❌ | ❌ |
| Saisir résultats | ✅ | ❌ | ✅ | ❌ |
| Valider | ✅ | ❌ | ❌ | ✅ |
| **Rapports PDF** |
| Générer | ✅ | ❌ | ❌ | ✅ |
| **Dashboard** |
| Stats | ✅ | ❌ | ❌ | ✅ |

---

## Workflow des Analyses

```
1. SECRÉTAIRE : Crée demande analyse
   └─> Status = PENDING

2. TECHNICIEN : Saisit résultats
   └─> Status = COMPLETED
   └─> isAbnormal calculé automatiquement

3. MÉDECIN : Valide analyse
   └─> Status = VALIDATED

4. MÉDECIN : Génère PDF rapport
   └─> PDF avec résultats + valeurs anormales en rouge
```

---

## Environnement de Développement

### Setup PostgreSQL (Docker)

```bash
docker run -d \
  --name lab-postgres \
  -e POSTGRES_USER=lab_user \
  -e POSTGRES_PASSWORD=lab_password \
  -e POSTGRES_DB=lab_db \
  -p 5432:5432 \
  postgres:15
```

### Variables d'environnement (.env)

```env
DATABASE_URL="postgresql://lab_user:lab_password@localhost:5432/lab_db"
JWT_SECRET="your-secret-key"
PORT=5000
```

### Commandes de Base

```bash
# Installation
npm install

# Migrations
npx prisma migrate dev

# Seed database
npx prisma db seed

# Démarrer serveur
npm run dev

# Tests
npm test

# Prisma Studio (DB GUI)
npx prisma studio

# Documentation Swagger
# Accès: http://localhost:5000/api-docs
```

---

## Tests

### Couverture de Tests

**Jest + Supertest configurés**

**Tests implémentés :**
- ✅ Auth routes (login success/fail)
- ✅ User CRUD + RBAC
- ✅ Patient CRUD + recherche
- ✅ Analysis workflows

**Commande :**
```bash
npm test
```

---

## Documentation API

### Swagger UI

**Accès :** `http://localhost:5000/api-docs`

**Fonctionnalités :**
- Documentation interactive complète
- Test des endpoints directement
- Schémas de requêtes/réponses
- Authentication Bearer token

---

## Données de Test (Seed)

### Comptes Utilisateurs

| Username | Password | Rôle |
|----------|----------|------|
| admin | tech123 | ADMIN |
| technician | tech123 | TECHNICIAN |
| secretary | secretary123 | SECRETARY |
| medecin | medecin123 | MEDECIN |

### Types d'Analyses (10)

- Glycémie (0.7-1.1 g/L)
- Cholestérol Total (1.5-2.0 g/L)
- Cholestérol HDL (0.4-0.65 g/L)
- Triglycérides (0.5-1.5 g/L)
- ASAT (TGO) (10-40 UI/L)
- ALAT (TGP) (10-40 UI/L)
- Créatinine (0.6-1.2 mg/dL)
- Urée (0.15-0.45 g/L)
- Hémoglobine (12-16 g/dL)
- Plaquettes (150-400 10³/µL)

### Patients (5)

Patients avec données réalistes (nom, CIN, téléphone, etc.)

### Analyses (5)

Demandes avec résultats normaux et anormaux pour tester le système

---

## Points Clés du Backend

### ✅ Fonctionnalités Principales

1. **Authentication JWT** - Sécurisé avec bcrypt
2. **RBAC complet** - 4 rôles avec permissions granulaires
3. **CRUD complet** - Users, Patients, Analyses
4. **Soft delete** - Patients (préserver historique)
5. **Workflow analyses** - PENDING → COMPLETED → VALIDATED
6. **Calcul automatique** - isAbnormal basé sur référence
7. **PDF Generation** - Rapports analyses + historique patient
8. **Swagger docs** - Documentation interactive
9. **Tests unitaires** - Jest + Supertest
10. **Validation** - Joi pour toutes les entrées

### 🔧 Technologies Utilisées

- **Node.js + Express** - Backend framework
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Database production-ready
- **JWT** - Stateless authentication
- **PDFMake** - Professional PDF reports
- **Swagger** - API documentation
- **Jest** - Testing framework

---

**Dernière mise à jour :** Décembre 2025  
**Version Backend :** 1.0  
**Status :** Production-ready

### 📋 Card 1.1 - Setup du Projet

**En tant que** développeur  
**Je veux** mettre en place l'architecture du projet  
**Afin de** pouvoir commencer le développement de façon structurée

#### ✅ Critères d'Acceptation :
- [ ] Structure backend (Node.js + Express) créée
- [ ] Structure frontend (React + Vite) créée
- [ ] PostgreSQL configuré avec Docker
- [ ] Prisma ORM configuré
- [ ] Variables d'environnement (.env) configurées
- [ ] Git repository initialisé

#### 🎯 Estimation : 5 points  
#### 🏷️ Labels : Backend, Frontend, Database

---

### 📋 Card 1.2 - Documentation Technique

**En tant que** membre de l'équipe  
**Je veux** avoir une documentation complète du projet  
**Afin de** comprendre l'architecture et les spécifications

#### ✅ Critères d'Acceptation :
- [ ] Architecture.md créé (3-tier, stack, sécurité)
- [ ] API-specification.md créé (tous les endpoints)
- [ ] Database-schema.md créé (tables, relations, index)
- [ ] User-stories.md créé (ce document)
- [ ] README.md mis à jour avec instructions de setup

#### 🎯 Estimation : 3 points  
#### 🏷️ Labels : Documentation

---

### 📋 Card 1.3 - Schéma de Base de Données

**En tant que** développeur backend  
**Je veux** créer le schéma de base de données complet  
**Afin de** structurer les données du laboratoire

#### ✅ Critères d'Acceptation :
- [ ] Modèle User créé (username, password_hash, role)
- [ ] Modèle Patient créé (fullName, dateOfBirth, CIN, etc.)
- [ ] Modèle AnalysisType créé (name, unit, reference_min/max)
- [ ] Modèle AnalysisRequest créé (patientId, doctorName, status)
- [ ] Modèle AnalysisResult créé (requestId, analysisTypeId, value)
- [ ] Enums créés (Role, AnalysisStatus)
- [ ] Relations établies
- [ ] Migration Prisma appliquée

#### 🎯 Estimation : 5 points  
#### 🏷️ Labels : Database, Backend

---

### 📋 Card 1.4 - Seed de Données de Test

**En tant que** développeur  
**Je veux** avoir des données de test dans la base de données  
**Afin de** pouvoir tester les fonctionnalités

#### ✅ Critères d'Acceptation :
- [ ] 4 utilisateurs créés (admin, secretary, technician, medecin)
- [ ] 10 types d'analyses créés (Glycémie, Cholestérol, etc.)
- [ ] 5 patients créés avec données réalistes
- [ ] 5 demandes d'analyses créées
- [ ] Résultats d'analyses créés (normaux et anormaux)
- [ ] Script seed.js fonctionnel

#### 🎯 Estimation : 3 points  
#### 🏷️ Labels : Database, Backend

---

## Sprint 2 : Backend Core (2 semaines)

### 📋 Card 2.1 - Authentification JWT

**En tant qu'** utilisateur  
**Je veux** pouvoir me connecter de façon sécurisée  
**Afin d'** accéder aux fonctionnalités selon mon rôle

#### ✅ Critères d'Acceptation :
- [ ] POST /api/auth/login implémenté
- [ ] Validation des credentials
- [ ] Génération de token JWT (expiration 24h)
- [ ] Hachage bcrypt des mots de passe
- [ ] Middleware d'authentification créé
- [ ] Tests unitaires (login success/fail)
- [ ] Documentation Swagger

#### 🎯 Estimation : 5 points  
#### 🏷️ Labels : Backend, API, Security

---

### 📋 Card 2.2 - Gestion des Utilisateurs

**En tant qu'** administrateur  
**Je veux** gérer les comptes utilisateurs  
**Afin de** contrôler l'accès au système

#### ✅ Critères d'Acceptation :
- [ ] GET /api/users (liste tous les utilisateurs)
- [ ] GET /api/users/:id (détails d'un utilisateur)
- [ ] POST /api/users (créer utilisateur)
- [ ] PUT /api/users/:id (modifier utilisateur)
- [ ] DELETE /api/users/:id (supprimer utilisateur)
- [ ] Validation Joi (username unique, role valide)
- [ ] RBAC : seul ADMIN peut accéder
- [ ] Tests unitaires
- [ ] Documentation Swagger

#### 🎯 Estimation : 5 points  
#### 🏷️ Labels : Backend, API, RBAC

---

### 📋 Card 2.3 - Gestion des Patients

**En tant que** secrétaire  
**Je veux** gérer les dossiers patients  
**Afin de** maintenir à jour les informations

#### ✅ Critères d'Acceptation :
- [ ] GET /api/patients (liste avec pagination)
- [ ] GET /api/patients/search (recherche par nom/CIN)
- [ ] GET /api/patients/:id (détails + historique)
- [ ] POST /api/patients (créer patient)
- [ ] PUT /api/patients/:id (modifier patient)
- [ ] DELETE /api/patients/:id (soft delete)
- [ ] Validation Joi (CIN unique, email valide)
- [ ] RBAC : ADMIN, SECRETARY, MEDECIN
- [ ] Tests unitaires
- [ ] Documentation Swagger

#### 🎯 Estimation : 8 points  
#### 🏷️ Labels : Backend, API, RBAC

---

### 📋 Card 2.4 - Gestion des Types d'Analyses

**En tant qu'** administrateur  
**Je veux** gérer les types d'analyses disponibles  
**Afin de** maintenir le catalogue à jour

#### ✅ Critères d'Acceptation :
- [ ] GET /api/analysis-types (liste tous les types)
- [ ] GET /api/analysis-types/:id (détails)
- [ ] POST /api/analysis-types (créer type)
- [ ] PUT /api/analysis-types/:id (modifier type)
- [ ] DELETE /api/analysis-types/:id (supprimer si non utilisé)
- [ ] Validation Joi (reference_min < reference_max)
- [ ] RBAC : ADMIN uniquement
- [ ] Tests unitaires
- [ ] Documentation Swagger

#### 🎯 Estimation : 5 points  
#### 🏷️ Labels : Backend, API, RBAC

---

### 📋 Card 2.5 - Middleware RBAC

**En tant que** développeur  
**Je veux** implémenter le contrôle d'accès basé sur les rôles  
**Afin de** sécuriser les endpoints

#### ✅ Critères d'Acceptation :
- [ ] Middleware `authorize([roles])` créé
- [ ] Vérification du rôle dans le token JWT
- [ ] Retour 403 Forbidden si rôle insuffisant
- [ ] Application sur tous les endpoints sensibles
- [ ] Tests unitaires (accès autorisé/refusé)
- [ ] Documentation des permissions

#### 🎯 Estimation : 3 points  
#### 🏷️ Labels : Backend, Security, RBAC

---

### 📋 Card 2.6 - Tests Unitaires Backend

**En tant que** développeur  
**Je veux** avoir une couverture de tests complète  
**Afin d'** assurer la qualité du code

#### ✅ Critères d'Acceptation :
- [ ] Jest + Supertest configurés
- [ ] Tests pour routes Auth (login, token)
- [ ] Tests pour routes Users (CRUD + RBAC)
- [ ] Tests pour routes Patients (CRUD + recherche)
- [ ] Tests pour routes AnalysisTypes (CRUD)
- [ ] Couverture > 80%
- [ ] CI/CD pipeline configuré

#### 🎯 Estimation : 5 points  
#### 🏷️ Labels : Backend, Testing

---

## Sprint 3 : Gestion des Analyses (2 semaines)

### 📋 Card 3.1 - Demandes d'Analyses

**En tant que** secrétaire  
**Je veux** créer des demandes d'analyses pour les patients  
**Afin de** lancer les analyses

#### ✅ Critères d'Acceptation :
- [ ] GET /api/analyses (liste avec filtres status/patient)
- [ ] GET /api/analyses/:id (détails + résultats)
- [ ] POST /api/analyses (créer demande)
- [ ] PUT /api/analyses/:id (modifier demande)
- [ ] DELETE /api/analyses/:id (supprimer demande)
- [ ] Validation Joi (patientId existe, doctorName requis)
- [ ] RBAC : ADMIN, SECRETARY
- [ ] Tests unitaires
- [ ] Documentation Swagger

#### 🎯 Estimation : 8 points  
#### 🏷️ Labels : Backend, API

---

### 📋 Card 3.2 - Saisie des Résultats

**En tant que** technicien  
**Je veux** saisir les résultats d'analyses  
**Afin de** compléter les demandes

#### ✅ Critères d'Acceptation :
- [ ] POST /api/analyses/:id/results (saisir résultat)
- [ ] PUT /api/analyses/:id/results/:resultId (modifier résultat)
- [ ] Calcul automatique de `isAbnormal`
- [ ] Validation Joi (value >= 0, analysisTypeId existe)
- [ ] Mise à jour du statut vers COMPLETED
- [ ] RBAC : ADMIN, TECHNICIAN
- [ ] Tests unitaires (valeurs normales/anormales)
- [ ] Documentation Swagger

#### 🎯 Estimation : 8 points  
#### 🏷️ Labels : Backend, API

---

### 📋 Card 3.3 - Validation des Analyses

**En tant que** médecin/biologiste  
**Je veux** valider les analyses complétées  
**Afin de** les rendre officielles

#### ✅ Critères d'Acceptation :
- [ ] POST /api/analyses/:id/validate (valider analyse)
- [ ] Vérification que status = COMPLETED
- [ ] Mise à jour vers VALIDATED
- [ ] RBAC : ADMIN, MEDECIN
- [ ] Tests unitaires
- [ ] Documentation Swagger

#### 🎯 Estimation : 3 points  
#### 🏷️ Labels : Backend, API

---

### 📋 Card 3.4 - Historique des Analyses

**En tant que** médecin  
**Je veux** consulter l'historique complet d'un patient  
**Afin de** suivre son évolution

#### ✅ Critères d'Acceptation :
- [ ] GET /api/patients/:id/history (toutes les analyses)
- [ ] Tri chronologique (plus récent en premier)
- [ ] Include : résultats + types d'analyses
- [ ] Pagination (20 par page)
- [ ] RBAC : ADMIN, SECRETARY, MEDECIN
- [ ] Tests unitaires
- [ ] Documentation Swagger

#### 🎯 Estimation : 5 points  
#### 🏷️ Labels : Backend, API

---

### 📋 Card 3.5 - Dashboard Analytics

**En tant qu'** administrateur  
**Je veux** voir les statistiques du laboratoire  
**Afin de** suivre l'activité

#### ✅ Critères d'Acceptation :
- [ ] GET /api/dashboard/stats implémenté
- [ ] Statistiques :
  - Total patients
  - Total analyses
  - Analyses par statut (PENDING, COMPLETED, VALIDATED)
  - Analyses du jour/semaine/mois
- [ ] RBAC : ADMIN uniquement
- [ ] Tests unitaires
- [ ] Documentation Swagger

#### 🎯 Estimation : 5 points  
#### 🏷️ Labels : Backend, API

---

### 📋 Card 3.6 - Génération PDF

**En tant que** médecin  
**Je veux** générer un rapport PDF pour une analyse  
**Afin de** le remettre au patient

#### ✅ Critères d'Acceptation :
- [ ] GET /api/analyses/:id/pdf implémenté
- [ ] PDF contient :
  - Informations patient
  - Nom du médecin
  - Date de l'analyse
  - Tableau des résultats (valeur, unité, référence, anormal)
  - Mise en évidence des valeurs anormales (rouge)
- [ ] Utilisation de PDFMake
- [ ] RBAC : ADMIN, MEDECIN
- [ ] Tests unitaires
- [ ] Documentation Swagger

#### 🎯 Estimation : 8 points  
#### 🏷️ Labels : Backend, API, PDF

---

## Sprint 4 : Frontend & Intégration (3 semaines)

### 📋 Card 4.1 - Page de Connexion

**En tant qu'** utilisateur  
**Je veux** me connecter via une interface  
**Afin d'** accéder à l'application

#### ✅ Critères d'Acceptation :
- [ ] Formulaire de connexion (username, password)
- [ ] Validation côté client (champs requis)
- [ ] Appel API POST /api/auth/login
- [ ] Stockage du token dans localStorage
- [ ] Redirection vers dashboard après connexion
- [ ] Affichage des erreurs (401 Unauthorized)
- [ ] Design responsive

#### 🎯 Estimation : 5 points  
#### 🏷️ Labels : Frontend, UI/UX, Auth

---

### 📋 Card 4.2 - Layout & Navigation

**En tant qu'** utilisateur connecté  
**Je veux** naviguer facilement dans l'application  
**Afin de** accéder aux fonctionnalités

#### ✅ Critères d'Acceptation :
- [ ] Sidebar avec menu de navigation
- [ ] Menu adapté au rôle (RBAC frontend)
- [ ] Header avec nom d'utilisateur + bouton déconnexion
- [ ] Routes protégées (PrivateRoute component)
- [ ] Redirection vers login si non authentifié
- [ ] Design responsive (mobile-friendly)

#### 🎯 Estimation : 5 points  
#### 🏷️ Labels : Frontend, UI/UX

---

### 📋 Card 4.3 - Gestion des Utilisateurs (UI)

**En tant qu'** administrateur  
**Je veux** gérer les utilisateurs via l'interface  
**Afin de** créer/modifier/supprimer des comptes

#### ✅ Critères d'Acceptation :
- [ ] Page liste des utilisateurs (tableau)
- [ ] Bouton "Ajouter Utilisateur"
- [ ] Formulaire de création (username, password, role)
- [ ] Formulaire d'édition (modal ou page)
- [ ] Bouton de suppression avec confirmation
- [ ] Validation côté client
- [ ] Messages de succès/erreur (toasts)
- [ ] Design responsive

#### 🎯 Estimation : 8 points  
#### 🏷️ Labels : Frontend, UI/UX

---

### 📋 Card 4.4 - Gestion des Patients (UI)

**En tant que** secrétaire  
**Je veux** gérer les patients via l'interface  
**Afin de** maintenir les dossiers à jour

#### ✅ Critères d'Acceptation :
- [ ] Page liste des patients (tableau paginé)
- [ ] Barre de recherche (nom/CIN)
- [ ] Bouton "Ajouter Patient"
- [ ] Formulaire de création (tous les champs)
- [ ] Formulaire d'édition
- [ ] Bouton de suppression (soft delete)
- [ ] Validation côté client (CIN unique, email valide)
- [ ] Messages de succès/erreur
- [ ] Design responsive

#### 🎯 Estimation : 8 points  
#### 🏷️ Labels : Frontend, UI/UX

---

### 📋 Card 4.5 - Détails Patient & Historique (UI)

**En tant que** médecin  
**Je veux** consulter les détails d'un patient et son historique  
**Afin de** suivre son évolution

#### ✅ Critères d'Acceptation :
- [ ] Page détails patient (informations complètes)
- [ ] Onglet "Historique des Analyses"
- [ ] Liste chronologique des analyses
- [ ] Affichage des résultats (tableau)
- [ ] Indicateur visuel pour valeurs anormales (badge rouge)
- [ ] Bouton "Télécharger PDF" pour chaque analyse
- [ ] Design responsive

#### 🎯 Estimation : 8 points  
#### 🏷️ Labels : Frontend, UI/UX

---

### 📋 Card 4.6 - Gestion des Types d'Analyses (UI)

**En tant qu'** administrateur  
**Je veux** gérer les types d'analyses  
**Afin de** maintenir le catalogue

#### ✅ Critères d'Acceptation :
- [ ] Page liste des types d'analyses
- [ ] Bouton "Ajouter Type"
- [ ] Formulaire de création (name, unit, reference_min/max, price)
- [ ] Formulaire d'édition
- [ ] Bouton de suppression avec confirmation
- [ ] Validation côté client (min < max)
- [ ] Messages de succès/erreur
- [ ] Design responsive

#### 🎯 Estimation : 5 points  
#### 🏷️ Labels : Frontend, UI/UX

---

### 📋 Card 4.7 - Demandes d'Analyses (UI)

**En tant que** secrétaire  
**Je veux** créer des demandes d'analyses  
**Afin de** lancer les analyses pour les patients

#### ✅ Critères d'Acceptation :
- [ ] Page liste des demandes (filtres par statut)
- [ ] Bouton "Nouvelle Demande"
- [ ] Formulaire :
  - Sélection du patient (autocomplete)
  - Nom du médecin (input texte)
  - Sélection des types d'analyses (checkboxes)
- [ ] Validation côté client
- [ ] Messages de succès/erreur
- [ ] Design responsive

#### 🎯 Estimation : 8 points  
#### 🏷️ Labels : Frontend, UI/UX

---

### 📋 Card 4.8 - Saisie des Résultats (UI)

**En tant que** technicien  
**Je veux** saisir les résultats d'analyses  
**Afin de** compléter les demandes

#### ✅ Critères d'Acceptation :
- [ ] Page détails d'une demande
- [ ] Liste des types d'analyses sélectionnés
- [ ] Formulaire de saisie :
  - Input pour chaque valeur
  - Affichage des valeurs de référence
  - Indicateur visuel si hors normes
- [ ] Bouton "Enregistrer Résultats"
- [ ] Mise à jour du statut vers COMPLETED
- [ ] Validation côté client (valeur >= 0)
- [ ] Messages de succès/erreur
- [ ] Design responsive

#### 🎯 Estimation : 8 points  
#### 🏷️ Labels : Frontend, UI/UX

---

### 📋 Card 4.9 - Validation des Analyses (UI)

**En tant que** médecin  
**Je veux** valider les analyses complétées  
**Afin de** les rendre officielles

#### ✅ Critères d'Acceptation :
- [ ] Page liste des analyses COMPLETED
- [ ] Bouton "Voir Détails" pour chaque analyse
- [ ] Page détails avec tous les résultats
- [ ] Bouton "Valider" (statut → VALIDATED)
- [ ] Confirmation avant validation
- [ ] Messages de succès/erreur
- [ ] Design responsive

#### 🎯 Estimation : 5 points  
#### 🏷️ Labels : Frontend, UI/UX

---

### 📋 Card 4.10 - Dashboard (UI)

**En tant qu'** administrateur  
**Je veux** voir un tableau de bord avec les statistiques  
**Afin de** suivre l'activité du laboratoire

#### ✅ Critères d'Acceptation :
- [ ] Page dashboard avec cartes statistiques :
  - Total patients
  - Total analyses
  - Analyses en attente
  - Analyses complétées
  - Analyses validées
- [ ] Graphiques (optionnel) :
  - Analyses par jour (7 derniers jours)
  - Types d'analyses les plus demandés
- [ ] Design responsive

#### 🎯 Estimation : 8 points  
#### 🏷️ Labels : Frontend, UI/UX

---

### 📋 Card 4.11 - Téléchargement PDF (UI)

**En tant que** médecin  
**Je veux** télécharger le rapport PDF d'une analyse  
**Afin de** le remettre au patient

#### ✅ Critères d'Acceptation :
- [ ] Bouton "Télécharger PDF" sur page détails analyse
- [ ] Appel API GET /api/analyses/:id/pdf
- [ ] Ouverture du PDF dans un nouvel onglet
- [ ] Gestion des erreurs (404, 500)
- [ ] Design responsive

#### 🎯 Estimation : 3 points  
#### 🏷️ Labels : Frontend, UI/UX, PDF

---

### 📋 Card 4.12 - Tests End-to-End (E2E)

**En tant que** développeur  
**Je veux** avoir des tests E2E  
**Afin d'** assurer le bon fonctionnement global

#### ✅ Critères d'Acceptation :
- [ ] Cypress ou Playwright configuré
- [ ] Test : Connexion utilisateur
- [ ] Test : Créer un patient
- [ ] Test : Créer une demande d'analyse
- [ ] Test : Saisir des résultats
- [ ] Test : Valider une analyse
- [ ] Test : Télécharger un PDF
- [ ] CI/CD pipeline configuré

#### 🎯 Estimation : 8 points  
#### 🏷️ Labels : Frontend, Testing

---

### 📋 Card 4.13 - Déploiement & Production

**En tant que** DevOps  
**Je veux** déployer l'application en production  
**Afin de** la rendre accessible aux utilisateurs

#### ✅ Critères d'Acceptation :
- [ ] Backend déployé (Render, Railway, ou VPS)
- [ ] Frontend déployé (Vercel, Netlify, ou VPS)
- [ ] PostgreSQL en production (Render, AWS RDS)
- [ ] Variables d'environnement configurées
- [ ] HTTPS activé
- [ ] CORS configuré pour le frontend
- [ ] Monitoring (optionnel)
- [ ] Backups automatiques

#### 🎯 Estimation : 8 points  
#### 🏷️ Labels : DevOps, Deployment

---

## Backlog (Fonctionnalités Futures)

### 📋 Facturation

**En tant que** secrétaire  
**Je veux** générer des factures pour les patients  
**Afin de** gérer la comptabilité

#### 🎯 Estimation : 13 points

---

### 📋 Notifications par Email

**En tant que** patient  
**Je veux** recevoir mes résultats par email  
**Afin de** les consulter à distance

#### 🎯 Estimation : 8 points

---

### 📋 Graphiques d'Évolution

**En tant que** médecin  
**Je veux** voir l'évolution des valeurs dans le temps  
**Afin de** suivre les tendances

#### 🎯 Estimation : 8 points

---

### 📋 Gestion de Stock (Réactifs)

**En tant que** technicien  
**Je veux** gérer le stock de réactifs  
**Afin d'** éviter les ruptures

#### 🎯 Estimation : 13 points

---

### 📋 Rendez-vous en Ligne

**En tant que** patient  
**Je veux** prendre rendez-vous en ligne  
**Afin de** éviter les déplacements inutiles

#### 🎯 Estimation : 13 points

---

## Récapitulatif des Estimations

| Sprint | User Stories | Points Totaux | Durée |
|--------|--------------|---------------|-------|
| Sprint 1 | 4 | 16 | 1 semaine |
| Sprint 2 | 6 | 31 | 2 semaines |
| Sprint 3 | 6 | 37 | 2 semaines |
| Sprint 4 | 13 | 83 | 3 semaines |
| **Total** | **29** | **167** | **8 semaines** |

---

## Définition de "Done"

Une user story est considérée comme terminée quand :

1. ✅ Le code est écrit et conforme aux critères d'acceptation
2. ✅ Les tests unitaires sont écrits et passent
3. ✅ Le code est revu (code review)
4. ✅ La fonctionnalité est testée manuellement
5. ✅ La documentation est mise à jour
6. ✅ Le code est mergé dans la branche principale

---

**Dernière mise à jour :** Décembre 2025  
**Version :** 1.0
