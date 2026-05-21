#!/usr/bin/env markdown

# ⚡ Quick Start - 10 Minutes

Déployez la plateforme labs pour votre école **en moins de 10 minutes**.

## 📋 Checklist Prérequis

- [ ] Proxmox opérationnel (starfleet.lan) avec token API
- [ ] Serveur Ubuntu 22.04 / Debian 12
- [ ] Docker & Docker Compose installés
- [ ] Certificat SSL (auto-signé OK pour dev)
- [ ] Accès root sur le serveur

## 🚀 Installation (10 min)

### 1. Cloner & Naviguer (1 min)

```bash
# SSH sur le serveur
ssh root@labs.example.com

# Créer le répertoire
mkdir -p /opt/ephemeral-labs
cd /opt/ephemeral-labs

# Copier les fichiers (ou git clone)
# ...ou via git:
git clone https://github.com/laplateforme/ephemeral-labs.git .

ls -la  # Vérifier
```

### 2. Créer .env (2 min)

```bash
# Générer des secrets
JWT=$(openssl rand -hex 32)
DB_PASS=$(openssl rand -base64 16)
ADMIN=$(openssl rand -hex 32)

# Créer le fichier
cat > .env <<EOF
API_PORT=3001
FRONTEND_PORT=3000
JWT_SECRET=$JWT

FRONTEND_HOST=labs.example.com
PROXMOX_HOST=starfleet.lan
PROXMOX_TOKEN=PVEAPIToken=root@pam!api-token=PUT_YOUR_TOKEN_HERE
PROXMOX_NODE=pve
PROXMOX_STORAGE=local-lvm

DB_USER=admin
DB_PASSWORD=$DB_PASS

GRAFANA_PASSWORD=$(openssl rand -base64 12)
ADMIN_TOKEN=$ADMIN

ENABLE_SSO=false
ENABLE_NOTIFICATIONS=false
ENABLE_MONITORING=true
EOF

chmod 600 .env
cat .env  # Vérifier
```

### 3. Créer Certificate SSL (2 min)

```bash
# Pour développement (self-signed)
mkdir -p ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/key.pem \
  -out ssl/cert.pem \
  -subj "/CN=labs.example.com"

# Production: utiliser Let's Encrypt
# sudo certbot certonly --standalone -d labs.example.com
# sudo cp /etc/letsencrypt/live/labs.example.com/*.pem ssl/
```

### 4. Démarrer les Services (3 min)

```bash
# Build images
docker-compose build

# Lancer
docker-compose up -d

# Attendre ~30 secondes pour l'initialisation
sleep 30

# Vérifier
docker-compose ps
```

### 5. Vérifier (2 min)

```bash
# Health check
curl http://localhost:3001/api/health
# {"status":"ok","timestamp":"..."}

# Frontend
curl http://localhost:3000
# <html>...</html>

# Accès web
open https://labs.example.com
# ou
firefox https://labs.example.com
```

## 👥 Importer Étudiants (5 min)

### Créer le CSV

```bash
cat > students.csv <<'EOF'
username,email,full_name
alice,alice@laplateforme.io,Alice Dupont
bob,bob@laplateforme.io,Bob Martin
charlie,charlie@laplateforme.io,Charlie Moreau
david,david@laplateforme.io,David Blanc
emma,emma@laplateforme.io,Emma Legrand
EOF
```

### Importer

```bash
# Installer dépendances Python
pip3 install bcrypt requests

# Importer
python3 scripts/import_students.py students.csv --yes

# Vérifier
sqlite3 data/labs.db "SELECT count(*) FROM users;"
# Résultat: 5 (+ 1 admin)
```

## 🔑 Premiers Logins

```bash
# Admin (créé automatiquement)
# Username: admin
# Password: admin (CHANGER IMMÉDIATEMENT!)

# Étudiants (créés par import)
# Username: alice, bob, charlie, ...
# Password: [username] (ex: alice pour alice)
```

