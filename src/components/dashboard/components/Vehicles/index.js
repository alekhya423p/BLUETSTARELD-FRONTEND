import React, {useState} from "react";
import { Link } from "react-router-dom";
import moment from "moment-timezone";
import moveArrow from "../../../../assets/move-arrow.svg";
import LocationModal from "./LocationModal";

const VehicleTab = (props) => {
    const [inputMenu, setMenu] = useState('');
    const [locationModal ,setLocationModal] =useState(false)
    const [vehicleId , setVehicleId] = useState('');
    const [historyLocation , setHistoryLocation] = useState('')
    const [driverId , setDriverId] = useState('');
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const tz = user && user.companyInfo && user.companyInfo.timeZoneId ? user.companyInfo.timeZoneId : "America/Los_Angeles";

    const makeActive = (menuItem, e) => {
        localStorage.setItem("activeMenu", menuItem);
        setMenu(menuItem);
    }

    const getActiveClass = (e) => {
        if (e.currentTarget.classList.contains('active')) {
            e.currentTarget.classList.remove('active');
        }else{
            e.currentTarget.classList.add('active');
        }
    }
    const handleClick=(e,item)=>{
        setLocationModal(true);
        setDriverId(item.driverId)
        setVehicleId(item.truckId)
        setHistoryLocation(item.history)
    }
    
    const handleUpdateSubsModalClose = () => {
      setLocationModal(false)
    }

    return (
        <>
            <div className="row">
                <div className="col-md-12 flex-grow-1">
                    <div className="row">
                        <div className="col-md-12 d-flex mt-3">
                            <div className="form-group w-50">
                                <label className="form-label label-filter">Filter By Truck status</label>
                                <select className="form-select" aria-label="Active" value={props.truckStatus} onChange={e => props.setTruckStatus(e.target.value)}>
                                    <option value="">All</option>
                                    <option value="STATIONARY">Stationary</option>
                                    <option value="IN_MOTION">In Motion</option>
                                </select>
                            </div> &nbsp;&nbsp;
                            <div className="form-group w-50">
                                <label className="form-label label-filter">Sort</label>
                                <select className="form-select" aria-label="Active" value={props.order} onChange={e => props.setOrder(e.target.value)}>
                                    <option value="1">Ascending</option>
                                    <option value="-1">Descending</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <LocationModal open={locationModal} close ={handleUpdateSubsModalClose} driverId={driverId} vehicleId={vehicleId} historyLocation={historyLocation}/>
            {/* <LiveShareHistoryModal open={locationModal} close ={handleUpdateSubsModalClose} /> */}
            <div className="row scroll-seventh">
                {props.vehicles.length > 0 ?  props.vehicles.map((item, index) => (
                    <div className={(inputMenu === item) ? "seventh active" : "seventh"} onClick={(e) => {props.getUnitsOnMap([item], e); makeActive(item, e); getActiveClass(e);}}  key={index}>
                        <ul className="list-unstyled">
                            <li>
                                <div>                                    
                                    <span className="tag_mrgn plane_icon_span">
                                     {item.vehicleStatus === 'STATIONARY' ? 
                                        <i className="ri-checkbox-blank-circle-fill text-success"></i> : item.vehicleStatus === 'INACTIVE' ? <i className="ri-checkbox-blank-circle-fill font-size-18"></i> : <img src={moveArrow} alt="logo-sm" height="18" /> }
                                       
                                    </span>                                     
                                    <span onClick={() => props.getUnitsOnMap(item)} className="text-muted vehicle-text">
                                        <Link to={`/dashboard/vehicle/${item.truckNo}/${item.truckId}`}><b>{item.truckNo}</b></Link>
                                    </span> &nbsp;&nbsp;
                                    <span className={item.vehicleStatus === "STATIONARY" || item.vehicleStatus === 'INACTIVE' ? '' : 'text-success'}>{ item.vehicleStatus === "STATIONARY" ? item.vehicleStatus : item.vehicleStatus === 'INACTIVE' ? "Offline" : item.currentSpeed }</span> 
                                    {/* <label className="gas_label"><i className="ti ti-gas-station"></i>{item.fuelLevel}%</label> */}
                                </div>
                                <div>                                    
                                    <i className={item.history.length > 0?"ti ti-link blue_link":"ti ti-link"} onClick={(e) => handleClick(e,item)}></i>
                                </div>
                                
                            </li>
                            <li>
                                <div>
                                    <span className="tag_mrgn">
                                        <i className="ti ti-map-pin"></i>
                                    </span>
                                    {item.lastPosition.place ? (item.lastPosition.place + ',') : '' } {item.state}
                                </div>
                                <div>
                                    <small>{moment.tz(item.lastPosition.time, tz).fromNow(true)}</small>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <span className={`badge custom-badges ${item.status}`}>{item.status}</span>
                                    {item.driver}
                                </div>
                                {/* <div>
                                    <i className="ti ti-phone"></i>
                                    <i className="ti ti-clock"></i>
                                </div> */}
                            </li>
                            <li>
                                <div>
                                   <span className={`badge custom-badges ${item.coDriverEventCode}`}>{item.coDriverEventCode}</span>
                                    {item.coDriverName ? item.coDriverName : ''}
                                </div>
                                <div>
                                    {/* {item.coDriverName ?
                                        <>
                                            <i className="ti ti-phone"></i>
                                            <i className="ti ti-clock"></i>
                                        </>
                                        : ''} */}
                                </div>
                            </li>
                        </ul>
                    </div>
                )) : <div>
                        <ul>
                            No matching records found
                        </ul>
                </div> }
            </div>
        </>
    )
}

export default VehicleTab;