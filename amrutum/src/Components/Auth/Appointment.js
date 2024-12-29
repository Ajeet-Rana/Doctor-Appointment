import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { bookAppointment } from "../Reducer/action";
import { useLocation } from "react-router-dom";

const Appointment = () => {
  const location = useLocation();
  const { doctor } = location.state || {};
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  console.log(user);
  const [appointmentDate, setAppointmentDate] = useState("");
  const amountCharged = doctor.appointmentCharge;
  const discountApplied = doctor.discountGiven;
  const handleSubmit = (event) => {
    event.preventDefault();
    const appointmentData = {
      patientId: user._id,
      doctorId: doctor._id,
      appointmentDate,
      amountCharged,
      discountApplied,
    };
    dispatch(bookAppointment(appointmentData));
  };

  if (!doctor) {
    return <p>No doctor selected.</p>;
  }

  return (
    <div>
      <h1>Book Appointment with Dr. {doctor.name}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Amount Charged : {amountCharged}</label>
        </div>
        <div>
          <label>Discount Applied : {discountApplied}</label>
        </div>
        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
};

export default Appointment;
