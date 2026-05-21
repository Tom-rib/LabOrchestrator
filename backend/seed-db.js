require('dotenv').config();

const sqlite3 = require('sqlite3').verbose();
const auth = require('./auth');

const DB_PATH = process.env.DB_PATH || './data/labs.db';

let db = null;

const initializeDatabase = () => {
    db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
            console.error('Database connection error:', err);
            process.exit(1);
        } else {
            console.log('Connected to SQLite database at:', DB_PATH);
            auth.initializeAuthDB(db);
            seedDatabase();
        }
    });
};

const seedDatabase = async () => {
    try {
        // Check if admin user already exists
        db.get("SELECT COUNT(*) as count FROM users WHERE username = 'admin'", async (err, row) => {
            if (err) {
                console.error('Error checking for admin user:', err);
                process.exit(1);
            }

            if (row && row.count > 0) {
                console.log('✓ Admin user already exists');
                closeDatabase();
                return;
            }

            console.log('Creating admin user...');
            const result = await auth.createUser('admin', 'admin@lab.local', 'admin123', 'admin');
            
            if (result.success) {
                console.log('✓ Admin user created (username: admin, password: admin123)');
                
                // Insert quotas for admin user
                db.run(
                    'INSERT INTO quotas (user_id, max_labs, max_cpu, max_memory_gb, max_storage_gb) VALUES (?, ?, ?, ?, ?)',
                    [result.data.id, 10, 32, 64, 500],
                    (err) => {
                        if (err) {
                            console.error('Error creating quotas for admin:', err);
                        } else {
                            console.log('✓ Admin quotas created');
                        }
                        closeDatabase();
                    }
                );
            } else {
                console.log('✗ Failed to create admin user:', result.message);
                closeDatabase();
            }
        });
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

const closeDatabase = () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
            process.exit(1);
        } else {
            console.log('✓ Database seeding completed!');
            process.exit(0);
        }
    });
};

initializeDatabase();
