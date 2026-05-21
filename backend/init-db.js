require('dotenv').config();

const sqlite3 = require('sqlite3').verbose();
const auth = require('./auth');
const quotas = require('./quotas');

const DB_PATH = process.env.DB_PATH || './data/labs.db';

let db = null;

const initializeDatabase = () => {
    db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
            console.error('Database connection error:', err);
            process.exit(1);
        } else {
            console.log('Connected to SQLite database at:', DB_PATH);
            createTables();
        }
    });
};

const createTables = () => {
    db.serialize(() => {
        console.log('Creating tables...');

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
        `, (err) => {
            if (err) console.error('Error creating users table:', err);
            else console.log('✓ Users table created');
        });

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
        `, (err) => {
            if (err) console.error('Error creating quotas table:', err);
            else console.log('✓ Quotas table created');
        });

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
        `, (err) => {
            if (err) console.error('Error creating labs table:', err);
            else console.log('✓ Labs table created');
        });

        db.run(`
            CREATE TABLE IF NOT EXISTS audit_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                action TEXT,
                resource TEXT,
                timestamp TEXT
            )
        `, (err) => {
            if (err) console.error('Error creating audit_log table:', err);
            else console.log('✓ Audit log table created');
        });

        setTimeout(() => {
            console.log('✓ Database initialized successfully!');
            db.close();
            process.exit(0);
        }, 500);
    });
};

// Initialize auth and quotas modules with the database
auth.initializeAuthDB(db);
quotas.initializeQuotasDB(db);

initializeDatabase();
