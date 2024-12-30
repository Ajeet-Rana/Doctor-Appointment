import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo } from "../Reducer/action";
import Loading from "../Auth/Loading";
import "./UserInfo.css";
import DoctorList from "./DocData";

const UserInfo = () => {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const [showAll, setShowAll] = useState(false);
  const { loading, userinfo, appointments, error } = useSelector(
    (state) => state.userinfo
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserInfo(userId));
    }
  }, [dispatch, userId]);

  if (loading) return <Loading />;
  if (error) return <p className="error-message">Error: {error}</p>;
  if (!userinfo)
    return <p className="info-message">No user information found.</p>;

  const displayedAppointments = showAll
    ? appointments
    : appointments.slice(0, 4);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">User Dashboard</h1>

      <div className="dashboard-cards">
        {/* User Information Card */}
        <div className="card user-info-card">
          {userinfo.avatarUrl && (
            <img
              src={userinfo.avatarUrl}
              alt={`${userinfo.name}'s avatar`}
              className="user-avatar"
            />
          )}
          <p>
            <strong>Name:</strong> {userinfo.name}
          </p>
          <p>
            <strong>Email:</strong> {userinfo.email}
          </p>
          <p>
            <strong>Wallet Balance:</strong> ${userinfo.walletBalance}
          </p>
        </div>

        {/* Appointments Section */}
        <div className="card appointments-card">
          <h2>Appointments</h2>
          {appointments.length > 0 ? (
            <>
              <div className="appointments-container">
                {displayedAppointments.map((appointment) => (
                  <div key={appointment._id} className="appointment-card">
                    <p>
                      <strong>Doctor:</strong> {appointment.doctorId.name}
                    </p>
                    <p>
                      <strong>Specialty:</strong>{" "}
                      {appointment.doctorId.specialty}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(appointment.appointmentDate).toLocaleString()}
                    </p>
                    <p>
                      <strong>Status:</strong> {appointment.status}
                    </p>
                  </div>
                ))}
              </div>
              {/* View All / Show Less Button */}
              {appointments.length > 4 && (
                <button
                  className="view-all-button"
                  onClick={() => setShowAll((prev) => !prev)}
                >
                  {showAll ? "Show Less" : "View All"}
                </button>
              )}
            </>
          ) : (
            <p className="info-message">No upcoming appointments.</p>
          )}
        </div>
      </div>
      <DoctorList />
    </div>
  );
};

export default UserInfo;
