import React, { useState } from "react";

const AppointmentForm = ({ createAppointment }) => {
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [amountCharged, setAmountCharged] = useState("");
  const [discountApplied, setDiscountApplied] = useState(0);
  const [status, setStatus] = useState("pending");

  const handleSubmit = (e) => {
    e.preventDefault();
    const appointmentData = {
      patientId,
      doctorId,
      appointmentDate,
      amountCharged,
      discountApplied,
      status,
    };
    createAppointment(appointmentData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Patient ID:</label>
        <input
          type="text"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Doctor ID:</label>
        <input
          type="text"
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Appointment Date:</label>
        <input
          type="date"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Amount Charged:</label>
        <input
          type="number"
          value={amountCharged}
          onChange={(e) => setAmountCharged(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Discount Applied:</label>
        <input
          type="number"
          value={discountApplied}
          onChange={(e) => setDiscountApplied(e.target.value)}
        />
      </div>
      <div>
        <label>Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <button type="submit">Create Appointment</button>
    </form>
  );
};

export default AppointmentForm;
