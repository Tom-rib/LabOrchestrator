# 📚 DOCUMENTATION COMPLÈTE - Ephemeral Labs

## 🎯 Guide de Navigation

Bienvenue dans la documentation complète du projet Ephemeral Labs! Utilisez ce guide pour trouver exactement ce que vous cherchez.

---

## 🚀 Je Veux Commencer Rapidement

### Pour un Utilisateur Normal
➜ **[QUICK_START.md](QUICK_START.md)** (5 min)
- Démarrage en 3 étapes
- Accès à l'application
- Se connecter et créer un lab

### Pour un Développeur
➜ **[USAGE_GUIDE.md](USAGE_GUIDE.md)** - Section "Démarrage Rapide"
- Installation des dépendances
- Démarrage en mode développement
- Guide complet du projet

### Pour un Administrateur Système
➜ **[SERVER_VM_SETUP.md](SERVER_VM_SETUP.md)** - Section "Démarrage Rapide"
- Configuration du serveur Proxmox
- Création des VMs templates
- Intégration avec l'API

---

## 📖 Je Veux Tout Comprendre en Détail

### Architecture et Installation
1. **[APP_GENERATION_SUMMARY.md](APP_GENERATION_SUMMARY.md)** ← Récapitulatif complet
   - Fichiers créés
   - Architecture
   - Statistiques

2. **[GENERATED_APP_README.md](GENERATED_APP_README.md)** ← Documentation technique
   - Structure du projet
   - Configuration
   - API endpoints

### Configuration du Serveur
➜ **[SERVER_VM_SETUP.md](SERVER_VM_SETUP.md)** ← Guide complet serveur
- Prérequis matériel
- Configuration Proxmox
- Création des 6 templates VM
- Scripts de clonage
- Configuration réseau
- Intégration API

### Utilisation de l'Application
➜ **[USAGE_GUIDE.md](USAGE_GUIDE.md)** ← Guide complet utilisateur
- Installation (3 options)
- Dashboard étudiant
- Admin panel
- API Reference complète
- Troubleshooting détaillé
- Exemples d'utilisation

---

## 🔨 Installation Automatique

### Avec Makefile (Recommandé)

```bash
# Voir toutes les commandes disponibles
make help

# Installation + démarrage
make setup          # Installation complète
make prod           # Lancer en production
make dev            # Lancer en développement

# Base de données
make db-init        # Initialiser
make db-seed        # Ajouter données de démo
make db-reset       # Réinitialiser (⚠️)

# Maintenance
make logs           # Voir les logs
make health-check   # Vérifier la santé
make clean          # Nettoyer
```

➜ **[Makefile](Makefile)** ← Référence complète
- 30+ commandes disponibles
- Installation automatique
- Démarrage/arrêt
- Maintenance
- Docker
- Déploiement

---

## 📊 Je Veux Apprendre à Utiliser

### Guide Étudiant
➜ **[USAGE_GUIDE.md](USAGE_GUIDE.md)** - Section "Guide Utilisateur"
- Authentification
- Dashboard
- Créer un lab
- Accéder via SSH
- Gérer les labs
- Consulter les quotas

### Guide Administrateur
➜ **[USAGE_GUIDE.md](USAGE_GUIDE.md)** - Section "Guide Administrateur"
- Admin Panel
- Gestion des utilisateurs
- Gestion des labs
- Maintenance
- Monitoring
- Sauvegarde

### Guide API
➜ **[USAGE_GUIDE.md](USAGE_GUIDE.md)** - Section "API Reference"
- Authentification
- Endpoints labs
- Endpoints quotas
- Endpoints admin
- Format des requêtes
- Exemples

---

## 🔧 Je Veux Configurer LE SERVEUR

### Configuration Proxmox Complète
➜ **[SERVER_VM_SETUP.md](SERVER_VM_SETUP.md)**

**Contenus:**
- ✅ Architecture requise
- ✅ Configuration réseau
- ✅ Création du token API
- ✅ Création des 6 templates VM
  - RHCSA (VMID: 100)
  - Docker (VMID: 101)
  - Kubernetes (VMID: 102)
  - CTF (VMID: 103)
  - Terraform (VMID: 104)
  - Ansible (VMID: 105)
- ✅ Configuration DHCP
- ✅ Intégration API
- ✅ Script de clonage

---

## 🆘 J'Ai un Problème

