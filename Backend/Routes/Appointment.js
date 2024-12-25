// routes/appointmentsRoutes.js
const express = require("express");
const authenticateJWT = require("../Middleware/authenticateJWT");
const router = express.Router();

// Example protected route that requires a valid JWT token
router.post("/", authenticateJWT, (req, res) => {
  // Protected route logic
  res.status(200).json({ message: "Welcome to the appointments page!" });
});

module.exports = router;
