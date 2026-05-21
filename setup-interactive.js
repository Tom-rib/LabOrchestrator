#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (prompt) => {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
};

const runCommand = (cmd) => {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                resolve({ success: false, output: stderr });
            } else {
                resolve({ success: true, output: stdout });
            }
        });
    });
};

async function checkPrerequisites() {
    console.log('\n🔍 Vérification des prérequis...\n');
    
    const checks = [
        { name: 'Node.js', cmd: 'node --version' },
        { name: 'npm', cmd: 'npm --version' },
        { name: 'Git', cmd: 'git --version' }
    ];

    let allGood = true;
    for (const check of checks) {
        const result = await runCommand(check.cmd);
        if (result.success) {
            console.log(`✓ ${check.name}: ${result.output.trim()}`);
        } else {
            console.log(`✗ ${check.name}: NOT FOUND`);
            allGood = false;
        }
    }

    if (!allGood) {
        console.log('\n⚠️  Certains prérequis manquent. Installez-les avant de continuer.');
        return false;
    }
    
    console.log('\n✓ Tous les prérequis sont installés!\n');
    return true;
}

async function setupComplete() {
    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║     CONFIGURATION COMPLÈTE DU SERVEUR      ║');
    console.log('╚════════════════════════════════════════════╝\n');

    // Check prerequisites
    const prereqOk = await checkPrerequisites();
    if (!prereqOk) {
        rl.close();
        process.exit(1);
    }

    console.log('📋 Configuration de l\'architecture:\n');
    console.log('Vous avez une architecture séparée:');
    console.log('  • Serveur Proxmox (hypervisor avec 2 DD)');
    console.log('  • Serveur App (LabOrchestrator)\n');

    const mode = await question('Quelle configuration voulez-vous? (1=App seule, 2=Proxmox seul, 3=Les deux): ');

    if (mode === '1' || mode === '3') {
        await setupAppServer();
    }

    if (mode === '2' || mode === '3') {
        await setupProxmoxOnly();
    }

    console.log('\n✓ Configuration terminée!\n');
    rl.close();
}

async function setupAppServer() {
    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║      CONFIGURATION SERVEUR APP             ║');
    console.log('╚════════════════════════════════════════════╝\n');

    console.log('📋 Configuration de l\'application:\n');

    const appPort = await question('Port de l\'application [3001]: ') || '3001';
    const appEnv = await question('Environnement (development/production) [production]: ') || 'production';
    const dbPath = await question('Chemin de la base de données [./data/labs.db]: ') || './data/labs.db';

    const jwtSecret = await question('JWT Secret [générer aléatoire]: ');
    let finalJwtSecret = jwtSecret;
    if (!finalJwtSecret) {
        finalJwtSecret = require('crypto').randomBytes(32).toString('hex');
        console.log(`✓ JWT Secret généré`);
    }

    console.log('\n📋 Configuration Proxmox (sur le serveur distant):\n');

    const proxmoxHost = await question('Adresse du serveur Proxmox (ex: 192.168.1.10:8006): ');
    const proxmoxNode = await question('Nom du nœud Proxmox (ex: pve): ');
    const proxmoxStorage = await question('Stockage Proxmox (ex: local-lvm): ');
    const proxmoxToken = await question('Token API Proxmox (format: username@pam!tokenid=token): ');
    const proxmoxMode = await question('Mode Proxmox (mock/real) [mock]: ') || 'mock';

    console.log('\n💾 Configuration de la base de données:\n');

    const backendDir = path.join(__dirname, 'backend');
    const envFile = path.join(backendDir, '.env');

    const envContent = `# ============================================================================
# APPLICATION
# ============================================================================
PORT=${appPort}
NODE_ENV=${appEnv}
JWT_SECRET=${finalJwtSecret}

# ============================================================================
# DATABASE
# ============================================================================
DB_PATH=${dbPath}

# ============================================================================
# PROXMOX CONFIGURATION
# ============================================================================
PROXMOX_HOST=${proxmoxHost}
PROXMOX_TOKEN=${proxmoxToken}
PROXMOX_NODE=${proxmoxNode}
PROXMOX_STORAGE=${proxmoxStorage}
PROXMOX_MODE=${proxmoxMode}
`;

    try {
        fs.writeFileSync(envFile, envContent);
        console.log('✓ Fichier .env créé avec succès!\n');
    } catch (error) {
        console.error('✗ Erreur lors de la création du fichier .env:', error.message);
        return;
    }

    console.log('📦 Installation des dépendances...\n');
    
    const installResult = await runCommand(`cd ${backendDir} && npm install`);
    if (installResult.success) {
        console.log('✓ Dépendances installées!\n');
    } else {
        console.log('✗ Erreur lors de l\'installation des dépendances');
        console.log(installResult.output);
    }

    console.log('🗄️  Initialisation de la base de données...\n');
    
    const initResult = await runCommand(`cd ${backendDir} && node init-db.js`);
    if (initResult.success) {
        console.log(initResult.output);
    } else {
        console.log('✗ Erreur lors de l\'initialisation');
        console.log(initResult.output);
    }

    console.log('\n🌱 Remplissage des données de démo...\n');
    
    const seedResult = await runCommand(`cd ${backendDir} && node seed-db.js`);
    if (seedResult.success) {
        console.log(seedResult.output);
    } else {
        console.log('✗ Erreur lors du seed');
        console.log(seedResult.output);
    }

    console.log('\n✅ Configuration du serveur App terminée!');
    console.log('\n📝 Résumé:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  Port: ${appPort}`);
    console.log(`  Environnement: ${appEnv}`);
    console.log(`  Base de données: ${dbPath}`);
    console.log(`  Proxmox: ${proxmoxHost}`);
    console.log(`  Mode: ${proxmoxMode}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚡ Prêt à démarrer: make dev-backend\n');
}

async function setupProxmoxOnly() {
    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║  CONFIGURATION SERVEUR PROXMOX SEUL        ║');
    console.log('╚════════════════════════════════════════════╝\n');

    console.log('📋 Information Proxmox (pour référence):\n');
    console.log('Architecture recommandée:');
    console.log('  • DD1: Installation Proxmox VE 8.0+');
    console.log('  • DD2: Stockage ISO, templates, VMs\n');

    console.log('✓ Aucune installation requise sur le serveur Proxmox!');
    console.log('\n📝 À faire manuellement sur Proxmox:\n');
    console.log('1. Créer les templates VMs (rhcsa, docker, k8s, ctf, terraform, ansible)');
    console.log('2. Uploader les ISO sur le DD2');
    console.log('3. Générer un token API Proxmox (PVE realm)');
    console.log('4. Configurer le token API dans le serveur App\n');

    console.log('🔗 Documentation: docs/SERVER_VM_SETUP.md\n');
}

setupComplete().catch(error => {
    console.error('Erreur:', error);
    process.exit(1);
});
