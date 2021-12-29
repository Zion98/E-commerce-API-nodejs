const { UnauthenticatedError, UnauthorizedError } = require("../errors");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookiess.token;
  if (!token) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
  try {
    const { name, userId, role } = isTokenValid({ token });

    req.user = { name, userId, role };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError("Unauthorized to access this route");
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
};

// const User = require("../models/User");
// const jwt = require("jsonwebtoken");
// const { UnauthenticatedError } = require("../errors");

// const auth = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     throw new UnauthenticatedError("Authentication Invalid");
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     //ATTACH THE USER TO THE JOB ROUTES
//     req.user = { userId: payload.userId, name: payload.name };
//   } catch (error) {
//     throw new UnauthenticatedError("Authentication Invalid");
//   }
// };

// module.exports = auth;
