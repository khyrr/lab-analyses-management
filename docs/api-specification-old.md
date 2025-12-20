# Spécification API REST - Laboratoire d'Analyses Médicales

**Version :** 1.0  
**Base URL :** `http://localhost:5000/api`  
**Format :** JSON  
**Authentification :** JWT Bearer Token

---

## Table des Matières

1. [Authentification](#1-authentification)
2. [Gestion des Utilisateurs](#2-gestion-des-utilisateurs)
3. [Gestion des Patients](#3-gestion-des-patients)
4. [Gestion des Analyses](#4-gestion-des-analyses)
5. [Dashboard](#5-dashboard)
6. [Codes d'Erreur](#6-codes-derreur)

---

## 1. Authentification

### 1.1 POST `/auth/login`

Authentifier un utilisateur et obtenir un token JWT.

**Permissions :** Public

**Request Body :**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response 200 :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "ADMIN"
  }
}
```

**Response 401 :**
```json
{
  "error": "Identifiants invalides"
}
```

---

### 1.2 POST `/auth/register`

Créer un nouveau compte utilisateur.

**Permissions :** ADMIN uniquement

**Headers :**
```
Authorization: Bearer {token}
```

**Request Body :**
```json
{
  "username": "newuser",
  "password": "password123",
  "role": "TECHNICIAN"
}
```

**Response 201 :**
```json
{
  "message": "User created successfully",
  "userId": 5
}
```

**Response 400 :**
```json
{
  "error": "Username already exists"
}
```

---

## 2. Gestion des Utilisateurs

**Permissions :** ADMIN uniquement pour toutes les routes

### 2.1 GET `/users`

Lister tous les utilisateurs.

**Headers :**
```
Authorization: Bearer {token}
```

**Response 200 :**
```json
[
  {
    "id": 1,
    "username": "admin",
    "role": "ADMIN",
    "createdAt": "2025-12-20T10:00:00Z",
    "updatedAt": "2025-12-20T10:00:00Z"
  },
  {
    "id": 2,
    "username": "technician",
    "role": "TECHNICIAN",
    "createdAt": "2025-12-20T10:05:00Z",
    "updatedAt": "2025-12-20T10:05:00Z"
  }
]
```

---

### 2.2 GET `/users/:id`

Obtenir les détails d'un utilisateur.

**Headers :**
```
Authorization: Bearer {token}
```

**Response 200 :**
```json
{
  "id": 1,
  "username": "admin",
  "role": "ADMIN",
  "createdAt": "2025-12-20T10:00:00Z",
  "updatedAt": "2025-12-20T10:00:00Z"
}
```

**Response 404 :**
```json
{
  "error": "User not found"
}
```

---

### 2.3 PUT `/users/:id`

Mettre à jour un utilisateur.

**Headers :**
```
Authorization: Bearer {token}
```

**Request Body :**
```json
{
  "username": "updated_username",
  "role": "MEDECIN"
}
```

**Response 200 :**
```json
{
  "id": 2,
  "username": "updated_username",
  "role": "MEDECIN",
  "updatedAt": "2025-12-20T15:00:00Z"
}
```

---

### 2.4 DELETE `/users/:id`

Supprimer un utilisateur.

**Headers :**
```
Authorization: Bearer {token}
```

**Response 200 :**
```json
{
  "message": "User deleted successfully"
}
```

**Response 400 :**
```json
{
  "error": "Cannot delete your own account"
}
```

---

### 2.5 PUT `/users/:id/password`

Changer le mot de passe d'un utilisateur.

**Headers :**
```
Authorization: Bearer {token}
```

**Request Body :**
```json
{
  "newPassword": "newpassword123"
}
```

**Response 200 :**
```json
{
  "message": "Password changed successfully"
}
```

**Response 400 :**
```json
{
  "error": "Password must be at least 6 characters long"
}
```

---

## 3. Gestion des Patients

### 3.1 POST `/patients`

Créer un nouveau patient.

**Permissions :** SECRETARY, ADMIN

**Headers :**
```
Authorization: Bearer {token}
```

**Request Body :**
```json
{
  "fullName": "Mohammed Ben Ali",
  "dateOfBirth": "1985-03-15",
  "gender": "M",
  "address": "123 Rue de la Liberté, Casablanca",
  "phone": "0612345678",
  "email": "mohammed@email.com",
  "cin": "AB123456"
}
```

**Response 201 :**
```json
{
  "id": 1,
  "fullName": "Mohammed Ben Ali",
  "dateOfBirth": "1985-03-15T00:00:00Z",
  "gender": "M",
  "address": "123 Rue de la Liberté, Casablanca",
  "phone": "0612345678",
  "email": "mohammed@email.com",
  "cin": "AB123456",
  "deleted": false,
  "createdAt": "2025-12-20T10:00:00Z",
  "updatedAt": "2025-12-20T10:00:00Z"
}
```

**Response 400 :**
```json
{
  "error": "Patient with this CIN already exists"
}
```

---

### 3.2 GET `/patients`

Lister tous les patients avec pagination et recherche.

**Permissions :** Authentifié

**Headers :**
```
Authorization: Bearer {token}
```

**Query Parameters :**
- `page` (optionnel) : Numéro de page (défaut: 1)
- `limit` (optionnel) : Nombre de résultats par page (défaut: 10)
- `search` (optionnel) : Recherche par nom ou CIN

**Exemple :**
```
GET /patients?page=1&limit=10&search=Mohammed
```

**Response 200 :**
```json
{
  "data": [
    {
      "id": 1,
      "fullName": "Mohammed Ben Ali",
      "dateOfBirth": "1985-03-15T00:00:00Z",
      "gender": "M",
      "phone": "0612345678",
      "cin": "AB123456",
      "createdAt": "2025-12-20T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

---

### 3.3 GET `/patients/:id`

Obtenir les détails d'un patient.

**Permissions :** Authentifié

**Headers :**
```
Authorization: Bearer {token}
```

**Response 200 :**
```json
{
  "id": 1,
  "fullName": "Mohammed Ben Ali",
  "dateOfBirth": "1985-03-15T00:00:00Z",
  "gender": "M",
  "address": "123 Rue de la Liberté, Casablanca",
  "phone": "0612345678",
  "email": "mohammed@email.com",
  "cin": "AB123456",
  "deleted": false,
  "createdAt": "2025-12-20T10:00:00Z",
  "updatedAt": "2025-12-20T10:00:00Z"
}
```

**Response 404 :**
```json
{
  "error": "Patient not found"
}
```

---

### 3.4 PUT `/patients/:id`

Mettre à jour un patient.

**Permissions :** SECRETARY, ADMIN

**Headers :**
```
Authorization: Bearer {token}
```

**Request Body :**
```json
{
  "fullName": "Mohammed Ben Ali Updated",
  "phone": "0698765432",
  "address": "New Address"
}
```

**Response 200 :**
```json
{
  "id": 1,
  "fullName": "Mohammed Ben Ali Updated",
  "phone": "0698765432",
  "address": "New Address",
  "updatedAt": "2025-12-20T15:00:00Z"
}
```

---

### 3.5 DELETE `/patients/:id`

Supprimer un patient (soft delete).

**Permissions :** ADMIN uniquement

**Headers :**
```
Authorization: Bearer {token}
```

**Response 200 :**
```json
{
  "message": "Patient supprimé avec succès"
}
```

---

### 3.6 GET `/patients/:id/history`

Obtenir l'historique complet des analyses d'un patient.

**Permissions :** Authentifié

**Headers :**
```
Authorization: Bearer {token}
```

**Response 200 :**
```json
{
  "patient": {
    "id": 1,
    "fullName": "Mohammed Ben Ali",
    "cin": "AB123456"
  },
  "analyses": [
    {
      "id": 1,
      "doctorName": "Dr. Hassan Mouline",
      "status": "VALIDATED",
      "createdAt": "2025-12-15T10:00:00Z",
      "results": [
        {
          "id": 1,
          "analysisType": {
            "name": "Glycémie",
            "unit": "g/L"
          },
          "value": 0.95,
          "isAbnormal": false
        }
      ]
    }
  ]
}
```

---

### 3.7 GET `/patients/:id/history/pdf`

Générer et télécharger l'historique complet en PDF.

**Permissions :** MEDECIN, ADMIN

**Headers :**
```
Authorization: Bearer {token}
```

**Response 200 :**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename=historique_patient_1.pdf

[Binary PDF Data]
```

---

## 4. Gestion des Analyses

### 4.1 POST `/analyses/types`

Créer un nouveau type d'analyse.

**Permissions :** ADMIN uniquement

**Headers :**
```
Authorization: Bearer {token}
```

**Request Body :**
```json
{
  "name": "Glycémie",
  "unit": "g/L",
  "reference_min": 0.7,
  "reference_max": 1.1,
  "price": 50
}
```

**Response 201 :**
```json
{
  "id": 1,
  "name": "Glycémie",
  "unit": "g/L",
  "reference_min": 0.7,
  "reference_max": 1.1,
  "price": 50,
  "createdAt": "2025-12-20T10:00:00Z",
  "updatedAt": "2025-12-20T10:00:00Z"
}
```

---

### 4.2 GET `/analyses/types`

Lister tous les types d'analyses.

**Permissions :** Authentifié

**Headers :**
```
Authorization: Bearer {token}
```

**Response 200 :**
```json
[
  {
    "id": 1,
    "name": "Glycémie",
    "unit": "g/L",
    "reference_min": 0.7,
    "reference_max": 1.1,
    "price": 50
  },
  {
    "id": 2,
    "name": "Cholestérol Total",
    "unit": "g/L",
    "reference_min": 1.5,
    "reference_max": 2.0,
    "price": 60
  }
]
```

---

### 4.3 POST `/analyses`

Créer une nouvelle demande d'analyse.

**Permissions :** SECRETARY, ADMIN

**Headers :**
```
Authorization: Bearer {token}
```

**Request Body :**
```json
{
  "patientId": 1,
  "doctorName": "Dr. Hassan Mouline",
  "analysisTypeIds": [1, 2, 3]
}
```

**Response 201 :**
```json
{
  "id": 1,
  "patientId": 1,
  "doctorName": "Dr. Hassan Mouline",
  "status": "PENDING",
  "createdAt": "2025-12-20T10:00:00Z",
  "updatedAt": "2025-12-20T10:00:00Z"
}
```

---

### 4.4 GET `/analyses`

Lister toutes les demandes d'analyses avec filtres.

**Permissions :** Authentifié

**Headers :**
```
Authorization: Bearer {token}
```

**Query Parameters :**
- `status` (optionnel) : PENDING, COMPLETED, VALIDATED
- `patientId` (optionnel) : Filtrer par patient

**Exemple :**
```
GET /analyses?status=PENDING&patientId=1
```

**Response 200 :**
```json
[
  {
    "id": 1,
    "patientId": 1,
    "patient": {
      "fullName": "Mohammed Ben Ali",
      "cin": "AB123456"
    },
    "doctorName": "Dr. Hassan Mouline",
    "status": "PENDING",
    "createdAt": "2025-12-20T10:00:00Z",
    "results": [
      {
        "id": 1,
        "analysisType": {
          "name": "Glycémie",
          "unit": "g/L",
          "reference_min": 0.7,
          "reference_max": 1.1
        },
        "value": 0,
        "isAbnormal": false
      }
    ]
  }
]
```

---

### 4.5 PUT `/analyses/:id`

Mettre à jour une demande d'analyse.

**Permissions :** SECRETARY, ADMIN

**Headers :**
```
Authorization: Bearer {token}
```

**Request Body :**
```json
{
  "doctorName": "Dr. Updated Name",
  "patientId": 2
}
```

**Response 200 :**
```json
{
  "id": 1,
  "doctorName": "Dr. Updated Name",
  "patientId": 2,
  "updatedAt": "2025-12-20T15:00:00Z"
}
```

---

### 4.6 DELETE `/analyses/:id`

Supprimer une demande d'analyse.

**Permissions :** SECRETARY, ADMIN

**Headers :**
```
Authorization: Bearer {token}
```

**Response 200 :**
```json
{
  "message": "Analysis request deleted successfully"
}
```

---

### 4.7 PUT `/analyses/:id/results`

Saisir ou mettre à jour les résultats d'une analyse.

**Permissions :** TECHNICIAN, ADMIN

**Headers :**
```
Authorization: Bearer {token}
```

**Request Body :**
```json
{
  "results": [
    {
      "resultId": 1,
      "value": 0.95
    },
    {
      "resultId": 2,
      "value": 1.8
    }
  ]
}
```

**Response 200 :**
```json
{
  "message": "Results updated successfully"
}
```

**Note :** Le système calcule automatiquement `isAbnormal` en comparant la valeur avec `reference_min` et `reference_max`.

---

### 4.8 PATCH `/analyses/:id/status`

Mettre à jour le statut d'une demande d'analyse.

**Permissions :** TECHNICIAN, ADMIN

**Headers :**
```
Authorization: Bearer {token}
```

**Request Body :**
```json
{
  "status": "VALIDATED"
}
```

**Response 200 :**
```json
{
  "id": 1,
  "status": "VALIDATED",
  "updatedAt": "2025-12-20T15:00:00Z"
}
```

**Valeurs possibles :**
- `PENDING` : En attente de résultats
- `COMPLETED` : Résultats saisis
- `VALIDATED` : Validé par le biologiste

---

### 4.9 GET `/analyses/:id/pdf`

Générer et télécharger le rapport PDF d'une analyse.

**Permissions :** MEDECIN, ADMIN

**Headers :**
```
Authorization: Bearer {token}
```

**Response 200 :**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename=rapport_1.pdf

[Binary PDF Data]
```

**Response 404 :**
```json
{
  "error": "Analysis request not found"
}
```

---

## 5. Dashboard

### 5.1 GET `/dashboard/stats`

Obtenir les statistiques globales du laboratoire.

**Permissions :** MEDECIN, ADMIN

**Headers :**
```
Authorization: Bearer {token}
```

**Response 200 :**
```json
{
  "overview": {
    "totalPatients": 150,
    "totalUsers": 8,
    "totalAnalysisTypes": 10,
    "totalAnalysisRequests": 345
  },
  "analyses": {
    "pending": 12,
    "completed": 45,
    "validated": 288
  },
  "recent": {
    "patientsLast30Days": 15,
    "analysesLast30Days": 67
  },
  "users": {
    "byRole": {
      "ADMIN": 1,
      "SECRETARY": 2,
      "TECHNICIAN": 3,
      "MEDECIN": 2
    }
  }
}
```

---

### 5.2 GET `/dashboard/recent-activity`

Obtenir l'activité récente du laboratoire.

**Permissions :** MEDECIN, ADMIN

**Headers :**
```
Authorization: Bearer {token}
```

**Query Parameters :**
- `limit` (optionnel) : Nombre d'éléments (défaut: 10)

**Response 200 :**
```json
{
  "recentPatients": [
    {
      "type": "patient_created",
      "id": 5,
      "description": "Nouveau patient: Sanaa Bennani",
      "createdAt": "2025-12-20T14:30:00Z"
    }
  ],
  "recentAnalyses": [
    {
      "type": "analysis_request",
      "id": 12,
      "description": "Demande d'analyse pour Mohammed Ben Ali - Statut: PENDING",
      "createdAt": "2025-12-20T14:00:00Z"
    }
  ],
  "recentResults": [
    {
      "type": "result_updated",
      "id": 45,
      "description": "Résultat mis à jour: Glycémie pour Fatima Zahra El Amrani",
      "updatedAt": "2025-12-20T13:45:00Z"
    }
  ]
}
```

---

## 6. Codes d'Erreur

| Code | Message Type | Description |
|------|-------------|-------------|
| **200** | OK | Succès (GET, PUT, PATCH) |
| **201** | Created | Ressource créée avec succès (POST) |
| **400** | Bad Request | Validation échouée, données invalides |
| **401** | Unauthorized | Non authentifié (token manquant ou invalide) |
| **403** | Forbidden | Permissions insuffisantes |
| **404** | Not Found | Ressource inexistante |
| **500** | Internal Server Error | Erreur serveur |

---

## 7. Authentication Header

Toutes les routes protégées nécessitent un header d'authentification :

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Le token JWT est obtenu via `/api/auth/login` et est valide pendant 24 heures.

---

## 8. CORS

L'API accepte les requêtes depuis :
- `http://localhost:5173` (Frontend développement)
- Production origins (à configurer)

---

## 9. Rate Limiting

**Non implémenté actuellement** mais recommandé pour la production :
- 100 requêtes par minute par IP
- 1000 requêtes par heure par IP

---

## 10. Documentation Interactive

**Swagger UI disponible à :** `http://localhost:5000/api-docs`

Permet de tester tous les endpoints directement depuis le navigateur.

---

**Dernière mise à jour :** Décembre 2025  
**Version :** 1.0
