import React, { useEffect, useRef } from "react";
// import GMap from "./GoogleMaps";
// import { GoogleMap } from "react-google-maps";
import { GoogleMap, LoadScript } from '@react-google-maps/api';

import { CustomMarker } from "./elements/CustomMarker";
import { randomGeo } from "./utils";
import { v4 as uuidv4 } from "uuid";

const defaultCenter = {
  lat: 40.748817,
  lng: -73.985428,
};
const defaultZoom = 12;

export const MapDashboard = ({ markers, setMaptypeId }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    let mapRender = +localStorage.getItem("mapRender") || 0;
    if (mapRender === 0) {
      let map = mapRef.current;
      const bounds = new window.google.maps.LatLngBounds();
      if (markers.length > 1) {
        markers.forEach((place) => {
          bounds.extend(place.position);
        });
        map.fitBounds(bounds);
      } else {
        const defaultCenter = {
          lat: 40.748817,
          lng: -73.985428,
        };
        const center = markers[0] ? markers[0].position : defaultCenter;
        for (let i = 0; i < 100; i++) {
          bounds.extend(randomGeo(center, 500));
        }
        map.fitBounds(bounds);
      }
      localStorage.setItem("mapRender", mapRender + 1);
    }
  }, [markers]);

  const onMapTypeIdChanged = () => {
    // console.log(mapRef.current.getMapTypeId());
    let id = mapRef.current.getMapTypeId();
    if (id === "roadmap") {
      localStorage.setItem("mapRender", 0);
      setMaptypeId("roadmap");
    }
  };

  return (

    <LoadScript
        googleMapsApiKey="AIzaSyDqvuVyMWJuv-bhxfhtLhsCeuqY-VcUurQ"
      >
    <GoogleMap
      ref={mapRef}
      defaultZoom={defaultZoom}
      defaultCenter={defaultCenter}
      options={{
        mapTypeId: "hybrid",
        
      }}
      onMapTypeIdChanged={onMapTypeIdChanged}
    >
       {markers.length > 0 &&
         markers.map((mar, i) => (
           <CustomMarker
             key={uuidv4()}
             id={mar.Id}
             driver={mar.driver}
             iconDeg={mar.iconDeg}
             label={mar.label}
             position={mar.position}
             speed={mar.speed}
             odometr={mar.odometr}
             truckNo={mar.truckNo}
           />
         ))}{" "}
    </GoogleMap>
    </LoadScript>
  );
};
