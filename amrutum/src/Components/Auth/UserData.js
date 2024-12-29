import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo } from "../Reducer/action";
import "./UserInfo.css";
import Loading from "./Loading";
const UserInfo = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user._id);
  console.log(userId);
  const { loading, userinfo, appointments, error } = useSelector(
    (state) => state.userinfo
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserInfo(userId));
    }
  }, [dispatch, userId]);

  if (loading || !userinfo) return <Loading />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container">
      <h1 className="title">User Info</h1>
      {userinfo && (
        <div className="user-info">
          <p>Name: {userinfo.name}</p>
          <p>Email: {userinfo.email}</p>
          <p>Wallet Balance: ${userinfo.wallet}</p>
        </div>
      )}
      <h2 className="section-title">Appointments</h2>
      {appointments.length > 0 ? (
        <ul className="appointments-list">
          {appointments.map((appointment) => (
            <li key={appointment._id}>
              <p>Doctor: {appointment.doctorId.name}</p>
              <p>Specialty: {appointment.doctorId.specialty}</p>
              <p>
                Date: {new Date(appointment.appointmentDate).toLocaleString()}
              </p>
              <p>Status: {appointment.status}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-appointments">No upcoming appointments.</p>
      )}
    </div>
  );
};

export default UserInfo;
