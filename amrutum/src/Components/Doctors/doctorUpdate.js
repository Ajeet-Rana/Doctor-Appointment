import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateAppointment } from "../Reducer/action";

const DoctorEarnings = ({ appointments, userinfo }) => {
  const dispatch = useDispatch();

  // State to store charge and discount for each appointment
  const [chargesAndDiscounts, setChargesAndDiscounts] = useState({});

  // Function to handle charge and discount updates
  const handleUpdate = (appointmentId) => {
    const updatedData = chargesAndDiscounts[appointmentId];
    dispatch(updateAppointment(appointmentId, updatedData));
  };

  // Calculate total earnings
  const totalEarnings = appointments.reduce(
    (total, appointment) =>
      total + (appointment.amountCharged - appointment.discountApplied),
    0
  );

  // Handle input change for charge and discount
  const handleInputChange = (e, appointmentId, field) => {
    const value = e.target.value;
    setChargesAndDiscounts((prev) => ({
      ...prev,
      [appointmentId]: {
        ...prev[appointmentId],
        [field]: value,
      },
    }));
  };

  return (
    <div className="doctor-earnings">
      <p>
        <strong>Total Earnings:</strong> ${totalEarnings}
      </p>

      <h3>Appointment Charges</h3>
      <div className="appointments-container">
        {appointments.length > 0 && (
          <div key={appointments[0]._id} className="appointment-card">
            <p>
              <strong>Charge:</strong> ${userinfo.appointmentCharge}
            </p>
            <p>
              <strong>Discount:</strong> ${userinfo.discountGiven}
            </p>

            {/* Inputs to update charge and discount */}
            <div>
              <input
                type="number"
                value={chargesAndDiscounts[appointments[0]._id]?.charge}
                onChange={(e) =>
                  handleInputChange(e, appointments[0]._id, "amountCharged")
                }
                placeholder="New Charge"
                style={{
                  width: "200px", // Adjust the width to make the input box bigger
                  padding: "8px", // Optional: Adds some padding for better UI
                }}
              />
              <input
                type="number"
                value={chargesAndDiscounts[appointments[0]._id]?.discount}
                onChange={(e) =>
                  handleInputChange(e, appointments[0]._id, "discountGiven")
                }
                placeholder="New Discount"
                style={{
                  width: "200px", // Adjust the width to make the input box bigger
                  padding: "8px", // Optional: Adds some padding for better UI
                  marginLeft: "10px", // Adds some spacing between the input boxes
                }}
              />
              <button
                onClick={() => handleUpdate(appointments[0]._id)}
                style={{
                  marginLeft: "15px", // Adds a left margin to the button
                  padding: "8px 12px", // Optional: Improves the button's appearance
                  cursor: "pointer", // Optional: Adds a pointer cursor for better UX
                }}
              >
                Update Charge & Discount
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorEarnings;
