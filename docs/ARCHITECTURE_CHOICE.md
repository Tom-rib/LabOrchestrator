# 🏗️ ARCHITECTURE - DÉPLOIEMENT PROXMOX vs SÉPARÉ

## 🤔 La Question

> "Du coup j'installe tout sur Proxmox? Ou j'ai Proxmox et un autre serveur qui gère l'admin interface web?"

## 📊 Les 2 Architectures Possibles

---

## ✅ ARCHITECTURE 1: TOUT SUR PROXMOX (Recommandé pour PME)

```
┌─────────────────────────────────────────────┐
│        SERVEUR PROXMOX                      │
│        (Hypervisor + Application)           │
│        192.168.1.10                         │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ Proxmox VE (Port 8006)              │   │
│  │ - Gestion des VMs                   │   │
│  │ - Stockage local-lvm                │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ Docker Compose (Application)        │   │
│  ├─────────────────────────────────────┤   │
│  │ Backend Node.js (Port 3001)         │   │
│  │ Frontend React (Port 3000)          │   │
│  │ Redis (Port 6379)                   │   │
│  │ SQLite BD                           │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ Templates VMs (100-105)             │   │
│  │ - RHCSA, Docker, K8s, CTF, etc.     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ Labs VMs (300-399)                  │   │
│  │ - Clonées automatiquement           │   │
│  │ - Détruites après usage             │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│     Utilisateurs Internet                   │
│     http://proxmox.example.com              │
│     ↓                                       │
│     [Frontend React sur Proxmox]            │
│     [Backend API sur Proxmox]               │
└─────────────────────────────────────────────┘
```

### ✅ Avantages
- ✅ **Simple** - Un seul serveur à gérer
- ✅ **Économique** - 1 serveur = moins de coûts
- ✅ **Rapide** - Installation facile
- ✅ **Performance** - Pas de latence réseau
- ✅ **Intégration parfaite** - API Proxmox locale
- ✅ **Maintenance facile** - Tout centralisé
- ✅ **Idéal pour** - PME, Écoles, Startups

### ❌ Inconvénients
- ❌ **Pas de redondance** - Si Proxmox tombe, tout s'arrête
- ❌ **Capacités limitées** - Partage de ressources (CPU, RAM)
- ❌ **Charge globale** - Proxmox + App + VMs = ressources limitées
- ❌ **Pas de scaling indépendant** - Limité à 1 serveur
- ❌ **Dépend du hardware** - Un serveur powerful requis

### 💾 Ressources Requises
```
Total: 
- CPU: 16 cores (8 Proxmox + 8 Application)
- RAM: 64GB (32 Proxmox + 32 Application)
- Storage: 2TB (Proxmox 500GB + VMs templates 500GB + VMs labs 1TB)
- Réseau: Gigabit
```

### 🛠️ Installation
```bash
# 1. Installer Proxmox (normal)
# 2. Docker sur Proxmox
sudo apt update && sudo apt install -y docker.io
sudo usermod -aG docker $USER

# 3. Docker Compose sur Proxmox
sudo curl -L "https://github.com/docker/compose/releases/download/v2.0.0/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 4. Cloner le projet
git clone <repo> /opt/ephemeral-labs

# 5. Démarrer
cd /opt/ephemeral-labs
make setup
make prod
```

---

## ⚙️ ARCHITECTURE 2: SÉPARATION (Recommandé pour Entreprises)

