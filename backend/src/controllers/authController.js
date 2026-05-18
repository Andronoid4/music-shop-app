const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

exports.register = async (req, res) => {
  const { username, password, role = 'user' } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING user_id, username, role',
      [username, hashed, role]
    );
    res.json({ user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'Username already exists' });
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (user.is_banned) return res.status(403).json({ error: 'User is banned' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.user_id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.user_id, username: user.username, role: user.role, isBanned: user.is_banned } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  // только для владельца
  if (req.user.role !== 'owner') return res.status(403).json({ error: 'Forbidden' });
  try {
    const { rows } = await pool.query('SELECT user_id, username, role, is_banned FROM users');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.banUser = async (req, res) => {
  if (req.user.role !== 'owner') return res.status(403).json({ error: 'Forbidden' });
  const { userId } = req.params;
  const { ban } = req.body; // true/false
  try {
    await pool.query('UPDATE users SET is_banned = $1 WHERE user_id = $2', [ban, userId]);
    res.json({ message: `User ${ban ? 'banned' : 'unbanned'}` });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// middleware для проверки токена
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// проверка роли администратора (admin или owner)
exports.authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'owner')
    return res.status(403).json({ error: 'Admin access required' });
  next();
};