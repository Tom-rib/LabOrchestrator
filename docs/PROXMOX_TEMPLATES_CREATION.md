# 🛠️ Créer les Templates VMs sur Proxmox

Guide complet pour créer les 6 templates VMs nécessaires pour Ephemeral Labs.

---

## 📋 Vue d'ensemble

Vous allez créer **6 templates** (VMID 100-105):

| VMID | Template | OS | Purpose |
|------|----------|----|----|
| 100 | rhcsa | Rocky Linux 8 | Red Hat Admin certification labs |
| 101 | docker | Ubuntu 22.04 | Docker/Container labs |
| 102 | kubernetes | Ubuntu 22.04 | Kubernetes/K8s labs |
| 103 | ctf | Debian 12 | Capture The Flag security labs |
| 104 | terraform | Ubuntu 22.04 | Infrastructure as Code labs |
| 105 | ansible | Rocky Linux 9 | Ansible automation labs |

**Important:** Les VMID 100-105 sont réservés à vos templates. Les labs clonés utiliseront VMID 300-999.

---

## 🚀 Étape 1: Créer le Template RHCSA (VMID 100)

### A. Créer une nouvelle VM depuis l'ISO Rocky 8

**Via l'interface Proxmox:**

1. Datacenter → Créer VM
2. **General:**
   - Node: pve (votre nœud)
   - VM ID: 100
   - Name: template-rhcsa
   - Resource Pool: (laisser vide)

3. **OS:**
   - Type: Linux
   - Version: Rocky Linux (ou CentOS)
   - ISO Image: Rocky-8.8-x86_64-dvd.iso

4. **System:**
   - Firmware: OVMF (UEFI)
   - Machine: q35
   - SCSI Controller: VirtIO SCSI

