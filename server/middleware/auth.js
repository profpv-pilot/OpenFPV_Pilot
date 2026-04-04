const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access Denied: Insufficient Permissions' });
    }
    next();
  };
};

const protect = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Please log in to access this resource' });
};

module.exports = { checkRole, protect };
