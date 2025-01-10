import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { bookAppointment } from "../Reducer/action";
import { useLocation, useHistory } from "react-router-dom";
import "./Appointment.css";

const Appointment = () => {
  const location = useLocation();
  const { doctor } = location.state || {};
  const userInfo = useSelector((state) => state.userinfo);
  const user = userInfo.userinfo;
  const dispatch = useDispatch();
  const history = useHistory();
  const [appointmentDate, setAppointmentDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [discount, setDiscount] = useState(doctor.discountGiven); // Default discount
  const [hasBookedBefore, setHasBookedBefore] = useState(false);

  const amountCharged = doctor.appointmentCharge - discount;

  useEffect(() => {
    const bookedBefore = userInfo.appointments.some(
      (appointment) => appointment.doctorId._id === doctor._id
    );
    setHasBookedBefore(bookedBefore);
  }, [userInfo.appointments, doctor._id]);

  useEffect(() => {
    if (hasBookedBefore) {
      setDiscount(0); // No discount for repeat bookings
    }
  }, [hasBookedBefore]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const appointmentData = {
      patientId: user._id,
      doctorId: doctor._id,
      appointmentDate,
      amountCharged: doctor.appointmentCharge,
      discountApplied: discount,
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
          <label>Discount Applied: {discount}</label>
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
            <p>
              Your appointment is booked with Dr. {doctor.name}.{" "}
              {discount > 0
                ? "You received a discount!"
                : "No discount applied."}
            </p>
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
