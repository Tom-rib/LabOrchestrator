# 📋 GUIDE COMPLET - SETUP SERVEUR ET VMs

## 🎯 Vue d'ensemble

Ce guide explique comment configurer le serveur Proxmox et créer les VMs templates nécessaires pour la plateforme Ephemeral Labs.

---

## 📊 Architecture Requise

```
┌─────────────────────────────────────────────────────┐
│         Serveur Proxmox (Hypervisor)                │
│         IP: 192.168.1.10 (à adapter)                │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │  Template VMs (Templates à cloner)           │  │
│  ├──────────────────────────────────────────────┤  │
│  │  - rhcsa-template (100-100)                  │  │
│  │  - docker-template (101-101)                 │  │
│  │  - k8s-template (102-102)                    │  │
│  │  - ctf-template (103-103)                    │  │
│  │  - terraform-template (104-104)              │  │
│  │  - ansible-template (105-105)                │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │  Lab VMs (Clonés automatiquement)            │  │
│  │  Range: 300-399 (100 VMs max)                │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  Storage: local-lvm (disques locaux)               │
│  Network: 192.168.122.0/24 (labs)                  │
└─────────────────────────────────────────────────────┘
```

---

## 🔧 PRÉ-REQUIS

### Hardware Minimal
- CPU: 8 cores minimum
- RAM: 16GB minimum
- Storage: 500GB minimum
- 2 interfaces réseau (LAN + Management)

### Logiciels
- Proxmox VE 8.0+
- Token API Proxmox valide
- SSH configuré
- curl/wget pour télécharger les ISO

---

## 📝 ÉTAPE 1: Configuration du Serveur Proxmox

### 1.1 Accéder à Proxmox

```bash
# Interface Web
https://192.168.1.10:8006

# Identifiants par défaut
Username: root@pam
Password: [password défini à l'installation]
```

### 1.2 Configurer le Réseau

**Pour les Labs** (Isolated network):
```bash
# Via Shell Proxmox
pvesh create /nodes/pve/network -iface vmbr1 -type bridge -autostart 1

# Configuration
/etc/network/interfaces:
auto vmbr1
iface vmbr1 inet static
    address 192.168.122.1/24
    bridge-ports none
    bridge-stp off
    bridge-fd 0
```

### 1.3 Créer le Token API

**Via Interface Web:**
```
Datacenter → Permissions → API Tokens → Add
- User: root@pam
- Token ID: ephemeral-labs
- Privilege Separation: ☐ (No)
- Expiry: Never

Token généré: root@pam!ephemeral-labs:xxxxxxxx
```

**Ou via CLI:**
```bash
pveum acl modify / -user root@pam -role Administrator
pveum user add ephemeral-labs@pam
pveum aclmod / -user ephemeral-labs@pam -role PVEAdmin
```

### 1.4 Vérifier la Connectivité

```bash
curl -k -H "Authorization: PVEAPIToken=root@pam!ephemeral-labs:xxxxxxxx" \
  https://192.168.1.10:8006/api2/json/nodes
```

---

## 🖼️ ÉTAPE 2: Créer les Templates VMs

### 2.1 Télécharger les ISO

```bash
cd /var/lib/vz/template/iso

# RHCSA/Fedora
wget https://mirror.example.com/rhel/rhel-9-minimal.iso

# Ubuntu (pour Docker, K8s, etc)
wget https://releases.ubuntu.com/jammy/ubuntu-22.04-live-server-amd64.iso

# Debian (pour CTF)
wget https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/debian-12.1.0-amd64-netinst.iso
```

### 2.2 Créer Template RHCSA (VMID: 100)

