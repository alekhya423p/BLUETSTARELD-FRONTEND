import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store/store";
import {
  loadUser,
  // refreshToken
} from "./actions/authAction";
import jwt_decode from "jwt-decode";
import "react-datepicker/dist/react-datepicker.css";
// import data from './data.json';
import {
  SET_MINIMIZE_REQUEST,
  SET_COLOR_THEME_REQUEST,
} from "./constants/actionTypes";

function checkTokenValid() {
  try {
    //what you are doing...
    let token_expired = localStorage.getItem("token");
    let decoded = jwt_decode(token_expired);
    let decode_string = decoded["exp"];
    var current_time = Date.now() / 1000;
    if (decode_string < current_time) {
      localStorage.clear();
    }
  } catch (e) {
    localStorage.clear(); //what you need to do incase the jwt is not valid
    // console.log(e); //for your own debugging
  }
}
checkTokenValid();

const isMinimize = localStorage.getItem("minimize");
const nMode = localStorage.getItem("nMode")
  ? localStorage.getItem("nMode")
  : "nModeOff";
localStorage.setItem("nMode", nMode);
// localStorage.setItem('user', JSON.stringify(data))
try {
  //what you are doing...
  const token = localStorage.getItem("token");
  const user = token && jwt_decode(token);
  if (user) {
    let decode_string = user.exp;
    var current_time = Date.now() / 1000;
    if (decode_string < current_time) {
      localStorage.clear();
    }
    store.dispatch(loadUser());
  }
} catch (e) {
  localStorage.clear(); //what you need to do incase the jwt is not valid
  // console.log(e); //for your own debugging
}

store.dispatch({ type: SET_MINIMIZE_REQUEST, payload: isMinimize });
store.dispatch({ type: SET_COLOR_THEME_REQUEST, payload: nMode });

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <App />
  </Provider>
  // </React.StrictMode>
);
