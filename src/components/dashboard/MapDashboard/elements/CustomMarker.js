import React, { useState, useRef } from "react";
// import { Marker, InfoWindow } from "react-google-maps";
// import InfoBox from "react-google-maps/lib/components/addons/InfoBox";
import { InfoWindow, Marker,
  // InfoBox
 } from "@react-google-maps/api";
import "./style.css";
// import moveArr from '../icons/move-arrow.svg';
// import moveArrUp from '../icons/move-arrowup.svg';
// import moveArrDown from '../icons/move-arrowdown.svg';
// import moveArrLeft from '../icons/move-arrowleft.svg';
// import moveArrRight from '../icons/move-arrowright.svg';
// import location from '../icons/up-arrow2.svg';
import location from "../icons/green-circle.svg";
import stopPoint from "../icons/stop-point.svg";
import { v4 as uuidv4 } from "uuid";
// import { MdNearMe } from "@react-md/material-icons";


export const CustomMarker = ({ id, driver, iconDeg, label, clusterer, position, speed, odometer, truckNo, vehicleStatus, coordinates, coordinatesPrevious }) => {
  // const [copyMsg, setCopyMsg] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const iconRef = useRef(null);
  const infoRef = useRef(null);

  const infos = [
    { title: "Vehicle: ", value: truckNo},
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
  let heading = '';
  if(coordinates && coordinatesPrevious && vehicleStatus === 'IN_MOTION'){
    var location1 = new window.google.maps.LatLng(coordinatesPrevious.lat, coordinatesPrevious.lng);
    var location2 = new window.google.maps.LatLng(coordinates.lat, coordinates.lng);
  
    const heading_cal = window.google.maps && window.google.maps.geometry.spherical.computeHeading(
      location1,
      location2
    );
    heading = heading_cal;
  }

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
            icon = { (iconDeg > 0 && (st === "D" || st === "PC" || st === "YM" || vehicleStatus === "IN_MOTION")) ? 
            {
              // path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              path: "M12 18.5l7.265 2.463a0.535 .535 0 0 0 .57 -.116a0.548 .548 0 0 0 .134 -.572l-7.969 -17.275l-7.97 17.275a0.547 .547 0 0 0 .135 .572a0.535 .535 0 0 0 .57 .116l7.265 -2.463",
              strokeWeight: 1,
              anchor: speed > 0 ? {x: 8, y: 8}: { x: 8, y: 8 },              
              scale: 1,
              strokeColor: "transparent",
              fillColor: "#16b765",
              fillOpacity: 1,
              rotation: heading
             }: 
             iconDeg > 0 && vehicleStatus === "INACTIVE" ? {
              anchor: speed > 0 ? {x: 8, y: 8}: { x: 8, y: 8 },
              url: stopPoint,
              scaledSize: { width: 20, height: 20 },
              // origin: { x: 0.5, y: 0.5 },
              defaultZIndex: 3655 + id
             } : 
             {
              anchor: speed > 0 ? {x: 8, y: 8}: { x: 8, y: 8 },
              url: location,
              scaledSize: { width: 20, height: 20 },
              // origin: { x: 0.5, y: 0.5 },
              defaultZIndex: 3655 + id
            }               
            }
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
      </Marker>
    </span>
   
  );
};
