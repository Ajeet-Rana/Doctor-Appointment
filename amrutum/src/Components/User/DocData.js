import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { fetchDoctors } from "../Reducer/action";

const DoctorList = () => {
  const [specialty, setSpecialty] = useState("");
  const [displayedDoctors, setDisplayedDoctors] = useState({
    regularDoctors: [],
    appointmentDoctors: [],
  });
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const doctorData = useSelector((state) => state.doctors);
  const history = useHistory();
  const userinfo = useSelector((state) => state.userinfo.userinfo);
  const appointments = useSelector((state) => state.userinfo.appointments);

  useEffect(() => {
    dispatch(fetchDoctors(specialty));
  }, [dispatch, specialty]);

  useEffect(() => {
    if (doctorData.doctors) {
      const appointmentDoctors = doctorData.doctors.filter((doctor) =>
        appointments.some(
          (appointment) => appointment.doctorId._id === doctor._id
        )
      );

      const regularDoctors = doctorData.doctors.filter(
        (doctor) =>
          !appointments.some(
            (appointment) => appointment.doctorId._id === doctor._id
          )
      );

      setDisplayedDoctors({
        regularDoctors,
        appointmentDoctors,
      });
    }
  }, [doctorData, appointments]);

  const handleSpecialtyChange = (e) => {
    setSpecialty(e.target.value);
  };

  const handleBookAppointment = (doctor) => {
    if (!userinfo) {
      setShowModal(true);
    } else {
      history.push({
        pathname: "/appointment",
        state: { doctor },
      });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLoginRedirect = () => {
    setShowModal(false);
    history.push("/login");
  };

  const { loading, error } = doctorData;

  return (
    <div className="container">
      <h1>Meet Our Popular Doctors</h1>
      <h2>Choose Specialization</h2>
      <div className="select-container">
        <select onChange={handleSpecialtyChange} value={specialty}>
          <option value="">All Specialties</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Dermatology">Dermatology</option>
          <option value="Neurology">Neurology</option>
        </select>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <h1>Get A Fist Time Appointment and Save HUGE!!</h1>
          <div className="doctor-list-container">
            {displayedDoctors.regularDoctors.map((doctor) => (
              <div className="doctor-card" key={doctor._id}>
                <h2>{doctor.name}</h2>
                <p>Specialty: {doctor.specialty}</p>
                <p>Email: {doctor.email}</p>
                <button onClick={() => handleBookAppointment(doctor)}>
                  Book Appointment
                </button>
              </div>
            ))}
          </div>

          {userinfo && appointments.length > 0 && (
            <>
              <h1>Your List of doctors</h1>
              <div className="doctor-list-container">
                {displayedDoctors.appointmentDoctors.map((doctor) => (
                  <div className="doctor-card" key={doctor._id}>
                    <h2>{doctor.name}</h2>
                    <p>Specialty: {doctor.specialty}</p>
                    <p>Email: {doctor.email}</p>
                    <button onClick={() => handleBookAppointment(doctor)}>
                      Book Appointment
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <p>Please login to book the doctor</p>
            <button onClick={handleLoginRedirect}>Login</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorList;
