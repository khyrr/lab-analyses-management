# Cahier des Charges – Application de gestion d’un laboratoire d’analyses médicales

---

## 1. Contexte du projet
Les laboratoires médicaux gèrent quotidiennement un grand nombre de patients et de demandes d’analyses.  
Le projet consiste à développer un **site web** permettant de centraliser et automatiser la gestion des patients, des analyses et des résultats.

---

## 2. Objectif général
Développer un site web qui permet :  
- La gestion des patients et de leurs analyses  
- L’enregistrement et la consultation des résultats  
- La génération de rapports PDF pour les patients et médecins

---

## 3. Objectifs spécifiques
- Suivre l’historique complet des analyses d’un patient  
- Permettre aux secrétaires de gérer les demandes d’analyses  
- Permettre aux techniciens de saisir les résultats  
- Permettre aux médecins de consulter les résultats et générer des rapports

---

## 4. Acteurs du système

| Acteur        | Rôle                     | Actions principales                                   |
|---------------|--------------------------|------------------------------------------------------|
| Secrétaire    | Gestion des patients et analyses | Ajouter/modifier/supprimer patients, créer demandes d’analyses |
| Technicien    | Saisie des résultats     | Entrer les résultats des analyses dans le système   |
| Médecin       | Consultation             | Consulter les résultats et générer rapports PDF     |
| Administrateur| Gestion système          | Gestion des comptes utilisateurs et permissions     |

---

## 5. Fonctionnalités principales

### 5.1 Gestion des patients et analyses
- Ajouter, modifier et supprimer un patient  
- Créer et suivre les demandes d’analyses  
- Historique complet des analyses par patient  

### 5.2 Enregistrement et consultation des résultats
- Saisie des résultats par les techniciens  
- Consultation des résultats par les médecins  

### 5.3 Génération de rapports médicaux
- Génération automatique de rapports PDF pour chaque patient  
- Possibilité d’exporter l’historique complet  

---

## 6. Technologies prévues
- **Backend :** Java + Spring Boot (REST API)  
- **Frontend :** Framework moderne (React, Angular ou Vue.js)  
- **Base de données :** MySQL  
- **Génération PDF :** iTextPDF (côté serveur)  
- **Méthodologie :** Agile (SCRUM)  
- **Gestion du projet :** GitHub + GitHub Projects (Kanban)  

---

## 7. Organisation du travail (Scrum)
**Équipe :** 3 développeurs  

**Rôles :**  
- Product Owner : ---  
- Scrum Master : ---  
- Développeurs : ---  

**Sprints :**  
- **Sprint 1 : Planification & Conception** – Cahier des charges, diagrammes UML, architecture globale  
- **Sprint 2 : Backend & Base de données** – CRUD Patients, connexion MySQL, création API REST  
- **Sprint 3 : Module Analyses & Résultats** – Saisie et consultation des analyses via API, authentification utilisateurs  
- **Sprint 4 : Frontend & PDF + Tests** – Interface web moderne, génération PDF, tests finaux  

---

## 8. Livrables
- Cahier des charges  
- Diagrammes UML (cas d’utilisation, classes, séquence)  
- Code source Spring Boot (backend)  
- Code source frontend (React/Angular/Vue)  
- Base de données MySQL  
- Documentation technique et utilisateur  
- Rapport PDF final  

---

## 9. Contraintes
- Confidentialité et sécurité des données médicales  
- Interface intuitive et responsive pour chaque rôle  
- Respect du calendrier du projet  

---

## 10. Planning prévisionnel

| Sprint   | Durée       | Objectif principal                                  |
|----------|------------|-----------------------------------------------------|
| Sprint 1 | 1–2 semaines | Cahier des charges + UML + architecture           |
| Sprint 2 | 2 semaines  | Backend + Base de données + API REST              |
| Sprint 3 | 2 semaines  | Module Analyses + Résultats + Authentification    |
| Sprint 4 | 2 semaines  | Frontend web + PDF + Tests finaux                  |
