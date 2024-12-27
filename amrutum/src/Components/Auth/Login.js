import React, { useState } from "react";

function Auth() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // For Register only
  const [role, setRole] = useState("User"); // Default role is "User"
  const [specialization, setSpecialization] = useState(""); // For Doctor only
  const [loading, setLoading] = useState(false); // For API call state
  const [error, setError] = useState(null); // For error handling

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

      // Prepare request data based on the mode
      const requestData = isLogin
        ? { email, password, role }
        : {
            name,
            email,
            role,
            password,
            ...(role === "doctor" && { specialty: specialization }),
          };

      // Send POST request to the backend
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An error occurred");
      }

      const result = await response.json();
      if (isLogin) {
        console.log("Token saved:", result.token);
        alert("Login successful");
      } else {
        alert("Registration successful");
      }

      // Clear form fields
      setName("");
      setEmail("");
      setPassword("");
      setRole("User");
      setSpecialization("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>{isLogin ? "Login" : "Register"}</h1>
      <form onSubmit={handleSubmit}>
        {/* Name and Role fields for Register only */}
        {!isLogin && (
          <>
            <div>
              <label>Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Role:</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="User">User</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
            {role === "doctor" && (
              <div>
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
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="User">User</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : isLogin ? "Login" : "Register"}
        </button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)} disabled={loading}>
        Switch to {isLogin ? "Register" : "Login"}
      </button>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
}

export default Auth;
