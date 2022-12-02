import React from "react";
import "./StatusIndicator.css";

export const StatusIOff = () => (
  <span className="status-indicator off"> OFF </span>
);

export const StatusIOffPersonal = () => (
  <>
    <span className="status-indicator off">OFF </span>{" "}
    <span className="subtext"> (PC) </span>{" "}
  </>
);

export const StatusIYard = () => (
  <>
    <span className="status-indicator on">ON </span>{" "}
    <span className="subtext"> (YM) </span>{" "}
  </>
);

export const StatusIOn = () => (
  <span className="status-indicator on"> ON </span>
);

export const StatusIDR = () => (
  <span className="status-indicator dr"> DR </span>
);

export const StatusISB = () => (
  <span className="status-indicator sb"> SB </span>
);

export const StatusINotInfo = ({ log, errColor }) => (
  <span className={`status-indicator notInfo ${errColor ? "errColor" : ""}`}>
    {" "}
    {log}{" "}
  </span>
);

export default {
  on: <StatusIOn />,
  yard: <StatusIYard />,
  driving: <StatusIDR />,
  sleep: <StatusISB />,
  off: <StatusIOff />,
  personal: <StatusIOffPersonal />,
  login: <StatusINotInfo log="Login" />,
  logout: <StatusINotInfo log="Logout" />,
  poweron: <StatusINotInfo log="Power on" />,
  poweroff: <StatusINotInfo log="Power off" />,
  intermediate: <StatusINotInfo log="Intermediate" />,
  malfunction: <StatusINotInfo log="Malfunction" />,
  certify: <StatusINotInfo log="Certify" />,
};

export const Status = ({ type, errColor }) => {
  switch (type) {
    case "on":
      return <StatusIOn />;
    case "yard":
      return <StatusIYard />;
    case "driving":
      return <StatusIDR />;
    case "sleep":
      return <StatusISB />;
    case "off":
      return <StatusIOff />;
    case "personal":
      return <StatusIOffPersonal />;
    case "login":
      return <StatusINotInfo log="Login" errColor={errColor} />;
    case "logout":
      return <StatusINotInfo log="Logout" errColor={errColor} />;
    case "poweron":
      return <StatusINotInfo log="Power on" errColor={errColor} />;
    case "poweroff":
      return <StatusINotInfo log="Power off" errColor={errColor} />;
    case "intermediate":
      return <StatusINotInfo log="Intermediate" errColor={errColor} />;
    case "malfunction":
      return <StatusINotInfo log="Malfunction" errColor={errColor} />;
    case "certify":
      return <StatusINotInfo log="Certify" errColor={errColor} />;
    default:
      return null;
  }
};
