import React from "react";
import "./StatusIndicator.css";

export const StatusIOff = () => (
  <span className="status-indicator off"> Off Duty </span>
);

export const StatusIOffPersonal = () => (
  <>
    <span className="status-indicator off">OFF Duty</span>{" "}
    <span className="subtext"> (PC) </span>{" "}
  </>
);

export const StatusIYard = () => (
  <>
    <span className="status-indicator on">On Duty </span>{" "}
    <span className="subtext"> (YM) </span>{" "}
  </>
);

export const StatusIOn = () => (
  <span className="status-indicator on"> On Duty </span>
);

export const StatusIDR = () => (
  <span className="status-indicator dr"> Driving </span>
);

export const StatusISB = () => (
  <span className="status-indicator sb"> Sleeper </span>
);

export const StatusINotInfo = ({ log, errColor }) => (
  <span className={`status-indicator notInfo ${errColor ? "errColor" : ""}`}>
    {" "}
    {log}{" "}
  </span>
);
// eslint-disable-next-line
export default {
  DS_ON: <StatusIOn />,
  DR_IND_YM: <StatusIYard />,
  DS_D: <StatusIDR />,
  DS_SB: <StatusISB />,
  DS_OFF: <StatusIOff />,
  DR_IND_PC: <StatusIOffPersonal />,
  DR_LOGIN: <StatusINotInfo log="Login" />,
  DR_LOGOUT: <StatusINotInfo log="Logout" />,
  ENG_UP_NORMAL: <StatusINotInfo log="Power on" />,
  ENG_DOWN_NORMAL: <StatusINotInfo log="Power off" />,
  INTER_NORMAL_PRECISION: <StatusINotInfo log="Intermediate" />,
  ELD_MALF: <StatusINotInfo log="Malfunction" />,
  DR_CERT_1: <StatusINotInfo log="Certify (1)" />,
  DR_CERT_2: <StatusINotInfo log="Certify (2)" />,
  DR_CERT_3: <StatusINotInfo log="Certify (3)" />,
  DR_CERT_4: <StatusINotInfo log="Certify (4)" />,
  DR_CERT_5: <StatusINotInfo log="Certify (5)" />,
  DR_CERT_6: <StatusINotInfo log="Certify (6)" />,
  DR_CERT_7: <StatusINotInfo log="Certify (7)" />,
  DR_CERT_8: <StatusINotInfo log="Certify (8)" />,
  DR_CERT_9: <StatusINotInfo log="Certify (9)" />,
};

export const Status = ({ type, errColor }) => {
  switch (type) {
    case "DS_ON":
      return <StatusIOn />;
    case "DR_IND_YM":
      return <StatusIYard />;
    case "DS_D":
      return <StatusIDR />;
    case "DS_SB":
      return <StatusISB />;
    case "DS_OFF":
      return <StatusIOff />;
    case "DR_IND_PC":
      return <StatusIOffPersonal />;
    case "DR_LOGIN":
      return <StatusINotInfo log="Login" errColor={errColor} />;
    case "DR_LOGOUT":
      return <StatusINotInfo log="Logout" errColor={errColor} />;
    case "ENG_UP_NORMAL":
      return <StatusINotInfo log="Power on" errColor={errColor} />;
    case "ENG_DOWN_NORMAL":
      return <StatusINotInfo log="Power off" errColor={errColor} />;
    case "INTER_NORMAL_PRECISION":
      return <StatusINotInfo log="Intermediate" errColor={errColor} />;
    case "ELD_MALF":
      return <StatusINotInfo log="Malfunction" errColor={errColor} />;
    case "DR_CERT_1":
      return <StatusINotInfo log="Certify (1)" errColor={errColor} />;
    case "DR_CERT_2":
      return <StatusINotInfo log="Certify (2)" errColor={errColor} />;
    case "DR_CERT_3":
      return <StatusINotInfo log="Certify (3)" errColor={errColor} />;
    case "DR_CERT_4":
      return <StatusINotInfo log="Certify (4)" errColor={errColor} />;
    case "DR_CERT_5":
      return <StatusINotInfo log="Certify (5)" errColor={errColor} />;
    case "DR_CERT_6":
      return <StatusINotInfo log="Certify (6)" errColor={errColor} />;
    case "DR_CERT_7":
      return <StatusINotInfo log="Certify (7)" errColor={errColor} />;
    case "DR_CERT_8":
      return <StatusINotInfo log="Certify (8)" errColor={errColor} />;
    case "DR_CERT_9":
      return <StatusINotInfo log="Certify (9)" errColor={errColor} />;
    default:
      return null;
  }
};
