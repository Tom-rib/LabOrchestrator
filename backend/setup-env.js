#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (prompt) => {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
};

const ENV_FILE = path.join(__dirname, '.env');
const ENV_EXAMPLE = path.join(__dirname, '.env.example');

async function setupEnv() {
    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║  Configuration du serveur LabOrchestrator  ║');
    console.log('╚════════════════════════════════════════════╝\n');

    // Check if .env already exists
    if (fs.existsSync(ENV_FILE)) {
        const overwrite = await question('⚠️  Le fichier .env existe déjà. Voulez-vous le remplacer? (y/n): ');
        if (overwrite.toLowerCase() !== 'y') {
            console.log('✓ Configuration annulée');
            rl.close();
            return;
        }
    }

    console.log('\n📋 Configuration du serveur Proxmox:\n');

    const proxmoxHost = await question('Adresse du serveur Proxmox (ex: starfleet.lan): ');
    const proxmoxNode = await question('Nom du nœud Proxmox (ex: pve): ');
    const proxmoxStorage = await question('Stockage Proxmox (ex: local-lvm): ');
    const proxmoxToken = await question('Token API Proxmox: ');
    const proxmoxMode = await question('Mode Proxmox (mock/real) [par défaut: mock]: ') || 'mock';

    console.log('\n🔐 Configuration de sécurité:\n');

    const port = await question('Port du serveur (ex: 3001) [par défaut: 3001]: ') || '3001';
    const jwtSecret = await question('JWT Secret (clé secrète JWT) [générer aléatoire]: ');
    const nodeEnv = await question('Environnement (development/production) [par défaut: production]: ') || 'production';

    console.log('\n💾 Configuration de la base de données:\n');

    const dbPath = await question('Chemin de la base de données [par défaut: ./data/labs.db]: ') || './data/labs.db';

    // Generate JWT secret if not provided
    let finalJwtSecret = jwtSecret;
    if (!finalJwtSecret) {
        finalJwtSecret = require('crypto').randomBytes(32).toString('hex');
        console.log(`✓ JWT Secret généré: ${finalJwtSecret}`);
    }

    // Create .env content
    const envContent = `PORT=${port}
DB_PATH=${dbPath}
JWT_SECRET=${finalJwtSecret}
PROXMOX_HOST=${proxmoxHost}
PROXMOX_TOKEN=${proxmoxToken}
PROXMOX_NODE=${proxmoxNode}
PROXMOX_STORAGE=${proxmoxStorage}
PROXMOX_MODE=${proxmoxMode}
NODE_ENV=${nodeEnv}
`;

    // Write .env file
    try {
        fs.writeFileSync(ENV_FILE, envContent);
        console.log('\n✓ Fichier .env créé avec succès!\n');
        console.log('📝 Configuration résumée:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`  Serveur Proxmox: ${proxmoxHost}`);
        console.log(`  Nœud: ${proxmoxNode}`);
        console.log(`  Stockage: ${proxmoxStorage}`);
        console.log(`  Mode: ${proxmoxMode}`);
        console.log(`  Port: ${port}`);
        console.log(`  Environnement: ${nodeEnv}`);
        console.log(`  Base de données: ${dbPath}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n⚠️  IMPORTANT: Ne partagez pas votre token API ou JWT Secret!');
        console.log('ℹ️  Le fichier .env est dans .gitignore et ne sera pas committé.\n');
    } catch (error) {
        console.error('\n✗ Erreur lors de la création du fichier .env:', error.message);
        process.exit(1);
    }

    rl.close();
}

setupEnv();
