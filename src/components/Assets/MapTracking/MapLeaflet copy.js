import React, { useEffect } from "react";
// import "./MapLeaflet.scss";

// import location from "../MapDashboard/icons/location.png";

let L;
let layer;
let mymap;
let cancel;

export const MapLeaflet = ({ stops, coordinates }) => {
  useEffect(() => {
    cancel = false;
    L = {
      ...window.L,
    };
    layer = window.layer;

    let asyncFunc = async () => {
      mymap =
        L &&
        L.map("MapLeafletId", {
          scrollWheelZoom: true,
          renderer: L.canvas(),
          markerZoomAnimation: false,
          gestureHandling: true,
          doubleClickZoom: false,
        });
      mymap.setView([40.748817, -73.985428], 12);
      layer && layer.addTo(mymap);
    };

    asyncFunc();

    return () => {
      if (mymap) {
        mymap.remove();
        mymap = false;
      }
      if (layer) {
        layer = false;
      }
      if (L) {
        L = false;
      }
      cancel = true;
    };
  }, []);

  useEffect(() => {
    cancel = false;
    let mapMarkers = [];
    let polyline;

    // const asyncFunc = async () => {
    //   if (mymap && L && !cancel) {
    //     const addMarker = (coor, isFirst = false) => {
    //       const { id, iconDeg, label, position } = coor;
    //       let options = {
    //         riseOnHover: true,
    //         icon: L.icon({
    //           className: `myIcon2${id}`,
    //           iconUrl: !isFirst
    //             ? `https://us.tteld.com/result/pin${iconDeg}.png`
    //             : `https://us.tteld.com/result/pin${iconDeg}.png`,
    //           iconSize: [35, 35],
    //           popupAnchor: [0, -22],
    //         }),
    //       };
    //       let marker = L.marker([position.lat, position.lng], options);
    //       marker.addTo(mymap);
    //       // POPUP HANDLE
    //       const infos = [
    //         {
    //           title: "Status: ",
    //           value: label.status,
    //         },
    //         {
    //           title: "Address: ",
    //           value: label.address,
    //         },
    //         {
    //           title: "Coordinates: ",
    //           value: label.coordinates,
    //         },
    //         {
    //           title: "Odometr: ",
    //           value: label.odometr,
    //         },
    //         {
    //           title: "Date: ",
    //           value: label.date,
    //         },
    //       ];
    //       let infoDom = "";
    //       infos.forEach(
    //         (el, i) =>
    //           (infoDom += `
    //                  <div className="IW_it">
    //                     <span className="left">${el.title}</span>
    //                     <span className="right">${el.value}</span>
    //                  </div>
    //               `)
    //       );
    //       marker.bindPopup(infoDom, {
    //         className: "myPopup",
    //         closeButton: false,
    //       });

    //       return marker;
    //     };

    //     mapMarkers.push(addMarker(coordinates[0], true));
    //     mapMarkers.push(addMarker(coordinates[coordinates.length - 1]));

    //     let coors = [];
    //     coordinates.forEach((el) => {
    //       if (el.position && el.position.lat && el.position.lng) {
    //         coors.push([el.position.lat, el.position.lng]);
    //       }
    //     });
    //     polyline = L.polyline(coors, {
    //       weight: 2.2,
    //       opacity: 2.2,
    //       color: "#FF0000",
    //     }).addTo(mymap);

    //     mymap.fitBounds(polyline.getBounds());
    //   }
    // };

    // asyncFunc();

    return () => {
      mapMarkers && mapMarkers.forEach((m) => m.remove());
      mapMarkers = [];
      // polyline.remove && polyline.remove();
      polyline = [];
      cancel = true;
    };
  }, [stops, coordinates]);

  return <div id="MapLeafletId"> </div>;
};
