# 📚 GUIDE COMPLET D'UTILISATION - EPHEMERAL LABS

## 🎯 Table des Matières

1. [Installation](#installation)
2. [Démarrage Rapide](#démarrage-rapide)
3. [Guide Utilisateur](#guide-utilisateur)
4. [Guide Administrateur](#guide-administrateur)
5. [API Reference](#api-reference)
6. [Troubleshooting](#troubleshooting)

---

## 📥 Installation

### Option 1: Avec Makefile (Recommandé)

```bash
# Installation complète
make setup

# Ou étapes individuelles
make install        # Installer les dépendances
make db-init        # Initialiser la base de données
make db-seed        # Ajouter les données de démonstration
```

### Option 2: Manuelle

**Backend:**
```bash
cd backend
npm install
node init-db.js
node seed-db.js
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Option 3: Docker

```bash
# Lancer tous les services
docker-compose up -d

# Ou avec Makefile
make prod
```

---

## 🚀 Démarrage Rapide

### Étape 1: Démarrer l'Application

```bash
# Option A: Makefile
make prod

# Option B: Docker direct
docker-compose up -d

# Option C: Développement
make dev
```

### Étape 2: Accéder à l'Application

Ouvrir votre navigateur:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001

### Étape 3: Se Connecter

```
Email: admin
Password: admin123
Role: Admin
```

### Étape 4: Créer votre Premier Lab

1. Aller au **Dashboard**
2. Sélectionner un **Type de Lab** (RHCSA, Docker, Kubernetes, etc.)
3. Cliquer **"Launch Lab"**
4. Attendre le démarrage (~15 secondes)
5. Copier la commande SSH

---

## 👨‍🎓 Guide Utilisateur

### 🔑 Authentification

#### Se Connecter

```
1. Accéder à http://localhost:3000
2. Entrer vos identifiants
3. Cliquer "Login"
```

Le JWT est sauvegardé dans `localStorage` et utilisé pour les requêtes API.

#### Se Déconnecter

```
Cliquer le bouton "Logout" en haut à droite
```

### 📊 Dashboard

Le dashboard montre:

1. **Quotas** - Vos limites de ressources
   ```
   ┌─────────────────┐
   │ Labs  [████░] 3/10
   │ CPU   [████░] 8/32
   │ RAM   [████░] 16/64GB
   │ Storage [██░░░░░] 40/500GB
   └─────────────────┘
   ```

2. **Mes Labs** - Liste des labs actifs
   ```
   ┌─────────────────────────────────────────────────┐
   │ Type    │ IP           │ Status  │ SSH Command │
   ├─────────────────────────────────────────────────┤
   │ Docker  │ 192.168.122.10 │ Running │ Copy      │
   │ RHCSA   │ 192.168.122.11 │ Booting │ Copy      │
   └─────────────────────────────────────────────────┘
   ```

3. **Créer Lab** - Formulaire de création
   ```
   ┌──────────────────────────────┐
   │ Type: [RHCSA ▼]              │
   │ CPU: 2 | RAM: 2GB | SSD: 20GB│
   │                 [Launch Lab] │
   └──────────────────────────────┘
   ```

### 🧪 Créer un Lab

#### Types de Labs Disponibles

| Type | CPU | RAM | Storage | Durée | Cas d'Usage |
|------|-----|-----|---------|-------|------------|
| **RHCSA** | 2 | 2GB | 20GB | 2h | Certification Linux |
| **Docker** | 4 | 4GB | 30GB | 3h | Containers |
| **Kubernetes** | 4 | 8GB | 50GB | 4h | Orchestration |
| **CTF** | 2 | 2GB | 20GB | 2h | Hacking/Sécurité |
| **Terraform** | 4 | 4GB | 30GB | 3h | Infrastructure as Code |
| **Ansible** | 2 | 3GB | 25GB | 2h | Configuration Management |

#### Procédure Complète

```
1. SÉLECTIONNER TYPE
   └─ Dropdown "Type de Lab"
      └─ Voir les specs de chaque type

2. VÉRIFIER QUOTAS
   └─ Vérifier que vous avez assez de ressources
   └─ Exemple: Pour Docker → besoin 4 CPU, 4GB RAM

3. LANCER
   └─ Cliquer "Launch Lab"
   └─ Affichage: "Creating..."

4. ATTENDRE
   └─ Temps: ~15 secondes (MOCK) / ~2-3 min (réel Proxmox)
   └─ Statut: booting → running

5. ACCÉDER
   └─ IP s'affiche automatiquement
   └─ Copier la commande SSH
   └─ ssh root@192.168.122.X
```

### 🖥️ Se Connecter via SSH

Une fois le lab démarré:

```bash
# 1. Copier la commande SSH depuis le dashboard
# Ou manuellement:
ssh root@192.168.122.10

# 2. Mot de passe par défaut
password: ephemeral-labs  # À personnaliser

# 3. Vous êtes dans la VM!
$ whoami
root

$ uname -a
Linux lab-ubuntu 5.15.0-...
```

### ⚙️ Gérer vos Labs

#### Voir les Détails

```bash
# Dans le dashboard, section "My Labs"
# Cliquer sur une ligne pour voir les détails
```

#### Copier la Commande SSH

```bash
# Cliquer le bouton "Copy" à côté de la commande SSH
# Puis coller: Ctrl+V
```

#### Détruire un Lab

```bash
# Cliquer le bouton "Delete" ou "Destroy"
# Confirmer: "Are you sure?"

# Effet:
# - VM est supprimée immédiatement
# - Ressources sont libérées
# - Lab disparaît de la liste
```

#### Consulter vos Quotas

```
Dashboard → Section "Your Quotas"
├─ Labs: X/10 utilisés
├─ CPU: X/32 vCores utilisés
├─ RAM: X/64 GB utilisés
└─ Storage: X/500 GB utilisés

# Barres de couleur:
├─ Vert:  < 70% (OK)
├─ Orange: 70-90% (Attention)
└─ Rouge:  > 90% (Limite proche!)
```

---

## 👑 Guide Administrateur

### 🔐 Accès Admin

**Identifiants Admin:**
```
Username: admin
Password: admin123
Role: Admin
```

Une fois connecté en tant qu'admin, vous verrez le **Admin Panel** au lieu du Dashboard.

### 📋 Admin Panel

#### Onglet 1: Utilisateurs (👥 Users)

```
├─ Liste de tous les utilisateurs
├─ Colonnes:
│  ├─ ID
│  ├─ Username
│  ├─ Email
│  ├─ Role (student/admin)
│  ├─ Status (Active/Inactive)
│  ├─ Date de création
│  └─ Actions (Edit)
└─ Actions:
   └─ Edit Quotas (bouton)
```

**Tâches:**

1. **Ajouter un Utilisateur**
   ```bash
   # Via API
   curl -X POST http://localhost:3001/api/admin/users \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{
       "username": "alice",
       "email": "alice@example.com",
       "password": "secure123",
       "role": "student"
     }'
   ```

2. **Modifier les Quotas**
   ```bash
   # Interface: Click Edit
   # Ou via API
   curl -X PUT http://localhost:3001/api/admin/quotas/1 \
     -H "Authorization: Bearer <token>" \
     -d '{
       "max_labs": 5,
       "max_cpu": 16,
       "max_memory_gb": 32,
       "max_storage_gb": 200
     }'
   ```

3. **Désactiver un Utilisateur**
   ```bash
   # Interface: Status → Inactive
   # Utilisateur ne peut plus créer de labs
   ```

#### Onglet 2: Labs (💻 All Labs)

```
├─ Liste de TOUS les labs du système
├─ Filtré par: User ID, Type, Status
├─ Colonnes:
│  ├─ ID
│  ├─ User ID (Qui a créé)
│  ├─ Type (RHCSA, Docker, etc.)
│  ├─ IP Address
│  ├─ VMID (Proxmox)
│  ├─ Status (Running/Destroyed)
│  ├─ Date de création
│  └─ Date de destruction
└─ Fonctionnalités:
   └─ Recherche et filtrage
   └─ Export (CSV)
```

**Tâches:**

1. **Voir les Labs d'un Utilisateur**
   ```bash
   # Filtrer par "User ID"
   # Ou via API
   curl http://localhost:3001/api/admin/labs?user_id=2 \
     -H "Authorization: Bearer <token>"
   ```

2. **Forcer la Destruction d'un Lab**
   ```bash
   # Interface: Click "Terminate"
   # Ou via API
   curl -X DELETE http://localhost:3001/api/admin/labs/lab-id \
     -H "Authorization: Bearer <token>"
   ```

3. **Voir les Statistiques**
   ```
   # Stats en temps réel:
   ├─ Total des users
   ├─ Total des labs actifs
   ├─ Ressources utilisées
   └─ Ressources disponibles
   ```

### 🔧 Maintenance

#### Initialiser la Base de Données

```bash
make db-init
```

#### Ajouter des Données de Démo

```bash
make db-seed
```

#### Réinitialiser Complètement

```bash
make db-reset  # ⚠️ Supprime TOUT
```

#### Sauvegarder la Base de Données

```bash
make backup
```

Les fichiers sont sauvegardés dans `backups/labs-YYYYMMDD-HHMMSS.db`

### 📊 Monitoring

#### Voir les Logs

```bash
# Tous les logs
make logs

# Logs API uniquement
make logs-api

# Logs Frontend uniquement
make logs-frontend
```

#### Vérifier la Santé du Système

```bash
make health-check
```

Affiche:
```
Frontend HTTP Status: 200
Backend HTTP Status: 200
Docker containers: RUNNING
```

#### Voir les Statistiques Docker

```bash
make status
```

Affiche:
```
CONTAINER ID  NAME            STATUS        CPU%    MEM
xxxxx         api             Up 2 hours    0.1%    45MB
xxxxx         frontend        Up 2 hours    0.0%    35MB
xxxxx         redis           Up 2 hours    0.0%    12MB
```

---

## 🔌 API Reference

### 📝 Format des Requêtes

Toutes les requêtes nécessitent le header:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### 🔑 Authentication Endpoints

#### Login
```
POST /api/auth/login

Request:
{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@lab.local",
    "role": "admin"
  },
  "expires_in": "24h"
}
```

#### Get Current User
```
GET /api/auth/me

Response:
{
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@lab.local",
    "role": "admin"
  }
}
```

### 🧪 Lab Endpoints

#### Create Lab
```
POST /api/labs

Request:
{
  "lab_type": "docker"
}

Response:
{
  "id": "uuid",
  "vmid": 310,
  "ip_address": "192.168.122.10",
  "hostname": "lab-admin-1234567890",
  "status": "booting",
  "ssh_command": "ssh root@192.168.122.10",
  "lab_type": "docker"
}
```

#### List My Labs
```
GET /api/labs

Response:
{
  "data": [
    {
      "id": "uuid",
      "user_id": 1,
      "lab_type": "docker",
      "vmid": 310,
      "ip_address": "192.168.122.10",
      "hostname": "lab-admin-1234567890",
      "resource_cpu": 4,
      "resource_memory_gb": 4,
      "resource_storage_gb": 30,
      "created_at": "2026-05-20T10:30:00Z",
      "destroyed_at": null
    }
  ]
}
```

#### Get Lab Details
```
GET /api/labs/:id

Response:
{
  "data": {
    "id": "uuid",
    ...
  }
}
```

#### Delete Lab
```
DELETE /api/labs/:id

Response:
{
  "message": "Lab destroyed successfully"
}
```

### 📊 Quota Endpoints

#### Get My Quotas
```
GET /api/quotas

Response:
{
  "max_labs": 10,
  "max_cpu": 32,
  "max_memory_gb": 64,
  "max_storage_gb": 500,
  "used_labs": 2,
  "used_cpu": 8,
  "used_memory_gb": 8,
  "used_storage_gb": 60,
  "available_labs": 8,
  "available_cpu": 24,
  "available_memory_gb": 56,
  "available_storage_gb": 440
}
```

### 👑 Admin Endpoints

#### List All Users
```
GET /api/admin/users

Response:
{
  "data": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@lab.local",
      "role": "admin",
      "active": 1,
      "created_at": "2026-05-20T10:00:00Z"
    }
  ]
}
```

#### List All Labs
```
GET /api/admin/labs