```bash
# 1. Créer VM vide
qm create 100 --name rhcsa-template --memory 2048 --cores 2 \
  --sockets 1 --cpu host --net0 virtio,bridge=vmbr0

# 2. Ajouter CD-ROM avec ISO
qm set 100 --cdrom local:iso/rhel-9-minimal.iso

# 3. Ajouter disque dur
qm set 100 --scsi0 local-lvm:30

# 4. Ajouter interface réseau pour labs
qm set 100 --net1 virtio,bridge=vmbr1

# 5. Démarrer et installer l'OS
qm start 100

# Via VNC (Interface Web Proxmox):
# - Console → VNC
# - Installer RHEL 9 minimal
# - Configurer SSH
# - Installer cloud-init (pour auto-config)
```

**Post-installation (via SSH):**
```bash
# Dans la VM RHCSA
sudo yum update -y
sudo yum install -y qemu-guest-agent cloud-init openssh-server

# Configurer cloud-init
sudo systemctl enable cloud-init
sudo systemctl enable qemu-guest-agent

# Préparer la template
sudo poweroff
```

**Convertir en Template:**
```bash
qm set 100 --template 1

# Via Interface Web:
# Hardware → CD/DVD Drive → Détacher
```

### 2.3 Créer Template Docker (VMID: 101)

```bash
# Basé sur Ubuntu
qm create 101 --name docker-template --memory 4096 --cores 4 \
  --sockets 1 --cpu host --net0 virtio,bridge=vmbr0 --net1 virtio,bridge=vmbr1

qm set 101 --cdrom local:iso/ubuntu-22.04-live-server-amd64.iso
qm set 101 --scsi0 local-lvm:40
qm start 101

# Installation:
# - Ubuntu 22.04 Server
# - OpenSSH Server
# - cloud-init

# Post-installation:
sudo apt update && sudo apt upgrade -y
sudo apt install -y qemu-guest-agent cloud-init docker.io

# Ajouter utilisateur docker
sudo usermod -aG docker ubuntu

sudo poweroff
```

**Convertir en Template:**
```bash
qm set 101 --template 1
```

### 2.4 Créer Template Kubernetes (VMID: 102)

```bash
# Basé sur Ubuntu (8GB RAM pour K8s)
qm create 102 --name k8s-template --memory 8192 --cores 4 \
  --sockets 1 --cpu host --net0 virtio,bridge=vmbr0 --net1 virtio,bridge=vmbr1

qm set 102 --cdrom local:iso/ubuntu-22.04-live-server-amd64.iso
qm set 102 --scsi0 local-lvm:60
qm start 102

# Installation similaire à Docker + minikube/kind
```

### 2.5 Créer Template CTF (VMID: 103)

```bash
# Basé sur Debian pour CTF
qm create 103 --name ctf-template --memory 2048 --cores 2 \
  --sockets 1 --cpu host --net0 virtio,bridge=vmbr0 --net1 virtio,bridge=vmbr1

qm set 103 --cdrom local:iso/debian-12-netinst.iso
qm set 103 --scsi0 local-lvm:30
qm start 103

# Installation: Debian minimal + outils CTF (binutils, gdb, python3, etc)
```

### 2.6 Créer Templates Terraform et Ansible (VMID: 104, 105)

```bash
# Terraform (VMID: 104)
qm create 104 --name terraform-template --memory 4096 --cores 4 \
  --sockets 1 --cpu host --net0 virtio,bridge=vmbr0 --net1 virtio,bridge=vmbr1
qm set 104 --cdrom local:iso/ubuntu-22.04-live-server-amd64.iso
qm set 104 --scsi0 local-lvm:40

# Ansible (VMID: 105)
qm create 105 --name ansible-template --memory 2048 --cores 2 \
  --sockets 1 --cpu host --net0 virtio,bridge=vmbr0 --net1 virtio,bridge=vmbr1
qm set 105 --cdrom local:iso/ubuntu-22.04-live-server-amd64.iso
qm set 105 --scsi0 local-lvm:30

# Post-install: Installer terraform, ansible, etc
```

---

## 🔄 ÉTAPE 3: Script de Clonage Automatique

Créer `/opt/proxmox-clone.sh`:

