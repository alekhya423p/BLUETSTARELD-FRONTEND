import Header from "../layout/Header"
import Sidebar from "../layout/Sidebar"
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAssetDetail } from "../../actions/assetsAction";
import { useParams } from 'react-router-dom';
import * as actionTypes from '../../constants/actionTypes';
import { getDashboard } from "../../actions/dashboardAction";
import DriverTab from "./components/Drivers";
import LocationShareModal from "./components/LocationShareModal";
import { MapDashboard } from './MapDashboard'
import data from './data.json'
import driverData from './driverData.json'
import deepEqual from "fast-deep-equal";
import moment from "moment-timezone";
import { getLogStatus } from "../Logs/utils";
import VehicleTab from "./components/Vehicles";

let render = 0;

const Dashboard = () => {
    const dispatch = useDispatch()
    const params = useParams();
    const [inputMenu, setMenu] = useState('vehicle');
    const [truckStatus, setTruckStatus] = useState();
    const [order, setOrder] = useState(1);
    const { isMinimize, vehicles, drivers } = useSelector(state => state.dashboard)
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
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const tz = user && user.companyInfo && user.companyInfo.timeZoneId ? user.companyInfo.timeZoneId : "America/Los_Angeles";

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

    const drsTimers = data;
    const driver = driverData.data.drivers;
    useEffect(() => {
        if (driver) {
            let firstDriverUnits = JSON.parse(localStorage.getItem("firstDriverUnits")) || [];
            let newDriverUnits = [];
            driver.forEach((el, i) => {
                const odometr = el.odometr && el.odometr !== -1 ? `${el.odometr}` : "N/A";
                let fullname = (el.driverName).toLowerCase();
                newDriverUnits.push({
                    show: fullname.includes(search),
                    id: el.id,
                    status: el.eventCode ? getLogStatus(el.eventCode) : "",
                    driver: el.driverName,
                    tracking: el,
                    truckNo: el.vehicleId && el.vehicleNumber,
                    lastPosition: {
                        place: el && el.location,
                        time: el && el.timestamp,
                    },
                    device_info: el.device_info,
                    currentSpeed: el && el.speed + " mph",
                    marker: el && {
                        iconDeg: el.rotation,
                        odometr,
                        speed: el.speed,
                        position: {
                            ...el.coordinates,
                        },
                    },
                    ...el.timers,
                });
                let onMapEl = firstDriverUnits.find((fu) => fu.id === el.id);
                newDriverUnits[i]["showDriverOnMap"] = onMapEl ? onMapEl["showDriverOnMap"] : !!el;
            });
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

        if (drsTimers) {
            let firstUnits = JSON.parse(localStorage.getItem("firstUnits")) || [];
            let newUnits = [];
            drsTimers.data.vehicles.forEach((el, i) => {
                const odometr = 62141;
                // const odometr = el.tracking && el.tracking.odometr && el.tracking.odometr !== -1 ? `${el.tracking.odometr}` : "N/A";
                let fullname = (el.driverName).toLowerCase();
                newUnits.push({
                    show: fullname.includes(search),
                    id: el.id,
                    status: el.eventCode ? getLogStatus(el.eventCode) : "",
                    driver: el.driverName,
                    tracking: el,
                    truckNo: el.vehicleId && el.vehicleNumber,
                    lastPosition: {
                        place: el && el.location,
                        time: el && el.timestamp,
                    },
                    currentSpeed: el.speed && el.speed + " mph",
                    eld: el.eld_mode ? "ELD" : el.elog_mode ? "E-LOG" : "",
                    marker: el.coordinates && {
                        iconDeg: 0,
                        odometr,
                        speed: el.speed,
                        position: {
                            ...el.coordinates,
                        },
                    },
                    ...el.timers,
                });
                let onMapEl = firstUnits.find((fu) => fu.id === el.id);
                newUnits[i]["showOnMap"] = onMapEl ? onMapEl["showOnMap"] : !!el;
            });
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
    }, [drivers,drsTimers,driver, search, firstFetch, units, driverFirstFetch, maptypeId]);

    const getUnitsOnMap = () => {
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
            return data;
        }
        return false;
    };

    const getDriverOnMap = () => {
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
            return data;
        }
        return false;
    };

    function handleModalClose() {
        setLocationShareModal(false);
        setSelectedRowData(false);
    }
    const handleNewReport = () => {
        setLocationShareModal(true);
    };

    return (
        <>
            <div id="layout-wrapper">
                <Header />
                <Sidebar />
                <div className={`main-content ${isMinimize === 'minimize' ? 'minimize-main' : ''}`}>
                    <div className="page-content dashboard-page-content">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12 col-md-3 dashboard_side-bar">
                                    <div className="page-title-box">
                                        <form className="search-data pillst-tab-new m-0">
                                            <div className="col-md-12">
                                                <div className="form-group app-search p-0 d-flex top_sh">
                                                    <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                                        <li className={(inputMenu === "vehicle") ? "nav-item active" : "nav-item"} onClick={(e) => makeActive("vehicle", e)} role="presentation">
                                                            <button className="btn btn border border-color py-1 px-2" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true"><i className="ri-truck-line font-size-20"></i></button>
                                                        </li>
                                                        <li className={(inputMenu === "driver") ? "nav-item active" : "nav-item"} onClick={(e) => makeActive("driver", e)} role="presentation">
                                                            <button className="btn btn border border-color py-1 px-2" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false"><i className="ri-steering-2-line font-size-20"></i></button>
                                                        </li>
                                                    </ul>
                                                    <div className="position-relative">
                                                        <input type="text" className="form-control font-size-11 search_dashboard" placeholder="Search by Driver or Vehicle ID" onBlur={callSearch} defaultValue={search} />
                                                        <span className="ri-search-line"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tab-content" id="pills-tabContent">
                                                <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabIndex="0">
                                                    <VehicleTab
                                                        vehicles={vehicles}
                                                        truckStatus={truckStatus}
                                                        setTruckStatus={setTruckStatus}
                                                        handleNewReport={handleNewReport}
                                                        setOrder={setOrder}
                                                        order={order}
                                                    />
                                                </div>
                                                {/* <!-- first tab end --> */}
                                                <DriverTab
                                                    drivers={drivers}
                                                    setOrder={setOrder}
                                                    order={order}
                                                    dutyStatus={dutyStatus}
                                                    setDutyStatus={setDutyStatus}
                                                />
                                                {/* <!-- tab end --> */}
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="col-12 col-md-8 dashboard_map-bar">
                                    <div className="map_box">
                                        {inputMenu === 'vehicle' ? 
                                        <MapDashboard
                                            markers={getUnitsOnMap() || mapUnits}
                                            setMaptypeId={setMaptypeId}
                                        />
                                        : <>
                                        <MapDashboard
                                            markers={getDriverOnMap() || mapDriverUnits}
                                            setMaptypeId={setMaptypeId}
                                        />
                                        </>
                                        }
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