Response:
{
  "data": [
    {
      "id": "uuid",
      "user_id": 1,
      "lab_type": "docker",
      "vmid": 310,
      "ip_address": "192.168.122.10",
      "created_at": "2026-05-20T10:30:00Z",
      "destroyed_at": null
    }
  ]
}
```

### ⚕️ Health Endpoint

#### Check API Status
```
GET /api/health

Response:
{
  "status": "ok",
  "timestamp": "2026-05-20T10:00:00Z"
}
```

---

## 🔍 Troubleshooting

### ❌ Problème: "Cannot login"

**Cause:** Identifiants incorrects ou base de données non initialisée

**Solution:**
```bash
# 1. Vérifier la base de données
ls -la data/labs.db

# 2. Si absent, initialiser
make db-init
make db-seed

# 3. Essayer: admin / admin123
```

### ❌ Problème: "Port 3000 ou 3001 déjà utilisé"

**Solution:**
```bash
# Linux/Mac
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Ou changer les ports dans docker-compose.yml
```

### ❌ Problème: "Lab creation fails"

**Cause possible:** Quotas dépassés

**Solution:**
```bash
# Vérifier les quotas
curl http://localhost:3001/api/quotas \
  -H "Authorization: Bearer <token>"

# Admin: Augmenter les quotas
# Ou: Détruire un lab existant
```

### ❌ Problème: "Cannot connect to VM"

**Cause:** VM n'a pas d'IP assignée

**Solution:**
```bash
# 1. Vérifier l'IP
# Dans le dashboard, vérifier si l'IP s'affiche

