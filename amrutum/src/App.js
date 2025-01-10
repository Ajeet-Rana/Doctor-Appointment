import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "../src/Components/Auth/Login";
import Home from "./Components/Auth/Home";
import Appointment from "./Components/Auth/Appointment";
import Dashboard from "./Components/Auth/Dashboard";
import Dashboard_DOC from "./Components/Auth/Dashboard_DOC";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route exact path="/" component={Home} />
        <Route path="/user" component={Dashboard} />
        <Route path="/doctor" component={Dashboard_DOC} />
        <Route path="/appointment" component={Appointment} />
      </Switch>
    </Router>
  );
}

export default App;
