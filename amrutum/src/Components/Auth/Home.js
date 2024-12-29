import DoctorList from "../Doctors/doctorData";
import UserInfo from "./UserData";

const PlayerDashboard = () => {
  return (
    <div>
      <h1>Player Dashboard</h1>
      <UserInfo />
      <DoctorList />

      {/* Offers Section */}
    </div>
  );
};

export default PlayerDashboard;
