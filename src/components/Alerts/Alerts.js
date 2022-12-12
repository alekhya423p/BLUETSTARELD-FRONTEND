import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Header from '../layout/Header'
import Sidebar from "../layout/Sidebar";
import AddAlertModal from "./AddAlertModal";
import Loading from "../layout/Loading";
import DataTableAlerts from './DatatableAlerts';
import { getVehicleMaster } from "../../actions/vehicleAction";
// import { getAllAlerts } from '../../actions/alertActions';

const Alerts = () => {

    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchStatus, setsearchStatus] = useState("");
    const { alerts, count, totalRecord, loading } = useSelector(state => state.alerts)
    const { user } = useSelector((state) => state.auth);
    const { masterVehicles } = useSelector(state => state.vehicles)
    const { isMinimize, isMode } = useSelector(state => state.dashboard)
    const [showAddAlertModal, setAddAlertModal] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(false);
    const itemsPerPage = 20
    const childRef = useRef();
    var userType = user && user.user && user.user.userType;

    const pageHead = `Alerts`;

    useEffect(() => {
        dispatch(getVehicleMaster());
        // dispatch(getAllAlerts(currentPage, searchStatus))
    },[dispatch])

    const handleAddAlert = () => {
        setAddAlertModal(true);
    };
    
    const handleAddAlertClose = () => {
        setAddAlertModal(false);
        setSelectedRowData(false);
    };

    return (
        <>
        <div id="layout-wrapper" className={isMode}>
            <Header pageHead={pageHead} />
            <Sidebar />
            <div className={`main-content ${isMinimize === 'minimize' ? 'minimize-main' : ''}`}>
                <div className={userType === "company-administrator" ? "page-content company-admin" : "page-content"}>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box">
                                    <form className="search-data">
                                        <div className="row">
                                            <div className="col-md-10 flex-grow-1">
                                                <div className="row">
                                                    <div className="col col-sm-5">
                                                        <div className="form-group app-search p-0 ">
                                                            <label>Filter by Type</label>
                                                            <select className="form-select" aria-label="Active" value={searchStatus} onChange={e=>setsearchStatus(e.target.value)}>
                                                                <option>All</option>
                                                                <option>Vehicle Speeding</option>
                                                                <option>Device Disconnected</option>
                                                                <option>HOS Violation-Break</option>
                                                                <option>HOS Violation-Driving</option>
                                                                <option>HOS Violation-Shift</option>
                                                                <option>HOS Violation-Cycle</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>		
                                            <div className="col-auto col-2">
                                                <div className="d-inline-flex">
                                                    <div className="col-sm-10">
                                                        <div className="form-group">
                                                            <label className="form-label">&nbsp;</label>
                                                            <button type="button" className="btn d-block add-button" onClick={() => handleAddAlert()}><i className="dripicons-plus font-size-20 vertical-align-top"></i> Add Alert</button>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-2">
                                                        <div className="form-group">
                                                            <label className="form-label">&nbsp;</label>
                                                            <button className="btn btn border border-color d-block "><i className="ti ti-refresh"></i></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>                             
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">                             
                                <div className="table-responsive mb-0">        
                                    { loading ?
                                        <Loading /> :
                                        <DataTableAlerts count={count} currentPage={currentPage} setCurrentPage={setCurrentPage} data={alerts} ref={childRef} handleAddAlert={handleAddAlert} totalRecord={totalRecord} itemsPerPage={itemsPerPage} mode='edit' />
                                    }     
                                </div>
                            </div> 
                        </div>                    
                    </div>
                </div>
            </div>
        </div>
        {/* <!--Add Report Modal --> */}
        <AddAlertModal
            open={showAddAlertModal}
            close={handleAddAlertClose}
            data={selectedRowData}
            vehicles={masterVehicles}
        />
        </>
    );
}

export default Alerts;