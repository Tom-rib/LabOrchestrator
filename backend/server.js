require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

const auth = require('./auth');
const quotas = require('./quotas');
const proxmox = require('./proxmox-integration');

const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = process.env.DB_PATH || './data/labs.db';

const LAB_TYPE_CONFIG = {
    rhcsa: { cpu: 2, memory: 2, storage: 20, max_duration_hours: 2 },
    docker: { cpu: 4, memory: 4, storage: 30, max_duration_hours: 3 },
    kubernetes: { cpu: 4, memory: 8, storage: 50, max_duration_hours: 4 },
    ctf: { cpu: 2, memory: 2, storage: 20, max_duration_hours: 2 },
    terraform: { cpu: 4, memory: 4, storage: 30, max_duration_hours: 3 },
    ansible: { cpu: 2, memory: 3, storage: 25, max_duration_hours: 2 }
};

app.use(helmet());
app.use(cors());
app.use(express.json());

let db = null;

const initializeDatabase = () => {
    db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
            console.error('Database connection error:', err);
        } else {
            console.log('Connected to SQLite database');
            createTables();
            auth.initializeAuthDB(db);
            quotas.initializeQuotasDB(db);
        }
    });
};

const createTables = () => {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT DEFAULT 'student',
                active INTEGER DEFAULT 1,
                created_at TEXT
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS quotas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER UNIQUE NOT NULL,
                max_labs INTEGER DEFAULT 3,
                max_cpu INTEGER DEFAULT 8,
                max_memory_gb INTEGER DEFAULT 16,
                max_storage_gb INTEGER DEFAULT 100,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS labs (
                id TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL,
                lab_type TEXT NOT NULL,
                vmid INTEGER,
                ip_address TEXT,
                hostname TEXT,
                resource_cpu INTEGER,
                resource_memory_gb INTEGER,
                resource_storage_gb INTEGER,
                created_at TEXT,
                destroyed_at TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS audit_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                action TEXT,
                resource TEXT,
                timestamp TEXT
            )
        `);

        seedDatabase();
    });
};

const seedDatabase = () => {
    db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
        if (row && row.count === 0) {
            auth.createUser('admin', 'admin@lab.local', 'admin123', 'admin').then((result) => {
                if (result.success) {
                    db.run(
                        'INSERT INTO quotas (user_id, max_labs, max_cpu, max_memory_gb, max_storage_gb) VALUES (?, ?, ?, ?, ?)',
                        [result.data.id, 10, 32, 64, 500]
                    );
                }
            });
        }
    });
};

const verifyTokenMiddleware = auth.verifyTokenMiddleware();

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }
    
    const result = await auth.authenticateUser(username, password);
    
    if (result.success) {
        res.json(result.data);
    } else {
        res.status(401).json({ error: result.message });
    }
});

app.get('/api/auth/me', verifyTokenMiddleware, (req, res) => {
    res.json({ user: req.user });
});

app.post('/api/labs', verifyTokenMiddleware, async (req, res) => {
    const { lab_type } = req.body;
    const userId = req.user.id;
    
    if (!lab_type) {
        return res.status(400).json({ error: 'Lab type required' });
    }
    
    if (!LAB_TYPE_CONFIG[lab_type]) {
        return res.status(400).json({ error: 'Invalid lab type' });
    }
    
    const canCreateResult = await quotas.checkCanCreateLab(userId, lab_type, LAB_TYPE_CONFIG);
    
    if (!canCreateResult.canCreate) {
        return res.status(403).json({ error: canCreateResult.error });
    }
    
    const sessionId = uuidv4();
    const vmName = `lab-${req.user.username}-${Date.now()}`;
    
    const vmResult = await proxmox.createVM(null, null, vmName, sessionId);
    
    if (!vmResult.success) {
        return res.status(500).json({ error: 'Failed to create VM' });
    }
    
    const labId = uuidv4();
    const labConfig = LAB_TYPE_CONFIG[lab_type];
    
    db.run(
        `INSERT INTO labs (id, user_id, lab_type, vmid, ip_address, hostname, resource_cpu, resource_memory_gb, resource_storage_gb, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            labId,
            userId,
            lab_type,
            vmResult.data.vmid,
            vmResult.data.ip_address,
            vmResult.data.hostname,
            labConfig.cpu,
            labConfig.memory,
            labConfig.storage,
            new Date().toISOString()
        ],
        (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to save lab to database' });
            }
            
            res.status(201).json({
                id: labId,
                vmid: vmResult.data.vmid,
                ip_address: vmResult.data.ip_address,
                hostname: vmResult.data.hostname,
                status: vmResult.data.status,
                ssh_command: vmResult.data.ssh_command,
                lab_type: lab_type
            });
        }
    );
});

app.get('/api/labs', verifyTokenMiddleware, (req, res) => {
    const userId = req.user.id;
    
    db.all(
        'SELECT * FROM labs WHERE user_id = ? ORDER BY created_at DESC',
        [userId],
        (err, labs) => {
            if (err) {
                return res.status(500).json({ error: 'Error fetching labs' });
            }
            
            res.json({ data: labs || [] });
        }
    );
});

app.get('/api/labs/:id', verifyTokenMiddleware, (req, res) => {
    const userId = req.user.id;
    const labId = req.params.id;
    
    db.get(
        'SELECT * FROM labs WHERE id = ? AND user_id = ?',
        [labId, userId],
        (err, lab) => {
            if (err) {
                return res.status(500).json({ error: 'Error fetching lab' });
            }
            
            if (!lab) {
                return res.status(404).json({ error: 'Lab not found' });
            }
            
            res.json({ data: lab });
        }
    );
});

app.delete('/api/labs/:id', verifyTokenMiddleware, async (req, res) => {
    const userId = req.user.id;
    const labId = req.params.id;
    
    db.get(
        'SELECT * FROM labs WHERE id = ? AND user_id = ?',
        [labId, userId],
        async (err, lab) => {
            if (err || !lab) {
                return res.status(404).json({ error: 'Lab not found' });
            }
            
            const destroyResult = await proxmox.destroyVM(lab.vmid);
            
            if (!destroyResult.success) {
                return res.status(500).json({ error: 'Failed to destroy VM' });
            }
            
            await quotas.freeResources(userId, labId);
            
            db.run(
                'UPDATE labs SET destroyed_at = ? WHERE id = ?',
                [new Date().toISOString(), labId],
                (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to update lab' });
                    }
                    res.json({ message: 'Lab destroyed successfully' });
                }
            );
        }
    );
});

app.get('/api/quotas', verifyTokenMiddleware, async (req, res) => {
    const userId = req.user.id;
    const result = await quotas.getQuotas(userId);
    
    if (result.success) {
        res.json(result.data);
    } else {
        res.status(500).json({ error: result.message });
    }
});

app.get('/api/admin/users', verifyTokenMiddleware, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    
    db.all(
        'SELECT id, username, email, role, active, created_at FROM users',
        (err, users) => {
            if (err) {
                return res.status(500).json({ error: 'Error fetching users' });
            }
            res.json({ data: users || [] });
        }
    );
});

app.get('/api/admin/labs', verifyTokenMiddleware, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    
    db.all(
        'SELECT * FROM labs ORDER BY created_at DESC',
        (err, labs) => {
            if (err) {
                return res.status(500).json({ error: 'Error fetching labs' });
            }
            res.json({ data: labs || [] });
        }
    );
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

initializeDatabase();

app.listen(PORT, () => {
    console.log(`✓ API Server running on port ${PORT}`);
});

module.exports = app;
