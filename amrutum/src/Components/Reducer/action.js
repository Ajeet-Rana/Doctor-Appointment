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
    console.log(data.user._id);
    dispatch(fetchUserInfo(data.user._id));
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

export const fetchUserInfo = (userId) => async (dispatch) => {
  dispatch({ type: FETCH_USER_INFO_REQUEST });

  try {
    const response = await axios.get(`/api/auth/patients-info/${userId}`);
    dispatch({ type: FETCH_USER_INFO_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_USER_INFO_FAILURE, payload: error.message });
  }
};
