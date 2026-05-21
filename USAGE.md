# 📖 Guide d'Utilisation - LabOrchestrator

**Comment utiliser LabOrchestrator au quotidien**

---

## 📋 Table des Matières

1. [Interface Générale](#interface-générale)
2. [Pour les Étudiants](#pour-les-étudiants)
3. [Pour les Admins](#pour-les-admins)
4. [Gestion des Labs](#gestion-des-labs)
5. [Quotas](#quotas)
6. [SSH & Accès](#ssh--accès)
7. [FAQ](#faq)

---

## 🖥️ Interface Générale

### **Après connexion**

```
┌─────────────────────────────────────┐
│  LabOrchestrator  [Admin] [Logout]  │  ← Barre supérieure
├─────────────────────────────────────┤
│                                     │
│  Pour Étudiants:                    │
│  • Dashboard: Voir/créer vos labs   │
│  • Quotas: Voir vos limites         │
│                                     │
│  Pour Admins:                       │
│  • Admin Panel: Gérer tout          │
│  • Utilisateurs: Créer/éditer       │
│  • Labs: Voir tous les labs         │
│                                     │
└─────────────────────────────────────┘
```

### **Barre de navigation**

| Lien | Visible pour | Fonction |
|------|--------------|----------|
| **Logout** | Tous | Se déconnecter |
| **Admin** | Admins seulement | Accès admin panel |
| **Home** | Tous | Retour au dashboard |

---

## 👨‍🎓 Pour les Étudiants

### **Dashboard Étudiant**

C'est votre interface principale après connexion.

**Sections:**

#### **1. Créer un Lab**

```
Section: "Create a New Lab"
┌─ Dropdown ─────────────────────┐
│ Select a Lab Type:             │
│ • RHCSA (Red Hat Admin)        │
│ • Docker (Containerization)    │
│ • Kubernetes (K8s orchestr.)   │
│ • CTF (Security challenge)     │
│ • Terraform (IaC)              │
│ • Ansible (Automation)         │
└────────────────────────────────┘
 [Create Lab]  ← Bouton
```

**Étapes:**
1. Sélectionner un type de lab
2. Cliquer "Create Lab"
3. **Attendre 15-30 sec** pour le provisioning
4. Lab apparaît dans "Active Labs"

#### **2. Quotas**

```
┌─────────────────────────────────────┐
│  Your Quotas (Used / Limit)         │
├─────────────────────────────────────┤
│  Labs:    1 / 10              ▓░░░  │ (10%)
│  CPU:     4 / 32 cores        ▓░░░  │ (12%)
│  RAM:     8 / 64 GB            ▓░░░  │ (12%)
│  Storage: 50 / 500 GB          ▓░░░  │ (10%)
└─────────────────────────────────────┘
```

**Codes couleur:**
- 🟢 **Vert** (<70%): Beaucoup d'espace
- 🟡 **Orange** (70-90%): Attention
- 🔴 **Rouge** (>90%): Limite atteinte!

**Si rouge:** Vous ne pouvez plus créer de labs!
→ Arrêter/supprimer des labs existants

#### **3. Active Labs**

```
Lab #1: RHCSA (docker-rhcsa-001)
┌──────────────────────────────────────┐
│ VMID: 301                            │
│ IP: 192.168.122.50                   │
│ Status: running ✓                    │
│ Created: 2 hours ago                 │
│ Duration: 2h / 2h (expires in 120m)  │
│                                      │
│ [SSH] [VNC] [Copy IP] [Destroy]      │
└──────────────────────────────────────┘
```

**Informations:**
- **VMID**: ID de la machine virtuelle
- **IP**: Adresse IP pour SSH/VNC
- **Status**: En cours d'exécution?
- **Countdown**: Temps avant expiration

**Boutons:**
- **SSH**: Copie commande SSH
- **VNC**: Accès graphique (si disponible)
- **Copy IP**: Copie l'IP
- **Destroy**: Arrêter le lab (libère quotas!)

---

## 👨‍💼 Pour les Admins

### **Admin Panel**

**Accès:** Cliquer sur "Admin" (en haut à droite)

**Tabs:**

#### **Tab 1: Users**

```
┌──────────────────────────────────────────┐
│ All Users                                │
├──────────────────────────────────────────┤
│ # | Username | Email | Role | Active | Edit
├──────────────────────────────────────────┤
│ 1 | admin    | ...   | Admin| ✓ | [Edit]
│ 2 | student1 | ...   | User | ✓ | [Edit]
│ 3 | student2 | ...   | User | ✗ | [Edit]
└──────────────────────────────────────────┘
```

**Options par utilisateur:**

- **Edit**: Changer les quotas
  ```
  student1 quotas:
  • Max Labs: 10
  • Max CPU: 32 cores
  • Max RAM: 64 GB
  • Max Storage: 500 GB
  ```

- **Disable**: Bloquer l'accès
- **Delete**: Supprimer l'utilisateur (attention!)

#### **Tab 2: Labs**

```
┌────────────────────────────────────────────────┐
│ All System Labs                                │
├────────────────────────────────────────────────┤
│ Lab ID | Owner | Type | VMID | Status | Actions
├────────────────────────────────────────────────┤
│ #1 | student1 | RHCSA | 301 | running | [Stop]
│ #2 | student2 | Docker| 302 | pending | [Stop]
│ #3 | admin | CTF | 303 | destroyed | -
└────────────────────────────────────────────────┘

Filter by user: [Search]
```

**Actions:**
- **Stop**: Arrêter un lab
- **View**: Voir les détails
- **Delete**: Supprimer (et libérer ressources)

---

## 🛠️ Gestion des Labs

### **Créer un Lab**

**Étape 1:** Dashboard étudiant
```
Dropdown: "Select a Lab Type"
[Sélectionner type] → RHCSA
Bouton: [Create Lab]
```

**Étape 2:** Attendre le provisioning
```
Status change:
pending (15 sec) → running
```

**Étape 3:** Lab prêt!
```
✓ Lab créé avec VMID et IP
✓ Accessible via SSH
✓ 2h avant expiration
✓ Quotas mis à jour
```

### **Utiliser un Lab**

**Option A: SSH**

```bash
# Copier la commande du dashboard
ssh -i key.pem -p 22 root@192.168.122.50

# Ou entrer manuellement:
ssh root@192.168.122.50
# Password: student123 (ou généré)
```

**Option B: VNC** (graphique)

```
Cliquer [VNC] dans le dashboard
→ Ouvre une console graphique
```

### **Arrêter/Détruire un Lab**

**Automatique:** Après 2h (par défaut), le lab expire et est supprimé

**Manuel:** Cliquer [Destroy]
```
Lab supprimé immédiatement
Quotas libérés
Ressources Proxmox récupérées
```

**Important:** Détruire = perte de données! Faire un backup avant.

---

## 📊 Quotas

### **Comment fonctionnent les quotas?**

```
Chaque utilisateur a des limites:
• Max 10 labs actifs
• Max 32 CPU cores
• Max 64 GB RAM
• Max 500 GB storage

Exemple:
│ Création RHCSA │ Création Docker │ Création K8s
│ (4CPU, 8GB)    │ (4CPU, 8GB)     │ (8CPU, 16GB)
└────────────────┴─────────────────┴──────────────
CPU: 4/32     → 8/32          → 16/32
RAM: 8/64     → 16/64         → 32/64
Lab: 1/10     → 2/10          → 3/10

✓ Autorisé      ✓ Autorisé        ✓ Autorisé

Prochaine création (16CPU, 32GB):
16/32 CPU ✓  mais  64/64 RAM ✗ → BLOQUÉE!
"Insufficient RAM quota"
```

### **Dépasser les quotas?**

```
❌ Ne peut pas créer de lab
❌ Message: "Quota exceeded"

Solution:
✓ Détruire un lab existant
✓ Attendre l'expiration automatique
✓ Demander à l'admin d'augmenter le quota
```

### **Admin: Modifier les quotas**

**Pour un utilisateur:**

1. Admin Panel → Users
2. Trouver l'utilisateur → [Edit]
3. Modifier:
   ```
   Max Labs: 10 → 20
   Max CPU: 32 → 64
   Max RAM: 64 → 128
   Max Storage: 500 → 1000
   ```
4. [Save]

---

## 🔐 SSH & Accès

### **Accès SSH à une VM lab**

**Prérequis:**
- SSH client installé (OpenSSH, PuTTY, etc.)
- La VM est en status "running"

**Méthode 1: Copier depuis le dashboard**

```
1. Cliquer [SSH] sur le lab
2. Copier la commande affichée
3. Coller dans terminal
4. Taper le password si demandé
```

**Méthode 2: Manuel**

```bash
# Récupérer l'IP du lab
# Exemple: 192.168.122.50

# SSH
ssh root@192.168.122.50
# Password: student123 ou autre (voir lab details)

# Avec clé SSH (si configuré)
ssh -i ~/.ssh/lab-key root@192.168.122.50
```

**Méthode 3: Depuis Windows (PuTTY)**

```
1. Ouvrir PuTTY
2. Host: 192.168.122.50
3. Port: 22
4. Protocol: SSH
5. [Open]
6. Username: root
7. Password: (voir le lab)
```

### **Troubleshooting SSH**

| Erreur | Cause | Solution |
|--------|-------|----------|
| Connection refused | VM pas démarrée | Attendre 30 sec |
| Network unreachable | Mauvais réseau | Vérifier IP du lab |
| Permission denied | Mauvais password | Voir les credentials |
| Too many auth failures | Clé SSH mauvaise | Réinstaller la clé |

### **Credentials par défaut**

| Système | User | Password |
|---------|------|----------|
| RHCSA | root | student123 |
| Docker | student | student123 |
| Kubernetes | student | student123 |
| CTF | student | student123 |
| Terraform | student | student123 |
| Ansible | student | student123 |

---

## ❓ FAQ

### **Q: Combien de temps un lab dure?**

**A:** Par défaut, **2 heures**. Après, il est automatiquement supprimé et les ressources libérées.

Pour changer: L'admin modifie `LAB_MAX_DURATION_MINUTES` dans `.env`

---

### **Q: Peux-je créer plusieurs labs?**

**A:** Oui! Jusqu'à votre limite de quota.

Exemple:
- Quota: 10 labs max
- Vous pouvez créer 1 RHCSA + 1 Docker + 1 Kubernetes = 3 labs

Mais si quotas atteints (CPU, RAM), vous ne pouvez pas créer plus.

---

### **Q: Mes données seront sauvegardées?**

**A:** **Non**. Les labs sont éphémères = **temporaires**.

À la fin du lab:
- ✗ Données supprimées
- ✗ VM détruite
- ✗ Quotas libérés

**Sauvegarder avant l'expiration** si besoin!

---

### **Q: Peux-je prolonger un lab?**

**A:** À l'heure actuelle, **non**. 

Workaround: Avant expiration, créer un nouveau lab et migrer vos données.

Future: Un admin peut augmenter la durée max.

---

### **Q: Peux-je créer un lab personnalisé?**

**A:** À l'heure actuelle, les 6 templates sont fixes.

Contact l'admin pour:
- ✓ Ajouter un nouveau type de lab
- ✓ Modifier les specs d'un lab existant
- ✓ Créer une template personnalisée

---

### **Q: Comment savoir ma consommation de ressources?**

**A:** Voir le tableau "Your Quotas" au-dessus des labs.

Affiche:
- Labs utilisés / limites
- CPU / limites
- RAM / limites
- Storage / limites

---

### **Q: Que se passe si j'atteins 100% d'un quota?**

**A:** La création de nouveau lab est **bloquée**.

```
Error: "Insufficient CPU quota"
       "Insufficient RAM quota"
       "Lab limit reached"
```

Solution:
✓ Détruire un lab existant
✓ Attendre l'expiration d'un lab
✓ Demander plus de quota à l'admin

---

### **Q: Comment je vois les logs d'un lab?**

**A:** Se connecter en SSH et voir `/var/log/`

```bash
# Dans le lab SSH
cat /var/log/syslog
tail -f /var/log/cloud-init-output.log
```

---

### **Q: Est-ce que je peux installer des paquets?**

**A:** **Oui!** C'est votre VM!

```bash
# Sur RHCSA (dnf)
dnf install vim curl

# Sur Docker/Ubuntu (apt)
apt-get update
apt-get install vim curl
```

---

### **Q: Que fait le bouton VNC?**

**A:** Ouvre une **console graphique** vers la VM.

Utilise: X11, SPICE, ou VNC selon la config.

Si pas disponible → Utiliser SSH en ligne de commande.

---

## 📞 Support

- **Installation?** → [INSTALL.md](INSTALL.md)
- **Premier lancement?** → [GETTING_STARTED.md](GETTING_STARTED.md)
- **API details?** → [docs/USAGE_GUIDE.md](docs/USAGE_GUIDE.md)
- **Problèmes?** → [INSTALL.md#-troubleshooting](INSTALL.md#-troubleshooting-installation)

---

**Vous êtes un maître LabOrchestrator maintenant! 🎓**
