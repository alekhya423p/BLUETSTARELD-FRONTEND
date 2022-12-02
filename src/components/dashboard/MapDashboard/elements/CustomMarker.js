import React, { useState, useRef } from "react";
// import { Marker, InfoWindow } from "react-google-maps";
// import InfoBox from "react-google-maps/lib/components/addons/InfoBox";
import { InfoWindow, Marker,
  // InfoBox
 } from "@react-google-maps/api";
import "./style.css";
// import moveArr from '../icons/move-arrow.svg';
import moveArrUp from '../icons/move-arrowup.svg';
import moveArrDown from '../icons/move-arrowdown.svg';
import moveArrLeft from '../icons/move-arrowleft.svg';
import moveArrRight from '../icons/move-arrowright.svg';
// import location from '../icons/up-arrow2.svg';
import location from "../icons/green-circle.svg";
// import stopPoint from "../icons/stop-point.svg";
import { v4 as uuidv4 } from "uuid";

export const CustomMarker = ({ id, driver, iconDeg, label, clusterer, position, speed, odometr, truckNo, vehicleStatus, heading }) => {
  // const [copyMsg, setCopyMsg] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const iconRef = useRef(null);
  const infoRef = useRef(null);

  const infos = [
    { title: "Truck Number : ", value: truckNo},
    { title: "Driver: ", value: driver},
    { title: "Status: ", value: label.status,},
    { title: "Address: ", value: label.address,},
    { title: "Odometr: ", value: odometr,},
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
         console.log("Copying is " + msg);
        // setCopyMsg("Location copied to clipboard");
      }
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
    }

    document.body.removeChild(textArea);
  };

  let st = label.status;
  var img;

  if (heading === "0" || heading === "360")
  {
    img = moveArrUp;
  }else if(heading === "90"){
    img = moveArrRight;
  }else if(heading === "270"){
    img = moveArrLeft;
  }else if(heading === "180"){
    img = moveArrDown;
  }else
  {
    img = moveArrRight;
  }


  // console.log(iconDeg, 'iconDeg', vehicleStatus);


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
                anchor: speed > 0 ? {x: 20, y: 20}: { x: 20, y: 40 },
                url: iconDeg > 0 && (st === "D" || st === "PC" || st === "YM" || vehicleStatus === "IN_MOTION" || vehicleStatus === "INACTIVE") ? img : location,
                scaledSize: { width: 20, height: 20 },
                origin: { x: 0.5, y: 0.5 },
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
