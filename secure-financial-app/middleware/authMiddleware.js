const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

// Protect middleware (validates token)
const protect = (req, res, next) => {
  let token;

  // Check for token in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Split "Bearer" and the token itself
      token = req.headers.authorization.split(' ')[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log(decoded);

      // Ensure the decoded token has a user object
      if (!decoded) {
        return res.status(401).json({ message: 'Not authorized, invalid token' });
      }

      // Attach the user information from the decoded token to req.user
      req.user = decoded;

      // Move to the next middleware or route
      next();
    } catch (error) {
      console.error('Token verification failed', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Role check middleware (authorization based on roles)
const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied, insufficient permissions' });
    }
    next(); // Continue if the role is authorized
  };
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

// Request validation middleware
const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// Logger middleware
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

// Rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

module.exports = { protect, authorize, limiter, logger, validateRequest, errorHandler };