```bash
#!/bin/bash

# Variables
TEMPLATE_ID=$1
LAB_ID=$2
LAB_NAME=$3
TARGET_NODE="pve"

if [ -z "$TEMPLATE_ID" ] || [ -z "$LAB_ID" ] || [ -z "$LAB_NAME" ]; then
    echo "Usage: $0 <template_id> <lab_id> <lab_name>"
    exit 1
fi

echo "Clonage de la template $TEMPLATE_ID vers $LAB_ID ($LAB_NAME)..."

# Cloner la VM
qm clone $TEMPLATE_ID $LAB_ID --name $LAB_NAME --full 1 --target $TARGET_NODE

# Configurer les ressources selon le type
case $LAB_NAME in
    *rhcsa*)
        qm set $LAB_ID --cores 2 --memory 2048
        ;;
    *docker*)
        qm set $LAB_ID --cores 4 --memory 4096
        ;;
    *k8s*)
        qm set $LAB_ID --cores 4 --memory 8192
        ;;
    *ctf*)
        qm set $LAB_ID --cores 2 --memory 2048
        ;;
    *terraform*)
        qm set $LAB_ID --cores 4 --memory 4096
        ;;
    *ansible*)
        qm set $LAB_ID --cores 2 --memory 3072
        ;;
esac

# Démarrer la VM
qm start $LAB_ID

echo "✓ VM $LAB_ID créée et démarrée!"
echo "IP sera assignée via DHCP sur 192.168.122.x"
```

```bash
chmod +x /opt/proxmox-clone.sh
```

---

## 🌐 ÉTAPE 4: Configuration DHCP pour Labs

**Sur une VM de management (Ubuntu/Debian):**

```bash
sudo apt install -y isc-dhcp-server

# /etc/dhcp/dhcpd.conf
subnet 192.168.122.0 netmask 255.255.255.0 {
    range 192.168.122.10 192.168.122.250;
    option routers 192.168.122.1;
    option domain-name-servers 8.8.8.8, 8.8.4.4;
    default-lease-time 3600;
    max-lease-time 7200;
}

sudo systemctl restart isc-dhcp-server
```

---

## 🔌 ÉTAPE 5: Intégration avec l'API

### 5.1 Configurer le Backend

**`.env` du backend:**
```env
PROXMOX_HOST=192.168.1.10
PROXMOX_TOKEN=root@pam!ephemeral-labs:xxxxxxxx
PROXMOX_NODE=pve
PROXMOX_STORAGE=local-lvm
PROXMOX_MODE=real  # Passer de 'mock' à 'real'
```

### 5.2 Implémenter la vraie intégration

Remplacer `backend/proxmox-integration.js` par une implémentation réelle:

```javascript
const axios = require('axios');

const PROXMOX_HOST = process.env.PROXMOX_HOST;
const PROXMOX_TOKEN = process.env.PROXMOX_TOKEN;
const PROXMOX_NODE = process.env.PROXMOX_NODE;

const proxmox = axios.create({
    baseURL: `https://${PROXMOX_HOST}:8006/api2/json`,
    headers: {
        'Authorization': `PVEAPIToken=${PROXMOX_TOKEN}`
    },
    rejectUnauthorizedSSL: false
});

const createVM = async (templateId, vmId, vmName, sessionId) => {
    try {
        // Cloner la template
        await proxmox.post(
            `/nodes/${PROXMOX_NODE}/qemu/${templateId}/clone`,
            {
                newid: vmId,
                name: vmName,
                full: 1
            }
        );

        // Attendre le clonage (polling)
        await waitForTask(response.data.data);

        // Démarrer la VM
        await proxmox.post(
            `/nodes/${PROXMOX_NODE}/qemu/${vmId}/status/start`,
            {}
        );

        // Récupérer l'IP (attendre DHCP)
        const ip = await getVMIP(vmId);

        return { vmid: vmId, ip_address: ip, status: 'running' };
    } catch (error) {
        console.error('Error creating VM:', error);
        throw error;
    }
};