```
┌──────────────────────────────────┐
│  SERVEUR 1: PROXMOX (Hypervisor) │
│  192.168.1.10                    │
│  ✓ Proxmox VE                    │
│  ✓ Templates VMs                 │
│  ✓ Labs VMs                      │
│  ✓ Stockage                      │
│  - Pas d'application web         │
└──────────────────────────────────┘
            ↕ API Proxmox
            ↕ (Sécurisée)
┌──────────────────────────────────┐
│ SERVEUR 2: APPLICATION           │
│ 192.168.1.20                     │
│ ✓ Backend Node.js (3001)         │
│ ✓ Frontend React (3000)          │
│ ✓ Redis                          │
│ ✓ BD SQLite/PostgreSQL           │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ OPTIONNEL - SERVEUR 3: DB        │
│ 192.168.1.30                     │
│ ✓ PostgreSQL en prod             │
│ ✓ Backups automatiques           │
└──────────────────────────────────┘

┌──────────────────────────────────────┐
│     Utilisateurs Internet            │
│     http://app.example.com           │
│              ↓                       │
│     [Frontend sur Serveur 2]         │
│     [Backend sur Serveur 2]          │
│              ↓                       │
│     [API Proxmox sur Serveur 1]      │
└──────────────────────────────────────┘
```

### ✅ Avantages
- ✅ **Séparation des responsabilités** - Hypervisor ≠ Application
- ✅ **Scalabilité** - Ajouter des serveurs indépendamment
- ✅ **Haute disponibilité** - Si app tombe, Proxmox reste OK
- ✅ **Ressources dédiées** - Proxmox pour VMs, Serveur pour App
- ✅ **Sécurité** - Isolation réseau Proxmox/App
- ✅ **Performance** - Pas de contention de ressources
- ✅ **Clustering** - Plusieurs serveurs app = load balancing
- ✅ **Idéal pour** - Entreprises, Production, Scaling

### ❌ Inconvénients
- ❌ **Complexe** - 2+ serveurs à gérer
- ❌ **Coûteux** - Multiple serveurs = plus cher
- ❌ **Lent à installer** - Plus d'étapes
- ❌ **Latence réseau** - Communication inter-serveurs
- ❌ **Maintenance complexe** - Plusieurs points de défaillance

### 💾 Ressources Requises
```
Serveur 1 (Proxmox):
- CPU: 8 cores
- RAM: 32GB
- Storage: 2TB (templates + VMs)

Serveur 2 (Application):
- CPU: 4 cores
- RAM: 8GB
- Storage: 100GB (OS + Application + BD)

TOTAL: 12 cores, 40GB RAM
```

### 🛠️ Installation

**Serveur 1 - Proxmox:**
```bash
# Installation standard Proxmox
# Rien de spécial, configuration normale
```

**Serveur 2 - Application:**
```bash
# 1. Installer Docker
sudo apt update && sudo apt install -y docker.io

# 2. Installer Docker Compose
# (cf. Architecture 1)

# 3. Configurer .env
export PROXMOX_HOST=192.168.1.10
export PROXMOX_TOKEN=token-api
export PROXMOX_NODE=pve

# 4. Démarrer
docker-compose up -d
```

---

## 🎯 Quelle Architecture Choisir?

### 📊 Comparaison

| Critère | Architecture 1 | Architecture 2 |
|---------|---|---|
| **Simplicité** | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Coût** | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Performance** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Scalabilité** | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Haute Dispo** | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Sécurité** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Maintenance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

### 🎓 Recommandations

#### ➡️ Choisir Architecture 1 (Tout sur Proxmox) si:
```
✓ C'est une école/PME/startup
✓ < 100 utilisateurs simultanés
✓ Budget limité
✓ Installation rapide
✓ Pas besoin de haute disponibilité
✓ Serveur powerful disponible (32GB+ RAM, 16 cores)
```

**Exemple:** Lycée qui veut lancer rapidement avec budget limité

#### ➡️ Choisir Architecture 2 (Séparation) si:
```
✓ C'est une grande entreprise
✓ > 100 utilisateurs simultanés
✓ Budget IT normal
✓ Besoin de haute disponibilité
✓ Scaling futur prévu
✓ Équipe DevOps disponible
✓ Production critique
```

**Exemple:** Université, Bootcamp, Grande école

---

## 🔌 Configuration selon Architecture

### Architecture 1: TOUT SUR PROXMOX

