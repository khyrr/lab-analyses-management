# Liste des Tâches Backend - Gestion Laboratoire d'Analyses

Ce document suit les tâches de développement backend pour l'API Node.js + PostgreSQL.

## 🚀 Phase 1 : Configuration et Initialisation (Début Sprint 2)
- [x] **Initialisation du Projet**
    - [x] Initialiser le projet Node.js (`npm init`).
    - [x] Mettre en place la structure des dossiers (`src/`, `controllers/`, `routes/`, `models/`, `config/`, `middlewares/`).
    - [x] Installer les dépendances principales : `express`, `cors`, `dotenv`, `helmet`, `morgan`.
    - [x] Configurer les outils de développement : `nodemon`, `eslint`, `prettier`.
- [x] **Configuration de la Base de Données (PostgreSQL)**
    - [x] Installer PostgreSQL localement ou configurer un conteneur Docker.
    - [x] Choisir et installer un ORM (Recommandé : **Prisma** ou **Sequelize**).
    - [x] Configurer la chaîne de connexion à la base de données dans `.env`.

## 🔐 Phase 2 : Authentification et Utilisateurs (Sprint 2)
- [x] **Modèle Utilisateur (User)**
    - [x] Définir le schéma `User` (id, nom d'utilisateur, mot de passe haché, rôle : 'ADMIN' | 'TECHNICIEN' | 'SECRETAIRE').
- [x] **Logique d'Authentification**
    - [x] Implémenter le hachage des mots de passe (avec `bcrypt` ou `argon2`).
    - [x] Implémenter la génération (sign) et la vérification (verify) des JWT.
    - [x] Créer le Middleware : `authMiddleware` (vérifier le token).
    - [x] Créer le Middleware : `roleMiddleware` (vérifier les permissions, ex: seul l'Admin peut supprimer des utilisateurs).
- [x] **Routes d'Authentification**
    - [x] `POST /api/auth/login`
    - [x] `POST /api/auth/register` (Protégé : Admin seulement)

## 🏥 Phase 3 : Gestion des Patients (Sprint 2/3)
- [ ] **Modèle Patient**
    - [ ] Définir le schéma `Patient` (id, nom complet, date de naissance, genre, adresse, téléphone, email, identifiant unique).
- [ ] **Routes Patients (CRUD)**
    - [ ] `POST /api/patients` - Créer un nouveau patient.
    - [ ] `GET /api/patients` - Lister tous les patients (implémenter pagination & recherche par nom/ID).
    - [ ] `GET /api/patients/:id` - Obtenir les détails d'un patient.
    - [ ] `PUT /api/patients/:id` - Mettre à jour les infos du patient.
    - [ ] `DELETE /api/patients/:id` - Supprimer un patient (implémenter **soft delete** pour garder l'historique).

## 🧪 Phase 4 : Gestion des Analyses (Sprint 3)
- [ ] **Modèles d'Analyse**
    - [ ] Définir le schéma `AnalysisType` (nom, unité, ref_min, ref_max, prix).
    - [ ] Définir le schéma `AnalysisRequest` (patient_id, date, statut : 'EN_ATTENTE' | 'TERMINE', nom_medecin).
    - [ ] Définir le schéma `AnalysisResult` (request_id, nom_parametre, valeur, est_anormal).
- [ ] **Routes d'Analyses**
    - [ ] `POST /api/analyses` - Créer une nouvelle demande d'analyse pour un patient.
    - [ ] `GET /api/analyses` - Lister les analyses (filtrer par statut, date, patient).
    - [ ] `PUT /api/analyses/:id/results` - Saisir/Mettre à jour les résultats d'une analyse (Technicien seulement).
    - [ ] `PATCH /api/analyses/:id/status` - Mettre à jour le statut (ex: marquer comme validé).

## 📄 Phase 5 : Rapports et Historique (Sprint 4)
- [ ] **Endpoints d'Historique**
    - [ ] `GET /api/patients/:id/history` - Obtenir l'historique complet des analyses d'un patient.
- [ ] **Génération de PDF**
    - [ ] Intégrer une librairie PDF (`pdfmake` ou `puppeteer`).
    - [ ] Concevoir le modèle PDF (En-tête avec Logo, Infos Patient, Tableau des Résultats).
    - [ ] `GET /api/analyses/:id/pdf` - Générer et télécharger le rapport PDF.

## ✅ Phase 6 : Tests et Documentation
- [ ] **Documentation API**
    - [ ] Configurer Swagger/OpenAPI (`swagger-ui-express`) pour documenter les endpoints pour l'équipe Frontend.
- [ ] **Tests**
    - [ ] Écrire des tests unitaires pour la logique critique (ex: validation des résultats par rapport aux valeurs de référence).
    - [ ] Écrire des tests d'intégration pour les routes API avec `supertest`.
