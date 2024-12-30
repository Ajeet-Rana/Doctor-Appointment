import DoctorList from "../Doctors/doctorData";
import "./Home.css";
import HeroSec from "./HeroSec";
import CardText from "./CardText";

const PlayerDashboard = () => {
  return (
    <>
      <header className="header">
        <div className="top-bar">
          <div className="offer">
            <span>
              Get a FREE Ayurvedic Consultation | Download Amrutam App
            </span>
          </div>
        </div>
        <div className="brand">
          <div className="contact-info">
            <span className="phone-icon">📞</span>
            <span className="phone-number">+91 9713171999</span>
          </div>
          <h1>AMRUTAM</h1>
          <div className="login">Login</div>
        </div>
      </header>
      <HeroSec />
      <CardText />
      <div>
        <DoctorList />
        {/* Offers Section */}
      </div>
    </>
  );
};

export default PlayerDashboard;
