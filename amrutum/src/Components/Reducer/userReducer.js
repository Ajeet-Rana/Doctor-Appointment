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

export const userReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
      return {
        loading: true,
        isAuthenticated: false,
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
      };
    case LOGIN_FAIL:
    case REGISTER_FAIL:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const doctorReducer = (state = { doctors: [] }, action) => {
  switch (action.type) {
    case FETCH_DOCTORS_REQUEST:
      return { ...state, loading: true };
    case FETCH_DOCTORS_SUCCESS:
      return { loading: false, doctors: action.payload, error: "" };
    case FETCH_DOCTORS_FAILURE:
      return { loading: false, doctors: [], error: action.payload };
    default:
      return state;
  }
};

export const appointmentReducer = (state = null, action) => {
  switch (action.type) {
    case BOOK_APPOINTMENT_REQUEST:
      return { ...state, loading: true };
    case BOOK_APPOINTMENT_SUCCESS:
      return { loading: false, appointment: action.payload, error: "" };
    case BOOK_APPOINTMENT_FAILURE:
      return { loading: false, appointment: null, error: action.payload };
    default:
      return state;
  }
};

export const reportReducer = (state = [], action) => {
  switch (action.type) {
    case FETCH_FINANCIAL_REPORT_REQUEST:
      return { ...state, loading: true };
    case FETCH_FINANCIAL_REPORT_SUCCESS:
      return { ...state, loading: false, report: action.payload };
    case FETCH_FINANCIAL_REPORT_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userinfoReducer = (
  state = { userinfo: null, appointments: [] },
  action
) => {
  switch (action.type) {
    case FETCH_USER_INFO_REQUEST:
      return { ...state, loading: true };
    case FETCH_USER_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        userinfo: action.payload.userinfo,
        appointments: action.payload.appointments,
      };
    case FETCH_USER_INFO_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
