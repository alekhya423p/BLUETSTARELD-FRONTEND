import React, { useState } from "react";
import moment from "moment-timezone";
const DriverTab = (props) => {

    const [inputMenu, setMenu] = useState('');
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const tz = user && user.companyInfo && user.companyInfo.timeZoneId ? user.companyInfo.timeZoneId : "America/Los_Angeles";

    const makeActive = (menuItem, e) => {
        localStorage.setItem("activeMenu", menuItem);
        setMenu(menuItem);
    }

    // const getDuration = (totalSecs) => {
    //     let h = Math.floor(totalSecs / 3600);
    //     let m = Math.floor((totalSecs - h * 3600) / 60);
    //     return h +':'+ m;
    // };

    const getDuration = (timer, type) => {
        let total;
        let hours = "00";
        let minutes = "00";
        let colors = ["#F2994A", "#cfcfcf"];
        let labels;

        switch(type){
            case "break":
                colors = ["#eaaa08", "#ffe9b0"];
                labels = ["", ""];
                total = 8;
            break;
            case "drive":
                colors = ["#16b364", "#b9ffdc"];
                labels = ["", ""];
                total = 11;
            break;
            case "shift":
                colors = ["#2e90fa", "#cae4ff"];
                labels = ["", ""];
                total = 14;
            break;
            case "cycle":
                colors = ["#667085", "#dcdcdc"];
                labels = ["", ""];
                total = 70;
            break;
            case "recap":
                colors = ["#F2994A", "#cfcfcf"];
                labels = ["", ""];
                total = 50;
            break;
            default:
            break;
        }
        console.log(colors, labels, total);

        if (+timer && +timer > 0) {
        hours = Math.floor(Math.round(+timer) / 60);
        minutes = Math.round(+timer - 60 * hours);
        hours = hours > 9 ? `${hours}` : `0${hours}`;
        minutes = minutes > 9 ? `${minutes}` : `0${minutes}`;
            return hours + ':' + minutes
        }else{
            return '00:00';
        }

    }

    const getActiveClass = (e) => {
        if (e.currentTarget.classList.contains('active')) {
            e.currentTarget.classList.remove('active');
        }else{
            e.currentTarget.classList.add('active');
        }
    }

    return (
        <>
            <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabIndex="0">
                <div className="row">
                    <div className="col-md-12 flex-grow-1">
                        <div className="row">
                            <div className="col-md-12 d-flex mt-3">
                                <div className="form-group w-50">
                                    <label className="form-label label-filter">Filter By Duty Status</label>
                                    <select className="form-select" aria-label="Active" value={props.dutyStatus} onChange={e=> props.setDutyStatus(e.target.value)}>
                                        <option value="">All</option>
                                        <option value="DS_D">Driving</option>
                                        <option value="DS_ON">On Duty</option>
                                        <option value="DS_OFF">Off Duty</option>
                                        <option value="DS_SB">Sleeper</option>
                                        <option value="DR_IND_PC">Personal</option>
                                        <option value="DR_IND_YM">Yard Move</option>
                                    </select>
                                </div> &nbsp;&nbsp;

                                <div className="form-group w-50">
                                    <label className="form-label label-filter">Sort</label>
                                    <select className="form-select" aria-label="Active" value={props.order} onChange={e=> props.setOrder(e.target.value)}>
                                        <option value="1">Ascending</option>
                                        <option value="-1">Descending</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row scroll-seventh driver_props">
               
                { props.drivers.length > 0 ? props.drivers.map((item, index) => (     
                <div className={(inputMenu === item) ? "seventh active" : "seventh" } onClick={(e) => {props.getDriverOnMap([item], e); makeActive(item, e); getActiveClass(e);}} key={index}>
                    <ul className="list-unstyled">
                        
                        <li>
                            <div>
                                <span className={`badge custom-badges ${item.status}`}>{item.status}</span>
                                <span>{item.driver}</span>
                                <label className="lab_icon">
                                    <i className="ti ti-users"></i>
                                    <i className="ti ti-phone"></i>
                                </label>
                            </div>
                        </li>
                        <li>
                            <div className="table-responsive w-100">
                                <ul className="duty-status-detail">
                                    <li>
                                        <p className="duty-status-heading">BREAK</p>
                                        <p className="duty-staus-time">{item.times?.break ?  getDuration((item.times.break)/60, 'break') :  0 }</p>
                                    </li>
                                    <li>
                                        <p className="duty-status-heading">DRIVE</p>
                                        <p className="duty-staus-time">{item.times?.drive ? getDuration((item.times?.drive)/60, 'drive') : 0}</p>

                                    </li>
                                    <li><p className="duty-status-heading">SHIFT</p>
                                        <p className="duty-staus-time">{item.times?.shift ? getDuration((item.times?.shift)/60, 'shift') : 0}</p>
                                    </li>
                                    <li><p className="duty-status-heading">CYCLE</p>
                                        <p className="duty-staus-time">{item.times?.cycle ? getDuration((item.times?.cycle)/60, 'cycle') : 0}</p>
                                    </li>
                                    <li><p className="duty-status-heading">RECAP</p>
                                        <p className="duty-staus-time">{item.times?.recap ? getDuration((item.times?.recap)/60, 'recap') : 0}</p>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <div>
                                <span className="tag_mrgn truck-line-icon">
                                    <i className="ti ti-truck font-size-24"></i>
                                </span>
                                {item.truckNo}
                            </div>
                            <div className="time_ago">
                                <small>{moment.tz(item.lastPosition.time, tz).fromNow(true)}</small>
                            </div>
                        </li>
                    </ul>
                </div>                
                )) : 
                <div>
                    <ul>No matching records found</ul>
                </div>
                }
                </div>
            </div>
        </>
    )
}

export default DriverTab;