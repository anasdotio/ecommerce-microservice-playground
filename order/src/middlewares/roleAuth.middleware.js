export const roleAuth =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }

    next();
  };
