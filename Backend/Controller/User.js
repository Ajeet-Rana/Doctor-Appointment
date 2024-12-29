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
    const userinfo = await User.findById(userId).select("name email wallet");
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
  const {
    patientId,
    doctorId,
    appointmentDate,
    amountCharged,
    discountApplied,
    status = "pending",
  } = req.body;

  try {
    const previousAppointment = await Appointment.findOne({
      patientId,
      doctorId,
    });

    let finalAmountCharged = amountCharged;
    if (!previousAppointment) {
      finalAmountCharged -= discountApplied;
    }

    const patient = await User.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    if (patient.walletBalance < finalAmountCharged) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    patient.walletBalance -= finalAmountCharged;
    await patient.save();

    const newAppointment = new Appointment({
      patientId,
      doctorId,
      appointmentDate,
      amountCharged: finalAmountCharged,
      discountApplied: !previousAppointment ? discountApplied : 0,
      status,
    });

    await newAppointment.save();
    res.status(201).json({
      message: "Appointment created successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating appointment", error: error.message });
  }
};

const logout = async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
};

const generateFinancialReport = async (req, res) => {
  try {
    const report = await Appointment.aggregate([
      {
        $lookup: {
          from: "patients",
          localField: "patientId",
          foreignField: "_id",
          as: "patient",
        },
      },
      {
        $lookup: {
          from: "doctors",
          localField: "doctorId",
          foreignField: "_id",
          as: "doctor",
        },
      },
      {
        $unwind: "$patient",
      },
      {
        $unwind: "$doctor",
      },
      {
        $group: {
          _id: {
            doctor: "$doctorId",
            patient: "$patientId",
          },
          totalAmountCharged: { $sum: "$amountCharged" },
          totalDiscountApplied: { $sum: "$discountApplied" },
          totalAppointments: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          doctorId: "$_id.doctor",
          patientId: "$_id.patient",
          totalAmountCharged: 1,
          totalDiscountApplied: 1,
          totalAppointments: 1,
        },
      },
    ]);

    res.status(200).json({ report });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error generating report", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,

  addAmountToWallet,
  bookAppointment,
  logout,
  generateFinancialReport,
  getUserInfo,
};
