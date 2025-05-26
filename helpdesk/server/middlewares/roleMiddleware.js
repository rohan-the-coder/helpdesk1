const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "No role specified" });
    }

    const userRole = req.user.role.toLowerCase();
    const hasPermission = allowedRoles.some(role => role.toLowerCase() === userRole);

    if (!hasPermission) {
      return res.status(403).json({ 
        message: "Access denied. You don't have permission to perform this action" 
      });
    }

    next();
  };
};

module.exports = roleMiddleware;
