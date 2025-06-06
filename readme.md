
# 💤 Rest_And_Sleep

**Rest_And_Sleep** est une application de gestion de réservations d'hôtels.  
Elle se compose de deux parties distinctes :
- une API REST sécurisée en **Node.js + MySQL**
- une interface utilisateur de démonstration en **Electron + Bootstrap**

> 🛡️ Ce projet a été réalisé dans le cadre du BTS SIO (option SLAM).

---

## 📁 Structure du projet

```
rest_and_sleep/
├── rest_and_sleep_api/         → API Node.js (Express, MySQL, JWT)
└── rest_and_sleep_electron/    → Interface de démonstration Electron
```

---

## 🔧 Technologies utilisées

| Stack Backend       | Stack Frontend         | Divers                    |
|---------------------|------------------------|---------------------------|
| Node.js / Express   | Electron.js            | JWT (authentification)    |
| MySQL               | Bootstrap              | Dotenv                    |
| bcrypt              | HTML/CSS/JS            | Postman (tests API)       |

---

## 🔐 Authentification

L'application utilise une **authentification par JSON Web Token (JWT)**.  
Chaque route sensible vérifie les rôles (utilisateur, manager, PDG) grâce au middleware d'authentification.

---

## 📦 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/mon-compte/rest_and_sleep.git
cd rest_and_sleep
```

### 2. Installer l’API

```bash
cd rest_and_sleep_api
npm install
```

> Configurer le fichier `.env` avec les identifiants de connexion MySQL et la clé JWT.

### 3. Lancer l’API

```bash
npm start
```

Elle sera disponible sur `http://localhost:3000`.

---

### 4. Installer et lancer l'interface Electron

```bash
cd ../rest_and_sleep_electron
npm install
npx electron .
```

---

## 📋 Fonctionnalités principales

| Fonction                       | API        | Electron UI |
|--------------------------------|------------|-------------|
| 🔐 Connexion / Inscription    | ✔️         | ✔️          |
| 👤 Gestion utilisateurs       | ✔️ (CRUD)  | (en cours)  |
| 🏨 Gestion hôtels             | ✔️ (CRUD)  | (en cours)  |
| 🛏️ Gestion chambres           | ✔️ (CRUD)  | (en cours)  |
| 📅 Gestion réservations       | ✔️ (CRUD)  | (en cours)  |
| 🔒 Rôles et permissions       | ✔️         | (en cours)  |
| 📜 Affichage des logs         | ✔️         | (en cours)  |

---

## 📁 Base de données

### Tables principales :
- `utilisateurs` (avec rôles)
- `hotels`
- `chambres`
- `reservations`
- `roles`
- `statuts`
- `logs` *(optionnel)*

---

## 🔒 Sécurité

- Hashage des mots de passe avec **bcrypt**
- Authentification avec **JWT**
- Contrôle d’accès selon les rôles (user / manager / PDG)
- Vérifications des conflits de réservation

---

## 🙋‍♂️ Auteur

- **Nom** : Lucas SIEURIN VALLERY
- **Classe** : BTS SIO 2 - SLAM
- **Projet soutenu en juin 2025**