**Fichier `.env` backend:**
```env
PORT=3001
DB_PATH=/opt/ephemeral-labs/data/labs.db
JWT_SECRET=your-secret
PROXMOX_HOST=localhost:8006    # ← API locale!
PROXMOX_TOKEN=root@pam!token
PROXMOX_NODE=pve
PROXMOX_STORAGE=local-lvm
PROXMOX_MODE=real
NODE_ENV=production
```

**URL Frontend:**
```
http://proxmox-server.com:3000
```

**Installation:**
```bash
make setup
make prod
```

---

### Architecture 2: SÉPARATION

**Proxmox (Serveur 1):**
```bash
# Rien à faire de spécial
# Configuration Proxmox standard
# Créer le token API
pveum user add app@pam
pveum acl modify / -user app@pam -role PVEAdmin
```

**Backend (Serveur 2):**
```env
PORT=3001
DB_PATH=/var/lib/ephemeral-labs/labs.db
JWT_SECRET=your-secret
PROXMOX_HOST=192.168.1.10:8006  # ← IP Proxmox!
PROXMOX_TOKEN=app@pam!token
PROXMOX_NODE=pve
PROXMOX_STORAGE=local-lvm
PROXMOX_MODE=real
NODE_ENV=production
```

**Frontend (Serveur 2):**
```
http://app-server.com:3000
ou
http://app.example.com (avec reverse proxy Nginx)
```

**Nginx Reverse Proxy (Optionnel - Serveur 2):**
```nginx
server {
    listen 80;
    server_name app.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
    }
}
```

---

## 🚀 Migration Entre les Deux

### De Architecture 1 → Architecture 2

**Étape 1: Préparer Serveur 2**
```bash
# Installer Docker, Docker Compose
# Cloner le projet
# Configurer .env avec IP Proxmox
```

**Étape 2: Transférer la BD**
```bash
# Sur Serveur 1
scp data/labs.db user@192.168.1.20:/var/lib/ephemeral-labs/

# Sur Serveur 2
docker-compose down
cp /var/lib/ephemeral-labs/labs.db data/labs.db
docker-compose up -d
```

**Étape 3: Mettre à jour le DNS/Accès**
```bash
# Rediriger users vers Serveur 2
# http://app.example.com → Serveur 2
```

---

## 🔒 Sécurité selon Architecture

### Architecture 1: TOUT SUR PROXMOX

**Risques:**
- ❌ Si Proxmox compromis → tout est compromis
- ❌ Pas de isolation entre services

**Mitigation:**
```bash
# Firewall sur Proxmox
ufw allow 8006/tcp      # Proxmox Web
ufw allow 3000/tcp      # Frontend (restreint au réseau interne)
ufw allow 3001/tcp      # API (restreint au réseau interne)
ufw deny incoming       # Bloquer tout par défaut

# Reverse proxy Nginx (sur Proxmox)
# Ne pas exposer directement les ports 3000/3001
```

### Architecture 2: SÉPARATION

**Meilleure isolations:**
- ✅ Proxmox n'expose que l'API (8006)
- ✅ Serveur App isolé du réseau Proxmox
- ✅ Firewall strictes entre les deux

**Configuration recommandée:**
```bash
# Proxmox: Firewall
ufw allow 8006/tcp from 192.168.1.20  # Uniquement Serveur 2
ufw deny 8006/tcp                     # Bloquer les autres

# Serveur App: Firewall
ufw allow 80/tcp        # HTTP
ufw allow 443/tcp       # HTTPS
ufw allow 22/tcp        # SSH
ufw deny incoming       # Bloquer tout par défaut
```

---

## 📈 Dimensionnement Hardware

### Pour Architecture 1

```
Configuration Légère (20 utilisateurs):
├─ CPU: 12 cores (8 Proxmox + 4 App)
├─ RAM: 32GB (20 Proxmox + 12 App)
└─ Storage: 1TB

Configuration Moyenne (50 utilisateurs):
├─ CPU: 16 cores (8 Proxmox + 8 App)
├─ RAM: 64GB (32 Proxmox + 32 App)
└─ Storage: 2TB

Configuration Lourde (100 utilisateurs):
├─ CPU: 24 cores (12 Proxmox + 12 App)
├─ RAM: 96GB (48 Proxmox + 48 App)
└─ Storage: 3TB
```

