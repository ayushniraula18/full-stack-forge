const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Standard response helper
const sendResponse = (res, status, success, dataOrMessage) => {
  res.status(status).json(success ? { success, data: dataOrMessage } : { success, message: dataOrMessage });
};

// Middleware to validate JWT
const validateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return sendResponse(res, 401, false, "Authorization header missing");

  // Token format: "Bearer <token>"
  const token = authHeader.split(" ")[1];
  if (!token) return sendResponse(res, 401, false, "Token missing");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach decoded token to request
    next(); // proceed to next middleware/controller
  } catch (err) {
    return sendResponse(res, 401, false, "Invalid or expired token");
  }
};

module.exports = { validateToken };
