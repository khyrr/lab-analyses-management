# 📘 Guide de Démarrage pour l'Équipe Frontend

Ce document contient toutes les informations nécessaires pour configurer l'environnement de développement et commencer à travailler sur le Frontend de l'application **Lab Analyses Management**.

## 🛠️ Prérequis

Assurez-vous d'avoir installé :
- **Node.js** (v16 ou supérieur)
- **Git**
- **Base de données** :
    - Soit **Docker** (Recommandé pour la simplicité)
    - Soit **PostgreSQL** installé localement

---

## 🚀 1. Lancer le Backend (API)

Le Frontend a besoin que le Backend soit lancé pour fonctionner.

1.  **Cloner le projet** (si ce n'est pas déjà fait) :
    ```bash
    git clone <url-du-repo>
    cd lab-analyses-management
    ```

2.  **Configurer le Backend** :
    ```bash
    cd backend
    npm install
    cp .env.example .env
    ```

3.  **Lancer la Base de Données** :

    **Option A : Avec Docker (Recommandé)**
    ```bash
    # À la racine du projet (là où se trouve docker-compose.yml)
    docker-compose up -d
    ```

    **Option B : Sans Docker (PostgreSQL local)**
    Si vous n'utilisez pas Docker, vous devez :
    1.  Installer PostgreSQL sur votre machine.
    2.  Créer une base de données vide nommée `lab_db`.
    3.  Modifier le fichier `backend/.env` pour mettre vos propres identifiants :
        ```env
        DATABASE_URL="postgresql://VOTRE_USER:VOTRE_PASSWORD@localhost:5432/lab_db?schema=public"
        ```

4.  **Initialiser la Base de Données** :
    ```bash
    cd backend
    npx prisma migrate dev
    node prisma/seed.js  # Crée l'utilisateur Admin (user: admin, pass: admin123)
    ```

5.  **Démarrer le Serveur** :
    ```bash
    npm run dev
    ```
    Le serveur sera accessible sur `http://localhost:5000`.

---

## 📚 2. Documentation de l'API

Une fois le serveur lancé, la documentation complète de l'API (Swagger) est disponible ici :
👉 **[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

Vous y trouverez tous les endpoints, les formats de requêtes et de réponses.

**Utilisateurs de test :**
- **Admin** : `admin` / `admin123` (Peut tout faire, y compris créer d'autres utilisateurs)

---

## 💻 3. Stack Technique Frontend (Recommandée)

Comme défini dans le cahier des charges :
- **Framework** : React.js (Vite recommandé pour la rapidité)
- **State Management** : Redux Toolkit (ou Context API pour commencer)
- **Routing** : React Router v6
- **HTTP Client** : Axios
- **UI Library** : TailwindCSS, Material UI ou Ant Design (au choix de l'équipe)
- **Gestion des Formulaires** : React Hook Form + Zod (recommandé)

---

## ✅ 4. Liste des Tâches Frontend (TODO)

Voici la feuille de route pour le développement Frontend, basée sur les Sprints.

### 🏁 Phase 1 : Initialisation & Auth
- [ ] **Setup** : Initialiser le projet React (`npm create vite@latest frontend -- --template react`).
- [ ] **Configuration** : Configurer Axios (Base URL: `http://localhost:5000/api`) et les intercepteurs (pour injecter le token JWT).
- [ ] **Page de Login** : Formulaire de connexion (`POST /auth/login`).
- [ ] **Gestion du Token** : Stocker le JWT (localStorage/cookie) et gérer la déconnexion.
- [ ] **Layout** : Créer la structure principale (Sidebar, Header) avec protection des routes (PrivateRoutes).

### 🏥 Phase 2 : Gestion des Patients
- [ ] **Liste des Patients** : Tableau avec pagination et recherche (`GET /patients`).
- [ ] **Ajout/Modif Patient** : Formulaire modal ou page dédiée (`POST /patients`, `PUT /patients/:id`).
- [ ] **Détails Patient** : Page de profil patient avec historique des analyses (`GET /patients/:id/history`).

### 🧪 Phase 3 : Gestion des Analyses
- [ ] **Demande d'Analyse** : Formulaire pour créer une demande (`POST /analyses`).
    - Sélectionner un patient.
    - Sélectionner les types d'analyses (ex: NFS, Glycémie).
- [ ] **Tableau de Bord Laboratoire** : Liste des demandes en attente (`GET /analyses?status=PENDING`).
- [ ] **Saisie des Résultats** : Interface pour les techniciens (`PUT /analyses/:id/results`).
    - Afficher les champs à remplir.
    - Mettre en évidence les valeurs anormales (retournées par le backend).

### 📄 Phase 4 : Rapports & PDF
- [ ] **Validation** : Bouton pour valider une analyse terminée (`PATCH /analyses/:id/status`).
- [ ] **Téléchargement PDF** : Bouton pour télécharger le rapport (`GET /analyses/:id/pdf`).

---

Bon courage à l'équipe Frontend ! 🚀
