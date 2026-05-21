# ⚡ Démarrage Rapide - 5 minutes

**Lancez LabOrchestrator en 5 minutes chrono!**

---

## 🎯 Objectif

À la fin: Vous aurez une app fonctionnelle sur http://localhost:3000 avec accès complet.

**Temps:** ⏱️ 5 minutes (+ temps téléchargement)

---

## 📋 Prérequis (1 min)

### **Vérifier que vous avez**

```bash
# 1. Git
git --version
# Output: git version 2.x.x ✓

# 2. Node.js 18+
node --version
# Output: v18.x.x ou plus ✓

# 3. Docker + Docker Compose (si vous utilisez Docker)
docker --version
docker-compose --version
```

**Pas installé?** → [Guide Installation](INSTALL.md)

---

## 🚀 Lancer (4 min)

### **Option A: Docker (Super facile) ⭐**

**Terminal - Exécutez ces 3 commandes:**

```bash
# 1. Cloner le projet
git clone https://github.com/Tom-rib/LabOrchestrator.git
cd LabOrchestrator

# 2. Démarrer (une seule commande!)
docker-compose up -d

# 3. Attendre 30 sec + accéder
# http://localhost:3000
```

**C'est tout!** ✨

---

### **Option B: Local (Dev mode)**

**Terminal 1:**
```bash
git clone https://github.com/Tom-rib/LabOrchestrator.git
cd LabOrchestrator/backend
npm install
npm run dev
# Ctrl+C pour arrêter
```

**Terminal 2:**
```bash
cd LabOrchestrator/frontend
npm install
npm run dev
```

**Puis:** http://localhost:3000

---

## 🌐 Accéder à l'Application

### **URL**
```
http://localhost:3000
```

### **Identifiants**
```
Username: admin
Password: admin123
```

### **Vérification rapide**

Vous devez voir:
- ✅ Page de login
- ✅ Bouton "Sign in"
- ✅ Après login: Dashboard avec quotas
- ✅ Bouton "Create Lab"

---

## 🎮 Test Rapide (1 min)

### **Créer un lab de test**

1. **Se connecter** avec admin/admin123
2. **Cliquer** "Create Lab"
3. **Sélectionner** un lab (ex: RHCSA)
4. **Cliquer** "Create"

**Résultat attendu:**
```
✓ Lab créé
✓ VMID généré (300-399)
✓ IP assignée (192.168.122.x)
✓ Status: "pending" → "running" (après 15 sec en mode mock)
✓ Bouton SSH apparaît
```

### **Voir le Dashboard Admin**

1. **Cliquer** sur "Admin" (en haut)
2. **Voir:**
   - Liste des utilisateurs
   - Labs actifs
   - Quotas utilisés

---

## 📊 Vérifier que ça marche

### **API Health Check**

```bash
curl http://localhost:3001/api/health
# Output: {"status":"ok"}
```

### **Voir les logs**

```bash
# Docker
docker-compose logs -f api

# Local
# Les logs s'affichent dans le terminal
```

### **Voir les services Docker**

```bash
docker-compose ps

# Output:
# NAME                        STATUS
# ephemeral-labs-api          Up
# ephemeral-labs-frontend     Up
# redis                       Up
```

---

## 🎯 Prochaines Étapes

### **Après les 5 minutes**

1. **Lire** [USAGE.md](USAGE.md) - Comment utiliser
2. **Consulter** [docs/QUICKSTART.md](docs/QUICKSTART.md) - Plus de détails
3. **Configurer Proxmox** (optionnel) - Voir [docs/PROXMOX_ISO_DOWNLOAD_UPLOAD.md](docs/PROXMOX_ISO_DOWNLOAD_UPLOAD.md)

---

## ❌ Ça ne marche pas?

### **"Connection refused" sur http://localhost:3000**

```bash
# Vérifier que Docker tourne
docker-compose ps

# Si pas UP:
docker-compose up -d

# Attendre 30 secondes et réessayer
sleep 30
```

### **"Cannot connect to database"**

```bash
# Réinitialiser la base de données
docker-compose down -v
docker-compose up -d
```

### **"Port 3000 already in use"**

```bash
# Arrêter l'ancien processus
docker-compose down

# Puis relancer
docker-compose up -d
```

**Plus de problèmes?** → [INSTALL.md - Troubleshooting](INSTALL.md#-troubleshooting-installation)

---

## 💡 Conseils

### **Mode Mock vs Mode Réel**

Actuellement, vous êtes en **mode mock**:
- ✅ VMs créées en simulation
- ✅ Pas besoin de Proxmox
- ✅ Parfait pour tester
- ✓ Après 15 sec, les VMs simulent un démarrage

**Pour utiliser une vraie Proxmox:**
- 🔧 Configurer `.env`: `PROXMOX_MODE=real`
- 🖥️ Setup les 6 templates (VMID 100-105)
- 🚀 Les labs utiliseront les vraies VMs!

### **Commandes utiles**

```bash
# Arrêter l'app
docker-compose down

# Voir les logs
docker-compose logs -f api
docker-compose logs -f frontend

# Réinitialiser complètement
docker-compose down -v
docker-compose up -d

# Rebuild les images
docker-compose build
docker-compose up -d
```

### **Accéder à Redis**

```bash
# Se connecter à Redis (si besoin)
docker-compose exec redis redis-cli
# Puis: PING (devrait répondre PONG)
```

---

## ✅ Checklist Démarrage

```
 [ ] Git clonéé
 [ ] docker-compose up -d lancé (ou npm run dev)
 [ ] Attendre 30 sec
 [ ] http://localhost:3000 ouvert
 [ ] Login admin/admin123 OK
 [ ] Dashboard chargé
 [ ] Créer un lab test OK
 [ ] Admin panel visible
 [ ] Voir les quotas
```

---

## 🎓 Vous êtes prêt! 🎉

**Bravo!** Vous avez installé LabOrchestrator en 5 minutes.

**Prochaines étapes:**

1. 📖 **Lire** [USAGE.md](USAGE.md) pour apprendre à l'utiliser
2. 🏗️ **Voir** [docs/ARCHITECTURE_CHOICE.md](docs/ARCHITECTURE_CHOICE.md) pour le déploiement
3. 🖥️ **Configurer** Proxmox (optionnel) pour les vrais labs

---

## 🤔 Besoin d'aide?

- **Installation complète?** → [INSTALL.md](INSTALL.md)
- **Comment utiliser?** → [USAGE.md](USAGE.md)
- **Configuration avancée?** → [docs/USAGE_GUIDE.md](docs/USAGE_GUIDE.md)
- **Problèmes?** → [INSTALL.md#-troubleshooting](INSTALL.md#-troubleshooting-installation)

---

**Enjoy! 🚀**
