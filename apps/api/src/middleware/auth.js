const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Requires Admin role' });
  next();
};

const isReporter = (req, res, next) => {
  if (req.user.role !== 'REPORTER' && req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Requires Reporter or Admin role' });
  }
  next();
};

module.exports = { authenticateToken, isAdmin, isReporter };