### Troubleshooting
➜ **[USAGE_GUIDE.md](USAGE_GUIDE.md)** - Section "Troubleshooting"
- "Cannot login" → solution
- "Port déjà utilisé" → solution
- "Lab creation fails" → solution
- "Cannot connect to VM" → solution
- "Docker containers not starting" → solution
- Debug complet

### Logs et Monitoring
```bash
make logs           # Tous les logs
make logs-api       # API seulement
make health-check   # État du système
make status         # Statistiques Docker
```

---

## 📋 Checklist - Par Rôle

### 👨‍💼 DevOps / Sysadmin

**Installation:**
- [ ] Lire: [SERVER_VM_SETUP.md](SERVER_VM_SETUP.md)
- [ ] Lancer: `make setup`
- [ ] Configurer: Proxmox selon [SERVER_VM_SETUP.md](SERVER_VM_SETUP.md)
- [ ] Créer: 6 templates VM
- [ ] Vérifier: `make health-check`

**Maintenance:**
- [ ] Monitoring: `make status`
- [ ] Logs: `make logs`
- [ ] Backup: `make backup`
- [ ] Updates: Maintenir les packages

### 👨‍🏫 Instructeur / Responsable Labs

**Configuration:**
- [ ] Lire: [USAGE_GUIDE.md](USAGE_GUIDE.md)
- [ ] Se connecter: admin / admin123
- [ ] Accéder: Admin Panel
- [ ] Ajouter: des utilisateurs
- [ ] Configurer: les quotas

**Gestion:**
- [ ] Surveiller: les labs actifs
- [ ] Supporter: les utilisateurs
- [ ] Gérer: les quotas
- [ ] Archiver: les données

### 👨‍🎓 Utilisateur / Étudiant

**Utilisation:**
- [ ] Lire: [QUICK_START.md](QUICK_START.md)
- [ ] Accéder: http://localhost:3000
- [ ] Se connecter: identifiants fournis
- [ ] Créer: votre premier lab
- [ ] Accéder: via SSH

---

## 📁 Structure de la Documentation

```
Documentation/
├── 🚀 QUICK_START.md              ← COMMENCER ICI
│                                     (5 min de lecture)
│
├── 📖 USAGE_GUIDE.md              ← Guide complet utilisateur
│   ├─ Installation (3 options)      (60 min)
│   ├─ Dashboard étudiant
│   ├─ Admin panel
│   ├─ API Reference
│   ├─ Troubleshooting
│   └─ Exemples
│
├── 🔧 SERVER_VM_SETUP.md          ← Configuration serveur Proxmox
│   ├─ Architecture                  (90 min)
│   ├─ Setup Proxmox
│   ├─ 6 templates VM
│   ├─ Configuration DHCP
│   ├─ Scripts d'automatisation
│   └─ Scaling
│
├── 🔨 Makefile                    ← Automatisation
│   ├─ Installation                  (30+ commandes)
│   ├─ Développement
│   ├─ Production
│   ├─ Maintenance
│   └─ Déploiement
│
├── 📊 APP_GENERATION_SUMMARY.md   ← Récapitulatif génération
│   ├─ Fichiers créés               (~2300 lignes de code)
│   ├─ Architecture
│   └─ Statistiques
│
└── 📋 Fichiers Techniques
    ├─ docker-compose.yml
    ├─ backend/ (4 modules + config)
    ├─ frontend/ (5 components + styles)
    └─ scripts/ (installation, etc)
```

---

## 🎓 Parcours Recommandé

### Pour un Développeur Nouveau

```
1. QUICK_START.md (5 min)
   └─ Comprendre le concept

2. USAGE_GUIDE.md - Démarrage Rapide (10 min)
   └─ Installation locale

3. Faire fonctionner: make dev (5 min)
   └─ Tester localement

4. GENERATED_APP_README.md (20 min)
   └─ Comprendre l'architecture

5. USAGE_GUIDE.md - Guide Complet (30 min)
   └─ Apprendre les APIs

6. Code source (60+ min)
   └─ Explorer et modifier

TOTAL: ~2 heures
```

### Pour un Administrateur Système

```
1. QUICK_START.md (5 min)
   └─ Vue d'ensemble

2. SERVER_VM_SETUP.md - Étape 1-2 (30 min)
   └─ Comprendre les prérequis

3. SERVER_VM_SETUP.md - Étape 3-5 (120 min)
   └─ Mettre en place le serveur

4. USAGE_GUIDE.md - Admin Panel (20 min)
   └─ Gérer l'application

5. Makefile (10 min)
   └─ Connaître les commandes

TOTAL: ~3 heures
```

