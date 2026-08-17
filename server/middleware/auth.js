const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { memoryUsers } = require('../controllers/authController');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'codealpha_social_media_jwt_secret_key_2026');

      try {
        req.user = await User.findById(decoded.id).select('-password');
      } catch (dbErr) {
        req.user = null;
      }

      if (!req.user) {
        const memUser = memoryUsers.find((u) => String(u._id) === String(decoded.id));
        if (memUser) {
          const { password, ...safeUser } = memUser;
          req.user = safeUser;
        } else {
          req.user = { _id: decoded.id, name: 'Demo User', username: 'demouser' };
        }
      }

      return next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }
};

module.exports = { protect };

