const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'codealpha_social_media_jwt_secret_key_2026', {
    expiresIn: '30d'
  });
};

const defaultUsers = [
  {
    _id: 'user_alex',
    name: 'Alex Rivera',
    username: 'alex_dev',
    email: 'alex@codealpha.com',
    password: '$2a$10$wNq.0M7c.tTfN7oD76gOaO0L6GkU/j/yXqH8b/4f1l1Z0z0Z0Z0Z0', // hashed
    rawPassword: 'Password123!',
    bio: 'Full Stack Engineer and Cloud Architect.',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
    followers: ['user_sarah'],
    following: ['user_sarah', 'user_marcus']
  },
  {
    _id: 'user_sarah',
    name: 'Sarah Chen',
    username: 'sarah_ui',
    email: 'sarah@codealpha.com',
    password: '$2a$10$wNq.0M7c.tTfN7oD76gOaO0L6GkU/j/yXqH8b/4f1l1Z0z0Z0Z0Z0',
    rawPassword: 'Password123!',
    bio: 'UI/UX Designer and Frontend Systems Architect.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    followers: ['user_alex'],
    following: ['user_alex']
  },
  {
    _id: 'user_marcus',
    name: 'Marcus Vance',
    username: 'marcus_v',
    email: 'marcus@codealpha.com',
    password: '$2a$10$wNq.0M7c.tTfN7oD76gOaO0L6GkU/j/yXqH8b/4f1l1Z0z0Z0Z0Z0',
    rawPassword: 'Password123!',
    bio: 'Backend Distributed Systems Engineer.',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80',
    followers: ['user_alex'],
    following: []
  }
];

let memoryUsers = [...defaultUsers];

// @desc Register User
// @route POST /api/auth/register
const registerUser = async (req, res, next) => {
  try {
    const { name, username, email, password, bio, avatar } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    try {
      const userExists = await User.findOne({ $or: [{ email }, { username }] });
      if (userExists) {
        return res.status(400).json({ message: 'User with this email or username already exists.' });
      }

      const user = await User.create({
        name,
        username,
        email,
        password,
        bio: bio || 'Member of AlphaPulse community.',
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
      });

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        followers: user.followers,
        following: user.following,
        token: generateToken(user._id)
      });
    } catch (dbErr) {
      const existingMem = memoryUsers.find(
        (u) => u.email === email.toLowerCase() || u.username === username.toLowerCase()
      );
      if (existingMem) {
        return res.status(400).json({ message: 'User with this email or username already exists.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: 'user_' + Date.now(),
        name,
        username: username.toLowerCase().replace(/\s+/g, ''),
        email: email.toLowerCase(),
        password: hashedPassword,
        bio: bio || 'Member of AlphaPulse community.',
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        followers: [],
        following: []
      };
      memoryUsers.push(newUser);

      const { password: _, ...safeUser } = newUser;
      return res.status(201).json({
        ...safeUser,
        token: generateToken(newUser._id)
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Login User
// @route POST /api/auth/login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter both email and password.' });
    }

    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user && (await user.matchPassword(password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          bio: user.bio,
          avatar: user.avatar,
          followers: user.followers,
          following: user.following,
          token: generateToken(user._id)
        });
      }
    } catch (dbErr) {
      // Fall through to memory
    }

    const memUser = memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (memUser) {
      let isMatch = false;
      if (memUser.password.startsWith('$2a$') || memUser.password.startsWith('$2b$')) {
        isMatch = await bcrypt.compare(password, memUser.password);
      } else {
        isMatch = memUser.password === password || memUser.rawPassword === password;
      }

      if (isMatch) {
        const { password: _, ...safeUser } = memUser;
        return res.json({
          ...safeUser,
          token: generateToken(memUser._id)
        });
      }
    }

    res.status(401).json({ message: 'Invalid email or password.' });
  } catch (error) {
    next(error);
  }
};

// @desc Get current user profile
// @route GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    if (req.user) {
      res.json(req.user);
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  memoryUsers,
  defaultUsers
};

