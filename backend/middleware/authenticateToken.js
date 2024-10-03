/* const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    console.log('Authenticating token...');
    const authHeader = req.headers['authorization'];
    console.log('Authorization header:', authHeader);
  
    if (!authHeader) {
      console.log('No Authorization header found');
      return res.sendStatus(401);
    }
  
    const token = authHeader.split(' ')[1];
    console.log('Extracted token:', token ? 'Token exists' : 'No token');
  
    if (!token) {
      console.log('No token provided');
      return res.sendStatus(401);
    }
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.error('Token verification failed:', err.message);
        return res.sendStatus(403);
      }
      
      console.log('Token verified successfully');
      console.log('Decoded user:', user);
      
      req.user = user;
      next();
    });
  };

module.exports = authenticateToken; */


// FOR PRODUCTION

const jwt = require('jsonwebtoken');
const { createLogger, format, transports } = require('winston');

// Create a logger
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'auth-middleware' },
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' })
  ]
});

// If we're not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.simple()
  }));
}

const authenticateToken = (req, res, next) => {
  logger.info('Authenticating token');
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    logger.warn('No Authorization header found');
    return res.status(401).json({ message: 'No authorization header' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    logger.warn('No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      logger.error('Token verification failed', { error: err.message });
      return res.status(403).json({ message: 'Invalid token' });
    }
    
    logger.info('Token verified successfully', { userId: user.id });
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;