// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  // Get the token from the cookie
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user data to the request object
    next(); // Pass control to the next middleware/route
  } catch (error) {
    return res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = authenticateJWT;
