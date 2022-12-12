import React, { useRef, useState } from "react";
// import { GoogleMap, Polyline } from "react-google-maps";
import {GoogleMap, LoadScript } from '@react-google-maps/api';
import { CustomMarker, StopMarker } from "../../dashboard/MapDashboard/MapElements";
import { v4 as uuid } from "uuid";
// import { getPolylines } from "./utils";

export const MapTracking = ({ markers, coordinates, dailyMarkers, stops }) => {
    const mapRef = useRef(null);
    const [smallOption, setSmallOption] = useState({})

// console.log(smallOption);
    // const largeOption = {
    //   zIndex: 1,
    //   strokeOpacity: 0.4,
    //   strokeWeight: 0.4,
    //   icons: [
    //     {
    //       icon: {
    //         path: "M 0,-1 0,1",
    //         strokeOpacity: 1.2,
    //         strokeColor: "#FF0000",
    //         scale: 1.6,
    //       },
    //       repeat: "8px",
    //     },
    //   ],
    // };
    // const { small, large } = getPolylines(coordinates);

    // console.log(largeOption);


    const handleOnLoad = (map) => {
        const bounds = new window.google.maps.LatLngBounds();
        // console.log(markers);
        markers.forEach((item) => {
          bounds.extend(item.position);
        });
        map.fitBounds(bounds);
        let dailyPins = document.querySelector('img[src*="dailyPin"]');
        let mapPins = document.querySelectorAll('[src*="map-pin"]');
        if (dailyPins && mapPins) {
          [...Array.from(dailyPins), ...Array.from(mapPins)].forEach((el) => {
            // console.log(el);
            el.style.width = "25px";
          });
        }

        let smallOption = {
          zIndex: 2,
          strokeColor: "#008b8b",
          strokeOpacity: 2.2,
          strokeWeight: 2.2,
          icons: [
            {
              icon: {
                path: window.google.maps.SymbolPath.FORWARD_OPEN_ARROW,
                strokeOpacity: 1.6,
                strokeColor: "#008b8b",
                scale: 1.6,
              },
              repeat: "400px",
            },
          ],
        };
        setSmallOption(smallOption)
    };

    const mapContainerStyle = {
      height: "600px",
      width: "900px"
    };
    
    const center = {
      lat: 40.20050198,
      lng: -75.08738681
    };
    
    // const onLoad = polyline => {
    //   console.log('polyline: ', polyline)
    // };
    
    // const path = [
    //   // {lat: 37.772, lng: -122.214},
    //   // {lat: 21.291, lng: -157.821},
    //   // {lat: -18.142, lng: 178.431},
    //   // {lat: -27.467, lng: 153.027}
    //   { lat: -34.397, lng: 150.644 },
    //   { lat: -35.397, lng: 151.644 }
    // ];
    // var path = [{ lat:60.1697, lng:24.8292},
    //   { lat: 60.1704, lng: 24.8285 },
    //   { lat: 60.1709, lng: 24.8277 },
    //   { lat: 60.1700, lng: 24.8265 },
    //   { lat:60.1700, lng: 24.8283}];
    
    // const options = {
    //   strokeColor: '#FF0000',
    //   strokeOpacity: 0.8,
    //   strokeWeight: 2,
    //   fillColor: '#FF0000',
    //   fillOpacity: 0.35,
    //   clickable: false,
    //   draggable: false,
    //   editable: false,
    //   visible: true,
    //   radius: 30000,
    //   paths: [
    //     { lat:60.1697, lng:24.8292},
    //     { lat: 60.1704, lng: 24.8285 },
    //     { lat: 60.1709, lng: 24.8277 },
    //     { lat: 60.1700, lng: 24.8265 },
    //     { lat:60.1700, lng: 24.8283}
    //   ],
    //   zIndex: 1
    // };
    
    return (
      <LoadScript
        googleMapsApiKey="AIzaSyDqvuVyMWJuv-bhxfhtLhsCeuqY-VcUurQ"
      >
      <GoogleMap
        ref={mapRef}
        onLoad={handleOnLoad}
        id="marker-example"
        mapContainerStyle={mapContainerStyle}
        zoom={2}
        center={center}
      >
        {" "}
        {markers.map((item) => {
          return (
            item && (
              <CustomMarker
                key={uuid()}
                icon={item.icon}
                draggable={item.draggable}
                iconDeg={item.iconDeg}
                position={item.position}
                label={item.label}

              />
            )
          );
        })}{" "}
      {dailyMarkers &&
          dailyMarkers.map((item) => {
            return (
              item.icon && (
                <CustomMarker
                  key={uuid()}
                  icon={item.icon}
                  draggable={item.draggable}
                  iconDeg={item.iconDeg}
                  position={item.position}
                  label={item.label}
                />
              )
            );
          })}
        {stops && stops.map((item) => <StopMarker key={uuid()} marker={item} />)}
        {/* {small.length > 0 &&
          small.map((el) => (
            <Polyline
              key={uuid()}
              options={smallOption}
              geodesic={true}
              path={el}
            />
          ))}{" "} */}

        {/* {large.length > 0 &&
          large.map((el) => (
            <Polyline
              key={uuid()}
              options={options}
              geodesic={true}
              path={path}
            />
          }))} */}
          
          {/* <Polyline
            onLoad={onLoad}
            path={path}
            options={options}
          /> */}
      </GoogleMap>
    </LoadScript>
    );
  };