### Pour un Utilisateur Final

```
1. QUICK_START.md (5 min)
   └─ Comment démarrer

2. USAGE_GUIDE.md - Démarrage Rapide (5 min)
   └─ Se connecter et créer un lab

3. USAGE_GUIDE.md - Guide Utilisateur (15 min)
   └─ Apprendre toutes les fonctionnalités

4. Commencer à utiliser! (illimité)

TOTAL: ~25 minutes
```

---

## 🔍 Référence Rapide

### Commandes Essentielles

```bash
# Installation
make install        # Dépendances
make setup          # Setup complet

# Démarrage
make prod           # Production (Docker)
make dev            # Développement
make start          # Docker start
make stop           # Docker stop

# Base de données
make db-init        # Initialiser
make db-seed        # Ajouter démo
make db-reset       # Réinitialiser

# Maintenance
make logs           # Voir logs
make health-check   # État système
make backup         # Sauvegarder

# Aide
make help           # Voir toutes les commandes
```

### URLs Importantes

```
Frontend:     http://localhost:3000
Backend:      http://localhost:3001
API Health:   http://localhost:3001/api/health
Docs API:     [Voir USAGE_GUIDE.md]
Proxmox:      https://192.168.1.10:8006
```

### Identifiants Par Défaut

```
Username: admin
Password: admin123
Role:     Admin
```

---

## 📞 Support & Ressources

### Documentation Externe
- [Proxmox Documentation](https://pve.proxmox.com/wiki/)
- [Express.js Docs](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Docker Docs](https://docs.docker.com/)

### Fichiers de Configuration
- Backend: `backend/.env.example` → `backend/.env`
- Frontend: `frontend/.env` (si nécessaire)
- Docker: `docker-compose.yml`

### Logs & Debugging
```bash
make logs          # Voir tous les logs
make logs-api      # API seulement
docker ps          # Statut des containers
docker-compose ps  # Détails completes
```

---

## ✅ Avant de Commencer

**Prérequis:**
- [ ] Node.js 18+
- [ ] npm 9+
- [ ] Docker + Docker Compose
- [ ] 2GB RAM minimum
- [ ] 1GB disque libre

**Lecture recommandée:**
- [ ] Ce fichier (5 min)
- [ ] QUICK_START.md (5 min)
- [ ] USAGE_GUIDE.md (selon le rôle)

---

## 🎉 Prêt à Commencer?

### Option 1: Démarrer en 3 Étapes
```bash
make setup
make prod
# Ouvrir http://localhost:3000
```

### Option 2: Lire d'Abord
→ **[QUICK_START.md](QUICK_START.md)**

### Option 3: Cas d'Usage Spécifique
1. Utilisateur normal? → [USAGE_GUIDE.md](USAGE_GUIDE.md)
2. Administrateur? → [SERVER_VM_SETUP.md](SERVER_VM_SETUP.md)
3. Développeur? → [GENERATED_APP_README.md](GENERATED_APP_README.md)

---

## 📊 Statistiques du Projet

- **Fichiers créés:** 23+
- **Lignes de code:** ~2300
- **Documentation:** ~5000 lignes
- **Commandes Makefile:** 30+
- **Templates VM:** 6
- **API Endpoints:** 10+
- **Temps de lecture complète:** ~2-3 heures

---

## 🎓 Formation Complète

Pour une formation complète (tous les rôles):

**Jour 1: Installation & Setup (4 heures)**
- [ ] Installation: 30 min
- [ ] Configuration Proxmox: 2 heures
- [ ] Création VMs: 1.5 heures

**Jour 2: Utilisation (3 heures)**
- [ ] Dashboard utilisateur: 1 heure
- [ ] Admin panel: 1 heure
- [ ] API & Intégration: 1 heure

**Jour 3: Maintenance (2 heures)**
- [ ] Monitoring: 30 min
- [ ] Troubleshooting: 30 min
- [ ] Scaling: 1 heure

**Total: ~9 heures**

---

**💡 Conseil:** Commencez par [QUICK_START.md](QUICK_START.md), puis allez vers la documentation spécifique à votre rôle.

**Version:** 2.0.0  
**Dernière mise à jour:** May 20, 2026  
**Status:** ✅ Production Ready
