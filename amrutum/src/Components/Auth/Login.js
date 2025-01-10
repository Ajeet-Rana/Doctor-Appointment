import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { login, register } from "../Reducer/action"; // Assuming actions are defined in a file
import "./Login.css";
function Auth() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // For Register only
  const [role, setRole] = useState("user"); // Default role is "user"
  const [specialization, setSpecialization] = useState(""); // For Doctor only
  const [successMessage, setSuccessMessage] = useState(""); // For success message
  const dispatch = useDispatch();
  const history = useHistory();
  // Redux state values
  const { loading, error, isAuthenticated, registersuccess } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (isAuthenticated) {
      // Retrieve userInfo from local storage
      const userInfo = localStorage.getItem("userInfo");

      if (userInfo) {
        const parsedUserInfo = JSON.parse(userInfo);

        // Redirect based on role
        if (parsedUserInfo.role === "doctor") {
          history.push("/doctor");
        } else if (parsedUserInfo.role === "user") {
          history.push("/user");
        } else {
          console.error("Invalid role found in userInfo");
        }
      } else {
        console.error("No userInfo found in local storage");
      }
    }
  }, [isAuthenticated, history]);

  useEffect(() => {
    if (registersuccess) {
      setSuccessMessage("Registered successfully! Please login.");
      setIsLogin(true); // Switch to login form
      resetForm(); // Clear form fields
    }
  }, [registersuccess]);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setRole("user");
    setSpecialization("");
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      // Dispatch login action
      dispatch(login(email, password, role));
    } else {
      // Dispatch register action
      const userData = {
        name,
        email,
        role,
        password,
        ...(role === "doctor" && { specialty: specialization }),
      };
      dispatch(register(userData));
    }
  };

  const handleSwitch = () => {
    setIsLogin(!isLogin);
    resetForm();
    setSuccessMessage(""); // Clear success message on switching
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">{isLogin ? "Login" : "Register"}</h1>
      {/* Success message */}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="auth-form">
        {!isLogin && (
          <>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            {role === "doctor" && (
              <div className="form-group">
                <label>Specialization:</label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  required
                >
                  <option value="">Select Specialization</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Psychiatry">Psychiatry</option>
                </select>
              </div>
            )}
          </>
        )}
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="user">User</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Submitting..." : isLogin ? "Login" : "Register"}
        </button>
      </form>
      <button
        onClick={handleSwitch}
        className="switch-button"
        disabled={loading}
      >
        Switch to {isLogin ? "Register" : "Login"}
      </button>
      {error && <p className="error-message">Error: {error}</p>}
    </div>
  );
}

export default Auth;
