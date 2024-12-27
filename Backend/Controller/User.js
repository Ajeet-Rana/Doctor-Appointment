// controllers/authController.js
const User = require("../models/User.js");
const Doctor = require("../models/Doctor.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password, role, specialty } = req.body;

  try {
    let user;
    if (role == "doctor") {
      user = new Doctor({ name, email, password, role, specialty });
    } else {
      user = new User({ name, email, password, role });
    }
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error registering user" });
  }
};

// Login a user
const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user;
    if (role == "doctor") user = await Doctor.findOne({ email });
    else {
      user = await User.findOne({ email });
    }
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true, // Cannot be accessed by JavaScript
      sameSite: "Strict", // Prevents CSRF
    });
    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// User Information

const getUserData = async (req, res) => {
  const { id } = req.params;

  try {
    const patient = await User.findById(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving patient", error });
  }
};

// Add an amount to the user's wallet
const addAmountToWallet = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  try {
    const patient = await User.findById(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    patient.walletBalance += amount;
    await patient.save();

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: "Error updating wallet balance", error });
  }
};

module.exports = { registerUser, loginUser, getUserData, addAmountToWallet };
