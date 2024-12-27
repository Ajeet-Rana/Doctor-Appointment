// routes/authRoutes.js
const express = require("express");
const authenticateJWT = require("../Middleware/authenticateJWT");

const {
  loginUser,
  registerUser,
  getUserData,
  addAmountToWallet,
  bookAppointment,
} = require("../Controller/User");
const router = express.Router();

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

// Patient Data route
router.get("/patients/:id", authenticateJWT, getUserData);

// Route to add an amount to the user's wallet
router.patch("/patients/wallet/:id", authenticateJWT, addAmountToWallet);
router.post("/patients/appointments", authenticateJWT, bookAppointment);

module.exports = router;
