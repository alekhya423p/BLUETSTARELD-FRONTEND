import React, { useRef, useState } from "react";
import { GoogleMap, LoadScript,MarkerClusterer,
  // TrafficLayer
} from "@react-google-maps/api";
import { v4 as uuidv4 } from "uuid";
import { CustomMarker } from "./elements/CustomMarker";
import { randomGeo } from "./utils";
import { useEffect } from "react";
export const MapDashboard = ({ markers, setMaptypeId }) => {
  const [activeMarker, setActiveMarker] = useState('');
  const [maps, setMpas] = useState('');
  const mapRef = useRef(null);
  const handleOnLoad = (map) => {

  if(!maps) setMpas(map);

    const bounds = new window.google.maps.LatLngBounds();
    const latitudePos = markers[0]?.position?.lat;
    const longitudePos = markers[0]?.position?.lng;

    if (markers.length > 1) {
    //   markers.forEach((place) => {
    //     bounds.extend(place.position);
    //   })
    //   map.fitBounds(bounds);
    // } else {
      const defaultCenter = {
        lat: latitudePos,
        lng: longitudePos
      };
      const center = markers[0] ? markers[0].position : defaultCenter;
      setActiveMarker({lat: markers[0]?.position?.lat, lng: markers[0]?.position?.lng })

      for (let i = 0; i < 100; i++) {
        bounds.extend(randomGeo(center));
      }
      map.fitBounds(bounds);
    }
  };

  
  const mapContainerStyle = {
    height: "600px",
    width: "850px"
  }
  // const center = {
  //   lat: 0,
  //   lng: -180
  // }
  
  useEffect(() => {
    if(markers){
      if(markers.length === 0){
        setActiveMarker({lat: 40.748817, lng: -73.985428,})
      }else if(maps) {
        handleOnLoad(maps)
      }
    }    
  },[markers,maps]) 
  const options = {
    imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m', // so you must have m1.png, m2.png, m3.png, m4.png, m5.png and m6.png in that folder
  }
  
  return (
    <LoadScript
      googleMapsApiKey="AIzaSyDqvuVyMWJuv-bhxfhtLhsCeuqY-VcUurQ" libraries={["geometry"]}
    >
      <GoogleMap
        ref={mapRef}
        id="marker-example"
        mapContainerStyle={mapContainerStyle}
        zoom={4}
        onLoad={handleOnLoad}
        center={activeMarker}
        mapTypeId={setMaptypeId}
      >

       
      
      {/* <TrafficLayer autoUpdate /> */}

          {/* {markers.length > 0 && markers.map((mar, i) => (
            <CustomMarker
              key={uuidv4()}
              id={mar.Id}
              driver={mar.driver}
              iconDeg={mar.iconDeg}
              label={mar.label}
              position={mar.position}
              speed={mar.speed}
              odometer={mar.odometer}
              truckNo={mar.truckNo}
            />
          ))}{" "} */}
          <MarkerClusterer options={options}>
          {(clusterer) =>
            markers.length > 0 && markers.map((mar, i) => (
            mar.id ?
            <CustomMarker
              key={uuidv4()}
              id={mar.id}
              driver={mar.driver}
              iconDeg={mar.iconDeg}
              label={mar.label}
              position={mar.position}
              speed={mar.speed}
              odometer={mar.odometer}
              truckNo={mar.truckNo}
              vehicleStatus={mar?.vehicleStatus}
              heading={mar?.heading}
              coordinates= {mar?.coordinates}
              coordinatesPrevious= {mar?.coordinatesPrevious}
              clusterer={clusterer}
            /> : null
            )) 
          } 
        </MarkerClusterer>
      </GoogleMap>
    </LoadScript>
  );
}
