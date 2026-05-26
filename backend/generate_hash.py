#!/usr/bin/env python3
import subprocess
import json
import sys

# Try to install bcrypt if not available
try:
    import bcrypt
except ImportError:
    print("Installing bcrypt...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "bcrypt", "-q"])
    import bcrypt

def hash_password(password):
    """Generate bcrypt hash for password"""
    salt = bcrypt.gensalt(rounds=10)
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

# Generate hash for admin123
password = "admin123"
hashed = hash_password(password)

print(f"Password: {password}")
print(f"Bcrypt Hash: {hashed}")

# Create SQL command
sql_update = f'''
UPDATE users 
SET password_hash = '{hashed}' 
WHERE username = 'admin';
'''

print(f"\nSQL to run:\n{sql_update}")