# 2. Attendre le DHCP
# Peut prendre 1-2 minutes en mode réel Proxmox

# 3. Vérifier manuellement
ssh -i <key> root@192.168.122.X

# 4. Voir les logs
make logs-api
```

### ❌ Problème: "Docker containers not starting"

**Solution:**
```bash
# 1. Vérifier Docker
docker ps

# 2. Voir les erreurs
docker-compose logs

# 3. Nettoyer et redémarrer
make clean
make prod
```

### ❌ Problème: "API error 401 Unauthorized"

**Cause:** Token expiré ou invalide

**Solution:**
```bash
# 1. Se déconnecter
# Cliquer "Logout"

# 2. Se reconnecter
# Username: admin
# Password: admin123

# 3. Le nouveau token sera sauvegardé
```

### ✅ Problème: "Tout ne fonctionne pas"

**Debug complet:**
```bash
# 1. Vérifier les services
make health-check

# 2. Voir tous les logs
make logs

# 3. Vérifier les fichiers
make info

# 4. Faire un redémarrage complet
make restart

# 5. Si toujours pas bon
make clean
make prod
```

---

## 📖 Exemples d'Utilisation

### Exemple 1: Créer un Lab RHCSA et S'y Connecter

```bash
# 1. Ouvrir http://localhost:3000
# 2. Se connecter: admin / admin123

