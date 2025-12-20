# Sprint Frontend - Projet PFA Laboratoire d'Analyses Médicales

**Durée :** 3 semaines  
**Équipe :** Développeurs Frontend  
**Objectif :** Créer l'interface utilisateur complète connectée au backend existant

---

## 🎯 Objectif du Sprint

Développer une application web React complète pour la gestion du laboratoire d'analyses médicales. Le backend (API REST) est déjà fonctionnel, vous devez créer l'interface utilisateur qui communique avec cette API.

---

## 📋 Backend Disponible

### API Base URL
```
http://localhost:5000/api
```

### Documentation Swagger
```
http://localhost:5000/api-docs
```
Utilisez Swagger pour tester les endpoints et voir les schémas de données.

### Comptes de Test

| Username | Mot de passe | Rôle |
|----------|--------------|------|
| admin | tech123 | ADMIN |
| secretary | secretary123 | SECRETARY |
| technician | tech123 | TECHNICIAN |
| medecin | medecin123 | MEDECIN |

---

## 🛠️ Stack Technique Recommandé

### Frontend
- **Framework :** React 18+ avec Vite
- **Routing :** React Router v6
- **State Management :** Context API ou Redux Toolkit (au choix)
- **HTTP Client :** Axios
- **UI Library :** Material-UI (MUI) ou Ant Design ou Bootstrap
- **Forms :** React Hook Form + Yup validation
- **Styling :** CSS Modules ou Styled Components ou Tailwind CSS

### Installation Rapide

```bash
# Créer le projet
npm create vite@latest frontend -- --template react
cd frontend
npm install

# Installer les dépendances
npm install react-router-dom axios
npm install @mui/material @emotion/react @emotion/styled  # Si MUI
npm install react-hook-form yup @hookform/resolvers
```

---