module.exports = { createVM };
```

---

## ✅ CHECKLIST DE CONFIGURATION

### Serveur Proxmox
- [ ] Proxmox VE 8.0+ installé
- [ ] 2 interfaces réseau configurées (vmbr0 + vmbr1)
- [ ] Token API créé et fonctionnel
- [ ] Storage local-lvm disponible avec 500GB+

### Templates VMs
- [ ] RHCSA template (VMID: 100) créée et testée
- [ ] Docker template (VMID: 101) créée et testée
- [ ] Kubernetes template (VMID: 102) créée et testée
- [ ] CTF template (VMID: 103) créée et testée
- [ ] Terraform template (VMID: 104) créée et testée
- [ ] Ansible template (VMID: 105) créée et testée

### Configuration
- [ ] Réseau vmbr1 (192.168.122.0/24) configuré
- [ ] DHCP configuré pour les labs
- [ ] Script de clonage mis en place
- [ ] Connectivité API vérifiée

### API Integration
- [ ] Backend configuré avec vraies credentials Proxmox
- [ ] PROXMOX_MODE=real en production
- [ ] Tests de création VM OK
- [ ] Tests de destruction VM OK

---

## 🚨 TROUBLESHOOTING

### Erreur: "Pas d'IP assignée"
```bash
# Vérifier DHCP
sudo systemctl status isc-dhcp-server
sudo tail -f /var/log/syslog | grep DHCP

# Vérifier le réseau dans la VM
qm terminal <vmid>
# Voir: ip a
```

### Erreur: "Authentification Proxmox échouée"
```bash
# Vérifier le token
pveum verify-api-token root@pam!ephemeral-labs:xxxxxxxx

# Tester la connexion
curl -k -H "Authorization: PVEAPIToken=root@pam!ephemeral-labs:xxxxxxxx" \
  https://192.168.1.10:8006/api2/json/version
```

### Erreur: "Espace disque insuffisant"
```bash
# Vérifier le stockage
pvesh get /storage/local-lvm

# Augmenter le LVM
lvextend -l +50%FREE /dev/pve/data
```

---

## 📊 Mapping Template → Type Lab

| Lab Type | Template VMID | OS | CPU | RAM | Storage |
|----------|--------------|----|----|-----|---------|
| RHCSA | 100 | RHEL 9 | 2 | 2GB | 30GB |
| Docker | 101 | Ubuntu 22 | 4 | 4GB | 40GB |
| Kubernetes | 102 | Ubuntu 22 | 4 | 8GB | 60GB |
| CTF | 103 | Debian 12 | 2 | 2GB | 30GB |
| Terraform | 104 | Ubuntu 22 | 4 | 4GB | 40GB |
| Ansible | 105 | Ubuntu 22 | 2 | 3GB | 30GB |

---

## 🔐 Sécurité Recommandée

```bash
# Pare-feu Proxmox
ufw allow 8006/tcp  # Interface Web
ufw allow 111/tcp   # Proxmox Cluster
ufw allow 3128/tcp  # Spice

# SSH Hardening
# /etc/ssh/sshd_config
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes

# Certificats SSL auto-signés (déjà générés par Proxmox)
# Pour production, utiliser Let's Encrypt:
# acme.sh --issue -d proxmox.example.com
```

---

## 📈 Scaling pour Production

**Pour supporter 100+ étudiants simultanés:**

1. **Ajouter des nodes Proxmox** (cluster)
2. **Utiliser un stockage partagé** (NFS/Ceph)
3. **Augmenter les quotas** par utilisateur
4. **Ajouter un load balancer** (Nginx/HAProxy)
5. **Monitoring** (Grafana/Prometheus)

---

## 📞 Support

Pour les problèmes:
1. Vérifier les logs Proxmox: `pveproxy -d`
2. Vérifier les logs de la VM: `qm terminal <vmid>`
3. Consulter la documentation officielle: https://pve.proxmox.com/wiki/

---

**Généré:** May 20, 2026  
**Version:** 1.0  
**Status:** Production Ready ✅
