# 🚀 Guide de Démarrage Backend - Lab Analyses

**Pour :** L'équipe Frontend  
**Objectif :** Démarrer le backend avec la base de données et les données de test

---

## 📋 Prérequis

Avant de commencer, installez :
- **Node.js** version 18+ → [Télécharger ici](https://nodejs.org/)
- **Docker Desktop** → [Télécharger ici](https://www.docker.com/products/docker-desktop/)

---

## ⚡ Démarrage Rapide (3 étapes)

### Étape 1️⃣ : Démarrer PostgreSQL avec Docker

Ouvrez un terminal et lancez :

```bash
docker run -d \
  --name lab-postgres \
  -e POSTGRES_USER=lab_user \
  -e POSTGRES_PASSWORD=lab_password \
  -e POSTGRES_DB=lab_db \
  -p 5432:5432 \
  postgres:15
```

**Vérification :**
```bash
docker ps
```
Vous devriez voir `lab-postgres` dans la liste.

---

### Étape 2️⃣ : Installer et configurer le Backend

```bash
# Aller dans le dossier backend
cd backend

# Installer les dépendances
npm install

# Appliquer les migrations de la base de données
npx prisma migrate dev

# Remplir la base avec les données de test (IMPORTANT!)
npx prisma db seed
```

**Résultat attendu :**
```
✔ Generated Prisma Client
🌱 The seed command has been executed.
```

---

### Étape 3️⃣ : Démarrer le serveur Backend

```bash
npm run dev
```

**Vous devriez voir :**
```
🚀 Server running on http://localhost:5000
✅ Database connected successfully
```

---

## ✅ Vérification que tout fonctionne

### 1. Test de l'API

Ouvrez votre navigateur et allez sur :
```
http://localhost:5000/api-docs
```

Vous devriez voir la documentation **Swagger** avec tous les endpoints.

### 2. Test de Connexion

Dans Swagger, testez l'endpoint **POST /api/auth/login** :

**Cliquez sur "Try it out"** et utilisez :
```json
{
  "username": "admin",
  "password": "tech123"
}
```

**Vous devriez recevoir :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin",
  "role": "ADMIN"
}
```

✅ **Si vous voyez le token, tout fonctionne parfaitement !**

---

## 🔑 Comptes de Test (Seed Data)

Utilisez ces comptes pour tester l'application :

| Username | Mot de passe | Rôle | Description |
|----------|--------------|------|-------------|
| **admin** | tech123 | ADMIN | Accès complet au système |
| **secretary** | secretary123 | SECRETARY | Gestion patients + demandes |
| **technician** | tech123 | TECHNICIAN | Saisie résultats analyses |
| **medecin** | medecin123 | MEDECIN | Validation + génération PDF |

---

## 📊 Données de Test Disponibles

Après le seed, vous aurez :
- ✅ **4 utilisateurs** (voir tableau ci-dessus)
- ✅ **10 types d'analyses** (Glycémie, Cholestérol, ASAT, ALAT, etc.)
- ✅ **5 patients** avec données réalistes
- ✅ **5 demandes d'analyses** avec résultats (normaux et anormaux)

---

## 🌐 URLs Importantes

| Service | URL | Description |
|---------|-----|-------------|
| **API Backend** | http://localhost:5000/api | Base URL pour toutes les requêtes |
| **Swagger UI** | http://localhost:5000/api-docs | Documentation interactive |
| **Test API** | http://localhost:5000 | Message de bienvenue |

---

## 🛠️ Commandes Utiles

### Prisma Studio (Interface Visuelle DB)

Pour voir les données dans la base de données :
```bash
npx prisma studio
```
Ouvre automatiquement : http://localhost:5555

### Redémarrer la Base de Données

Si vous voulez repartir de zéro :
```bash
# Supprimer et recréer la DB
npx prisma migrate reset

# Re-seeder les données
npx prisma db seed
```

### Arrêter/Redémarrer Docker

```bash
# Arrêter PostgreSQL
docker stop lab-postgres

# Redémarrer PostgreSQL
docker start lab-postgres

# Voir les logs
docker logs lab-postgres
```

---

## 🧪 Tester les Endpoints

### Exemple avec Postman ou curl

#### 1. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"tech123"}'
```

#### 2. Récupérer les patients (avec le token)
```bash
curl http://localhost:5000/api/patients \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

#### 3. Récupérer les statistiques dashboard
```bash
curl http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

---

## ⚠️ Problèmes Courants

### ❌ "Port 5432 already in use"

**Solution :**
```bash
# Arrêter l'ancien container
docker stop lab-postgres
docker rm lab-postgres

# Relancer avec la commande de l'Étape 1
```

### ❌ "Port 5000 already in use"

**Solution :**
```bash
# Trouver et arrêter le processus
lsof -ti:5000 | xargs kill -9

# Ou changer le port dans backend/.env
PORT=5001
```

### ❌ "Prisma Client not generated"

**Solution :**
```bash
npx prisma generate
```

### ❌ "Cannot connect to database"

**Vérifications :**
```bash
# 1. Docker est lancé ?
docker ps

# 2. PostgreSQL fonctionne ?
docker logs lab-postgres

# 3. Relancer PostgreSQL
docker restart lab-postgres
```

---

## 📝 Structure Backend (Info)

```
backend/
├── src/
│   ├── routes/          → Endpoints API
│   ├── controllers/     → Logique métier
│   ├── middlewares/     → Auth, RBAC
│   └── config/          → Prisma, Swagger
├── prisma/
│   ├── schema.prisma    → Schéma DB
│   ├── seed.js          → Données de test ⭐
│   └── migrations/      → Historique DB
├── .env                 → Configuration
└── package.json
```

---

## 🔐 Authentification dans le Frontend

### Exemple avec Axios

```javascript
// Configuration de base
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Interceptor pour ajouter le token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login
const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('role', response.data.role);
  return response.data;
};

// Récupérer les patients
const getPatients = async () => {
  const response = await api.get('/patients');
  return response.data;
};
```

---

## 📚 Endpoints Principaux

### Auth
- `POST /api/auth/login` - Connexion

### Patients
- `GET /api/patients` - Liste patients
- `POST /api/patients` - Créer patient
- `GET /api/patients/:id` - Détails patient
- `PUT /api/patients/:id` - Modifier patient
- `DELETE /api/patients/:id` - Supprimer patient
- `GET /api/patients/:id/history` - Historique analyses

### Analyses
- `GET /api/analyses/types` - Types d'analyses disponibles
- `POST /api/analyses` - Créer demande analyse
- `GET /api/analyses` - Liste demandes
- `PUT /api/analyses/:id/results` - Saisir résultats
- `PATCH /api/analyses/:id/status` - Changer statut
- `GET /api/analyses/:id/pdf` - Télécharger PDF

### Dashboard
- `GET /api/dashboard/stats` - Statistiques

**👉 Voir la documentation complète sur http://localhost:5000/api-docs**

---

## ✅ Checklist de Démarrage

Avant de commencer le développement Frontend, vérifiez :

- [ ] Docker Desktop est installé et lancé
- [ ] Container `lab-postgres` fonctionne (`docker ps`)
- [ ] `npm install` dans le dossier backend
- [ ] `npx prisma migrate dev` exécuté avec succès
- [ ] `npx prisma db seed` a créé les données de test
- [ ] `npm run dev` démarre le serveur sur port 5000
- [ ] http://localhost:5000/api-docs est accessible
- [ ] Login avec admin/tech123 fonctionne sur Swagger
- [ ] Vous avez récupéré un token JWT valide

---

## 🎯 Prêt pour le Frontend !

Une fois ces étapes validées, vous pouvez :
1. ✅ Développer votre application React
2. ✅ Utiliser les comptes de test pour tester les fonctionnalités
3. ✅ Consulter Swagger pour voir les schémas de données
4. ✅ Appeler les endpoints avec Axios

---

## 🆘 Support

**Problème ?**
1. Vérifiez les logs : `docker logs lab-postgres`
2. Vérifiez le backend : regardez le terminal où tourne `npm run dev`
3. Testez sur Swagger : http://localhost:5000/api-docs

**Documentation complète :**
- `docs/backend-architecture.md` - Architecture technique
- `docs/database-schema.md` - Schéma base de données
- `docs/sprint-frontend-pfa.md` - Guide développement Frontend

---

**Bon développement ! 🚀**

**Dernière mise à jour :** Décembre 2025
