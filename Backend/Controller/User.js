// controllers/authController.js

const User = require("../models/User.js");
const Doctor = require("../models/Doctor.js");
const Appointment = require("../models/Appoin_model.js");
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

  if (role !== "doctor" && role !== "user") {
    return res.status(400).json({ message: "Invalid role" });
  }

  let user;
  if (role === "doctor") {
    user = await Doctor.findOne({ email });
  } else {
    user = await User.findOne({ email });
  }

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = user.getJWTToken();

  // options for cookie
  const options = {
    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "None",
    secure: true,
  };

  res.status(200).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

// User Information

const getUserInfo = async (req, res) => {
  const userId = req.params.id;

  try {
    const userinfo = await User.findById(userId).select(
      "name email walletBalance avatarUrl"
    );
    if (!userinfo) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find today's and upcoming appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointments = await Appointment.find({
      patientId: userId,
      appointmentDate: { $gte: today },
    }).populate("doctorId", "name specialty");

    res.status(200).json({ userinfo, appointments });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user info", error: error.message });
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

const bookAppointment = async (req, res) => {
  const { patientId, doctorId, appointmentDate } = req.body;

  try {
    // Step 1: Validate doctor and patient existence
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const patient = await User.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Step 2: Check if the doctor is already booked at the same time
    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate,
      status: { $ne: "cancelled" },
    });

    if (existingAppointment) {
      return res
        .status(400)
        .json({ message: "Doctor is already booked at this time" });
    }

    // Step 3: Check if this is the patient's first appointment with the doctor
    const previousAppointment = await Appointment.findOne({
      patientId,
      doctorId,
    });

    let discountApplied = 0;
    if (!previousAppointment) {
      discountApplied = doctor.discountGiven;
    }
    // Step 4: Calculate final amount charged
    const finalAmountCharged =
      doctor.appointmentCharge - discountApplied > 0
        ? doctor.appointmentCharge - discountApplied
        : 0;

    // Step 5: Check if the patient has enough wallet balance
    if (patient.walletBalance < finalAmountCharged) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    // Step 6: Deduct amount from patient's wallet
    patient.walletBalance -= finalAmountCharged;
    await patient.save();

    // Step 7: Create and save the new appointment
    const newAppointment = new Appointment({
      patientId,
      doctorId,
      appointmentDate,
      amountCharged: finalAmountCharged,
      discountApplied,
      status: "pending",
    });

    await newAppointment.save();

    // Step 8: Send success response
    res.status(201).json({
      message: "Appointment created successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    // Handle errors
    res
      .status(500)
      .json({ message: "Error creating appointment", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  addAmountToWallet,
  bookAppointment,
  getUserInfo,
};
