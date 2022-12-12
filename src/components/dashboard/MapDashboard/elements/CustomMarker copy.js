import React, { useState, useEffect, useRef } from "react";
import { InfoWindow,InfoBox, Marker } from "@react-google-maps/api";
import "./style.css";
// import upArr from '../icons/up-arrow.svg';
// import location from '../icons/up-arrow2.svg';
// import location from "../icons/location_sat.png";

import { v4 as uuidv4 } from "uuid";

export const CustomMarker = ({ id, driver, iconDeg, label, position, speed, odometer, truckNo }) => {
  const [copyMsg, setCopyMsg] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const iconRef = useRef(null);
  const infoRef = useRef(null);

  const infos = [
    { title: "Driver: ", value: driver},
    { title: "Status: ", value: label.status,},
    { title: "Address: ", value: label.address,},
    { title: "Odometer: ", value: odometer,},
    { title: "Speed: ",   value: speed,},
    { title: "Date: ", value: label.date,},
  ];

  const onDomReady = () => {
    const btn = document.querySelector(".gm-ui-hover-effect");
    if (btn) {
      btn.remove();
    }
  };

  const onSaveLocation = () => {
    let text = `${position.lat},${position.lng}`;
    let textArea = document.createElement("textarea");
    textArea.value = text;
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      let successful = document.execCommand("copy");
      let msg = successful ? "successfull" : "unsuccessfull";
      if (successful) {
        // console.log("Copying is " + msg);
        setCopyMsg("Location copied to clipboard");
      }
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
    }

    document.body.removeChild(textArea);
  };

  let st = label.status;

  return (
    <span ref={iconRef}>
    <Marker
        onMouseOver={() => setShowInfo(true)}
        onMouseOut={() => setShowInfo(false)}
        zIndex={3655 + id}
        onClick={onSaveLocation}
        position={position}
        // icon={{
        //     anchor: speed > 0 ? {x: 20, y: 20}: { x: 20, y: 40 },
        //     url:
        //       iconDeg > 0 &&
        //       (st === "driving" || st === "personal" || st === "yard")
        //         ? `https://us.tteld.com/result/pin_sat${iconDeg}.png` : location,
        //     scaledSize: { width: 40, height: 40 },
        //     origin: { x: 0.5, y: 0.5 },
        //     defaultZIndex: 3655 + id,
        // }}
    >
        {showInfo && ( <InfoWindow onDomReady={onDomReady} ref={infoRef}>
            <div>
                {infos.map((el, i) => (
                  <div className="IW_it" key={uuidv4()}>
                    <span className="left"> {el.title} </span>{" "}
                    <span className="right"> {el.value} </span>{" "}
                  </div>
                ))}{" "}
            </div>
            </InfoWindow>
        )}
      <InfoBox
        options={{
            closeBoxURL: ``,
            enableEventPropagation: true,
            pixelOffset: new window.google.maps.Size(-90, speed > 0 ? 15 : 0),
            boxStyle: {
              width: "180px",
            },
          }}
      >
        <div className="InfoBox">
            <p className="IB_it"> {driver} </p>{" "}
            <p className="IB_it"> Truck: {truckNo} </p>{" "}
        </div>
      </InfoBox>
    </Marker> 
    </span>
   
  );
};