## 📁 Structure Projet Recommandée

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Layout.jsx
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Table.jsx
│   │   └── auth/
│   │       └── PrivateRoute.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── patients/
│   │   │   ├── PatientList.jsx
│   │   │   ├── PatientForm.jsx
│   │   │   ├── PatientDetails.jsx
│   │   │   └── PatientHistory.jsx
│   │   ├── analyses/
│   │   │   ├── AnalysisList.jsx
│   │   │   ├── AnalysisForm.jsx
│   │   │   ├── AnalysisResults.jsx
│   │   │   └── AnalysisValidation.jsx
│   │   └── users/
│   │       ├── UserList.jsx
│   │       └── UserForm.jsx
│   │
│   ├── services/
│   │   ├── api.js              # Configuration Axios
│   │   ├── authService.js      # Login, logout, token
│   │   ├── patientService.js   # API patients
│   │   ├── analysisService.js  # API analyses
│   │   └── userService.js      # API users
│   │
│   ├── context/
│   │   └── AuthContext.jsx     # Context pour auth
│   │
│   ├── hooks/
│   │   └── useAuth.js          # Custom hook auth
│   │
│   ├── utils/
│   │   ├── constants.js        # Constantes (roles, status)
│   │   └── helpers.js          # Fonctions utilitaires
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── public/
├── package.json
└── vite.config.js
```

---

## 📝 Tâches du Sprint (User Stories)

### 🔐 Semaine 1 : Authentification & Layout

#### Story 1.1 : Configuration du Projet
**Estimation :** 2h

**Tâches :**
- [ ] Créer le projet React avec Vite
- [ ] Installer toutes les dépendances
- [ ] Configurer Axios (base URL, interceptors)
- [ ] Créer la structure des dossiers
- [ ] Configurer React Router

**Livrable :** Projet React fonctionnel avec structure

---

#### Story 1.2 : Page de Connexion
**Estimation :** 4h

**Tâches :**
- [ ] Créer le formulaire de connexion (username, password)
- [ ] Valider les champs (Yup ou validation manuelle)
- [ ] Appeler l'API `POST /api/auth/login`
- [ ] Stocker le token dans localStorage
- [ ] Gérer les erreurs (401, 500)
- [ ] Rediriger vers dashboard après succès

**API Endpoint :**
```javascript
POST /api/auth/login
Body: { username: "admin", password: "tech123" }
Response: { token: "jwt...", role: "ADMIN", username: "admin" }
```

**Critères d'acceptation :**
- Connexion avec admin/tech123 fonctionne
- Message d'erreur si mauvais credentials
- Redirection automatique après login

---

#### Story 1.3 : Layout & Navigation
**Estimation :** 6h

**Tâches :**
- [ ] Créer Navbar (logo, nom utilisateur, bouton déconnexion)
- [ ] Créer Sidebar avec menu de navigation
- [ ] Adapter le menu selon le rôle (RBAC)
- [ ] Créer Layout component
- [ ] Implémenter PrivateRoute (vérifier token)
- [ ] Bouton déconnexion (clear localStorage + redirect)

**Menu selon les rôles :**

**ADMIN :**
- Dashboard
- Patients
- Analyses
- Utilisateurs

**SECRETARY :**
- Patients
- Analyses

**TECHNICIAN :**
- Analyses (saisie résultats)

**MEDECIN :**
- Dashboard
- Patients (consultation)
- Analyses (validation)

**Critères d'acceptation :**
- Menu s'adapte au rôle connecté
- Déconnexion fonctionne
- Routes protégées (redirect si pas de token)

---

#### Story 1.4 : Dashboard
**Estimation :** 4h

**Tâches :**
- [ ] Créer page Dashboard
- [ ] Appeler `GET /api/dashboard/stats`
- [ ] Afficher les statistiques en cartes (cards) :
  - Total patients
  - Total analyses
  - Analyses en attente
  - Analyses complétées
  - Analyses validées
- [ ] Design responsive

**API Endpoint :**
```javascript
GET /api/dashboard/stats
Headers: { Authorization: "Bearer <token>" }
Response: {
  totalPatients: 125,
  totalAnalyses: 450,
  pendingAnalyses: 12,
  completedAnalyses: 8,
  validatedAnalyses: 430
}
```

**Critères d'acceptation :**
- Statistiques affichées correctement
- Accessible uniquement par ADMIN et MEDECIN

---

### 👥 Semaine 2 : Gestion des Patients

#### Story 2.1 : Liste des Patients
**Estimation :** 6h

**Tâches :**
- [ ] Créer page PatientList
- [ ] Appeler `GET /api/patients`
- [ ] Afficher tableau avec colonnes :
  - Nom complet
  - CIN
  - Date de naissance
  - Téléphone
  - Actions (Voir, Modifier, Supprimer)
- [ ] Barre de recherche (nom ou CIN)
- [ ] Pagination (20 par page)
- [ ] Bouton "Ajouter Patient"

**API Endpoint :**
```javascript
GET /api/patients?page=1&limit=20&search=mohammed
Headers: { Authorization: "Bearer <token>" }
```

**Critères d'acceptation :**
- Liste des patients affichée
- Recherche fonctionne
- Pagination fonctionne

---

#### Story 2.2 : Formulaire Ajout/Modification Patient
**Estimation :** 6h

**Tâches :**
- [ ] Créer formulaire PatientForm (réutilisable)
- [ ] Champs :
  - Nom complet (requis)
  - CIN (requis, unique)
  - Date de naissance (requis)
  - Genre (M/F) (requis)
  - Adresse (requis)
  - Téléphone (requis)
  - Email (optionnel)
- [ ] Validation des champs
- [ ] Appeler `POST /api/patients` (création)
- [ ] Appeler `PUT /api/patients/:id` (modification)
- [ ] Messages de succès/erreur
- [ ] Retour à la liste après succès

**API Endpoints :**
```javascript
// Création
POST /api/patients
Body: {
  fullName: "Mohammed Ben Ali",
  cin: "AB123456",
  dateOfBirth: "1985-03-15",
  gender: "M",
  address: "123 Rue Casablanca",
  phone: "0612345678",
  email: "mohammed@email.com"
}

