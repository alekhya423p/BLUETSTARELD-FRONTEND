import Header from "../layout/Header"
import Sidebar from "../layout/Sidebar"
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAssetDetail } from "../../actions/assetsAction";
import * as actionTypes from '../../constants/actionTypes';
import { useParams } from 'react-router-dom';
import { getDashboard } from "../../actions/dashboardAction";
import DriverTab from "./components/Drivers";
import LocationShareModal from "./components/LocationShareModal";
import { MapDashboard } from './MapDashboard'
// import data from './data.json'
// import driverData from './driverData.json'
import deepEqual from "fast-deep-equal";
import moment from "moment-timezone";
import VehicleTab from "./components/Vehicles";
import { getVehicles, getDrivers } from './utils'
import Fullscreen from "../layout/Fullscreen";
// import { inArray } from "jquery";
let render = 0;

const Dashboard = () => {
    const dispatch = useDispatch()
    const params = useParams();
    const [inputMenu, setMenu] = useState('vehicle');
    const [truckStatus, setTruckStatus] = useState();
    const [show , setShow] = useState(false);
    const[showHeader , setShowHeader] = useState(true)
    const [order, setOrder] = useState(-1);
    const { isMinimize, isMode, vehicles, drivers } = useSelector(state => state.dashboard)
    const { user } = useSelector((state) => state.auth);
    const [units, setUnits] = useState([]);
    const [driverUnits, setDriverUnits] = useState([]);
    const [mapUnits, setMapUnits] = useState([]);
    const [mapDriverUnits, setDriverMapUnits] = useState([]);
    const [maptypeId, setMaptypeId] = useState("roadmap");
    const [firstFetch, setFirstFetch] = useState(true);
    const [driverFirstFetch, setDriverFirstFetch] = useState(true);
    const [dutyStatus, setDutyStatus] = useState();
    const [showAddAdminModal, setLocationShareModal] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(false);
    const [search, setSearch] = useState("");
    const [open , setOpen] = useState(false);

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const tz = userInfo && userInfo.companyInfo && userInfo.companyInfo.timeZoneId ? userInfo.companyInfo.timeZoneId : "America/Los_Angeles";
    var userType =  user && user.user && user.user.userType;
    
    useEffect(() => {
        dispatch(getDashboard(truckStatus, dutyStatus, order, search))
        if (params.vehicleId) dispatch(getAssetDetail(params?.vehicleId))
        else dispatch({ type: actionTypes.CLEAR_ASSETS_DETAIL })
    }, [dispatch, params, truckStatus, search, order, dutyStatus])

    const makeActive = (menuItem, e) => {
        localStorage.setItem("activeMenu", menuItem);
        setMenu(menuItem);
    }
    const callSearch = (e) => {
        setSearch(e.target.value);
    }

    // const drsTimers = data;
    // const driver = driverData.data.drivers;
    const handleClick = () =>{
        if(open){ 
            if(localStorage.getItem('minimize') === "minimize" && localStorage.getItem('minimize1') === 'minimize'){
                localStorage.setItem('minimize', 'minimize');
            }
            let status = isMinimize === 'minimize' ? 'not_minimize' : 'minimize';
            localStorage.setItem('minimize1', status);
        }        
        setOpen(!open);
        // handleClose();
    }
 
    useEffect(() => {
        if (drivers) {
            let newDriverUnits = getDrivers(drivers, search)
            if (driverFirstFetch) {
                localStorage.setItem("firstDriverUnits", JSON.stringify(newDriverUnits));
                setDriverFirstFetch(!driverFirstFetch);
            }
            if (render === 0) {
                localStorage.setItem("mapRender", 0);
                render += 1;
            }
            if (!deepEqual(newDriverUnits, units)) {
                setDriverUnits(newDriverUnits);
            }
        }
        if (vehicles) {
            let newUnits = getVehicles(vehicles, search)
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
        setMaptypeId(maptypeId)
    }, [drivers, vehicles, search, firstFetch, units, driverFirstFetch, maptypeId]);

    useEffect(() => {
        if (driverUnits.length) {
            let data = [];
            driverUnits.forEach((el) => {
                if (el.showOnMap && el.marker) {
                    data.push({
                        ...el.marker,
                        driver: el.driver,
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

            if (!deepEqual(mapDriverUnits, data)) {
                setDriverMapUnits(data);
            }
        }
        if (units.length) {
        let data = [];
        units.forEach((el) => {
            if (el.showOnMap && el.marker) {
                data.push({
                    ...el.marker,
                    driver: el.driver,
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
        }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [driverUnits, units,tz])

    const getUnitsOnMap = (items, e) => {       
        let data = [];
        items.forEach((el) => {
            if(units.includes(el) && !(e.currentTarget.classList.contains('active'))){
                if (el.showOnMap && el.marker) {
                    data.push({
                        ...el.marker,
                        driver: el.driver,
                        id: el.id,
                        truckNo: el.truckNo,
                        label: {
                            status: el.status,
                            address: el.lastPosition.place,
                            date: moment.tz(el.lastPosition.time, tz).calendar(),
                        },
                    });
                }
                setMapUnits(data); 
            }else{
                units.forEach((el) => {
                    if (el.showOnMap && el.marker) {
                        data.push({
                            ...el.marker,
                            driver: el.driver,
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
                }
            }              
        });                  
    };

    const getDriverOnMap = (items) => {
        let data = [];
        items.forEach((el) => {
            if (el.showOnMap && el.marker) {
                data.push({
                    ...el.marker,
                    driver: el.driver,
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
        setDriverMapUnits(data);
        return data;
    };
    function handleModalClose() {
        setLocationShareModal(false);
        setSelectedRowData(false);
    }
    const handleNewReport = () => {
        setLocationShareModal(true);
    };
    const handleClick1 = () =>{
      setShowHeader(!showHeader);
      setShow(!show)
      localStorage.setItem("mappreview" , "large")
    }
    const handleClick2= () =>{
        setShowHeader(!showHeader);
        setShow(!show)
        localStorage.setItem("mappreview" , "small")
    }
const handleClickMapSatellite =() =>{
    setMaptypeId("hybrid")
}
const handleClickMapDefault =() =>{
    setMaptypeId("roadmap")
}
const handleClickMapTerrain =() =>{
    setMaptypeId("terrain")
}
    return (
        <>
            <div id="layout-wrapper"  className= {show ? "maximize_map" :isMode }>
              {show &&   <Fullscreen  handleClick2 ={handleClick2}
              handleClickMapSatellite ={handleClickMapSatellite} 
              handleClickMapDefault={handleClickMapDefault}
              handleClickMapTerrain = {handleClickMapTerrain}
              
              />  }
             
              {showHeader && <Header handleClick1 ={handleClick1}
               handleClickMapSatellite ={handleClickMapSatellite} 
               handleClickMapDefault={handleClickMapDefault}
               handleClickMapTerrain = {handleClickMapTerrain}
               />}
              {showHeader &&
                <Sidebar handleClose ={open} />}
                <div className={`main-content ${isMinimize === 'minimize' ? 'minimize-main' : ''}`}>
                    <div className={userType === "company-administrator" ? "page-content dashboard-page-content company-admin" : "page-content dashboard-page-content"}>
                        <div className="container-fluid">
                            
                            <div className="row">
                                {showHeader && 
                                <div className={open === false ?"col-12 col-md-3 dashboard_side-bar" : "close_menu"}>
                                    <div className= "page-title-box"  >
                                        <form className="search-data pillst-tab-new m-0">
                                            <div className="col-md-12">
                                                <div className="form-group app-search p-0 d-flex top_sh">
                                                    <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                                        <li className={(inputMenu === "vehicle") ? "nav-item active" : "nav-item"} onClick={(e) => makeActive("vehicle", e)} role="presentation">
                                                            <button className="btn btn border border-color py-1 px-2" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true"><i className="ti ti-truck font-size-20"></i></button>
                                                        </li>
                                                        <li className={(inputMenu === "driver") ? "nav-item active" : "nav-item"} onClick={(e) => makeActive("driver", e)} role="presentation">
                                                            <button className="btn btn border border-color py-1 px-2" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false"><i className="ti ti-steering-wheel font-size-20"></i></button>
                                                        </li>
                                                    </ul>
                                                    <div className="position-relative">
                                                        <input type="text" className="form-control font-size-11 search_dashboard" placeholder="Search by Driver or Vehicle ID" onBlur={callSearch} defaultValue={search} />
                                                        <span className="ti ti-search"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tab-content" id="pills-tabContent">
                                                <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabIndex="0">
                                                    <VehicleTab
                                                        vehicles={units}
                                                        truckStatus={truckStatus}
                                                        setTruckStatus={setTruckStatus}
                                                        handleNewReport={handleNewReport}
                                                        setOrder={setOrder}
                                                        order={order}
                                                        getUnitsOnMap={getUnitsOnMap}
                                                    />
                                                </div>
                                                {/* <!-- first tab end --> */}
                                                <DriverTab
                                                    drivers={driverUnits}
                                                    setOrder={setOrder}
                                                    order={order}
                                                    dutyStatus={dutyStatus}
                                                    setDutyStatus={setDutyStatus}
                                                    getDriverOnMap={getDriverOnMap}
                                                />
                                                {/* <!-- tab end --> */}
                                            </div>
                                        </form>
                                    </div>
                                </div>
}
                                <div className={open === false ? "col-12 col-md-9 dashboard_map-bar" : "col-12 col-md-9 dashboard_map-bar dashboard_map_full"}>
                                <div className="search_bar_div">
                                    <button className="map_large_button" onClick={() => handleClick()}>{open === true ?<i className="ti ti-chevron-right"></i> : <i className="ti ti-chevron-left"></i>}</button>
                                    {/* <div className={open === false ?"position-relative minimize_search_bar" : "position-relative minimize_search_bar close_Search"}>
                                        <input type="text" className="form-control font-size-11 search_dashboard" placeholder="Search by Driver or Vehicle ID" onBlur={callSearch} defaultValue={search} />
                                        <span className="ti ti-search"></span>
                                    </div>  */}
                                </div>
                                    <div className="map_box">
                                        {inputMenu === 'vehicle' ?
                                            <>
                                                { mapUnits.length > 0 ?
                                                <MapDashboard
                                                    markers={mapUnits}
                                                    setMaptypeId={maptypeId}
                                                />
                                                : <MapDashboard markers={[]} setMaptypeId={maptypeId}/>
                                                } 
                                            </>
                                            : <>
                                                { mapDriverUnits.length > 0 ?
                                                    <MapDashboard
                                                        markers={mapDriverUnits}
                                                        setMaptypeId={maptypeId}
                                                    />
                                                : <MapDashboard markers={[]} setMaptypeId={maptypeId}/>}
                                            </>
                                        }
                                        {/* <iframe title="drivermap" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26371286.49766774!2d-113.7164386566357!3d36.21152009978547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54eab584e432360b%3A0x1c3bb99243deb742!2sUnited%20States!5e0!3m2!1sen!2sin!4v1653560499738!5m2!1sen!2sin" width="100%" height="" style={{ "border": 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe> */}
                                    </div>
                                </div>
                                {/* <!-- end col --> */}
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!--Add Report Modal --> */}
                <LocationShareModal
                    open={showAddAdminModal}
                    close={handleModalClose}
                    data={selectedRowData}
                />
            </div>
        </>
    )
}

export default Dashboard