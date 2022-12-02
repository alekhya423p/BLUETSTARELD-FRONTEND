import React, { useState, useRef } from "react";
// import "./StopMarker.scss";
import { Marker, InfoWindow } from "react-google-maps";
import moment from "moment-timezone";

import stopIcon from "./icons/stopIcon.svg";
import clockIcon from "./icons/clock.svg";

export const StopMarker = ({ marker }) => {

  const user = JSON.parse(localStorage.getItem("userInfo"));
  const tz = user && user.companyInfo && user.companyInfo.timeZoneId ? user.companyInfo.timeZoneId : "America/Los_Angeles";
  const [showInfo, setShowInfo] = useState(false);
  const iconRef = useRef(null);
  const infoRef = useRef(null);

  const removeCloseBtn = () => {
    const btn = document.querySelector(".gm-ui-hover-effect");
    if (btn) {
      btn.remove();
    }
  };

  const getTime = () => {
    const from = moment.tz(marker.when, tz);
    const to = moment.tz(marker.when, tz).add(marker.duration, "second");
    return `${from.format("MMM DD, hh:mm:ss A")} - ${to.format("hh:mm:ss A")}`;
  };

  const getDuration = () => {
    const from = moment.tz(marker.when, tz);
    const to = moment.tz(marker.when, tz).add(marker.duration, "second");
    return moment(moment.duration(to.diff(from)).asMilliseconds()).format(
      "mm:ss"
    );
  };

  return (
    <span ref={iconRef}>
      <Marker
        onClick={() => setShowInfo(!showInfo)}
        icon={{
          anchor: {
            x: 12,
            y: 20,
          },
          url: stopIcon,
          scaledSize: {
            width: 25,
            height: 25,
          },
          origin: {
            x: 0.5,
            y: 0.5,
          },
        }}
        position={marker.coordinates}
      >
        {showInfo && (
          <InfoWindow onDomReady={removeCloseBtn} ref={infoRef}>
            <div
              className="StopMarkerInfo"
              style={{
                paddingBottom: "12px",
                marginRight: "12px",
              }}
            >
              <h3 className="sm-title"> {marker.address} </h3>{" "}
              <p className="sm-date"> {getTime()} </p>{" "}
              <div className="sm-time">
                <img className="smt-img" src={clockIcon} alt="icon" />
                <p className="smt-txt"> Stopped for {getDuration()} </p>{" "}
              </div>{" "}
            </div>{" "}
          </InfoWindow>
        )}{" "}
      </Marker>
    </span>
  );
};
