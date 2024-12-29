// routes/authRoutes.js
const express = require("express");
const authenticateJWT = require("../Middleware/authenticateJWT");

const {
  loginUser,
  registerUser,
  addAmountToWallet,
  bookAppointment,
  logout,
  generateFinancialReport,
  getUserInfo,
} = require("../Controller/User");
const router = express.Router();

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

// User
router.get("/logout", logout);

// Patient Data route
router.get("/patients-info/:id", authenticateJWT, getUserInfo);

router.patch("/patients/wallet/:id", authenticateJWT, addAmountToWallet);
router.post("/appointments", bookAppointment);

router.get("/financial-report", generateFinancialReport);
module.exports = router;
