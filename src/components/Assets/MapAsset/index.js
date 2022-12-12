import React, { useRef, useState } from "react";
import { GoogleMap, LoadScript,MarkerClusterer, Polyline  } from "@react-google-maps/api";
import { v4 as uuidv4 } from "uuid";
import { CustomMarker } from "./elements/CustomMarker";
import { randomGeo } from "./utils";
import { useEffect } from "react";
export const MapAsset = ({ markers, setMaptypeId }) => {
  const [activeMarker, setActiveMarker] = useState('');
  const [maps, setMpas] = useState('');
  const mapRef = useRef(null);
  const handleOnLoad = (map) => {
      if(!maps) setMpas(map);
    // let mapRender = +localStorage.getItem("mapRender") || 0;
    // if (mapRender === 0) {
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
        setActiveMarker(center)
        for (let i = 0; i < 100; i++) {
          bounds.extend(randomGeo(center, 500));
        }
        map.fitBounds(bounds);
      }
      // localStorage.setItem("mapRender", mapRender + 1);
    // }
    // const bounds = new window.google.maps.LatLngBounds();
    // markers.forEach(({ position }) => bounds.extend(position));
    // map.fitBounds(bounds);
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
    if(markers.length === 0){
      setActiveMarker({lat: 40.748817, lng: -73.985428,})
    }else if(maps) {
      handleOnLoad(maps)
    }
    // eslint-disable-next-line
  },[markers,maps]) 
  const options = {
    imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m', // so you must have m1.png, m2.png, m3.png, m4.png, m5.png and m6.png in that folder
  }

  var coords = [];
  if(markers){
    markers.map((mar, index) => (
      coords.push(mar.position)
    ));
  }

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyDqvuVyMWJuv-bhxfhtLhsCeuqY-VcUurQ"
    >
      <GoogleMap
        ref={mapRef}
        id="marker-example"
        mapContainerStyle={mapContainerStyle}
        zoom={4}
        onLoad={handleOnLoad}
        center={activeMarker}
      >
        {/*for creating path with the updated coordinates*/}
        <Polyline
          path={coords}
          geodesic={true}
          options={{
              strokeColor: "#669DF6",
              strokeOpacity: 1.0,
              strokeWeight: 5,
          }}
        />
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
            <CustomMarker
              key={uuidv4()}
              id={mar.Id}
              iconDeg={mar.iconDeg}
              label={mar.label}
              position={mar.position}
              speed={mar.speed}
              odometer={mar.odometer}
              truckNo={mar.truckNo}
              clusterer={clusterer}
            />
            ))
          }
        </MarkerClusterer>
      </GoogleMap>
    </LoadScript>
  );
}