// Modification
PUT /api/patients/1
Body: { ... même structure ... }
```

**Critères d'acceptation :**
- Formulaire valide les champs
- Création fonctionne
- Modification pré-remplit le formulaire
- Accessible par SECRETARY et ADMIN

---

#### Story 2.3 : Détails Patient & Historique
**Estimation :** 6h

**Tâches :**
- [ ] Créer page PatientDetails
- [ ] Appeler `GET /api/patients/:id`
- [ ] Afficher informations du patient
- [ ] Appeler `GET /api/patients/:id/history`
- [ ] Afficher liste des analyses (tableau) :
  - Date
  - Médecin prescripteur
  - Statut
  - Bouton "Voir Résultats"
  - Bouton "Télécharger PDF" (si validé)
- [ ] Tri chronologique (plus récent en premier)

**API Endpoints :**
```javascript
GET /api/patients/1
GET /api/patients/1/history
```

**Critères d'acceptation :**
- Informations patient affichées
- Historique complet visible
- Boutons PDF fonctionnent (téléchargement)

---

#### Story 2.4 : Suppression Patient
**Estimation :** 2h

**Tâches :**
- [ ] Bouton supprimer dans la liste
- [ ] Modal de confirmation "Êtes-vous sûr ?"
- [ ] Appeler `DELETE /api/patients/:id`
- [ ] Rafraîchir la liste après suppression
- [ ] Message de succès

**API Endpoint :**
```javascript
DELETE /api/patients/1
Headers: { Authorization: "Bearer <token>" }
```

**Critères d'acceptation :**
- Confirmation avant suppression
- Suppression fonctionne (soft delete backend)
- Accessible par ADMIN uniquement

---

### 🧪 Semaine 3 : Gestion des Analyses

#### Story 3.1 : Liste des Analyses
**Estimation :** 4h

**Tâches :**
- [ ] Créer page AnalysisList
- [ ] Appeler `GET /api/analyses`
- [ ] Tableau avec colonnes :
  - Numéro
  - Patient
  - Médecin
  - Statut (badge coloré)
  - Date
  - Actions
- [ ] Filtres par statut (PENDING, COMPLETED, VALIDATED)
- [ ] Bouton "Nouvelle Demande"

**API Endpoint :**
```javascript
GET /api/analyses?status=PENDING
```

**Critères d'acceptation :**
- Liste des analyses affichée
- Filtrage par statut fonctionne
- Badges de statut colorés (jaune, bleu, vert)

---

#### Story 3.2 : Création Demande d'Analyse
**Estimation :** 6h

**Tâches :**
- [ ] Créer formulaire AnalysisForm
- [ ] Champs :
  - Sélection patient (autocomplete/dropdown)
  - Nom du médecin (input texte)
  - Sélection types d'analyses (checkboxes multiples)
- [ ] Appeler `GET /api/analyses/types` pour charger les types
- [ ] Appeler `POST /api/analyses`
- [ ] Message de succès
- [ ] Redirection vers liste

**API Endpoints :**
```javascript
// Charger types
GET /api/analyses/types
Response: [
  { id: 1, name: "Glycémie", unit: "g/L", price: 50 },
  { id: 2, name: "Cholestérol", unit: "g/L", price: 60 }
]

