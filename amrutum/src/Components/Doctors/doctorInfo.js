import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo, updateAppointment } from "../Reducer/action";
import Loading from "../Auth/Loading";
import DoctorEarnings from "./doctorUpdate";
import "../User/UserInfo.css"; // Reuse the same CSS file for styling

const DoctorInfo = () => {
  const dispatch = useDispatch();
  const [showAll, setShowAll] = useState(false);

  const { loading, userinfo, appointments } = useSelector(
    (state) => state.userinfo
  );

  // Update function with flexible field updates
  const handleUpdate = (appointmentId, updates) => {
    dispatch(updateAppointment(appointmentId, updates));
  };

  useEffect(() => {
    const userdataString = localStorage.getItem("userInfo");
    const userdata = userdataString ? JSON.parse(userdataString) : null;

    if (userdata && userdata.userId && userdata.role) {
      console.log("User ID:", userdata.userId);
      console.log("Role:", userdata.role);

      // Dispatching with both userId and role
      dispatch(fetchUserInfo({ userId: userdata.userId, role: userdata.role }));
    }
  }, [dispatch]);

  if (loading) return <Loading />;

  if (!userinfo)
    return <p className="info-message">No doctor information found.</p>;

  const displayedAppointments = showAll
    ? appointments
    : appointments.slice(0, 4);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Doctor Dashboard</h1>

      <div className="dashboard-cards">
        {/* Doctor Information Card */}
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
            <strong>Specialty:</strong> {userinfo.specialty}
          </p>
        </div>

        {/* Appointments Section */}
        <div className="card appointments-card">
          <h2>Upcoming Appointments</h2>
          {appointments.length > 0 ? (
            <>
              <div className="appointments-container">
                {displayedAppointments.map((appointment) => (
                  <div key={appointment._id} className="appointment-card">
                    <p>
                      <strong>Patient:</strong> {appointment.patientId.name}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(appointment.appointmentDate).toLocaleString()}
                    </p>
                    <p>
                      <strong>Status:</strong> {appointment.status}
                    </p>
                    {/* Mark as Complete Button */}
                    {appointment.status !== "complete" && (
                      <button
                        onClick={() =>
                          handleUpdate(appointment._id, { status: "confirmed" })
                        }
                      >
                        Confirm
                      </button>
                    )}
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
      <DoctorEarnings appointments={appointments} userinfo={userinfo} />
    </div>
  );
};

export default DoctorInfo;
