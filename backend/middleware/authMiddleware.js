


import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  
  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  // Handle custom mock tokens (format: mock|userId)
  if (token.startsWith('mock|')) {
    const userId = token.split('|')[1];
    
    User.findById(userId).select('-password')
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        req.user = user;
        next();
      })
      .catch(error => {
        res.status(500).json({ message: error.message });
      });
    return;
  }

  // Handle JWT tokens
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.error('Auth middleware token verification failed:', { token, error: err.message });
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    try {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

const requireRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ message: `${role} access required` });
  }
  next();
};

export { authenticateToken, requireAdmin, requireRole };