# 📥 Télécharger et Uploader les ISO sur Proxmox

Guide rapide pour obtenir les ISO et les mettre sur Proxmox.

---

## 📥 Étape 1: Télécharger les ISO

### **ISO à télécharger:**

```
1. Rocky Linux 8.8
   URL: https://rockylinux.org/download
   Fichier: Rocky-8.8-x86_64-dvd.iso
   Taille: 3.5 GB
   Checksum: Vérifier sur le site (importante!)

2. Ubuntu 22.04 LTS
   URL: https://ubuntu.com/download/server
   Fichier: ubuntu-22.04-live-server-amd64.iso
   Taille: 1.3 GB
   Note: Utiliser pour Docker, Kubernetes, Terraform

3. Debian 12
   URL: https://www.debian.org/download
   Fichier: debian-12.0.0-amd64-netinst.iso
   Taille: 650 MB
   Note: Utiliser pour CTF

4. Rocky Linux 9.1
   URL: https://rockylinux.org/download
   Fichier: Rocky-9.1-x86_64-dvd.iso
   Taille: 3.7 GB
   Note: Utiliser pour Ansible
```

**Total: ~9 GB**

### **Où télécharger?**

Sur votre PC Windows/Linux/Mac:
- Créer un dossier: `C:\ISOs` (ou `/home/user/ISOs`)
- Télécharger les fichiers dedans
- **Vérifier les checksums** (important!)

---

## 📤 Étape 2: Uploader sur Proxmox

### **Option A: Interface Web (Facile)**

```
1. Ouvrir https://your-proxmox-ip:8006
2. Se connecter (root@pam + password)
3. Aller à: Datacenter → Storage → local
4. Onglet "Content"
5. Bouton "Upload"
6. Sélectionner votre ISO
7. Attendre (peut être long: 5-15 min par ISO)
8. Répéter pour les 4 ISO

Avantage: GUI simple
Inconvénient: Lent, dépend du réseau
```

### **Option B: SCP depuis votre PC (Rapide)**

**Sur Windows (PowerShell):**

```powershell
# D'abord, installer WinSCP ou utiliser scp directement
# Installer scp: choco install openssh -y

# Puis, uploader les ISO
scp C:\ISOs\Rocky-8.8-x86_64-dvd.iso root@your-proxmox-ip:/var/lib/vz/template/iso/
scp C:\ISOs\ubuntu-22.04-live-server-amd64.iso root@your-proxmox-ip:/var/lib/vz/template/iso/
scp C:\ISOs\debian-12.0.0-amd64-netinst.iso root@your-proxmox-ip:/var/lib/vz/template/iso/
scp C:\ISOs\Rocky-9.1-x86_64-dvd.iso root@your-proxmox-ip:/var/lib/vz/template/iso/

# Vous sera demandé le password root
```

**Sur Mac/Linux (Terminal):**

```bash
scp ~/ISOs/Rocky-8.8-x86_64-dvd.iso root@your-proxmox-ip:/var/lib/vz/template/iso/
scp ~/ISOs/ubuntu-22.04-live-server-amd64.iso root@your-proxmox-ip:/var/lib/vz/template/iso/
scp ~/ISOs/debian-12.0.0-amd64-netinst.iso root@your-proxmox-ip:/var/lib/vz/template/iso/
scp ~/ISOs/Rocky-9.1-x86_64-dvd.iso root@your-proxmox-ip:/var/lib/vz/template/iso/
```

**Avantage:** Beaucoup plus rapide
**Inconvénient:** Besoin de SSH

### **Option C: Télécharger directement sur Proxmox (Plus rapide!)**

**SSH dans Proxmox et télécharger directement:**

```bash
# SSH dans Proxmox
ssh root@your-proxmox-ip

# Créer le dossier
mkdir -p /var/lib/vz/template/iso

# Télécharger avec wget
cd /var/lib/vz/template/iso

# Rocky 8
wget https://download.rockylinux.org/releases/8.8/isos/x86_64/Rocky-8.8-x86_64-dvd.iso

# Ubuntu 22.04
wget https://releases.ubuntu.com/jammy/ubuntu-22.04-live-server-amd64.iso

# Debian 12
wget https://cdimage.debian.org/debian-cd/current/amd64/iso-dvd/debian-12.0.0-amd64-dvd-1.iso

# Rocky 9
wget https://download.rockylinux.org/releases/9.1/isos/x86_64/Rocky-9.1-x86_64-dvd.iso

# Vérifier
ls -lh /var/lib/vz/template/iso/

# Output:
# Rocky-8.8-x86_64-dvd.iso        3.5G
# ubuntu-22.04-live-server-amd64.iso  1.3G
# debian-12.0.0-amd64-dvd-1.iso   650M
# Rocky-9.1-x86_64-dvd.iso        3.7G
```

