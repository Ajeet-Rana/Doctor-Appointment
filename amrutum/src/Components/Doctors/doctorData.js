import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { fetchDoctors } from "../Reducer/action";

const DoctorList = () => {
  const [specialty, setSpecialty] = useState("");
  const dispatch = useDispatch();
  const doctorData = useSelector((state) => state.doctors);
  const history = useHistory();
  const userdata = useSelector((state) => state.user.user);

  useEffect(() => {
    dispatch(fetchDoctors(specialty));
  }, [dispatch, specialty]);

  const handleSpecialtyChange = (e) => {
    setSpecialty(e.target.value);
  };
  console.log(userdata);
  const handleBookAppointment = (doctor) => {
    if (!userdata || Object.keys(userdata ?? {}).length === 0) {
      history.push("/login");
    } else {
      history.push({
        pathname: "/appointment",
        state: { doctor },
      });
    }
  };

  const { loading, doctors, error } = doctorData;

  return (
    <div>
      <h1>Doctor List</h1>
      <select onChange={handleSpecialtyChange} value={specialty}>
        <option value="">All Specialties</option>
        <option value="Cardiology">Cardiology</option>
        <option value="Dermatology">Dermatology</option>
        <option value="Neurology">Neurology</option>
      </select>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <ul>
          {doctors.map((doctor) => (
            <li key={doctor.id}>
              <h2>{doctor.name}</h2>
              <p>Specialty: {doctor.specialty}</p>
              <p>Email: {doctor.email}</p>
              <button onClick={() => handleBookAppointment(doctor)}>
                Book Appointment
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DoctorList;
