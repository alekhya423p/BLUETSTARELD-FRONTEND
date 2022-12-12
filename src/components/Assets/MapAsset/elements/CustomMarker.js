import React, { useState, useRef } from "react";
// import { Marker, InfoWindow } from "react-google-maps";
// import InfoBox from "react-google-maps/lib/components/addons/InfoBox";
import { InfoWindow, Marker,
  // InfoBox
 } from "@react-google-maps/api";
import "./style.css";
import moveArr from '../icons/move-arrow.svg';
// import location from '../icons/up-arrow2.svg';
import location from "../icons/gray-circle.png";
import { v4 as uuidv4 } from "uuid";


export const CustomMarker = ({ id, driver, iconDeg, label,clusterer, position, speed, odometer, truckNo }) => {
  // const [copyMsg, setCopyMsg] = useState(null);
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
        console.log(msg);
        // setCopyMsg("Location copied to clipboard");
      }
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
    }

    document.body.removeChild(textArea);
  };

  let st = label.status;
  // const onLoad = infoBox => {
  //   console.log(infoBox);
  //   // console.log('infoBox: ', infoBox)
  // };
  // const options = { 
  //   closeBoxURL: '',
  //   enableEventPropagation: true ,
  //   pixelOffset: new window.google.maps.Size(-70, speed > 0 ? 1 : 0)
  // };
  return (
    <span ref={iconRef}>
      <Marker
            onMouseOver={() => setShowInfo(true)}
            onMouseOut={() => setShowInfo(false)}
            zIndex={3655 + id}
            key={id}
            onClick={onSaveLocation}
            position={position}
            clusterer={clusterer}
          icon={{
              anchor: speed > 0 ? {x: 8, y: 8}: { x: 8, y: 8 },
              url: iconDeg > 0 && (st === "D" || st === "PC" || st === "YM") ? moveArr : location,
              scaledSize: { width: 15, height: 15 },
              // origin: { x: 0.5, y: 0.5 },
              defaultZIndex: 3655 + id,
          }}
      >
          {showInfo && ( <InfoWindow onDomReady={onDomReady} ref={infoRef}>
              <div className="mapInfos">
                  {infos.map((el, i) => (
                    <div className="IW_it" key={uuidv4()}>
                      <span className="left"> {el.title} </span>{" "}
                      <span className="right"> {el.value} </span>{" "}
                    </div>
                  ))}{" "}
              </div>
              </InfoWindow>
          )}
        {/* <InfoBox
          onLoad={onLoad}
          options={options}
          position={position}
          boxStyle = {{
            width: "298px"
          }}
        >
          <div className="InfoBox">
            <p className="IB_it"> {driver} </p>{" "}
            <p className="IB_it"> Truck: {truckNo} </p>{" "}
          </div>
        </InfoBox> */}
       
      </Marker> 
    </span>
   
  );
};
