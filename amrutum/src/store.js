import { createStore, applyMiddleware, combineReducers } from "redux";
import { thunk } from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  userReducer,
  doctorReducer,
  appointmentReducer,
  reportReducer,
  userinfoReducer,
  appointmentUpdateReducer,
} from "./Components/Reducer/userReducer";

const middleware = [thunk];
const reducer = combineReducers({
  user: userReducer,
  doctors: doctorReducer,
  appointmentData: appointmentReducer,
  report: reportReducer,
  userinfo: userinfoReducer,
  appointmentUpdate: appointmentUpdateReducer,
});
const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
