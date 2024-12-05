
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

if (!accessTokenSecret || !refreshTokenSecret) {
  console.error('JWT secrets not set in environment variables');
  process.exit(1);
}

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});

// generate access token
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, accessTokenSecret, { expiresIn: '1h' });
};

// generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, refreshTokenSecret, { expiresIn: '7d' });
};

// register a new user
router.post('/register', authLimiter, async (req, res) => {
  const { email, password } = req.body;
  console.log('Registration attempt for:', email);
  console.log('Password being hashed:', password);

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ email, password: hashedPassword });
    await user.save();

    console.log('User registered successfully:', email);
    console.log('Hashed password:', hashedPassword);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(201).json({ accessToken, refreshToken, email: user.email });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// login an existing user
router.post('/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt for:', email);
  console.log('Provided password:', password);

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Stored hashed password:', user.password);

    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    console.log('Login successful for:', email);
    res.status(200).json({ accessToken, refreshToken, email: user.email });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// refresh token route
router.post('/token', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'Refresh Token is required' });

  try {
    const user = jwt.verify(refreshToken, refreshTokenSecret);
    const accessToken = generateAccessToken({ _id: user.id });
    res.json({ accessToken });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(403).json({ message: 'Invalid refresh token' });
  }
});

// logout a user 
router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'Refresh Token is required' });
  res.status(204).send();
});

module.exports = router;