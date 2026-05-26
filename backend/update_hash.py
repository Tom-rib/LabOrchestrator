#!/usr/bin/env python3
import sqlite3
from pathlib import Path

db_path = Path(__file__).parent.parent / "data" / "labs.db"

conn = sqlite3.connect(str(db_path))
cursor = conn.cursor()

# Update with correct bcrypt hash for admin123
correct_hash = "$2b$10$0J5MMzZ1VpQ.7JzTq3Du9.NAeAKIKpqFmE6Z6scgtEj8hiWOWu5Iq"

cursor.execute('''
    UPDATE users 
    SET password_hash = ? 
    WHERE username = 'admin'
''', (correct_hash,))

conn.commit()

# Verify the update
cursor.execute("SELECT username, password_hash FROM users WHERE username = 'admin'")
user = cursor.fetchone()

if user:
    print(f"✓ Admin user updated successfully!")
    print(f"  Username: {user[0]}")
    print(f"  Hash updated: {user[1][:30]}...")
else:
    print("✗ Admin user not found!")

conn.close()
