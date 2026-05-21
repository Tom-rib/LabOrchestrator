const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-prod';
const JWT_EXPIRY = '24h';

let db = null;

const initializeAuthDB = (database) => {
    db = database;
};

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const verifyPassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
    );
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

const authenticateUser = async (username, password) => {
    return new Promise((resolve) => {
        db.get(
            'SELECT * FROM users WHERE username = ? AND active = 1',
            [username],
            async (err, user) => {
                if (err || !user) {
                    resolve({ success: false, message: 'Invalid username or password', data: null });
                    return;
                }

                const passwordMatch = await verifyPassword(password, user.password_hash);
                if (!passwordMatch) {
                    resolve({ success: false, message: 'Invalid username or password', data: null });
                    return;
                }

                const token = generateToken(user);
                resolve({
                    success: true,
                    message: 'Authentication successful',
                    data: { token, user: { id: user.id, username: user.username, email: user.email, role: user.role } }
                });
            }
        );
    });
};

const verifyTokenMiddleware = () => {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ error: 'Missing authorization header' });
        }

        const token = authHeader.replace('Bearer ', '');
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        req.user = decoded;
        next();
    };
};

const createUser = async (username, email, password, role = 'student') => {
    return new Promise((resolve) => {
        db.get('SELECT id FROM users WHERE username = ? OR email = ?', [username, email], async (err, user) => {
            if (user) {
                resolve({ success: false, message: 'Username or email already exists', data: null });
                return;
            }

            const passwordHash = await hashPassword(password);
            db.run(
                'INSERT INTO users (username, email, password_hash, role, active, created_at) VALUES (?, ?, ?, ?, 1, ?)',
                [username, email, passwordHash, role, new Date().toISOString()],
                function(err) {
                    if (err) {
                        resolve({ success: false, message: 'Error creating user', data: null });
                    } else {
                        resolve({ success: true, message: 'User created successfully', data: { id: this.lastID, username, email, role } });
                    }
                }
            );
        });
    });
};

module.exports = {
    initializeAuthDB,
    hashPassword,
    verifyPassword,
    generateToken,
    verifyToken,
    authenticateUser,
    verifyTokenMiddleware,
    createUser
};
