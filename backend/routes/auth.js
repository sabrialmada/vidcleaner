/* const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model in the models folder
const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving it to the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new user
    user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate a JWT token for the newly created user
    const token = jwt.sign({ id: user._id }, 'your-secret-key', { expiresIn: '1h' });

    // Send the token and user email back to the frontend
    res.status(201).json({ token, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Login an existing user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, 'your-secret-key', { expiresIn: '1h' });

    // Send the token and user email back to the frontend
    res.status(200).json({ token, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
 */

/* const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const accessTokenSecret = 'your-access-token-secret';
const refreshTokenSecret = 'your-refresh-token-secret';

let refreshTokens = []; // Store refresh tokens in-memory. You can use a database in a real app.

// Generate Access Token
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, accessTokenSecret, { expiresIn: '1h' });
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign({ id: user._id }, refreshTokenSecret, { expiresIn: '7d' });
  refreshTokens.push(refreshToken); // Save the refresh token
  return refreshToken;
};

// Register a new user
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ email, password: hashedPassword });
    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(201).json({ accessToken, refreshToken, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Login an existing user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(200).json({ accessToken, refreshToken, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Refresh token route
router.post('/token', (req, res) => {
  const { token } = req.body;
  if (!token) return res.sendStatus(401);
  if (!refreshTokens.includes(token)) return res.sendStatus(403);

  jwt.verify(token, refreshTokenSecret, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = generateAccessToken({ _id: user.id });
    res.json({ accessToken });
  });
});

// Logout a user (Invalidate refresh token)
router.post('/logout', (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter(rt => rt !== token); // Remove refresh token
  res.sendStatus(204);
});

module.exports = router;
 */

/* const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'your-access-token-secret';
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret';

let refreshTokens = []; // Store refresh tokens in-memory. You can use a database in a real app.

// Generate Access Token
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, accessTokenSecret, { expiresIn: '1h' });
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign({ id: user._id }, refreshTokenSecret, { expiresIn: '7d' });
  refreshTokens.push(refreshToken); // Save the refresh token
  return refreshToken;
};

// Register a new user
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ email, password: hashedPassword });
    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(201).json({ accessToken, refreshToken, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Login an existing user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(200).json({ accessToken, refreshToken, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Refresh token route
router.post('/token', (req, res) => {
  const { token } = req.body;
  if (!token) return res.sendStatus(401);
  if (!refreshTokens.includes(token)) return res.sendStatus(403);

  jwt.verify(token, refreshTokenSecret, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = generateAccessToken({ _id: user.id });
    res.json({ accessToken });
  });
});

// Logout a user (Invalidate refresh token)
router.post('/logout', (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter(rt => rt !== token); // Remove refresh token
  res.sendStatus(204);
});

module.exports = router; */


// FOR PRODUCTION 

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

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 5 requests per windowMs
});

// Generate Access Token
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, accessTokenSecret, { expiresIn: '1h' });
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, refreshTokenSecret, { expiresIn: '7d' });
};

// Register a new user
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

// Login an existing user
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

// Refresh token route
router.post('/token', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'Refresh Token is required' });

  try {
    const user = jwt.verify(refreshToken, refreshTokenSecret);
    // In production, verify the refresh token exists in the database
    // const isValidToken = await verifyRefreshToken(user.id, refreshToken);
    // if (!isValidToken) {
    //   return res.status(403).json({ message: 'Invalid refresh token' });
    // }

    const accessToken = generateAccessToken({ _id: user.id });
    res.json({ accessToken });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(403).json({ message: 'Invalid refresh token' });
  }
});

// Logout a user (Invalidate refresh token)
router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'Refresh Token is required' });
  
  // In production, remove the refresh token from the database
  // await removeRefreshToken(refreshToken);
  res.status(204).send();
});

module.exports = router;