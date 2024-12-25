import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../src/Components/Auth/Login";
import Home from "./Components/Auth/Home";
import Appointment from "./Components/Auth/Appointment";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/appointment" element={<Appointment />} />
      </Routes>
    </Router>
  );
}

export default App;