5. **Disks:**
   - Bus/Device: SCSI
   - Storage: local-lvm (ou votre storage)
   - Disk size: 20 GB (pour RHCSA, 20GB c'est bon)
   - Discard: ✓

6. **CPU:**
   - Cores: 2 (pour template, on peut garder petit)
   - Type: host

7. **Memory:**
   - RAM: 2 GB

8. **Network:**
   - Bridge: vmbr0 (votre bridge principal)
   - Model: VirtIO

9. **Confirm** et créer

### B. Installer Rocky Linux 8

1. Dans l'onglet Console de la VM, lancer le boot
2. Sélectionner "Install Rocky Linux 8"
3. **Installation Summary:**
   - Hostname: `template-rhcsa` (IMPORTANT!)
   - Network: activer et configurer DHCP
   - Installation Destination: Sélectionner le disque (vda)
   - Root Password: `root123456` (temporaire)
   - User: `student` avec pwd `student123`
   - Finish Installation

4. **Après l'installation:**

```bash
# SSH dans la VM (depuis Proxmox ou un autre PC)
ssh -l root <template-rhcsa-ip>

# Mettre à jour
dnf update -y

# Installer cloud-init (TRÈS IMPORTANT!)
dnf install -y cloud-init

# Configurer cloud-init pour démarrage automatique
systemctl enable cloud-init
systemctl enable cloud-final
systemctl enable cloud-config

# Installer SSH si pas là
dnf install -y openssh-server openssh-clients
systemctl enable sshd

# Nettoyer (pour template)
rm -f /etc/ssh/ssh_host_*
truncate -s 0 /etc/machine-id
```

### C. Arrêter et créer le template

```bash
# Sur Proxmox (SSH root)
# Arrêter la VM
qm shutdown 100 --timeout 10

# Une fois arrêtée, créer le template
qm template 100
```

Ou via l'interface: **Clic droit sur VM → Convert to template**

---

## 🚀 Étape 2-6: Créer les autres templates

**Le processus est similaire pour chaque template:**

### Template Docker (VMID 101)

```bash
# Installation ISO: ubuntu-22.04.1-live-server-amd64.iso
# Mêmes étapes que RHCSA, mais:
# - Hostname: template-docker
# - OS: Ubuntu 22.04
# - Disk: 30GB (Docker a besoin de plus d'espace)
# - RAM: 2GB (minimum)

# Après installation:
apt-get update
apt-get install -y cloud-init openssh-server
apt-get install -y docker.io
systemctl enable docker
systemctl enable cloud-init

# Nettoyer
rm -f /etc/ssh/ssh_host_*
truncate -s 0 /etc/machine-id
# Arrêter et créer template
```

### Template Kubernetes (VMID 102)

```bash
# Installation ISO: ubuntu-22.04.1-live-server-amd64.iso (MÊME QUE DOCKER)
# Mêmes étapes que Docker
# - Hostname: template-kubernetes
# - Disk: 50GB (Kubernetes a besoin de plus!)
# - RAM: 4GB (recommandé)

# Après installation:
apt-get update
apt-get install -y cloud-init openssh-server
apt-get install -y docker.io
apt-get install -y kubeadm kubelet kubectl

systemctl enable docker
systemctl enable cloud-init
systemctl enable kubelet

# Nettoyer et créer template
```

### Template CTF (VMID 103)

```bash
# Installation ISO: debian-12.0.0-amd64-netinst.iso
# - Hostname: template-ctf
# - Disk: 25GB
# - RAM: 2GB

# Après installation:
apt-get update
apt-get install -y cloud-init openssh-server
apt-get install -y curl wget git build-essential

systemctl enable cloud-init

# Nettoyer et créer template
```

### Template Terraform (VMID 104)

```bash
# Installation ISO: ubuntu-22.04.1-live-server-amd64.iso
# - Hostname: template-terraform
# - Disk: 20GB
# - RAM: 2GB

# Après installation:
apt-get update
apt-get install -y cloud-init openssh-server
apt-get install -y curl wget git

# Installer Terraform
wget https://releases.hashicorp.com/terraform/1.5.0/terraform_1.5.0_linux_amd64.zip
unzip terraform_1.5.0_linux_amd64.zip -d /usr/local/bin/

systemctl enable cloud-init

# Nettoyer et créer template
```

### Template Ansible (VMID 105)

```bash
# Installation ISO: rocky-9.1-x86_64-dvd.iso
# - Hostname: template-ansible
# - Disk: 20GB
# - RAM: 2GB

# Après installation:
dnf update -y
dnf install -y cloud-init openssh-server
dnf install -y python3-pip

# Installer Ansible
pip3 install ansible

systemctl enable cloud-init

# Nettoyer et créer template
```

---

## 🔧 Configuration Cloud-Init (Crucial!)

**Cloud-init permet à l'app de configurer les VMs automatiquement!**

Créer un fichier `/etc/cloud/cloud.cfg.d/99-lab.cfg` sur CHAQUE template:

```yaml
#cloud-config
datasource:
  CloudStack:
    # Récupérer les métadonnées de Proxmox
    metadata_urls:
      - http://169.254.169.254
    
users:
  - name: root
    lock_passwd: false
    
  - name: student
    groups: sudo
    sudo: ALL=(ALL) NOPASSWD:ALL
    lock_passwd: false
    
hostname: ${HOSTNAME}
fqdn: ${HOSTNAME}.lab.local

# Auto-configurer le réseau
datasource_list: [ CloudStack ]
```

---

## 📋 Vérifier que tout est OK

```bash
# Sur Proxmox, vérifier les templates
qm list | grep "^10[0-5]"

# Output attendu:
# 100        template-rhcsa       stopped   2048
# 101        template-docker      stopped   2048
# 102        template-kubernetes  stopped   4096
# 103        template-ctf         stopped   2048
# 104        template-terraform   stopped   2048
# 105        template-ansible     stopped   2048

# Vérifier qu'ils sont templates
qm config 100 | grep template

# Output: template: 1 ✓
```

---

## 🎯 Checklist Création Templates

```
Templates:
 [ ] Template RHCSA (VMID 100)
   [ ] ISO installée
   [ ] Cloud-init configuré
   [ ] Convertie en template
   [ ] Teste: clone et démarre

 [ ] Template Docker (VMID 101)
   [ ] ISO installée
   [ ] Docker installé
   [ ] Cloud-init configuré
   [ ] Convertie en template

 [ ] Template Kubernetes (VMID 102)
   [ ] ISO installée
   [ ] Kubernetes installé
   [ ] Cloud-init configuré
   [ ] Convertie en template

 [ ] Template CTF (VMID 103)
   [ ] ISO installée
   [ ] Cloud-init configuré
   [ ] Convertie en template

 [ ] Template Terraform (VMID 104)
   [ ] ISO installée
   [ ] Terraform installé
   [ ] Cloud-init configuré
   [ ] Convertie en template

 [ ] Template Ansible (VMID 105)
   [ ] ISO installée
   [ ] Ansible installé
   [ ] Cloud-init configuré
   [ ] Convertie en template
```

---

## ⚠️ Troubleshooting

### **"Cloud-init ne démarre pas"**
```bash
# Vérifier les logs
cloud-init status
cloud-init query -a
```

### **"Les VMs clonées ne reçoivent pas d'IP"**
```bash
# Vérifier DHCP sur votre réseau
# Proxmox doit avoir un serveur DHCP actif
# Ou configurer les IP statiques dans cloud-init
```

### **"SSH ne marche pas après clone"**
```bash
# Cloud-init regenere les keys SSH à chaque démarrage
# Vérifier que les permissions sont bonnes:
chmod 600 /etc/ssh/ssh_host_*
```

---

## 🎓 Teste une Template

Pour vérifier que votre template fonctionne:

```bash
# Dans Proxmox
qm clone 100 200 --name test-rhcsa
qm start 200

# Attendre 30 secondes (cloud-init + démarrage)
# Voir l'IP
qm guest cmd 200 get-status

# SSH dedans
ssh root@<ip-de-vm-200>
# Doit marcher!

# Supprimer le test
qm destroy 200
```

---

## 🚀 Prochaine étape

Une fois les 6 templates créés:
1. Configurer `.env` avec les vrais VMID (déjà fait)
2. Changer `PROXMOX_MODE=real` dans `.env`
3. Configurer les credentials Proxmox
4. L'application peut cloner et créer les labs!

**Puis:** L'app utilisera `qm clone TEMPLATE-ID NEW-ID` pour créer les VMs éphémères.

---

## 📖 Référence rapide

```bash
# Lister les templates
qm list | grep template

# Cloner une template
qm clone <template-id> <new-id> --name <name>

# Démarrer une VM
qm start <id>

# Arrêter une VM
qm stop <id>

# Supprimer une VM
qm destroy <id>

# Convertir en template
qm template <id>
```

Good luck! 🚀
