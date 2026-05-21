# 🚀 LabOrchestrator

**Plateforme d'apprentissage pour créer et gérer des labs éphémères sur Proxmox VE**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue)](https://www.docker.com/)
[![Proxmox](https://img.shields.io/badge/Proxmox-VE%208.0+-orange)](https://www.proxmox.com/)

---

## ✨ Fonctionnalités

- ✅ **Création rapide** de labs éphémères (VM temporaires)
- ✅ **Gestion des quotas** par utilisateur (CPU, RAM, Storage)
- ✅ **Interface web** intuitive et responsive
- ✅ **Intégration Proxmox API** pour provisionner les VMs
- ✅ **Authentification JWT** avec contrôle d'accès
- ✅ **Audit logging** de toutes les actions
- ✅ **6 templates de labs** (RHCSA, Docker, Kubernetes, CTF, Terraform, Ansible)

---

## 📖 Documentation

### **🚀 Premiers Pas (LIRE EN PREMIER!)**

| Document | Contenu | Durée |
|----------|---------|-------|
| **[INDEX.md](INDEX.md)** | Où trouver ce que vous cherchez 🗂️ | 5 min |
| **[GETTING_STARTED.md](GETTING_STARTED.md)** | Démarrage en 5 minutes ⚡ | 5 min |
| **[INSTALL.md](INSTALL.md)** | Installation complète (Docker/Local) 📥 | 30 min |
| **[USAGE.md](USAGE.md)** | Guide d'utilisation quotidienne 📖 | 20 min |

### **📚 Documentation Complète**

| Document | Contenu |
|----------|---------|
| **[docs/USAGE_GUIDE.md](docs/USAGE_GUIDE.md)** | Guide complet + API référence |
| **[docs/ARCHITECTURE_CHOICE.md](docs/ARCHITECTURE_CHOICE.md)** | 2 architectures déploiement |
| **[docs/PROXMOX_ISO_DOWNLOAD_UPLOAD.md](docs/PROXMOX_ISO_DOWNLOAD_UPLOAD.md)** | Télécharger/uploader ISO |
| **[docs/PROXMOX_TEMPLATES_CREATION.md](docs/PROXMOX_TEMPLATES_CREATION.md)** | Créer les 6 templates |
| **[docs/SERVER_VM_SETUP.md](docs/SERVER_VM_SETUP.md)** | Setup serveur Proxmox |
| **[docs/DOCUMENTATION_INDEX.md](docs/DOCUMENTATION_INDEX.md)** | Index docs ancien (voir INDEX.md) |
| **[docs/QUICKSTART.md](docs/QUICKSTART.md)** | Démarrage rapide |

---

## 🚀 Démarrage rapide

### **Impatient? ⚡ Lire [GETTING_STARTED.md](GETTING_STARTED.md) (5 min)**

### **Installation complète? 📥 Lire [INSTALL.md](INSTALL.md) (30 min)**

---

### **TL;DR - 3 commandes**

```bash
# 1. Cloner
git clone https://github.com/Tom-rib/LabOrchestrator.git
cd LabOrchestrator

# 2. Démarrer
docker-compose up -d

# 3. Accéder
# http://localhost:3000
# Login: admin / admin123
```

**C'est tout!** ✨ Attendez 30 sec pour l'initialization de la base de données.

### **Prérequis**
- Git
- Docker + Docker Compose
- Node.js 18+ (si mode local)

---

## 🛠️ Architecture

```
┌─────────────────────────────────────────────┐
│            Frontend (React)                 │
│   Dashboard • Admin Panel • Auth UI         │
│            (Port 3000)                      │
└──────────────────┬──────────────────────────┘
                   │ HTTP/REST
┌──────────────────▼──────────────────────────┐
│            Backend (Node.js)                │
│   API • Auth • Quotas • Proxmox Integration│
│            (Port 3001)                      │
└──────────────────┬──────────────────────────┘
                   │ API calls
┌──────────────────▼──────────────────────────┐
│       Proxmox VE (Hypervisor)              │
│   VM Templates (VMID 100-105)              │
│   Lab VMs (VMID 300-999)                   │
│       (VM Cloning + Cloud-init)            │
└─────────────────────────────────────────────┘
```

---

## 📁 Structure du projet

```
LabOrchestrator/
├── 📂 backend/              # API Node.js + Express
│   ├── server.js            # Point d'entrée
│   ├── auth.js              # Authentification JWT
│   ├── quotas.js            # Gestion des quotas
│   ├── proxmox-integration.js  # API Proxmox
│   ├── package.json
│   ├── Dockerfile
│   └── scripts/             # Scripts DB
│
├── 📂 frontend/             # Interface React
│   ├── src/
│   │   ├── LoginPage.jsx    # Page connexion
│   │   ├── Dashboard.jsx    # Dashboard étudiant
│   │   ├── AdminPanel.jsx   # Panel admin
│   │   └── App.jsx          # Routing
│   ├── package.json
│   ├── vite.config.js
│   ├── Dockerfile
│   └── index.html
│
├── 📂 docs/                 # Documentation
│   ├── QUICKSTART.md
│   ├── USAGE_GUIDE.md
│   ├── ARCHITECTURE_CHOICE.md
│   └── ...
│
├── 📂 scripts/              # Scripts utilitaires
│   └── ...
│
├── docker-compose.yml       # Orchestration services
├── Makefile                 # Automatisation
├── .env                     # Configuration
└── README.md               # Ce fichier
```

---

## 🎯 Cas d'usage

### **Étudiant**
1. Se connecter au dashboard
2. Sélectionner un type de lab
3. VM provisionnée automatiquement
4. Accéder via SSH
5. Lab détruit après utilisation

### **Admin**
1. Voir tous les utilisateurs
2. Gérer les quotas
3. Monitorier les labs actifs
4. Voir les logs d'audit

---

## 🔐 Sécurité

- ✅ Authentification JWT (24h expiry)
- ✅ Bcrypt password hashing
- ✅ CORS configuré
- ✅ Helmet security headers
- ✅ Quotas enforcement
- ✅ Audit logging complet

---

## 🐳 Docker

```bash
# Démarrer tout
docker-compose up -d

# Arrêter
docker-compose down

# Logs
docker-compose logs -f api

# Réinitialiser
docker-compose down -v
docker-compose up -d
```

---

## 📊 Commandes Makefile

```bash
make help            # Voir toutes les commandes
make setup           # Setup initial
make dev             # Développement local
make prod            # Production Docker
make logs            # Afficher les logs
make health-check    # Vérifier la santé
make db-reset        # Réinitialiser la base
```

---

## 🌍 Déploiement

### **Architecture 1: Tout sur Proxmox** (Simple)
```
1 serveur Proxmox
- Proxmox VE (hypervisor)
- Docker (backend + frontend)
- Templates VMs + Labs
```
**Setup: 1 heure | Utilisateurs: jusqu'à 100**

### **Architecture 2: Séparation** (Production)
```
2+ serveurs
- Serveur 1: Proxmox VE
- Serveur 2: Application + API
- Optionnel: Serveur 3 PostgreSQL
```
**Setup: 2-3 heures | Utilisateurs: 100+**

👉 **Voir [docs/ARCHITECTURE_CHOICE.md](docs/ARCHITECTURE_CHOICE.md) pour détails**

---

## 🚨 Troubleshooting

### Docker ne démarre pas
Voir → [INSTALL.md#-troubleshooting-installation](INSTALL.md#-troubleshooting-installation)

### Backend API ne répond pas
Voir → [INSTALL.md#-troubleshooting-installation](INSTALL.md#-troubleshooting-installation)

### Frontend blanc
Voir → [INSTALL.md#-troubleshooting-installation](INSTALL.md#-troubleshooting-installation)

### Problèmes Proxmox
Voir → [docs/SERVER_VM_SETUP.md](docs/SERVER_VM_SETUP.md)

---

## 👥 Par Rôle

### **👨‍🎓 Je suis étudiant**
👉 Lire: [USAGE.md#pour-les-étudiants](USAGE.md#pour-les-étudiants)
- Créer un lab
- Voir mes quotas
- Accéder via SSH

### **👨‍💼 Je suis administrateur**
👉 Lire: [USAGE.md#pour-les-admins](USAGE.md#pour-les-admins)
- Admin Panel
- Gérer utilisateurs
- Modifier quotas

### **🖥️ Je suis DevOps**
👉 Lire: [docs/ARCHITECTURE_CHOICE.md](docs/ARCHITECTURE_CHOICE.md)
- Quelle architecture choisir?
- Setup Proxmox
- Déploiement production

---

## 📋 Checklist déploiement

- [ ] Docker Desktop installé
- [ ] `.env` configuré
- [ ] `docker-compose up -d` lancé
- [ ] http://localhost:3000 accessible
- [ ] Login avec admin/admin123 OK
- [ ] Dashboard affiche les quotas
- [ ] Proxmox configuré (si labs réels)
- [ ] 6 templates créées (VMID 100-105)
- [ ] Premier lab créé avec succès

---

## 🤝 Support

**Besoin d'aide?**

1. Lire [docs/DOCUMENTATION_INDEX.md](docs/DOCUMENTATION_INDEX.md)
2. Vérifier [docs/USAGE_GUIDE.md](docs/USAGE_GUIDE.md) - Troubleshooting
3. Consulter les logs: `make logs`

---

## 📝 License

MIT

---

## 👤 Auteur

LabOrchestrator - Plateforme d'apprentissage éphémère

**Version:** 2.0.0  
**Updated:** May 2026
