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
    const [defaulDate, setDefaulDate] = useState();
    const [firstFetch, setFirstFetch] = useState(true);
    const [maptypeId, setMaptypeId] = useState("roadmap");
    const { isMinimize, isMode } = useSelector(state => state.dashboard) 
    // const { locationHistory } = useSelector(state => state.vehicles)
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const tz = user && user.companyInfo && user.companyInfo.timeZoneId ? user.companyInfo.timeZoneId : "America/Los_Angeles";

   useEffect(() => {
        setDefaulDate(moment().format('YYYY-MM-DD') + '/' + moment().format('YYYY-MM-DD'))
        if(params.vehicleId){
            dispatch(getVehicleLocation(params?.vehicleId, defaulDate));
        }    
    }, [dispatch, params, defaulDate]);

    // console.log(locationHistory, 'locationHistory');
    let result = data;
   
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

    const pageHead = `Vehicle Location History/${params?.vehicleNo ? params.vehicleNo : 0}`
    return (
        <>
            <div id="layout-wrapper" className={isMode}>
                <Header pageHead={pageHead} />
                <Sidebar />
                <div className={`main-content ${isMinimize === 'minimize' ? 'minimize-main' : ''}`}>

                    <div className="page-content asset-page">
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