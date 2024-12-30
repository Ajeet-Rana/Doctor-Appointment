import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { bookAppointment } from "../Reducer/action";
import { useLocation, useHistory } from "react-router-dom";
import "./Appointment.css";

const Appointment = () => {
  const location = useLocation();
  const { doctor } = location.state || {};
  const user = useSelector((state) => state.userinfo.userinfo);
  const dispatch = useDispatch();
  const history = useHistory();
  const [appointmentDate, setAppointmentDate] = useState("");
  const [showModal, setShowModal] = useState(false);
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
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    history.push("/user");
  };

  if (!doctor) {
    return <p>No doctor selected.</p>;
  }

  return (
    <div className="appointment-container">
      <h1>Book Appointment with Dr. {doctor.name}</h1>
      <form onSubmit={handleSubmit} className="appointment-form">
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Amount Charged: {amountCharged}</label>
        </div>
        <div className="form-group">
          <label>Discount Applied: {discountApplied}</label>
        </div>
        <button type="submit" className="btn">
          Book Appointment
        </button>
      </form>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <p>Your appointment is booked with Dr. {doctor.name}</p>
            <button onClick={handleCloseModal} className="btn">
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;
