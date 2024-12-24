// routes/authRoutes.js
const express = require("express");
const { loginUser, registerUser } = require("../Controller/Login");
const router = express.Router();

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

module.exports = router;
