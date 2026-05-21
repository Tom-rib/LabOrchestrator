# 📥 Guide d'Installation - LabOrchestrator

**Installation complète de la plateforme Ephemeral Labs**

---

## 🎯 Contenu

1. [Prérequis](#prérequis)
2. [Installation Option A: Docker (Recommandé)](#installation-option-a--docker-recommandé)
3. [Installation Option B: Local (Dev)](#installation-option-b--local-dev)
4. [Configuration](#configuration)
5. [Vérification](#vérification)
6. [Troubleshooting](#troubleshooting)

---

## ✅ Prérequis

### Pour tous

- **Git** - Pour cloner le repo
- **Node.js 18+** - Pour backend et frontend
- **npm ou yarn** - Gestionnaire de paquets

### Option A: Docker
- **Docker Desktop** - Containerization
- **Docker Compose** - Orchestration

### Option B: Local
- **SQLite3** - Database (optionnel)
- **Redis** (optionnel) - Cache

### Proxmox (pour labs réels)
- **Proxmox VE 8.0+** - Hypervisor
- **Token API** - Pour communiquer avec l'API

---

## 🐳 Installation Option A: Docker (Recommandé)

### **Étape 1: Cloner le projet**

```bash
git clone https://github.com/Tom-rib/LabOrchestrator.git
cd LabOrchestrator
```

### **Étape 2: Configurer l'environnement**

```bash
# Copier le fichier .env de template
cp .env.example .env

# Éditer .env avec vos valeurs
# Windows: notepad .env
# Mac/Linux: nano .env
```

**Valeurs essentielles dans .env:**

```env
# Application
NODE_ENV=production
API_PORT=3001
FRONTEND_PORT=3000
JWT_SECRET=your-super-secret-key-change-this

# Database (SQLite pour dev)
DB_PATH=/data/labs.db

# Proxmox (mode mock pour dev)
PROXMOX_MODE=mock
PROXMOX_HOST=localhost:8006

# Logs
LOG_LEVEL=info
```

### **Étape 3: Démarrer avec Docker Compose**

```bash
# Démarrer tous les services
docker-compose up -d

# Attendre 30 secondes (initialization base de données)
sleep 30

# Vérifier que tout tourne
docker-compose ps

# Output attendu:
# NAME                COMMAND             STATUS
# ephemeral-labs-api  "node server.js"    Up
# ephemeral-labs-frontend "npm run dev"   Up
# redis               "redis-server"      Up
```

### **Étape 4: Accéder à l'application**

```
🌐 Frontend: http://localhost:3000
🔗 Backend API: http://localhost:3001/api/health

Identifiants par défaut:
  Username: admin
  Password: admin123
```

### **Étape 5: Vérifier que ça marche**

```bash
# Voir les logs
docker-compose logs -f api

# Test API
curl http://localhost:3001/api/health

# Output: {"status":"ok"}
```

---

## 💻 Installation Option B: Local (Dev)

### **Étape 1: Cloner le projet**

```bash
git clone https://github.com/Tom-rib/LabOrchestrator.git
cd LabOrchestrator
```

### **Étape 2: Configurer l'environnement**

```bash
cp .env.example .env
# Éditer .env si nécessaire
```

### **Étape 3: Installer Backend**

```bash
cd backend

# Installer les dépendances
npm install

# Lancer en développement (avec reload auto)
npm run dev

# Le backend démarre sur http://localhost:3001
```

**Output attendu:**
```
[Listening] Server is running on port 3001
[Database] Connected to SQLite
[Auth] JWT module initialized
```

### **Étape 4: Installer Frontend (nouveau terminal)**

```bash
cd frontend

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Output:
# VITE v4.x.x  ready in xxx ms
# ➜  Local:   http://localhost:5173/
```

### **Étape 5: Accéder**

```
🌐 Frontend: http://localhost:5173 (ou selon Vite)
🔗 Backend: http://localhost:3001
```

---

## ⚙️ Configuration Avancée

### **Utiliser PostgreSQL au lieu de SQLite**

Pour production, remplacer SQLite par PostgreSQL:

**1. Installer PostgreSQL**
```bash
# Docker
docker run -d -e POSTGRES_PASSWORD=secret -p 5432:5432 postgres:15

# Ou localement
sudo apt-get install postgresql
```

**2. Configurer .env**
```env
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=ephemeral
DB_PASSWORD=your-password
DB_NAME=ephemeral_labs
```

**3. Créer la base de données**
```bash
createdb -U ephemeral ephemeral_labs
```

### **Activer Redis pour le cache**

```env
REDIS_HOST=localhost  # ou 'redis' si Docker
REDIS_PORT=6379
REDIS_PASSWORD=
```

### **Configuration Proxmox (pour labs réels)**

```env
# Passer du mode mock au mode real
PROXMOX_MODE=real
PROXMOX_HOST=your-proxmox-ip:8006
PROXMOX_NODE=pve
PROXMOX_STORAGE=local-lvm
PROXMOX_TOKEN=root@pam!token-xxxx
```

**Créer un token Proxmox:**
```bash
# SSH dans Proxmox
ssh root@proxmox-ip

# Créer un token
pveum user add app@pam
pveum aclmod / -user app@pam -role Administrator
pveum user token add app@pam token-name --privsep 0
```

---

## 🔍 Vérification Post-Installation

### **Test complet**

```bash
# 1. Backend répond
curl http://localhost:3001/api/health

# 2. Frontend chargé
curl http://localhost:3000 | grep -q "React" && echo "✓ Frontend OK"

# 3. Accéder à l'app
# http://localhost:3000

# 4. Se connecter
# Username: admin
# Password: admin123

# 5. Voir le Dashboard
# Doit afficher les quotas et les labs vides
```

### **Vérifier les services Docker**

```bash
# Liste les conteneurs
docker-compose ps

# Voir les logs d'un service
docker-compose logs api
docker-compose logs frontend
docker-compose logs redis

# Vérifier les variables d'environnement
docker-compose exec api env | grep PROXMOX
```

---

## 🛠️ Utiliser le Makefile

Automatiser les tâches courantes:

```bash
# Voir toutes les commandes disponibles
make help

# Installation + setup
make setup

# Lancer en production
make prod

# Lancer en développement
make dev

# Voir les logs
make logs

# Réinitialiser la base de données
make db-reset

# Health check
make health-check
```

---

## 🚀 Déploiement Production

### **Avec Docker (Recommandé)**

```bash
# Build les images
docker-compose build

# Démarrer en arrière-plan
docker-compose up -d

# Vérifier la santé
make health-check

# Voir les logs
docker-compose logs -f
```

### **Avec Nginx reverse proxy**

```bash
# Créer une config nginx
sudo nano /etc/nginx/sites-available/labs

# Ajouter:
server {
    listen 80;
    server_name labs.example.com;

    location / {
        proxy_pass http://localhost:3000;
    }

    location /api {
        proxy_pass http://localhost:3001;
    }
}

# Activer
sudo ln -s /etc/nginx/sites-available/labs /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

### **SSL/TLS (Let's Encrypt)**

```bash
# Installer certbot
sudo apt-get install certbot python3-certbot-nginx

# Générer certificat
sudo certbot --nginx -d labs.example.com

# Auto-renouvellement activé automatiquement
```

---

## 🐛 Troubleshooting Installation

### **"Docker Compose not found"**
```bash
# Installer Docker Compose
# Windows/Mac: Inclus dans Docker Desktop
# Linux: sudo apt-get install docker-compose
```

### **"Port 3000/3001 déjà utilisé"**
```bash
# Trouver le processus
lsof -i :3000
lsof -i :3001

# Tuer le processus
kill -9 <PID>

# Ou changer les ports dans .env
API_PORT=3002
FRONTEND_PORT=3001
```

### **"Cannot connect to database"**
```bash
# Vérifier la permission du dossier /data
ls -la /data

# Si pas de dossier /data dans Docker:
docker-compose exec api ls -la /data

# Si erreur de permission:
docker-compose exec api chmod 777 /data
```

### **"JWT_SECRET not defined"**
```bash
# Dans .env, définir JWT_SECRET
JWT_SECRET=my-super-secret-key-12345

# Redémarrer l'app
docker-compose restart api
```

### **"Frontend ne charge pas"**
```bash
# Vérifier la compilation
docker-compose logs frontend

# Reconstruire
docker-compose build frontend
docker-compose up -d
```

### **"Cannot get /api/labs"**
```bash
# Vérifier que le backend répond
curl http://localhost:3001/api/health

# Si "Connection refused":
docker-compose logs api

# Vérifier la variable d'environnement
docker-compose exec api env | grep API_PORT
```

---

## 📋 Checklist Installation

### **Docker Setup**
- [ ] Git clone du repo
- [ ] .env configuré avec JWT_SECRET
- [ ] Docker Desktop lancé
- [ ] `docker-compose up -d` exécuté
- [ ] `docker-compose ps` montre 3 services UP
- [ ] http://localhost:3000 accessible
- [ ] Login admin/admin123 OK
- [ ] Dashboard affiche les quotas

### **Local Setup**
- [ ] Git clone du repo
- [ ] Node.js 18+ installé (`node --version`)
- [ ] Backend: `npm install` + `npm run dev` OK
- [ ] Frontend: `npm install` + `npm run dev` OK
- [ ] http://localhost:3000 accessible
- [ ] Login admin/admin123 OK
- [ ] Dashboard chargé

### **Proxmox Setup (optionnel)**
- [ ] Proxmox VE 8.0+ installé
- [ ] Token API créé
- [ ] PROXMOX_MODE=real dans .env
- [ ] PROXMOX_HOST et TOKEN configurés
- [ ] 6 templates créés (VMID 100-105)
- [ ] Premier lab créé avec succès

---

## 🎓 Prochaines Étapes

1. **Lire [GETTING_STARTED.md](GETTING_STARTED.md)** - Démarrage rapide
2. **Consulter [USAGE.md](USAGE.md)** - Comment utiliser l'app
3. **Voir [docs/ARCHITECTURE_CHOICE.md](docs/ARCHITECTURE_CHOICE.md)** - Déploiement
4. **Setup Proxmox** - Voir [docs/PROXMOX_ISO_DOWNLOAD_UPLOAD.md](docs/PROXMOX_ISO_DOWNLOAD_UPLOAD.md)

---

## 📞 Support

- **Besoin d'aide?** Voir [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **API questions?** Consulter [docs/USAGE_GUIDE.md](docs/USAGE_GUIDE.md)
- **Architecture?** Lire [docs/ARCHITECTURE_CHOICE.md](docs/ARCHITECTURE_CHOICE.md)

---

**✨ Installation terminée! Vous êtes prêt à utiliser LabOrchestrator!**
