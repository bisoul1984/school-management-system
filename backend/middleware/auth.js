const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    console.log('Auth Headers:', req.headers.authorization);
    
    // Check for Authorization header
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
      console.log('No valid authorization header');
      return res.status(401).json({ message: 'No token provided' });
    }

    // Get token from header
    const token = req.headers.authorization.split(' ')[1];
    console.log('Token received:', token.substring(0, 20) + '...');
    
    if (!token) {
      console.log('No token found after Bearer');
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
      // Verify token
      console.log('Verifying token with secret:', process.env.JWT_SECRET ? 'Secret exists' : 'No secret found');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      console.log('Found user:', user ? 'Yes' : 'No');
      
      if (!user) {
        console.log('No user found for token payload:', decoded);
        return res.status(401).json({ message: 'User not found' });
      }

      // Add user to request object
      req.user = user;
      console.log('User authenticated:', { id: user._id, role: user.role });
      next();
    } catch (error) {
      console.error('Token verification error:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Server error in auth middleware' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    console.log('Checking role authorization:', {
      userRole: req.user?.role,
      allowedRoles: roles
    });
    
    if (!req.user) {
      console.log('No user object found in request');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      console.log('User role not authorized:', {
        userRole: req.user.role,
        allowedRoles: roles
      });
      return res.status(403).json({
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    console.log('Authorization successful for role:', req.user.role);
    next();
  };
};

module.exports = { protect, authorize }; 