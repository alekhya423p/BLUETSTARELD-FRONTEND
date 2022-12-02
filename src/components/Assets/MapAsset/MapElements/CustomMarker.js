import React, { useState, useEffect, useRef } from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";
import upArr from "./icons/up-arrow.svg";
import uppArr2 from "./icons/pointer.png";

export const CustomMarker = ({ iconDeg, speed, label, position, draggable, icon}) => {
  const [counter, setCounter] = useState(1);
  const [showInfo, setShowInfo] = useState(false);

  const iconRef = useRef(null);
  const infoRef = useRef(null);
  useEffect(() => {
    let cancel = false;
    let timer;
    if (!cancel) {
        timer = setTimeout(() => {
          // console.log(speed);
        if (speed > 0) {
          let icon = document.querySelector(`[src*="up-arrow"]`);
          if (icon) {
            icon.style.transform = `rotate(${iconDeg}deg)`;
            icon.style.transformOrigin = `center`;
          }
          if (counter < 4) {
            setCounter(counter + 1);
          }
        }
      }, 500);
    }
    return () => {
      cancel = true;
      clearTimeout(timer);
    };
  }, [counter, setCounter, iconDeg, speed]);

  const removeCloseBtn = () => {
    const btn = document.querySelector(".gm-ui-hover-effect");
    if (btn) {
      btn.remove();
    }
  };

  return (
    <span ref={iconRef}>
      {" "}
      {position && (
        <Marker
          onClick={() => setShowInfo(!showInfo)}
          icon={{
            anchor: {
              x: 12,
              y: 20,
            },
            url: icon || (speed > 0 ? upArr : uppArr2),
            scaledSize: {
              width: 25,
              height: 25,
            },
            origin: {
              x: 0.5,
              y: 0.5,
            },
          }}
          position={position}
          draggable={draggable}
        >
          {showInfo && (
            <InfoWindow onDomReady={removeCloseBtn} ref={infoRef}>
              <div
                className="WindowInfo"
                style={{
                  paddingBottom: "12px",
                  marginRight: "12px",
                }}
              >
                <div>
                  <span className="left"> Status: </span>{" "}
                  <span className="right"> {label.status} </span>{" "}
                </div>{" "}
                <div>
                  <span className="left"> Address: </span>{" "}
                  <span className="right"> {label.address} </span>{" "}
                </div>{" "}
                {label.coordinates && (
                  <div>
                    <span className="left"> Coordinates: </span>{" "}
                    <span className="right">
                      {" "}
                      {`${label.coordinates.lat}, ${label.coordinates.lng}`}{" "}
                    </span>{" "}
                  </div>
                )}{" "}
                <div>
                  <span className="left"> Odometer: </span>{" "}
                  <span className="right"> {label.odometr} </span>{" "}
                </div>{" "}
                <div>
                  <span className="left"> Date: </span>{" "}
                  <span className="right"> {label.date} </span>{" "}
                </div>{" "}
              </div>{" "}
            </InfoWindow>
          )}{" "}
        </Marker>
      )}{" "}
    </span>
  );
};
