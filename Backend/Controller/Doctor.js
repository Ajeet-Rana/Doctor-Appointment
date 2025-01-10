const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appoin_model");
const User = require("../models/User.js");
const mongoose = require("mongoose");
const getAllDoctor = async (req, res) => {
  try {
    const { specialty } = req.query;
    let filter = {};
    if (specialty) {
      filter.specialty = specialty;
    }
    const doctors = await Doctor.find(filter);
    res.json(doctors);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getDoctorInfo = async (req, res) => {
  const doctorId = req.params.id;

  try {
    // Fetch doctor details
    const doctorInfo = await Doctor.findById(doctorId).select(
      "name specialty appointmentCharge discountGiven email avatarUrl"
    );

    if (!doctorInfo) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Find today's and future appointments for the doctor
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointments = await Appointment.find({
      doctorId: doctorId,
      appointmentDate: { $gte: today },
    }).populate("patientId", "name email");
    const userinfo = doctorInfo;
    res.status(200).json({
      userinfo,
      appointments,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching doctor info", error: error.message });
  }
};
const updateAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id; // Retrieve appointment ID from the request
    const { status, amountCharged, discountGiven } = req.body;

    const appointmentCharge = amountCharged;

    // step 1 : Check the appointment is valid or not
    const appointment = await Appointment.findById(appointmentId).lean(); // Use .lean() to get plain JavaScript object

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const doctorId = appointment.doctorId.toString(); // Convert doctorId to a string

    let updatedAppointment = null;

    // step 2 : Update the status
    if (status) {
      updatedAppointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        { status },
        { new: true, runValidators: true }
      ).lean();
    }

    // Update doctor's charge and discount if provided
    if (amountCharged !== undefined || discountGiven !== undefined) {
      const updatedDoctor = await Doctor.findByIdAndUpdate(
        doctorId,
        {
          ...(appointmentCharge !== undefined && {
            appointmentCharge,
          }),
          ...(discountGiven !== undefined && { discountGiven }),
        },
        { new: true, runValidators: true }
      ).lean();

      if (!updatedDoctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }
    }

    // Respond with success message and updated appointment (if status was updated)
    res.status(200).json({
      success: true,
      message: "Updates applied successfully",
      appointment: updatedAppointment || appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getAllDoctor, getDoctorInfo, updateAppointment };