# 3. Dans le dashboard:
# - Sélectionner type: RHCSA
# - Cliquer "Launch Lab"
# - Attendre ~15s

# 4. Copier la commande SSH
# - ssh root@192.168.122.10

# 5. Se connecter:
ssh root@192.168.122.10
password: ephemeral-labs

# 6. Vous êtes dans le lab!
$ cat /etc/redhat-release
Red Hat Enterprise Linux 9

# 7. Revenir au dashboard et détruire le lab
# - Cliquer "Delete"
```

### Exemple 2: Admin - Ajouter un Utilisateur

```bash
# Option 1: Via API
curl -X POST http://localhost:3001/api/admin/users \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice",
    "email": "alice@example.com",
    "password": "password123",
    "role": "student"
  }'

# Option 2: Via Interface
# Admin Panel → Users → New User
```

### Exemple 3: Créer 3 Labs Différents

```bash
# Lab 1: Docker
# - Type: Docker
# - Resources: 4 CPU, 4GB RAM
# - Purpose: Apprendre Docker

# Lab 2: Kubernetes
# - Type: Kubernetes
# - Resources: 4 CPU, 8GB RAM
# - Purpose: Apprendre K8s

# Lab 3: Ansible
# - Type: Ansible
# - Resources: 2 CPU, 3GB RAM
# - Purpose: Apprendre Ansible

# Total utilisé: 10 CPU, 15 GB RAM
# Vérifier les quotas restants dans le dashboard
```

---

## 🎓 Bonnes Pratiques

### ✅ À Faire

- ✅ Détruire les labs non utilisés pour libérer des ressources
- ✅ Vérifier vos quotas avant de créer un lab
- ✅ Utiliser des noms significatifs pour les labs
- ✅ Sauvegarder les données importantes avant de détruire
- ✅ Communiquer avec les admins si vous avez besoin de quotas plus élevés

### ❌ À Ne Pas Faire

- ❌ Ne pas laisser des labs tournant inutilement
- ❌ Ne pas essayer d'accéder à d'autres VMs
- ❌ Ne pas modifier les fichiers système Proxmox
- ❌ Ne pas partager vos identifiants

---

## 📞 Support

### Obtenir de l'Aide

1. **Consulter ce guide**
2. **Vérifier les logs**
   ```bash
   make logs
   ```
3. **Contacter un administrateur**
   - Email: admin@example.com
   - Slack: #lab-support

### Reporter un Problème

```markdown
1. Décrire le problème
2. Fournir les logs (make logs)
3. Indiquer les étapes à reproduire
4. Donner votre navigateur/OS
```

---

## 🎉 Conclusion

Vous êtes maintenant prêt à:
- ✅ Installer l'application
- ✅ Créer et gérer vos labs
- ✅ Utiliser l'API
- ✅ Administrer le système

**Bon apprentissage! 🚀**

---

**Version:** 2.0.0  
**Date:** May 20, 2026  
**Status:** Production Ready ✅