**Avantage:** Très rapide (dépend de la bande passante du serveur Proxmox)
**Inconvénient:** Vous devez avoir SSH

---

## ✅ Vérifier que les ISO sont bien uploadées

**Via l'interface Proxmox:**

```
1. Datacenter → Storage → local
2. Onglet "Content"
3. Vous devez voir vos 4 ISO listées
```

**Via SSH sur Proxmox:**

```bash
ls -lh /var/lib/vz/template/iso/

# Output attendu:
# -rw-r--r-- 1 root root 3.5G May 20 10:00 Rocky-8.8-x86_64-dvd.iso
# -rw-r--r-- 1 root root 1.3G May 20 10:15 ubuntu-22.04-live-server-amd64.iso
# -rw-r--r-- 1 root root 650M May 20 10:30 debian-12.0.0-amd64-dvd-1.iso
# -rw-r--r-- 1 root root 3.7G May 20 10:45 Rocky-9.1-x86_64-dvd.iso
```

---

## 🎯 Résumé du processus

```
1. Télécharger 4 ISO (~9GB)
   Rocky 8.8, Ubuntu 22.04, Debian 12, Rocky 9.1

2. Uploader sur Proxmox
   Option A: Web GUI (lent)
   Option B: SCP (rapide)
   Option C: wget direct sur Proxmox (très rapide!)

3. Vérifier dans Proxmox
   Voir les ISO dans: Datacenter → Storage → local

4. Créer les 6 templates
   Utiliser PROXMOX_TEMPLATES_CREATION.md
   VMID 100-105
   Installer cloud-init sur chaque!

5. Configurer Proxmox dans .env
   PROXMOX_MODE=real
   PROXMOX_HOST=your-proxmox-ip:8006
   PROXMOX_TOKEN=root@pam!token
   PROXMOX_NODE=pve

6. Lancer l'application
   docker-compose up -d
   Accéder à http://localhost:3000
   Créer un lab → Clone d'une template → VM automatique!
```

---

## ⚠️ Trucs Importants

### **Vérifier les checksums**

Les checksums évitent d'avoir des ISO corrompues:

```bash
# Télécharger le fichier SHA256SUMS du site
# Sur Ubuntu:
sha256sum -c ubuntu-22.04-live-server-amd64.iso

# Output: ubuntu-22.04-live-server-amd64.iso: OK
```

### **Espace disque**

Vérifier que Proxmox a assez d'espace:

```bash
# SSH sur Proxmox
df -h /var/lib/vz/

# Output example:
# Filesystem      Size  Used Avail Use%
# /dev/mapper/... 2.0T  500G  1.5T  25%

# Vous avez besoin de 10GB minimum pour les ISO
```

### **Temps de téléchargement**

- **Option A (Web):** 10-30 min par ISO (dépend de votre connexion)
- **Option B (SCP):** 5-15 min par ISO
- **Option C (wget sur Proxmox):** 2-5 min par ISO

---

## 🚀 Prochaine étape

Une fois les ISO uploadées:

1. Aller à [PROXMOX_TEMPLATES_CREATION.md](PROXMOX_TEMPLATES_CREATION.md)
2. Créer les 6 templates (VMID 100-105)
3. Configurer cloud-init sur chaque
4. Convertir en templates
5. Tester un clone

**Puis:** L'application peut cloner et créer les labs éphémères automatiquement! 🚀

---

## 📞 Besoin d'aide?

Commandes utiles:

```bash
# Voir l'espace disque
df -h /var/lib/vz/

# Voir la vitesse de téléchargement (en SSH)
watch -n 1 'ls -lh /var/lib/vz/template/iso/ | tail -5'

# Annuler un téléchargement
# Ctrl+C (si en SSH)
# Ou supprimer le fichier partiel:
rm -f /var/lib/vz/template/iso/*.iso.tmp

# Vérifier l'intégrité d'une ISO
# (après téléchargement)
sha256sum /var/lib/vz/template/iso/Rocky-8.8-x86_64-dvd.iso
```

Good luck! 🍀
