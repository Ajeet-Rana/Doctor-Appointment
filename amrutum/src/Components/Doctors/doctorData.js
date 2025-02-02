// DoctorList.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { fetchDoctors } from "../Reducer/action";
import "./DoctorList.css";

const DoctorList = () => {
  const [specialty, setSpecialty] = useState("");
  const [displayedDoctors, setDisplayedDoctors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const doctorData = useSelector((state) => state.doctors);
  const history = useHistory();
  const userdata = useSelector((state) => state.user.user);

  useEffect(() => {
    dispatch(fetchDoctors(specialty));
  }, [dispatch, specialty]);

  useEffect(() => {
    if (doctorData.doctors) {
      setDisplayedDoctors(doctorData.doctors.slice(0, 5));
    }
  }, [doctorData]);

  const handleSpecialtyChange = (e) => {
    setSpecialty(e.target.value);
  };

  const handleBookAppointment = (doctor) => {
    if (!userdata || Object.keys(userdata ?? {}).length === 0) {
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
        <div className="doctor-list-container">
          {displayedDoctors.map((doctor) => (
            <div className="doctor-card" key={doctor.id}>
              <h2>{doctor.name}</h2>
              <p>Specialty: {doctor.specialty}</p>
              <p>Email: {doctor.email}</p>
              <button onClick={() => handleBookAppointment(doctor)}>
                Book Appointment
              </button>
            </div>
          ))}
        </div>
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
