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
- [x] **Modèle Patient**
    - [x] Définir le schéma `Patient` (id, nom complet, date de naissance, genre, adresse, téléphone, email, identifiant unique).
- [x] **Routes Patients (CRUD)**
    - [x] `POST /api/patients` - Créer un nouveau patient.
    - [x] `GET /api/patients` - Lister tous les patients (implémenter pagination & recherche par nom/ID).
    - [x] `GET /api/patients/:id` - Obtenir les détails d'un patient.
    - [x] `PUT /api/patients/:id` - Mettre à jour les infos du patient.
    - [x] `DELETE /api/patients/:id` - Supprimer un patient (implémenter **soft delete** pour garder l'historique).

## 🧪 Phase 4 : Gestion des Analyses (Sprint 3)
- [x] **Modèles d'Analyse**
    - [x] Définir le schéma `AnalysisType` (nom, unité, ref_min, ref_max, prix).
    - [x] Définir le schéma `AnalysisRequest` (patient_id, date, statut : 'EN_ATTENTE' | 'TERMINE', nom_medecin).
    - [x] Définir le schéma `AnalysisResult` (request_id, nom_parametre, valeur, est_anormal).
- [x] **Routes d'Analyses**
    - [x] `POST /api/analyses` - Créer une nouvelle demande d'analyse pour un patient.
    - [x] `GET /api/analyses` - Lister les analyses (filtrer par statut, date, patient).
    - [x] `PUT /api/analyses/:id/results` - Saisir/Mettre à jour les résultats d'une analyse (Technicien seulement).
    - [x] `PATCH /api/analyses/:id/status` - Mettre à jour le statut (ex: marquer comme validé).

## 📄 Phase 5 : Rapports et Historique (Sprint 4)
- [x] **Endpoints d'Historique**
    - [x] `GET /api/patients/:id/history` - Obtenir l'historique complet des analyses d'un patient.
- [x] **Génération de PDF**
    - [x] Intégrer une librairie PDF (`pdfmake` ou `puppeteer`).
    - [x] Concevoir le modèle PDF (En-tête avec Logo, Infos Patient, Tableau des Résultats).
    - [x] `GET /api/analyses/:id/pdf` - Générer et télécharger le rapport PDF.

## ✅ Phase 6 : Tests et Documentation
- [x] **Documentation API**
    - [x] Configurer Swagger/OpenAPI (`swagger-ui-express`) pour documenter les endpoints pour l'équipe Frontend.
- [x] **Tests**
    - [x] Écrire des tests unitaires pour la logique critique (ex: validation des résultats par rapport aux valeurs de référence).
    - [x] Écrire des tests d'intégration pour les routes API avec `supertest`.

## 🔧 Phase 7 : Améliorations et Fonctionnalités Manquantes (Post-Sprint 4)
- [x] **Ajout du Rôle MEDECIN**
    - [x] Ajouter le rôle `MEDECIN` à l'énumération Role dans le schéma Prisma.
    - [x] Migrer la base de données pour inclure le nouveau rôle.
    - [x] Mettre à jour les middlewares de rôle pour supporter MEDECIN.
- [x] **Gestion des Utilisateurs (Admin)**
    - [x] `GET /api/users` - Lister tous les utilisateurs (Admin seulement).
    - [x] `GET /api/users/:id` - Obtenir les détails d'un utilisateur.
    - [x] `PUT /api/users/:id` - Mettre à jour un utilisateur (changer rôle, nom, etc.).
    - [x] `DELETE /api/users/:id` - Supprimer un utilisateur.
    - [x] `PUT /api/users/:id/password` - Changer le mot de passe d'un utilisateur.
- [x] **Gestion Complète des Demandes d'Analyses**
    - [x] `PUT /api/analyses/:id` - Mettre à jour une demande d'analyse (Secrétaire).
    - [x] `DELETE /api/analyses/:id` - Supprimer une demande d'analyse (Secrétaire/Admin).
    - [x] Renforcer le contrôle d'accès basé sur les rôles (RBAC) pour les secrétaires.
- [x] **Export Historique Patient Complet en PDF**
    - [x] `GET /api/patients/:id/history/pdf` - Générer et télécharger l'historique complet d'un patient en PDF.
    - [x] Inclure toutes les analyses avec résultats dans le PDF.
- [x] **Contrôle d'Accès Renforcé**
    - [x] Vérifier que seuls les Secrétaires peuvent créer/modifier des demandes d'analyses.
    - [x] Vérifier que seuls les Techniciens peuvent saisir les résultats.
    - [x] Vérifier que les Médecins et Admins peuvent consulter et générer des PDFs.
- [x] **Endpoints Statistiques/Dashboard**
    - [x] `GET /api/dashboard/stats` - Statistiques générales (nombre de patients, analyses en attente, complétées, etc.).
    - [x] `GET /api/dashboard/recent-activity` - Activité récente du laboratoire.
