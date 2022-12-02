import React, { useState, useEffect } from "react"
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import { useParams } from 'react-router-dom';
import { getVehicleMaster, getVehicleLocation } from "../../../actions/vehicleAction";
import Select from 'react-select';
import {useDispatch, useSelector } from "react-redux";

const AssetSidebar = () => {

    const dispatch = useDispatch()
    const params = useParams();
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [options, setOptions] = useState()
    const [inputVehicle, setInputVehicle] = useState({ value: params?.vehicleId, label: params?.vehicleNo });
    const [searchDate, setSearchDate] = useState(moment().format('YYYY-MM-DD') + '/' + moment().format('YYYY-MM-DD'));
    const [searchStatus, setsearchStatus] = useState(params?.vehicleId);
    const { masterVehicles, locationHistory } = useSelector(state => state.vehicles)

    const range = {
        Today: [moment(), moment()],
        Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
        "Last 7 Days": [moment().subtract(6, "days"), moment()],
        "Last 30 Days": [moment().subtract(29, "days"), moment()],
        "This Month": [moment().startOf("month"), moment().endOf("month")],
        "Last Month": [moment().subtract(1, "month").startOf("month"),moment().subtract(1, "month").endOf("month")],
        "Last Year": [moment().subtract(1, "year").startOf("year"),moment().subtract(1, "year").endOf("year")]
    };

    const handleDateEvent = (event, picker) => {
        // console.log("start: ", picker.startDate._d);
        // console.log("end: ", picker.endDate._d);
        // setFromDate(picker.startDate._d.toISOString());
        // setToDate(picker.endDate._d.toISOString());
        // setSearchDate(moment(picker.startDate._d).format('YYYY/MM/DD') + '-' + moment(picker.endDate._d).format('YYYY/MM/DD'));
    };

    const handleCallback = (start, end, label) => {
        setFromDate(start._d.toISOString());
        setToDate(end._d.toISOString());
        setSearchDate(moment(start._d).format('YYYY-MM-DD') + '/' + moment(end._d).format('YYYY-MM-DD'));
        // console.log(start, end, 'kamal');
    }

    const setVehicleNumber = (e) => {
        setsearchStatus(e.value);
    }

    useEffect(() => {
        dispatch(getVehicleMaster())
        if(searchStatus && searchDate){
            dispatch(getVehicleLocation(searchStatus, searchDate))
        }
        setInputVehicle({ value: params?.vehicleId, label: params?.vehicleNo });
    }, [dispatch, params, searchStatus, searchDate]);

    useEffect(() => {       
		if(masterVehicles.vehicles) {
            masterVehicles.vehicles.unshift({
                _id: '',
                vehicleNumber: 'No Vehicle',
                vin: '',
                id: ''
            });
            var options = masterVehicles?.vehicles.map((item) => {
                return { value: item.id, label: item.vehicleNumber }
            })
        }
        setOptions(options);
    }, [masterVehicles, dispatch]);

    return (
        <>
            <div className="col-3">
                <div className="page-title-box">
                    <form className="search-data m-0">
                        <div className="col-md-12">
                            <div className="form-group app-search p-0 d-none top_sh">
                                <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button className="btn btn border border-color py-1 px-2" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true"><i className="ti ti-truck font-size-20"></i></button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="btn btn border border-color py-1 px-2" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false"><i className="ti ti-steering-wheel font-size-20"></i></button>
                                    </li>
                                </ul>
                                <div className="position-relative">
                                    <input type="text" className="form-control font-size-11" placeholder="Search by Vechile ID or VIN Number" />
                                    <span className="ti ti-search"></span>
                                </div>
                            </div>
                        </div>
                        <div className="tab-content" id="pills-tabContent">
                            <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabIndex="0">
                                <div className="row">
                                    <div className="col-md-12 flex-grow-1">
                                        <div className="row">
                                            <div className="col-md-12 d-block mb-3">
                                                <div className="form-group w-100 assets-date-picker">
                                                <DateRangePicker
                                                    ranges={range}
                                                    onCallback={handleCallback}
                                                    onEvent={handleDateEvent}
                                                >
                                                    <button type="button" className="date_filter_style align-left"><i className="ti ti-calendar"></i>
                                                        {moment(fromDate).format("MMM DD, YYYY")} to {moment(toDate).format("MMM DD, YYYY")}
                                                    </button>
                                                </DateRangePicker>
                                                </div> &nbsp;&nbsp;
                                                <div className="form-group w-100">
                                                    <Select className="assign_vehicles" defaultValue={inputVehicle} options={options} onChange={ (e) => setVehicleNumber(e) }  placeholder="Select Vehicle" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row scroll-seventh_2">
                                    { locationHistory ? locationHistory.length > 0 ? locationHistory.map((item, index) => (
                                        <div className="seventh" key={index}>
                                            <ul className="list-unstyled assets_side_ul">
                                                <li></li>
                                                <li>
                                                    <div>
                                                        <span className="badge custom-badges bg-success new-badges first-badges">B</span>{moment(item.startTime).format('MMM DD, YYYY')}
                                                    </div>
                                                </li>
                                                <li>
                                                    <div>
                                                        <span className="badge custom-badges bg-success new-badges">A</span>{item.endTime ? moment(item.endTime).format('MMM DD, YYYY') : 'NA'}
                                                    </div>
                                                </li>
                                                <li className="standart-time-li"><span className="badge-stationary">{item.status}</span> <span className="pehra-badge">10:32 AM - 10:47 AM (15m 30s)</span></li>
                                            </ul>
                                        </div>
                                    )): 
                                    <div className="seventh">
                                        <p>No matching records</p>
                                    </div> : ''
                                    }                                  
                                </div>
                            </div>
                            <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabIndex="0">
                                <div className="row">
                                    <div className="col-md-12 flex-grow-1">
                                        <div className="row">
                                            <div className="col-md-12 d-flex mt-3">
                                                <div className="form-group w-50">
                                                    <label className="form-label">Filter  By Duty Status</label>
                                                    <select className="form-select" aria-label="Active">
                                                        <option>Active</option>
                                                        <option value="1">One</option>
                                                        <option value="2">Two</option>
                                                        <option value="3">Three</option>
                                                    </select>
                                                </div> &nbsp;&nbsp;
                                                <div className="form-group w-50">
                                                    <label className="form-label">Sort</label>
                                                    <select className="form-select" aria-label="Active">
                                                        <option>Active</option>
                                                        <option value="1">One</option>
                                                        <option value="2">Two</option>
                                                        <option value="3">Three</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="seventh">
                                    <ul className="list-unstyled">
                                        <li>
                                            <div>
                                                <span className="badge custom-badges bg-success">D</span>Corey Goodman
                                                <label className="lab_icon">
                                                    <i className="ti ti-users"></i>
                                                    <i className="ti ti-phone"></i>
                                                </label>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="table-responsive w-100">
                                                <table className="table data_list">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">BREAK</th>
                                                            <th scope="col">DRIVE</th>
                                                            <th scope="col">SHIFT</th>
                                                            <th scope="col">CYCLE</th>
                                                            <th scope="col">RECAP</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <th>06:47</th>
                                                            <td>10:02</td>
                                                            <td>12:47</td>
                                                            <td>32:48</td>
                                                            <td>32:48</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </li>
                                        <li>
                                            <div>
                                                <span className="tag_mrgn">
                                                    <i className="ti ti-truck font-size-24"></i>
                                                </span>
                                                7000
                                            </div>
                                            <div>
                                                <small>1 min ago</small>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="seventh">
                                    <ul className="list-unstyled">
                                        <li>
                                            <div>
                                                <span className="badge custom-badges bg-primary">ON</span>Corey Goodman
                                                <label className="lab_icon">
                                                    <i className="ti ti-phone"></i>
                                                    <span className="text-danger"><i className="ti ti-alert-triangle"></i></span>
                                                </label>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="table-responsive w-100">
                                                <table className="table data_list">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">BREAK</th>
                                                            <th scope="col" className="text-danger">DRIVE</th>
                                                            <th scope="col" className="text-danger">SHIFT</th>
                                                            <th scope="col">CYCLE</th>
                                                            <th scope="col">RECAP</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <th>06:47</th>
                                                            <td className="text-danger">01:02</td>
                                                            <td className="text-danger">01:02</td>
                                                            <td>32:48</td>
                                                            <td>32:48</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </li>
                                        <li>
                                            <div>
                                                <span className="tag_mrgn">
                                                    <i className="ti ti-truck font-size-24"></i>
                                                </span>
                                                7001
                                            </div>
                                            <div>
                                                <small>1 min ago</small>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="seventh">
                                    <ul className="list-unstyled">
                                        <li>
                                            <div>
                                                <span className="badge custom-badges bg-gray">OFF</span>Corey Goodman
                                                <label className="lab_icon">
                                                    <i className="ti ti-phone"></i>
                                                </label>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="table-responsive w-100">
                                                <table className="table data_list">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">BREAK</th>
                                                            <th scope="col">DRIVE</th>
                                                            <th scope="col">SHIFT</th>
                                                            <th scope="col">CYCLE</th>
                                                            <th scope="col">RECAP</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <th>06:47</th>
                                                            <td>01:02</td>
                                                            <td>01:02</td>
                                                            <td>32:48</td>
                                                            <td>32:48</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </li>
                                        <li>
                                            <div>
                                                <span className="tag_mrgn">
                                                    <i className="ti ti-truck font-size-24"></i>
                                                </span>
                                                7002
                                            </div>
                                            <div>
                                                <small>1 min ago</small>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div className="seventh">
                                    <ul className="list-unstyled">
                                        <li>
                                            <div>
                                                <span className="badge custom-badges bg-gray">OFF</span>Corey Goodman
                                                <label className="lab_icon">
                                                    <i className="ti ti-phone"></i>
                                                </label>
                                            </div>
                                        </li>

                                        <li>
                                            <div className="table-responsive w-100">
                                                <table className="table data_list">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">BREAK</th>
                                                            <th scope="col">DRIVE</th>
                                                            <th scope="col">SHIFT</th>
                                                            <th scope="col">CYCLE</th>
                                                            <th scope="col">RECAP</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <th>06:47</th>
                                                            <td>01:02</td>
                                                            <td>01:02</td>
                                                            <td>32:48</td>
                                                            <td>32:48</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                        </li>
                                        <li>
                                            <div>
                                                <span className="tag_mrgn">
                                                    <i className="ti ti-truck font-size-24"></i>
                                                </span>
                                                7003
                                            </div>
                                            <div>
                                                <small>1 min ago</small>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div className="seventh">
                                    <ul className="list-unstyled">
                                        <li>
                                            <div>
                                                <span className="badge custom-badges bg-violet">PC</span>Corey Goodman
                                                <label className="lab_icon">
                                                    <i className="ti ti-phone"></i>
                                                    <span className="text-danger"><i className="ti ti-alert-circle"></i></span>
                                                </label>
                                            </div>
                                        </li>

                                        <li>
                                            <div className="table-responsive w-100">
                                                <table className="table data_list">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">BREAK</th>
                                                            <th scope="col" className="text-danger">DRIVE</th>
                                                            <th scope="col" className="text-danger">SHIFT</th>
                                                            <th scope="col">CYCLE</th>
                                                            <th scope="col">RECAP</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <th>06:47</th>
                                                            <td className="text-danger">01:02</td>
                                                            <td className="text-danger">01:02</td>
                                                            <td>32:48</td>
                                                            <td>32:48</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </li>
                                        <li>
                                            <div>
                                                <span className="tag_mrgn">
                                                    <i className="ti ti-truck font-size-24"></i>
                                                </span>
                                                7004
                                            </div>

                                            <div>
                                                <small>1 min ago</small>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="seventh">
                                    <ul className="list-unstyled">
                                        <li>
                                            <div>
                                                <span className="badge custom-badges bg-warning">SB</span>Corey Goodman
                                                <label className="lab_icon">
                                                    <i className="ti ti-users"></i>
                                                    <i className="ti ti-phone"></i>
                                                </label>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="table-responsive w-100">
                                                <table className="table data_list">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">BREAK</th>
                                                            <th scope="col">DRIVE</th>
                                                            <th scope="col">SHIFT</th>
                                                            <th scope="col">CYCLE</th>
                                                            <th scope="col">RECAP</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <th>06:47</th>
                                                            <td>10:02</td>
                                                            <td>12:47</td>
                                                            <td>32:48</td>
                                                            <td>32:48</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </li>
                                        <li>
                                            <div>
                                                <span className="tag_mrgn">
                                                    <i className="ti ti-truck font-size-24"></i>
                                                </span>
                                                7005
                                            </div>
                                            <div>
                                                <small>1 min ago</small>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default AssetSidebar