## 🎯 Premier Test

### 1. Login Admin

```
Navigate to: https://labs.example.com/admin
Login: admin / admin
```

### 2. Créer un étudiant test

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "test123",
    "full_name": "Test User"
  }'
```

### 3. Login étudiant

```
Navigate to: https://labs.example.com
Login: testuser / test123
```

### 4. Créer un lab

```
- Cliquer "Créer un Lab"
- Sélectionner "RHCSA Lab"
- Cliquer "Lancer"
- Attendre ~30 secondes
- Voir le lab se créer dans le dashboard
```

## 📊 Dashboard Admin

```
URL: https://labs.example.com/admin
Login: admin / admin

Sections:
- Users: Voir/Modifier étudiants + quotas
- Labs: Tous les labs créés
- Stats: Utilisation CPU/RAM/Disk
- Settings: Configuration plateforme
```

## 🐛 Troubleshooting Rapide

### "Connection refused" à Proxmox

```bash
# Vérifier la connectivité
ping starfleet.lan

# Vérifier le token
grep PROXMOX_TOKEN .env

# Tester l'API Proxmox
curl -k https://starfleet.lan:8006/api2/json/version
```

### API n'a pas démarré

```bash
# Voir les logs
docker-compose logs api

# Redémarrer
docker-compose down
docker-compose up -d api
docker-compose logs -f api
```

### Base de données non initialisée

```bash
# Réinitialiser complètement
docker-compose down
rm -rf data/labs.db
docker-compose up -d
sleep 10
python3 scripts/import_students.py students.csv
```

## 📈 Scaling (facultatif)

Pour une classe complète (50-100 étudiants):

### Option 1: Multi-nœuds Proxmox

```bash
# Modifier dans .env
PROXMOX_NODES=pve1,pve2,pve3  # Cluster
PROXMOX_STORAGE=shared-storage # NFS/CEPH
```

### Option 2: Load balancer

```bash
# Ajouter Nginx avec upstream API multiples
# Éditer nginx.conf

upstream api {
  server api:3001;
  server api2:3001;
  server api3:3001;
}
```

### Option 3: Database PostgreSQL

Déjà inclus dans docker-compose.yml, il suffit d'activer dans l'API.

## 📞 Support

**Problème?** Consultez DEPLOYMENT.md (documentation complète)

**Logs?** `docker-compose logs -f [service]`

**Reset complet?** 
```bash
docker-compose down -v
rm -rf data/* ssl/*
# Recommencer du step 2
```

## ✅ Checklist Final

- [ ] Services up: `docker-compose ps`
- [ ] API répond: `curl http://localhost:3001/api/health`
- [ ] Frontend accessible: navigateur vers https://labs.example.com
- [ ] Étudiants importés: `sqlite3 data/labs.db "SELECT COUNT(*) FROM users;"`
- [ ] Login fonctionne: essayer admin/admin
- [ ] Créer lab fonctionne: essayer de créer un lab test
- [ ] Proxmox intégré: vérifier les VMs dans Proxmox

## 🎉 C'est prêt!

La plateforme fonctionne et est prête pour:

✅ Classes pratiques (Étudiants créent leurs labs)  
✅ Travaux de groupe (Quotas personnalisés)  
✅ Examens pratiques (100s d'étudiants simultanés)  
✅ Tutoriels auto-apprentissage (24/7 disponible)  

**Prochaines étapes:**

1. **Configurez les quotas** par classe/groupe dans le panel Admin
2. **Importez tous les étudiants** via le CSV import tool
3. **Testez avec un petit groupe** avant le déploiement complet
4. **Activez les notifications email** (optionnel)
5. **Mettez en place les backups** (scripts/backup.sh)

---

**Questions?** Contactez labs-support@laplateforme.io  
**Documentation complète:** Voir DEPLOYMENT.md  
**Status:** Production-ready ✅

Bonne chance! 🚀
