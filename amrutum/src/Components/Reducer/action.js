import axios from "axios";

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  FETCH_DOCTORS_REQUEST,
  FETCH_DOCTORS_SUCCESS,
  FETCH_DOCTORS_FAILURE,
  BOOK_APPOINTMENT_REQUEST,
  BOOK_APPOINTMENT_SUCCESS,
  BOOK_APPOINTMENT_FAILURE,
  FETCH_FINANCIAL_REPORT_REQUEST,
  FETCH_FINANCIAL_REPORT_SUCCESS,
  FETCH_FINANCIAL_REPORT_FAILURE,
  FETCH_USER_INFO_REQUEST,
  FETCH_USER_INFO_SUCCESS,
  FETCH_USER_INFO_FAILURE,
  UPDATE_APPOINTMENT_REQUEST,
  UPDATE_APPOINTMENT_SUCCESS,
  UPDATE_APPOINTMENT_FAIL,
} from "./constants";
// Login User
export const login = (email, password, role) => async (dispatch) => {
  console.log(email, password);
  try {
    dispatch({ type: LOGIN_REQUEST });
    //const config = { headers: { "Content-type": "application/json" } };
    const { data } = await axios.post(
      "/api/auth/login",
      { email, password, role },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    dispatch({
      type: LOGIN_SUCCESS,
      payload: data.user,
    });
    // Determine role based on user data
    const userRole = data.user.specialty ? "doctor" : "user";

    // Save user info to localStorage
    localStorage.setItem(
      "userInfo",
      JSON.stringify({
        userId: data.user._id,
        role: userRole,
        specialty: data.user.specialty, // Store specialty only if doctor
      })
    );

    // Log user data for debugging
    console.log(data.user);

    // Fetch user info based on role
    dispatch(
      fetchUserInfo({
        userId: data.user._id,
        role: userRole,
      })
    );
  } catch (error) {
    dispatch({ type: LOGIN_FAIL, payload: error.response.data.message });
  }
};

// Register User
export const register = (userData) => async (dispatch) => {
  console.log(userData);
  try {
    dispatch({ type: REGISTER_REQUEST });

    const { data } = await axios.post(`/api/auth/register`, userData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    dispatch({
      type: REGISTER_SUCCESS,
      payload: data.user,
    });
    console.log(data);
  } catch (error) {
    dispatch({ type: REGISTER_FAIL, payload: error.response.data.message });
  }
};

// Get Doctors
export const fetchDoctors =
  (specialty = "") =>
  async (dispatch) => {
    dispatch({ type: FETCH_DOCTORS_REQUEST });

    try {
      const response = await axios.get(`/api/doc/doctors`, {
        params: { specialty },
      });
      dispatch({ type: FETCH_DOCTORS_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: FETCH_DOCTORS_FAILURE, payload: error.message });
    }
  };

export const bookAppointment = (appointmentData) => async (dispatch) => {
  dispatch({ type: BOOK_APPOINTMENT_REQUEST });

  try {
    const response = await axios.post(
      "/api/auth/appointments",
      appointmentData
    );
    dispatch({ type: BOOK_APPOINTMENT_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: BOOK_APPOINTMENT_FAILURE, payload: error.message });
  }
};

export const fetchFinancialReport = () => async (dispatch) => {
  dispatch({ type: FETCH_FINANCIAL_REPORT_REQUEST });

  try {
    const response = await axios.get("/api/reports/financial-report");
    dispatch({
      type: FETCH_FINANCIAL_REPORT_SUCCESS,
      payload: response.data.report,
    });
  } catch (error) {
    dispatch({ type: FETCH_FINANCIAL_REPORT_FAILURE, payload: error.message });
  }
};

export const fetchUserInfo =
  ({ userId, role }) =>
  async (dispatch) => {
    dispatch({ type: FETCH_USER_INFO_REQUEST });

    try {
      console.log(userId, role);
      const apiRoute =
        role === "doctor"
          ? `/api/auth/doctor-info/${userId}`
          : `/api/auth/patients-info/${userId}`;
      const response = await axios.get(apiRoute);

      dispatch({
        type: FETCH_USER_INFO_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: FETCH_USER_INFO_FAILURE,
        payload: error.message,
      });
    }
  };

export const updateAppointment =
  (appointmentId, updates) => async (dispatch) => {
    console.log(appointmentId, updates);
    try {
      dispatch({ type: UPDATE_APPOINTMENT_REQUEST });

      const { data } = await axios.patch(
        `/api/auth/doctor/appointment/${appointmentId}`,
        updates,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      dispatch({
        type: UPDATE_APPOINTMENT_SUCCESS,
        payload: data.appointment,
      });

      console.log(data.appointment.doctorId);
      dispatch(
        fetchUserInfo({
          userId: data.appointment.doctorId,
          role: "doctor",
        })
      );
    } catch (error) {
      dispatch({
        type: UPDATE_APPOINTMENT_FAIL,
        payload: error.response.data.message || "Failed to update appointment",
      });
    }
  };
