import React, { useEffect, useState } from "react";
import Header from "../layout/Header"
import Sidebar from "../layout/Sidebar"
import { useDispatch, useSelector} from "react-redux";
import { useParams } from 'react-router-dom';
import { getVehicleLocation } from "../../../src/actions/vehicleAction";
import AssetSidebar from "./component/AssetSidebar";
import deepEqual from "fast-deep-equal";
import moment from "moment-timezone";
import { MapAsset } from './MapAsset';
import geoLocation from './csvjson.json';
import * as geolib from 'geolib';
import _ from 'lodash';
import { distance } from './utils.js';
// import { MapTracking } from './MapTracking'
// import { MapLeaflet } from './MapTracking/MapLeaflet'
import { getLocations } from './MapTracking/utils'
import data from './data.json'

let render = 0;

const AssetDetail = () => {
    const dispatch = useDispatch()
    const params = useParams();
    const [mapUnits, setMapUnits] = useState([]);
    const [units, setUnits] = useState([]);
    // const [error, setErrors] = useState('');
    const [defaulDate, setDefaulDate] = useState();
    const [firstFetch, setFirstFetch] = useState(true);
    const [maptypeId, setMaptypeId] = useState("roadmap");
    const { isMinimize, isMode } = useSelector(state => state.dashboard) 
    const { user } = useSelector((state) => state.auth);
    const { locationHistory } = useSelector(state => state.vehicles)
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const tz = userInfo && userInfo.companyInfo && userInfo.companyInfo.timeZoneId ? userInfo.companyInfo.timeZoneId : "America/Los_Angeles";
    var userType = user && user.user && user.user.userType; 

   useEffect(() => {
        setDefaulDate(moment().format('YYYY-MM-DD') + '/' + moment().format('YYYY-MM-DD'));
        if(params.vehicleId){
            dispatch(getVehicleLocation(params?.vehicleId, moment().format('YYYY-MM-DD') + '/' + moment().format('YYYY-MM-DD')));
        }    
    }, [dispatch, params, defaulDate]);

    let result = data;

    let res = locationHistory;
   
    useEffect(() => {
        if (result) {
            let newUnits = getLocations(result.data.locationHistory)
            if (firstFetch) {
                localStorage.setItem("firstUnits", JSON.stringify(newUnits));
                setFirstFetch(!firstFetch);
            }
            if (render === 0) {
                localStorage.setItem("mapRender", 0);
                render += 1;
            }
            if (!deepEqual(newUnits, units)) {
                setUnits(newUnits);
            }
        }
        setMaptypeId('roadmap')  
    }, [result, firstFetch, units, maptypeId])

    const getUnitsOnMap = () => {
        let data = [];
        units.forEach((el) => {
            if (el.showOnMap && el.marker) {
                data.push({
                    ...el.marker,
                    id: el.id,
                    truckNo: el.truckNo,
                    label: {
                        status: el.status,
                        address: el.lastPosition.place,
                        date: moment.tz(el.lastPosition.time, tz).calendar(),
                    },
                });
            }
        });
        if (!deepEqual(mapUnits, data)) {
            setMapUnits(data);
            return data;
        }
        return false;
    };

    useEffect(() => {
        if(res){
            let data = res.data.locationHistory;
            if(data){
                for(let i = 0; i < data.length; i++){
                    let locationsData = data[i].locations;
                    if(locationsData){
                        for(let j= 0; j < locationsData.length; j++){
                            let inputLat = locationsData[j].coordinates.lat ? locationsData[j].coordinates.lat : '';
                            let inputLng = locationsData[j].coordinates.lng ? locationsData[j].coordinates.lng : '';
                            if (inputLat && inputLng) {
                                let geoLocationList = JSON.parse(JSON.stringify(geoLocation.geoLocationList));
                                geoLocationList = _.map(geoLocationList, (location) => {
                                    location.distance = distance(inputLat, inputLng, location.Lat, location.Lon, 'M');
                                    // console.log(location.distance, 'locationhere');
                                    return location;
                                })
                                let distanceList = _.map(geoLocationList, (list) => list.distance);
                                let closetDistance = _.min(distanceList);
                                let closetLocation = _.find(geoLocationList, { distance: closetDistance });
                                if (distanceList && closetDistance && closetLocation) {
                                    let result = geolib.getCompassDirection(
                                        { latitude: closetLocation.Lat, longitude: closetLocation.Lon },
                                        { latitude: inputLat, longitude: inputLng }
                                    );
                                    if (result && closetLocation) {
                                        locationsData[j].location = `${closetLocation.distance}mi ${result} from ${closetLocation.City}, ${closetLocation.State}`;
                                        // setValue('calcLoc', `${closetLocation.distance}mi ${result} from ${closetLocation.City}, ${closetLocation.State}`);
                                        // setErrors('')
                                    } else {
                                        // setValue('calcLoc', '');
                                        // setErrors('Please Enter correct coordinate');
                                    }
                                } else {
                                    // setValue('calcLoc', '');
                                    // setErrors('Please Enter correct coordinate');
                                }
                            }                       
                        }
                    }
                }
            }            
        }
       
    },[res]);

    // console

    const pageHead = `Vehicle Location History/${params?.vehicleNo ? params.vehicleNo : 0}`
    return (
        <>
            <div id="layout-wrapper" className={isMode}>
                <Header pageHead={pageHead} />
                <Sidebar />
                <div className={`main-content ${isMinimize === 'minimize' ? 'minimize-main' : ''}`}>

                    <div className={userType === "company-administrator" ? "page-content asset-page company-admin" : "page-content asset-page"}>
                        <div className="container-fluid">
                            <div className="row">
                                <AssetSidebar />
                                <div className="col-9">
                                    <div className="map_box">
                                        {/* {mapUnits.length > 0 ? */}
                                            <MapAsset
                                                markers={getUnitsOnMap () || mapUnits}
                                                setMaptypeId={setMaptypeId}
                                            />
                                        {/* : <MapAsset markers={[]} setMaptypeId={maptypeId}} */}
                                        {/* <MapTracking
                                                markers={getUnitsOnMap () || mapUnits}
                                                // stops={stops.data}
                                                // // dailyMarkers={daily.data.logs}
                                                coordinates={mapUnits.map((el => el.position))} 
                                        /> */}
                                        {/* <MapLeaflet 
                                        coors={mapUnits.map((el => el.position))}
                                        stops={mapUnits.map((el => el.position))}
                                        coordinates={getUnitsOnMap() || mapUnits} /> */}
                                        {/* <iframe title="drivermap" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26371286.49766774!2d-113.7164386566357!3d36.21152009978547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54eab584e432360b%3A0x1c3bb99243deb742!2sUnited%20States!5e0!3m2!1sen!2sin!4v1653560499738!5m2!1sen!2sin" width="100%" height="" style={{"border":0}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AssetDetail