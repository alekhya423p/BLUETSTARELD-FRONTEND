import Map from './Map';
import React, { useState } from 'react';

const Layer =(props)=> {

  const [mapOne,setMapOne]=useState({ 
    map: {},
    traffic : {},
    transit : {},
    bicycling : {}
  })
    
  

 const handleMapLoad = (map) => {
    setMapOne({
      map: map,
      traffic : new window.google.maps.TrafficLayer(),
      transit : new window.google.maps.TransitLayer(),
      bicycling : new window.google.maps.BicyclingLayer(),
    })
  }

  const handleLayer = (layer) => {
    switch (layer) {
      case "traffic" : 
        mapOne.transit.setMap(null);
        mapOne.bicycling.setMap(null);
        mapOne.traffic.setMap(mapOne.map); 
        break;
      case "transit" :         
      mapOne.bicycling.setMap(null);
      mapOne.traffic.setMap(null); 
      mapOne.transit.setMap(mapOne.map);
        break;  
      case "bicycling" : 
      mapOne.transit.setMap(null);
      mapOne.traffic.setMap(null); 
      mapOne.bicycling.setMap(mapOne.map);
        break; 
      case "none" : 
      mapOne.transit.setMap(null);
      mapOne.traffic.setMap(null); 
      mapOne.bicycling.setMap(null);  
        break;  
        default:
            return "traffic"   ;
    }          
  }


    return (
      <>
        <button onClick = {() => handleLayer("transit")}> Transit</button>
        <button onClick = {() => handleLayer("traffic")}> Traffic</button>
        <button onClick = {() => handleLayer("bicycling")}> Bicycling</button>
        <button onClick = {() => handleLayer("none")}> None</button>
        <Map
          id="myMap"
          options={{
            center: { lat: 51.501904, lng: -0.115871 },
            zoom: 13
          }}
          onMapLoad = {handleMapLoad}
        />      
       </>
    );    
  
}

export default Layer;
