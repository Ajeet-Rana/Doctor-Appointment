import React from "react";
import AppointmentForm from "./AppointmentForm";

const App = () => {
  const createAppointment = async (appointmentData) => {
    const endpoint = "http://localhost:5000/api/auth/patients/appointments"; // Adjust this based on your backend route

    const requestData = {
      patientId: appointmentData.patientId,
      doctorId: appointmentData.doctorId,
      appointmentDate: appointmentData.appointmentDate,
      amountCharged: appointmentData.amountCharged,
      discountApplied: appointmentData.discountApplied,
      status: appointmentData.status,
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
        credentials: "include", // For handling cookies/session if needed
      });

      if (response.ok) {
        alert("Appointment created successfully");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("Failed to create appointment");
    }
  };

  return (
    <div>
      <h1>Create Appointment</h1>
      <AppointmentForm createAppointment={createAppointment} />
    </div>
  );
};

export default App;
