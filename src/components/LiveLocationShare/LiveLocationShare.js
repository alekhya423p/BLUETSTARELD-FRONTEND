import React, { useEffect } from "react";
import WrappedMap from "./gMap/Map";
import useFetch from "./hooks/useFetch";
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import config from "./gMap/config";
import { useDispatch, useSelector } from "react-redux";
// import { useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import { getShareLocation } from "../../actions/locationsharingAction";
import { getActiveLocation } from "../Logs/components/EventFormTechModal/utils";
import moment from "moment-timezone";

const LiveLocationShare = () => {
  const { locationData } = useSelector(state => state.locationsharing)
  const { data: paths } = useFetch('https://61a4a0604c822c0017041d33.mockapi.io/shuttle/v1/path');
  const { data: stops } = useFetch('https://61a4a0604c822c0017041d33.mockapi.io/shuttle/v1/stops');
  const mapURL = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${config.mapsKey}`;
  const dispatch = useDispatch();
  const { tokenId } = useParams();

  console.log(locationData)
  useEffect(() => {
    if (tokenId) {
      dispatch(getShareLocation(tokenId))
    }
  }, [dispatch,tokenId])
  const refresh = async () => {
    dispatch(getShareLocation(tokenId))
};
  const currentLocation = getActiveLocation(locationData[0]?.coordinates?.lng, locationData[0]?.coordinates?.lat);

  return (
    <>
      <div className="vertical-menu live-sharing-map">
        <div data-simplebar="init" className="h-100">
          <div to="" className="logo logo-dark">
            <span className="logo-sm">
              <a href="/"><img src="/assets/images/live-logo.png" alt="logo-sm" height="35" /></a>
            </span>
            <span className="logo-lg">
              <a href="/"><img src="/assets/images/live-logo.png" alt="logo-dark" height="35" /></a>
            </span>
          </div>
          <div className="refresh-tag-btnn">
            <a href="/"><i className="ri-send-plane-fill"></i>{locationData[0]?.company?.companyName}</a>
            <button type="button" className="btn btn border border-color d-block  mx-2" onClick={()=>refresh()}><i className="ti ti-refresh"></i></button>
          </div>
          <div className="driver-vech-detail">
            <p className="heading-details">Vehicle Number<strong>{locationData[0]?.vehicle?.vehicleNumber}</strong></p>
            <p className="heading-details">Driver Name<strong>{(locationData[0]?.driver?.firstName ===undefined ?'': locationData[0]?.driver?.firstName )+ " " + (locationData[0]?.driver?.lastName ===undefined ?'': locationData[0]?.driver?.lastName)}</strong></p>
            <p className="heading-details">Phone Number<strong>{locationData[0]?.driver?.phoneNumber}</strong></p>
            <p className="heading-details">Trailer Number<strong>{locationData[0]?.vehicle?.vehicleModel}</strong></p>
            <p className="heading-details">Shipping Document<strong>BOL-23SDGBHJ23</strong></p>
            <p className="heading-details">Current Location<strong>{currentLocation}</strong></p>
            <p className="heading-details">Time<strong>{moment(locationData[0]?.expiry_time).utc().subtract(10, 'hours').format('lll')} EDT</strong></p>
          </div>
        </div>
      </div>
      <div className="live-map-frame App">
        {/* <div className="App"> */}
        {paths && stops ?
          <WrappedMap
            paths={paths}
            stops={stops}
            googleMapURL={mapURL}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div className='mapContainer' />}
            mapElement={<div style={{ height: `100%` }} />}
          />
          :
          <Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>
        }
        {/* <iframe title="drivermap" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26371286.49766774!2d-113.7164386566357!3d36.21152009978547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54eab584e432360b%3A0x1c3bb99243deb742!2sUnited%20States!5e0!3m2!1sen!2sin!4v1653560499738!5m2!1sen!2sin" width="100%" height="100%" style={{ "border": 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe> */}
      </div>
    </>
  );
}

export default LiveLocationShare;