# Schéma de Base de Données - Laboratoire d'Analyses Médicales

**SGBD :** PostgreSQL 15+  
**ORM :** Prisma 5.x  
**Schéma :** public

---

## Table des Matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Tables](#2-tables)
3. [Énumérations](#3-énumérations)
4. [Relations](#4-relations)
5. [Index](#5-index)
6. [Contraintes](#6-contraintes)
7. [Exemples de Requêtes](#7-exemples-de-requêtes)

---

## 1. Vue d'ensemble

### 1.1 Diagramme ER (Entity-Relationship)

```
┌──────────────┐
│     User     │
└──────────────┘
      │
      │ (no direct relation)
      │
┌──────────────┐         ┌─────────────────┐
│   Patient    │────────▶│ AnalysisRequest │
└──────────────┘ 1    n  └─────────────────┘
                                  │
                                  │ 1
                                  │
                                  ▼ n
                         ┌─────────────────┐         ┌───────────────┐
                         │ AnalysisResult  │────────▶│ AnalysisType  │
                         └─────────────────┘ n    1  └───────────────┘
```

### 1.2 Statistiques

| Table | Fonction | Nombre estimé d'enregistrements |
|-------|----------|--------------------------------|
| User | Gestion des comptes utilisateurs | ~10-50 |
| Patient | Informations des patients | ~1000-10000 |
| AnalysisType | Types d'analyses disponibles | ~20-100 |
| AnalysisRequest | Demandes d'analyses | ~5000-50000 |
| AnalysisResult | Résultats individuels | ~25000-250000 |

---

## 2. Tables

### 2.1 Table `User`

**Description :** Stocke les comptes utilisateurs du système (Admin, Secrétaire, Technicien, Médecin).

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | `INTEGER` | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique |
| `username` | `VARCHAR(255)` | UNIQUE, NOT NULL | Nom d'utilisateur pour connexion |
| `password_hash` | `VARCHAR(255)` | NOT NULL | Mot de passe haché (bcrypt) |
| `role` | `Role` | NOT NULL, DEFAULT 'TECHNICIAN' | Rôle de l'utilisateur (enum) |
| `createdAt` | `TIMESTAMP` | NOT NULL, DEFAULT NOW() | Date de création |
| `updatedAt` | `TIMESTAMP` | NOT NULL, AUTO_UPDATE | Date de dernière modification |

**Exemple :**
```sql
id | username   | password_hash                                          | role       | createdAt           | updatedAt
---|------------|--------------------------------------------------------|------------|---------------------|-------------------
1  | admin      | $2b$10$KfoYkTJ1H8jWr1SOWHNxNOMht59bCo5TeCYkP.11ZZ68... | ADMIN      | 2025-12-20 10:00:00 | 2025-12-20 10:00:00
2  | technician | $2b$10$abc123...                                         | TECHNICIAN | 2025-12-20 10:05:00 | 2025-12-20 10:05:00
```

**Index :**
- PRIMARY KEY sur `id`
- UNIQUE INDEX sur `username`

**Remarques :**
- Les mots de passe sont hachés avec bcrypt (10 rounds)
- Le rôle détermine les permissions dans l'application
- Pas de soft delete (suppression définitive)

---

### 2.2 Table `Patient`

**Description :** Stocke les informations personnelles des patients.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | `INTEGER` | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique |
| `fullName` | `VARCHAR(255)` | NOT NULL | Nom complet du patient |
| `dateOfBirth` | `DATE` | NOT NULL | Date de naissance |
| `gender` | `VARCHAR(10)` | NOT NULL | Genre (M/F) |
| `address` | `TEXT` | NOT NULL | Adresse complète |
| `phone` | `VARCHAR(20)` | NOT NULL | Numéro de téléphone |
| `email` | `VARCHAR(255)` | NULL | Email (optionnel) |
| `cin` | `VARCHAR(20)` | UNIQUE, NOT NULL | Carte d'identité nationale |
| `deleted` | `BOOLEAN` | NOT NULL, DEFAULT FALSE | Soft delete |
| `createdAt` | `TIMESTAMP` | NOT NULL, DEFAULT NOW() | Date de création |
| `updatedAt` | `TIMESTAMP` | NOT NULL, AUTO_UPDATE | Date de dernière modification |

**Exemple :**
```sql
id | fullName           | dateOfBirth | gender | phone        | cin      | deleted
---|--------------------|-------------|--------|--------------|----------|--------
1  | Mohammed Ben Ali   | 1985-03-15  | M      | 0612345678   | AB123456 | false
2  | Fatima El Amrani   | 1990-07-22  | F      | 0623456789   | CD234567 | false
```

**Relations :**
- `analyses` → AnalysisRequest[] (one-to-many)

**Index :**
- PRIMARY KEY sur `id`
- UNIQUE INDEX sur `cin`
- INDEX sur `fullName` (pour recherche)
- INDEX sur `deleted` (pour filtrage)

**Remarques :**
- Soft delete utilisé (`deleted = true`) pour préserver l'historique
- Le CIN est unique et obligatoire
- Email optionnel

---

### 2.3 Table `AnalysisType`

**Description :** Catalogue des types d'analyses médicales disponibles.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | `INTEGER` | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique |
| `name` | `VARCHAR(255)` | UNIQUE, NOT NULL | Nom de l'analyse |
| `unit` | `VARCHAR(50)` | NOT NULL | Unité de mesure (g/L, mg/dL, etc.) |
| `reference_min` | `FLOAT` | NOT NULL | Valeur de référence minimale |
| `reference_max` | `FLOAT` | NOT NULL | Valeur de référence maximale |
| `price` | `FLOAT` | NOT NULL | Prix de l'analyse |
| `createdAt` | `TIMESTAMP` | NOT NULL, DEFAULT NOW() | Date de création |
| `updatedAt` | `TIMESTAMP` | NOT NULL, AUTO_UPDATE | Date de dernière modification |

**Exemple :**
```sql
id | name              | unit  | reference_min | reference_max | price
---|-------------------|-------|---------------|---------------|------
1  | Glycémie          | g/L   | 0.7           | 1.1           | 50
2  | Cholestérol Total | g/L   | 1.5           | 2.0           | 60
3  | ASAT (TGO)        | UI/L  | 10            | 40            | 70
```

**Relations :**
- `results` → AnalysisResult[] (one-to-many)

**Index :**
- PRIMARY KEY sur `id`
- UNIQUE INDEX sur `name`

**Remarques :**
- Les valeurs de référence permettent de calculer `isAbnormal`
- Prix utilisé pour facturation (fonctionnalité future)

---

### 2.4 Table `AnalysisRequest`

**Description :** Demandes d'analyses pour un patient.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | `INTEGER` | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique |
| `patientId` | `INTEGER` | FOREIGN KEY, NOT NULL | Référence au patient |
| `doctorName` | `VARCHAR(255)` | NOT NULL | Nom du médecin prescripteur |
| `status` | `AnalysisStatus` | NOT NULL, DEFAULT 'PENDING' | Statut de la demande |
| `createdAt` | `TIMESTAMP` | NOT NULL, DEFAULT NOW() | Date de création |
| `updatedAt` | `TIMESTAMP` | NOT NULL, AUTO_UPDATE | Date de dernière modification |

**Exemple :**
```sql
id | patientId | doctorName          | status    | createdAt
---|-----------|---------------------|-----------|--------------------
1  | 1         | Dr. Hassan Mouline  | VALIDATED | 2025-12-15 10:00:00
2  | 2         | Dr. Amina Benjelloun| COMPLETED | 2025-12-18 14:30:00
3  | 3         | Dr. Karim El Fassi  | PENDING   | 2025-12-20 09:15:00
```

**Relations :**
- `patient` → Patient (many-to-one)
- `results` → AnalysisResult[] (one-to-many)

**Index :**
- PRIMARY KEY sur `id`
- FOREIGN KEY INDEX sur `patientId`
- INDEX sur `status` (pour filtrage)
- INDEX sur `createdAt` (pour tri chronologique)

**Remarques :**
- Une demande contient plusieurs résultats d'analyses
- Le statut évolue : PENDING → COMPLETED → VALIDATED

---

### 2.5 Table `AnalysisResult`

**Description :** Résultats individuels pour chaque type d'analyse dans une demande.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | `INTEGER` | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique |
| `requestId` | `INTEGER` | FOREIGN KEY, NOT NULL | Référence à la demande |
| `analysisTypeId` | `INTEGER` | FOREIGN KEY, NOT NULL | Type d'analyse |
| `value` | `FLOAT` | NOT NULL | Valeur mesurée |
| `isAbnormal` | `BOOLEAN` | NOT NULL, DEFAULT FALSE | Valeur hors normes |
| `createdAt` | `TIMESTAMP` | NOT NULL, DEFAULT NOW() | Date de création |
| `updatedAt` | `TIMESTAMP` | NOT NULL, AUTO_UPDATE | Date de dernière modification |

**Exemple :**
```sql
id | requestId | analysisTypeId | value | isAbnormal | updatedAt
---|-----------|----------------|-------|------------|--------------------
1  | 1         | 1              | 0.95  | false      | 2025-12-15 11:00:00
2  | 1         | 2              | 1.8   | false      | 2025-12-15 11:00:00
3  | 2         | 3              | 55    | true       | 2025-12-18 15:00:00
```

**Relations :**
- `request` → AnalysisRequest (many-to-one)
- `analysisType` → AnalysisType (many-to-one)

**Index :**
- PRIMARY KEY sur `id`
- FOREIGN KEY INDEX sur `requestId`
- FOREIGN KEY INDEX sur `analysisTypeId`
- INDEX sur `isAbnormal` (pour filtrage)

**Remarques :**
- `isAbnormal` calculé automatiquement lors de la saisie
- Comparaison : `value < reference_min OR value > reference_max`

---

## 3. Énumérations

### 3.1 Enum `Role`

**Description :** Rôles des utilisateurs du système.

| Valeur | Description | Permissions |
|--------|-------------|-------------|
| `ADMIN` | Administrateur | Toutes les opérations, gestion utilisateurs |
| `SECRETARY` | Secrétaire | CRUD patients, créer demandes d'analyses |
| `TECHNICIAN` | Technicien | Saisir résultats, mettre à jour statuts |
| `MEDECIN` | Médecin | Consulter résultats, générer PDFs |

**Définition SQL :**
```sql
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SECRETARY', 'TECHNICIAN', 'MEDECIN');
```

---

### 3.2 Enum `AnalysisStatus`

**Description :** Statuts d'une demande d'analyse.

| Valeur | Description | Transition |
|--------|-------------|------------|
| `PENDING` | En attente de résultats | État initial |
| `COMPLETED` | Résultats saisis | Après saisie par technicien |
| `VALIDATED` | Validé par biologiste | État final |

**Définition SQL :**
```sql
CREATE TYPE "AnalysisStatus" AS ENUM ('PENDING', 'COMPLETED', 'VALIDATED');
```

**Workflow :**
```
PENDING → COMPLETED → VALIDATED
```

---

## 4. Relations

### 4.1 Patient → AnalysisRequest

**Type :** One-to-Many  
**Clé étrangère :** `AnalysisRequest.patientId` → `Patient.id`  
**Cascade :** Aucune (préserver l'historique)

```sql
ALTER TABLE "AnalysisRequest"
ADD CONSTRAINT "AnalysisRequest_patientId_fkey"
FOREIGN KEY ("patientId") REFERENCES "Patient"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
```

---

### 4.2 AnalysisRequest → AnalysisResult

**Type :** One-to-Many  
**Clé étrangère :** `AnalysisResult.requestId` → `AnalysisRequest.id`  
**Cascade :** DELETE (supprimer les résultats si demande supprimée)

```sql
ALTER TABLE "AnalysisResult"
ADD CONSTRAINT "AnalysisResult_requestId_fkey"
FOREIGN KEY ("requestId") REFERENCES "AnalysisRequest"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
```

---

### 4.3 AnalysisType → AnalysisResult

**Type :** One-to-Many  
**Clé étrangère :** `AnalysisResult.analysisTypeId` → `AnalysisType.id`  
**Cascade :** RESTRICT (ne pas supprimer un type utilisé)

```sql
ALTER TABLE "AnalysisResult"
ADD CONSTRAINT "AnalysisResult_analysisTypeId_fkey"
FOREIGN KEY ("analysisTypeId") REFERENCES "AnalysisType"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
```

---

## 5. Index

### 5.1 Index Primaires (Automatiques)

- `User_pkey` sur `User(id)`
- `Patient_pkey` sur `Patient(id)`
- `AnalysisType_pkey` sur `AnalysisType(id)`
- `AnalysisRequest_pkey` sur `AnalysisRequest(id)`
- `AnalysisResult_pkey` sur `AnalysisResult(id)`

### 5.2 Index Uniques

- `User_username_key` sur `User(username)`
- `Patient_cin_key` sur `Patient(cin)`
- `AnalysisType_name_key` sur `AnalysisType(name)`

### 5.3 Index de Performance (Recommandés)

```sql
-- Recherche de patients par nom
CREATE INDEX idx_patient_fullname ON "Patient"(fullName);

-- Filtrage des patients non supprimés
CREATE INDEX idx_patient_deleted ON "Patient"(deleted);

-- Filtrage des demandes par statut
CREATE INDEX idx_request_status ON "AnalysisRequest"(status);

-- Tri chronologique des demandes
CREATE INDEX idx_request_createdat ON "AnalysisRequest"(createdAt DESC);

-- Recherche de résultats anormaux
CREATE INDEX idx_result_isabnormal ON "AnalysisResult"(isAbnormal);
```

---

## 6. Contraintes

### 6.1 Contraintes NOT NULL

Tous les champs marqués `NOT NULL` dans les définitions de tables.

### 6.2 Contraintes CHECK (Recommandées)

```sql
-- Validation du genre
ALTER TABLE "Patient"
ADD CONSTRAINT check_patient_gender
CHECK (gender IN ('M', 'F'));

-- Validation des valeurs de référence
ALTER TABLE "AnalysisType"
ADD CONSTRAINT check_reference_range
CHECK (reference_min < reference_max);

-- Validation du prix
ALTER TABLE "AnalysisType"
ADD CONSTRAINT check_positive_price
CHECK (price > 0);

-- Validation de la valeur du résultat
ALTER TABLE "AnalysisResult"
ADD CONSTRAINT check_positive_value
CHECK (value >= 0);
```

### 6.3 Contraintes de Clés Étrangères

Voir section [4. Relations](#4-relations)

---

## 7. Exemples de Requêtes

### 7.1 Créer un Patient

```sql
INSERT INTO "Patient" (
  "fullName", "dateOfBirth", "gender", "address", "phone", "email", "cin"
)
VALUES (
  'Mohammed Ben Ali',
  '1985-03-15',
  'M',
  '123 Rue de la Liberté, Casablanca',
  '0612345678',
  'mohammed@email.com',
  'AB123456'
);
```

### 7.2 Rechercher un Patient par CIN

```sql
SELECT * FROM "Patient"
WHERE "cin" = 'AB123456'
AND "deleted" = false;
```

### 7.3 Lister les Analyses en Attente

```sql
SELECT
  ar.id,
  p."fullName" AS patient_name,
  ar."doctorName",
  ar."createdAt"
FROM "AnalysisRequest" ar
JOIN "Patient" p ON ar."patientId" = p.id
WHERE ar.status = 'PENDING'
ORDER BY ar."createdAt" DESC;
```

### 7.4 Obtenir l'Historique d'un Patient

```sql
SELECT
  ar.id AS request_id,
  ar."doctorName",
  ar.status,
  ar."createdAt",
  at.name AS analysis_name,
  res.value,
  res."isAbnormal",
  at.unit,
  at."reference_min",
  at."reference_max"
FROM "AnalysisRequest" ar
JOIN "AnalysisResult" res ON res."requestId" = ar.id
JOIN "AnalysisType" at ON res."analysisTypeId" = at.id
WHERE ar."patientId" = 1
ORDER BY ar."createdAt" DESC, at.name;
```

### 7.5 Compter les Analyses par Statut

```sql
SELECT
  status,
  COUNT(*) AS count
FROM "AnalysisRequest"
GROUP BY status;
```

### 7.6 Trouver les Résultats Anormaux

```sql
SELECT
  p."fullName",
  at.name,
  res.value,
  at."reference_min",
  at."reference_max",
  ar."createdAt"
FROM "AnalysisResult" res
JOIN "AnalysisRequest" ar ON res."requestId" = ar.id
JOIN "Patient" p ON ar."patientId" = p.id
JOIN "AnalysisType" at ON res."analysisTypeId" = at.id
WHERE res."isAbnormal" = true
ORDER BY ar."createdAt" DESC;
```

### 7.7 Statistiques du Laboratoire

```sql
SELECT
  (SELECT COUNT(*) FROM "Patient" WHERE deleted = false) AS total_patients,
  (SELECT COUNT(*) FROM "AnalysisRequest") AS total_requests,
  (SELECT COUNT(*) FROM "AnalysisRequest" WHERE status = 'PENDING') AS pending_requests,
  (SELECT COUNT(*) FROM "AnalysisRequest" WHERE status = 'COMPLETED') AS completed_requests,
  (SELECT COUNT(*) FROM "AnalysisRequest" WHERE status = 'VALIDATED') AS validated_requests;
```

---

## 8. Migrations Prisma

### 8.1 Migration Initiale

```bash
npx prisma migrate dev --name init
```

### 8.2 Ajouter le Rôle MEDECIN

```bash
npx prisma migrate dev --name add_medecin_role
```

### 8.3 Voir l'Historique des Migrations

```bash
npx prisma migrate status
```

---

## 9. Prisma Schema

Le schéma complet se trouve dans `prisma/schema.prisma`.

**Commandes utiles :**
```bash
# Générer le client Prisma
npx prisma generate

# Visualiser les données
npx prisma studio

# Réinitialiser la base de données
npx prisma migrate reset

# Seeder la base de données
npx prisma db seed
```

---

## 10. Sécurité et Bonnes Pratiques

### 10.1 Sécurité

- ✅ Soft delete pour Patient (préserver l'historique)
- ✅ Contraintes de clés étrangères
- ✅ Index pour performances
- ✅ Pas de données sensibles en clair
- ✅ Validation au niveau application (Prisma + Express)

### 10.2 Performances

- ✅ Index sur colonnes de recherche fréquentes
- ✅ Pagination des résultats
- ✅ Eager loading avec Prisma (`include`)
- ✅ Transactions pour opérations multiples

### 10.3 Maintenance

```sql
-- Analyse des statistiques de table
ANALYZE "Patient";
ANALYZE "AnalysisRequest";

-- Reindexation
REINDEX TABLE "Patient";

-- Nettoyage
VACUUM FULL;
```

---

**Dernière mise à jour :** Décembre 2025  
**Version :** 1.0