// Créer demande
POST /api/analyses
Body: {
  patientId: 1,
  doctorName: "Dr. Hassan Mouline",
  analysisTypeIds: [1, 2, 3]
}
```

**Critères d'acceptation :**
- Formulaire fonctionne
- Au moins un type d'analyse sélectionné
- Accessible par SECRETARY et ADMIN

---

#### Story 3.3 : Saisie des Résultats (Technicien)
**Estimation :** 8h

**Tâches :**
- [ ] Créer page AnalysisResults
- [ ] Afficher infos demande (patient, médecin, date)
- [ ] Pour chaque type d'analyse sélectionné :
  - Nom de l'analyse
  - Unité
  - Valeurs de référence
  - Input pour saisir la valeur
  - Badge si hors normes (calculé en temps réel)
- [ ] Bouton "Enregistrer Résultats"
- [ ] Appeler `PUT /api/analyses/:id/results`
- [ ] Message de succès
- [ ] Statut passe à COMPLETED automatiquement

**API Endpoint :**
```javascript
PUT /api/analyses/1/results
Body: {
  results: [
    { analysisTypeId: 1, value: 0.95 },
    { analysisTypeId: 2, value: 2.5 },  // Hors normes
    { analysisTypeId: 3, value: 0.55 }
  ]
}
```

**Critères d'acceptation :**
- Saisie des résultats fonctionne
- Indicateur visuel pour valeurs anormales
- Accessible par TECHNICIAN et ADMIN

---

#### Story 3.4 : Validation des Analyses (Médecin)
**Estimation :** 4h

**Tâches :**
- [ ] Page AnalysisValidation
- [ ] Filtrer analyses avec statut COMPLETED
- [ ] Afficher détails + tous les résultats
- [ ] Valeurs anormales en rouge/orange
- [ ] Bouton "Valider"
- [ ] Appeler `PATCH /api/analyses/:id/status`
- [ ] Statut passe à VALIDATED

**API Endpoint :**
```javascript
PATCH /api/analyses/1/status
Body: { status: "VALIDATED" }
```

**Critères d'acceptation :**
- Liste des analyses à valider
- Validation fonctionne
- Accessible par MEDECIN et ADMIN

---

#### Story 3.5 : Téléchargement PDF
**Estimation :** 2h

**Tâches :**
- [ ] Bouton "Télécharger PDF" sur détails analyse
- [ ] Appeler `GET /api/analyses/:id/pdf`
- [ ] Ouvrir PDF dans nouvel onglet
- [ ] Gérer les erreurs

**API Endpoint :**
```javascript
GET /api/analyses/1/pdf
Headers: { Authorization: "Bearer <token>" }
Response: PDF file (application/pdf)
```

**Critères d'acceptation :**
- PDF se télécharge/ouvre
- Accessible par MEDECIN et ADMIN
- Uniquement pour analyses validées

---

### 👥 BONUS : Gestion des Utilisateurs (Admin)

#### Story 4.1 : Liste & CRUD Utilisateurs
**Estimation :** 6h

**Tâches :**
- [ ] Page UserList
- [ ] Appeler `GET /api/users`
- [ ] Tableau (username, rôle, actions)
- [ ] Formulaire création utilisateur
- [ ] `POST /api/auth/register` (ADMIN uniquement)
- [ ] Modification/Suppression

**API Endpoints :**
```javascript
GET /api/users
POST /api/auth/register
Body: { username: "newuser", password: "password123", role: "SECRETARY" }
```

**Critères d'acceptation :**
- Liste utilisateurs visible
- Création/modification/suppression fonctionnent
- Accessible ADMIN uniquement

---

## 🎨 Design & UX

### Recommandations

1. **Palette de couleurs :**
   - Primaire : Bleu médical (#1976D2)
   - Secondaire : Vert (#4CAF50)
   - Danger : Rouge (#F44336)
   - Warning : Orange (#FF9800)

2. **Statuts des analyses :**
   - PENDING : Badge jaune/orange
   - COMPLETED : Badge bleu
   - VALIDATED : Badge vert

3. **Responsive :**
   - Mobile-first design
   - Tableau responsive (scroll horizontal si besoin)
   - Menu burger sur mobile

4. **Messages utilisateur :**
   - Toast notifications (succès, erreur)
   - Loading spinners pendant les requêtes
   - Messages d'erreur clairs

---

## 🔧 Configuration Axios

### src/services/api.js

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor pour ajouter le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 🔑 Authentification Context

### src/context/AuthContext.jsx

```javascript
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    
    if (token && username && role) {
      setUser({ username, role, token });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const { data } = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      localStorage.setItem('role', data.role);
      setUser(data);
      navigate('/dashboard');
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.error || 'Erreur de connexion' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## 📊 Livrables Attendus

### Fin du Sprint (3 semaines)

1. ✅ Application React fonctionnelle
2. ✅ Toutes les pages implémentées :
   - Login
   - Dashboard
   - Patients (liste, formulaire, détails)
   - Analyses (liste, création, saisie, validation)
   - Utilisateurs (ADMIN)
3. ✅ RBAC fonctionnel (menu adapté, routes protégées)
4. ✅ Communication API complète
5. ✅ Design responsive
6. ✅ Code propre et commenté
7. ✅ README avec instructions de lancement

### Bonus (si temps disponible)

- [ ] Graphiques sur dashboard (Chart.js)
- [ ] Dark mode
- [ ] Formulaires plus élaborés (autocomplete, date picker)
- [ ] Notifications en temps réel
- [ ] Export Excel des listes
- [ ] Tests unitaires (Jest + React Testing Library)

---

## 🚀 Démarrage

### Backend (déjà fonctionnel)

```bash
cd backend
npm install
docker run -d --name lab-postgres \
  -e POSTGRES_USER=lab_user \
  -e POSTGRES_PASSWORD=lab_password \
  -e POSTGRES_DB=lab_db \
  -p 5432:5432 postgres:15
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Backend accessible sur : http://localhost:5000

### Frontend (à créer)

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install react-router-dom axios @mui/material @emotion/react @emotion/styled
npm run dev
```

Frontend accessible sur : http://localhost:5173

---

## 📚 Ressources Utiles

### Documentation

- **React :** https://react.dev/
- **React Router :** https://reactrouter.com/
- **Axios :** https://axios-http.com/
- **Material-UI :** https://mui.com/
- **React Hook Form :** https://react-hook-form.com/

### Swagger Backend

http://localhost:5000/api-docs

Testez tous les endpoints ici avant de les implémenter dans le frontend.

---

## ✅ Critères de Réussite du PFA

### Fonctionnel (60%)
- [ ] Application fonctionne sans erreurs
- [ ] Toutes les fonctionnalités CRUD implémentées
- [ ] RBAC respecté (permissions par rôle)
- [ ] Communication API complète
- [ ] PDF téléchargement fonctionne

### Technique (20%)
- [ ] Code propre et structuré
- [ ] Composants réutilisables
- [ ] Gestion d'état cohérente
- [ ] Gestion des erreurs

### UI/UX (10%)
- [ ] Interface intuitive
- [ ] Design responsive
- [ ] Messages utilisateur clairs
- [ ] Navigation fluide

### Documentation (10%)
- [ ] README clair
- [ ] Commentaires dans le code
- [ ] Guide d'installation

---

## 🎯 Planning Recommandé

### Semaine 1 (20-26 Déc)
- Lundi-Mardi : Setup + Login + Layout
- Mercredi-Jeudi : Dashboard + Navigation
- Vendredi : Tests et ajustements

### Semaine 2 (27 Déc - 2 Jan)
- Lundi-Mardi : Liste patients + Formulaires
- Mercredi-Jeudi : Détails patient + Historique
- Vendredi : Tests et corrections

### Semaine 3 (3-9 Jan)
- Lundi-Mardi : Gestion analyses (liste + création)
- Mercredi : Saisie résultats + Validation
- Jeudi : PDF + Tests finaux
- Vendredi : Documentation + Présentation

---

## 📞 Support

**Backend déjà implémenté :** ✅  
**Documentation complète :** Voir `/docs`  
**Swagger UI :** http://localhost:5000/api-docs  
**Comptes de test :** Voir section "Comptes de Test" ci-dessus

---

**Bon courage pour le PFA ! 🚀**

**Version :** 1.0  
**Date :** Décembre 2025
