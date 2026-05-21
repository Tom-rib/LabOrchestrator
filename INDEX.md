# 🎓 Index de Documentation - LabOrchestrator

**Trouvez rapidement ce que vous cherchez**

---

## 🚀 Je veux DÉMARRER MAINTENANT

### **Vous avez 5 minutes?**
👉 **Lire: [GETTING_STARTED.md](GETTING_STARTED.md)**
- Clone + Docker compose
- Accès immédiat à l'app
- Test rapide

### **Vous avez 30 minutes?**
👉 **Lire: [INSTALL.md](INSTALL.md)**
- Installation complète
- Toutes les options (Docker, Local)
- Configuration avancée
- Troubleshooting

---

## 📖 Je veux APPRENDRE À UTILISER

### **Je suis étudiant**
👉 **Lire: [USAGE.md](USAGE.md#pour-les-étudiants)**
- Créer un lab
- Consulter mes quotas
- Accéder via SSH/VNC
- FAQ étudiants

### **Je suis administrateur**
👉 **Lire: [USAGE.md](USAGE.md#pour-les-admins)**
- Admin Panel
- Gérer les utilisateurs
- Modifier les quotas
- Voir tous les labs

### **Je veux tout comprendre**
👉 **Lire: [docs/USAGE_GUIDE.md](docs/USAGE_GUIDE.md)**
- Guide complet (1000+ lignes)
- API reference (tous les endpoints)
- Gestion détaillée
- Troubleshooting avancé

---

## 🏗️ Je veux DÉPLOYER EN PRODUCTION

### **Quelle architecture?**
👉 **Lire: [docs/ARCHITECTURE_CHOICE.md](docs/ARCHITECTURE_CHOICE.md)**

**Architecture 1: Tout sur Proxmox** (simple)
- 1 serveur Proxmox
- Docker + templates
- Setup: 1h
- Utilisateurs: ~100

**Architecture 2: Séparation** (production)
- 2+ serveurs
- Proxmox + App server
- Setup: 2-3h
- Utilisateurs: 100+

### **Configurer Proxmox**
👉 **Lire: [docs/SERVER_VM_SETUP.md](docs/SERVER_VM_SETUP.md)**
- Installation Proxmox
- Setup token API
- Cloning de VMs
- Troubleshooting

### **Télécharger les ISO**
👉 **Lire: [docs/PROXMOX_ISO_DOWNLOAD_UPLOAD.md](docs/PROXMOX_ISO_DOWNLOAD_UPLOAD.md)**
- Quelles ISO?
- Comment télécharger?
- Comment uploader?
- Vérifier checksums

### **Créer les templates**
👉 **Lire: [docs/PROXMOX_TEMPLATES_CREATION.md](docs/PROXMOX_TEMPLATES_CREATION.md)**
- 6 templates (RHCSA, Docker, K8s, CTF, Terraform, Ansible)
- Installation détaillée
- Cloud-init configuration
- Tests

---

## 🆘 J'ai UN PROBLÈME

### **Erreur d'installation**
👉 **Voir: [INSTALL.md#-troubleshooting-installation](INSTALL.md#-troubleshooting-installation)**
- Docker ne démarre pas
- Port déjà utilisé
- Database connection
- Frontend ne charge pas

### **L'app ne marche pas**
👉 **Voir: [USAGE.md#troubleshooting-ssh](USAGE.md#troubleshooting-ssh)**
- Pas accès au dashboard
- Lab ne crée pas
- SSH ne marche pas
- Quotas bloqués

### **Problème Proxmox**
👉 **Voir: [docs/SERVER_VM_SETUP.md#troubleshooting](docs/SERVER_VM_SETUP.md)**
- Template ne démarre pas
- Cloud-init ne fonctionne pas
- Clone ne marche pas

---

## 📚 DOCUMENTATION PAR SUJET

### **Installation & Setup**

| Document | Pour | Temps |
|----------|------|-------|
| [GETTING_STARTED.md](GETTING_STARTED.md) | Démarrage rapide | 5 min |
| [INSTALL.md](INSTALL.md) | Installation complète | 30 min |
| [CLEANUP_REPORT.md](CLEANUP_REPORT.md) | Historique cleanup | 5 min |

### **Utilisation**

| Document | Pour | Temps |
|----------|------|-------|
| [USAGE.md](USAGE.md) | Guide quotidien | 20 min |
| [docs/USAGE_GUIDE.md](docs/USAGE_GUIDE.md) | Complet (API, etc) | 1h |
| [README.md](README.md) | Vue d'ensemble | 5 min |

### **Déploiement & Infrastructure**

| Document | Pour | Temps |
|----------|------|-------|
| [docs/ARCHITECTURE_CHOICE.md](docs/ARCHITECTURE_CHOICE.md) | Architecture déploiement | 30 min |
| [docs/SERVER_VM_SETUP.md](docs/SERVER_VM_SETUP.md) | Setup Proxmox | 1h |
| [docs/PROXMOX_ISO_DOWNLOAD_UPLOAD.md](docs/PROXMOX_ISO_DOWNLOAD_UPLOAD.md) | Télécharger ISO | 20 min |
| [docs/PROXMOX_TEMPLATES_CREATION.md](docs/PROXMOX_TEMPLATES_CREATION.md) | Créer templates | 2h |

---

## 👥 PAR RÔLE

### **👨‍🎓 Je suis étudiant**

**Étape 1: Installer** (si pas encore fait)
→ [GETTING_STARTED.md](GETTING_STARTED.md) (5 min)

**Étape 2: Apprendre à utiliser**
→ [USAGE.md#pour-les-étudiants](USAGE.md#pour-les-étudiants) (10 min)

**Étape 3: Questions**
→ [USAGE.md#faq](USAGE.md#faq)

**Ressources:**
- Mon Dashboard
- Créer un lab
- Voir mes quotas
- Accéder via SSH

---

### **👨‍💼 Je suis administrateur**

**Étape 1: Installer**
→ [INSTALL.md](INSTALL.md) (30 min)

**Étape 2: Apprendre l'admin**
→ [USAGE.md#pour-les-admins](USAGE.md#pour-les-admins) (15 min)

**Étape 3: Configuration avancée**
→ [docs/USAGE_GUIDE.md](docs/USAGE_GUIDE.md) (1h)

**Ressources:**
- Admin Panel
- Gérer utilisateurs
- Modifier quotas
- Voir tous les labs
- Logs d'audit

---

### **🖥️ Je suis DevOps/Infrastructure**

**Étape 1: Architecture**
→ [docs/ARCHITECTURE_CHOICE.md](docs/ARCHITECTURE_CHOICE.md) (30 min)

**Étape 2: Proxmox Setup**
→ [docs/SERVER_VM_SETUP.md](docs/SERVER_VM_SETUP.md) (1h)

**Étape 3: Templates**
→ [docs/PROXMOX_TEMPLATES_CREATION.md](docs/PROXMOX_TEMPLATES_CREATION.md) (2h)

**Étape 4: Déploiement**
→ [INSTALL.md#-déploiement-production](INSTALL.md#-déploiement-production)

**Ressources:**
- Docker compose
- Makefile
- Configuration .env
- Nginx proxy
- SSL/TLS

---

### **💻 Je suis développeur**

**Étape 1: Setup dev**
→ [INSTALL.md#-installation-option-b--local-dev](INSTALL.md#-installation-option-b--local-dev)

**Étape 2: Comprendre l'app**
→ [README.md](README.md)

**Étape 3: Architecture**
→ [docs/USAGE_GUIDE.md](docs/USAGE_GUIDE.md) (structure API)

**Ressources:**
- /backend/ (Node.js + Express)
- /frontend/ (React + Vite)
- API endpoints
- Database schema

---

## 📋 STRUCTURE DES FICHIERS

```
LabOrchestrator/
│
├─ 🎯 README.md                    ← Lire en premier!
├─ ⚡ GETTING_STARTED.md            ← 5 min démarrage
├─ 📥 INSTALL.md                   ← Installation complète
├─ 📖 USAGE.md                     ← Guide quotidien
├─ 🧹 CLEANUP_REPORT.md            ← Historique cleanup
│
├─ 📂 docs/
│   ├─ 📋 QUICKSTART.md            ← Démarrage rapide
│   ├─ 📚 USAGE_GUIDE.md           ← Complet + API
│   ├─ 🗂️  DOCUMENTATION_INDEX.md   ← Index docs
│   ├─ 🏗️  ARCHITECTURE_CHOICE.md   ← Architectures
│   ├─ 🖥️  SERVER_VM_SETUP.md       ← Proxmox setup
│   ├─ 📥 PROXMOX_ISO_DOWNLOAD_UPLOAD.md
│   └─ 🛠️  PROXMOX_TEMPLATES_CREATION.md
│
├─ 📂 backend/        ← API Node.js
├─ 📂 frontend/       ← UI React
├─ 📂 scripts/        ← Utilitaires
│
├─ docker-compose.yml ← Orchestration
├─ Makefile          ← Automatisation
└─ .env              ← Configuration
```

---

## 🎓 PARCOURS RECOMMANDÉS

### **Étudiant Impatient** ⚡
```
1. GETTING_STARTED.md (5 min)
2. Se connecter au dashboard
3. Créer un lab
4. Consulter USAGE.md#pour-les-étudiants si questions
```

### **Administrateur Complet** 📋
```
1. INSTALL.md (30 min) - Installation
2. USAGE.md#pour-les-admins (15 min) - Admin Panel
3. docs/USAGE_GUIDE.md (1h) - Tout le détail
4. docs/ARCHITECTURE_CHOICE.md - Déploiement
```

### **DevOps Complet** 🏗️
```
1. INSTALL.md (30 min) - Installation
2. docs/ARCHITECTURE_CHOICE.md (30 min) - Architecture
3. docs/SERVER_VM_SETUP.md (1h) - Proxmox setup
4. docs/PROXMOX_TEMPLATES_CREATION.md (2h) - Templates
5. INSTALL.md#-déploiement-production - Déployer
```

### **Développeur** 💻
```
1. INSTALL.md#-installation-option-b--local-dev (20 min)
2. README.md (5 min) - Overview
3. Explorer backend/ et frontend/
4. docs/USAGE_GUIDE.md - API reference
```

---

## ⏱️ DURÉE PAR SUJET

| Sujet | Débutant | Intermédiaire | Expert |
|-------|----------|---------------|--------|
| Installation | 30 min | 15 min | 5 min |
| Utilisation | 30 min | 15 min | - |
| Admin Panel | 45 min | 20 min | - |
| Architecture | 45 min | 30 min | - |
| Proxmox Setup | 3h | 1.5h | 1h |
| Déploiement | 2h | 1h | 30 min |

---

## 🔗 LIENS RAPIDES

### **Premiers pas**
- 🚀 [GETTING_STARTED.md](GETTING_STARTED.md) - Démarrage 5 min
- 📥 [INSTALL.md](INSTALL.md) - Installation

### **Utilisation quotidienne**
- 📖 [USAGE.md](USAGE.md) - Guide complet
- ❓ [USAGE.md#faq](USAGE.md#faq) - Questions fréquentes

### **Administration**
- 👨‍💼 [USAGE.md#pour-les-admins](USAGE.md#pour-les-admins) - Admin Panel
- 🔐 [USAGE.md#quotas](USAGE.md#quotas) - Gestion quotas

### **Infrastructure**
- 🏗️ [docs/ARCHITECTURE_CHOICE.md](docs/ARCHITECTURE_CHOICE.md) - 2 architectures
- 🖥️ [docs/SERVER_VM_SETUP.md](docs/SERVER_VM_SETUP.md) - Proxmox

### **Templates & ISO**
- 📥 [docs/PROXMOX_ISO_DOWNLOAD_UPLOAD.md](docs/PROXMOX_ISO_DOWNLOAD_UPLOAD.md) - ISO
- 🛠️ [docs/PROXMOX_TEMPLATES_CREATION.md](docs/PROXMOX_TEMPLATES_CREATION.md) - Templates

### **Troubleshooting**
- 🆘 [INSTALL.md#-troubleshooting-installation](INSTALL.md#-troubleshooting-installation) - Installation
- 🆘 [USAGE.md#troubleshooting-ssh](USAGE.md#troubleshooting-ssh) - Utilisation

---

## ✅ Checklist Orientation

- [ ] Connaître mon rôle (étudiant/admin/DevOps)
- [ ] Lire le document principal pour mon rôle
- [ ] Installer et tester l'app
- [ ] Créer mon premier lab (étudiants)
- [ ] Configurer l'admin (admins)
- [ ] Bookmark ce document pour référence future

---

**Bienvenue dans LabOrchestrator! 🎉**

**Vous êtes prêt? 👉 [Commencez ici →](GETTING_STARTED.md)**