### Pour Architecture 2

```
Configuration Standard:
├─ Serveur 1 (Proxmox): 16 cores, 32GB RAM, 2TB storage
├─ Serveur 2 (App): 8 cores, 16GB RAM, 200GB storage
└─ Total: 24 cores, 48GB RAM

High Availability:
├─ Serveur 1 (Proxmox): 16 cores, 32GB RAM, 2TB storage
├─ Serveur 2 (App): 8 cores, 16GB RAM, 200GB storage
├─ Serveur 3 (App - Backup): 8 cores, 16GB RAM, 200GB storage
├─ Serveur 4 (DB): 4 cores, 8GB RAM, 500GB storage
└─ Total: 36 cores, 72GB RAM
```

---

## 🎓 Exemple: Déploiement pour École

### Petite École (20 étudiants)
**Architecture 1 recommandée**
```
1 Serveur Proxmox:
├─ 16 cores
├─ 64GB RAM
├─ 1TB storage
├─ Docker + Application
├─ 6 Templates
└─ 20 Labs simultanés max

Coût: ~1000€ (petite machine)
Temps setup: 2 heures
```

### Grande Université (500 étudiants)
**Architecture 2 recommandée**
```
Serveur 1 - Proxmox:
├─ 32 cores
├─ 128GB RAM
├─ 4TB storage
├─ Hypervisor uniquement

Serveur 2 - Application:
├─ 16 cores
├─ 64GB RAM
├─ 500GB storage
├─ Docker + Application

Serveur 3 - Database:
├─ 8 cores
├─ 32GB RAM
├─ 1TB storage
├─ PostgreSQL + Backups

Serveur 4 - App Backup:
├─ Réplique du Serveur 2 (High Availability)

Coût: ~10000€
Temps setup: 1 journée
```

---

## 🎯 RECOMMANDATION FINALE

### ✅ **Pour commencer / Démo / Petite école:**
**→ Architecture 1 (TOUT SUR PROXMOX)**

**Installation:**
```bash
# 1. Installer Proxmox (30 min)
# 2. Installer Docker sur Proxmox (10 min)
# 3. Déployer application (make setup) (10 min)
# 4. Accéder http://proxmox:3000 (5 min)

TOTAL: 1 heure
```

### ⚙️ **Pour production / Scaling / Entreprise:**
**→ Architecture 2 (SÉPARATION)**

**Installation:**
```bash
# 1. Installer Proxmox sur Serveur 1 (30 min)
# 2. Installer Docker sur Serveur 2 (10 min)
# 3. Configurer Firewall + Networking (30 min)
# 4. Déployer application (10 min)
# 5. Configurer Nginx + SSL (20 min)

TOTAL: 2-3 heures
```

---

## 📞 Mise à Jour du Guide

Pour les fichiers de documentation:

**Ajouter à [SERVER_VM_SETUP.md](SERVER_VM_SETUP.md):**
- ✅ Section "Architecture Choices"
- ✅ Comparison tableau
- ✅ Configuration pour chaque approche

**Ajouter à [USAGE_GUIDE.md](USAGE_GUIDE.md):**
- ✅ Installation selon architecture
- ✅ Configuration .env adaptée

---

## 🎉 Résumé

**Architecture 1 (TOUT SUR PROXMOX):**
- ✅ Simple, rapide, économique
- ❌ Pas de redondance
- 📍 Idéal pour: école, startup, démo

**Architecture 2 (SÉPARATION):**
- ✅ Scalable, sécurisé, HA
- ❌ Complexe, coûteux
- 📍 Idéal pour: entreprise, production

---

**Quelle architecture choisissez-vous?** 🤔
