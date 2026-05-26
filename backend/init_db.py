#!/usr/bin/env python3
import sqlite3
import os
from pathlib import Path
from datetime import datetime

# Create data directory if it doesn't exist
data_dir = Path(__file__).parent.parent / "data"
data_dir.mkdir(exist_ok=True)

db_path = data_dir / "labs.db"

# Connect to database (creates it if doesn't exist)
conn = sqlite3.connect(str(db_path))
cursor = conn.cursor()

print("Creating tables...")

# Create users table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'student',
        active INTEGER DEFAULT 1,
        created_at TEXT
    )
''')
print("✓ Users table created")

# Create labs table
cursor.execute('''
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
''')
print("✓ Labs table created")

# Create quotas table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS quotas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE NOT NULL,
        max_labs INTEGER DEFAULT 3,
        max_cpu INTEGER DEFAULT 8,
        max_memory_gb INTEGER DEFAULT 16,
        max_storage_gb INTEGER DEFAULT 100,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
''')
print("✓ Quotas table created")

# Create audit_log table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS audit_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        action TEXT NOT NULL,
        resource_type TEXT,
        resource_id TEXT,
        details TEXT,
        timestamp TEXT,
        ip_address TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
''')
print("✓ Audit log table created")

# Check if admin user exists
cursor.execute("SELECT COUNT(*) as count FROM users WHERE username = 'admin'")
row = cursor.fetchone()

if row and row[0] > 0:
    print("\n✓ Admin user already exists")
else:
    # Hash password using a simple method (NOTE: In production, use bcrypt)
    # For demo, we'll use a pre-hashed value that matches bcrypt('admin123')
    # This is the bcrypt hash of 'admin123' with 10 rounds
    password_hash = "$2a$10$N9qo8uLOickgx2ZMRZoMye.2X.KXKFzfP4OV8o9J9wV5SXRgFblMK"
    
    cursor.execute('''
        INSERT INTO users (username, email, password_hash, role, active, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', ('admin', 'admin@lab.local', password_hash, 'admin', 1, datetime.now().isoformat()))
    
    admin_id = cursor.lastrowid
    
    # Add quotas for admin user
    cursor.execute('''
        INSERT INTO quotas (user_id, max_labs, max_cpu, max_memory_gb, max_storage_gb)
        VALUES (?, ?, ?, ?, ?)
    ''', (admin_id, 10, 32, 64, 500))
    
    print(f"\n✓ Admin user created (ID: {admin_id})")
    print("  Username: admin")
    print("  Password: admin123")
    print("✓ Admin quotas created")

conn.commit()
conn.close()

print(f"\n✓ Database initialized successfully!")
print(f"  Location: {db_path}")
print(f"  File size: {db_path.stat().st_size} bytes")
