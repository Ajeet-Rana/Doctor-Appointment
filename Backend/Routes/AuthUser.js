// routes/authRoutes.js
const express = require("express");
const authenticateJWT = require("../Middleware/authenticateJWT");

const {
  loginUser,
  registerUser,
  addAmountToWallet,
  bookAppointment,
  getUserInfo,
} = require("../Controller/User");
const { getDoctorInfo, updateAppointment } = require("../Controller/Doctor");
const router = express.Router();

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

// Patient / Doctor Data route
router.get("/patients-info/:id", authenticateJWT, getUserInfo);
router.get("/doctor-info/:id", authenticateJWT, getDoctorInfo);

// Adding money to patients wallet
router.patch("/patients/wallet/:id", authenticateJWT, addAmountToWallet);

// Appointment Booking
router.post("/appointments", bookAppointment);

// Updating Appointment
router.patch("/doctor/appointment/:id", updateAppointment);

module.exports = router;
