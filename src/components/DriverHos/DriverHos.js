import {useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";
import Loading from "../layout/Loading";
import { getAllDriverHos } from "../../actions/driverHosAction";
import DataTableDriverHos from "./DataTableDriverHos";
import { getEventCode } from "../../actions/logAction";

const DriverHos = () => {
    const dispatch = useDispatch()
    const { driverHos, count, totalRecord, loading } = useSelector(state => state.driverHos)  
    const { eventCodes } = useSelector(state => state.logs)  
    const { isMinimize, isMode } = useSelector(state => state.dashboard)
    const { user } = useSelector((state) => state.auth);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKey, setSearchKey] = useState();    
    const [eldStatus, setEldStatus] = useState();    
    const [dutyStatus, setDutyStatus] = useState();
    const [violationStatus, setViolationStatus] = useState();
    const itemsPerPage = 20;
    const childRef = useRef();
    var userType = user && user.user && user.user.userType;

    useEffect(() => {
        dispatch(getEventCode());
        dispatch(getAllDriverHos(currentPage, searchKey, eldStatus, dutyStatus, violationStatus))
    },[dispatch, currentPage, searchKey, eldStatus, dutyStatus, violationStatus])

    const clearFilter = (e) => {
        e.preventDefault(); 
        setSearchKey('');
        setEldStatus('');
        setDutyStatus('');
        setViolationStatus('');     
        dispatch(getAllDriverHos(currentPage, searchKey, eldStatus, dutyStatus, violationStatus));
    }

    const pageHead = `Driver HOS(${count ? count : 0})`
    
    const callSearch = (e) => {
        setSearchKey(e.target.value);
    }

    return(
        <>
        <div id="layout-wrapper" className={isMode}>
            <Header pageHead={pageHead} />
            <Sidebar />
            <div className={`main-content ${isMinimize === 'minimize' ? 'minimize-main' : ''}`}>
                <div className={userType === "company-administrator" ? "page-content company-admin" :"page-content"}>
                    <div className="container-fluid">
                         {/* start page title  */}
                         <div className="row">
                            <div className="col-12">
                                <div className="page-title-box">
                                    <div className="row">
                                        <div className="col-12 flex-grow-1">
                                            <div className="row">
                                                <div className="col col-sm-3 tob-section-option">                                                
                                                    <div className="form-group app-search p-0">
                                                        <label>&nbsp;</label>
                                                        <div className="position-relative">
                                                            <input type="text"  onBlur={callSearch} defaultValue={searchKey} className="form-control font-size-11" placeholder="Search by Driver or Vehicle ID"/>
                                                            <span className="ti ti-search"></span>
                                                        </div>
                                                    </div>
                                                </div>  
                                                <div className="col col-sm-8 drive-hos-label"> 
                                                <div className="row">                                               
                                                <div className="col col-sm-4 tob-section-option">
                                                    <div className="form-group">
                                                        <label>Filter by ELD Status</label>
                                                        <div>
                                                            <select className="form-select" value={eldStatus} onChange={e => setEldStatus(e.target.value)}>
                                                                <option value="">All</option>
                                                                <option value="Connected">Connected</option>
                                                                <option value="Disconnected">Disconnected</option>
                                                            </select>    
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col col-sm-4 tob-section-option">
                                                    <div className="form-group">
                                                        <label>Filter by Duty Status</label>
                                                        <select className="form-select" value={dutyStatus} onChange={e => setDutyStatus(e.target.value)}>
                                                            <option value="">All</option>
                                                            {eventCodes.map((e,key) => (
                                                                ( key <= 5) ? <option key={key} value={e.id}>{e.value}</option> : ''
                                                            ))}                                     
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col col-sm-4 tob-section-option">
                                                    <div className="form-group">
                                                        <label className="form-label">Filter by Violation Status</label>
                                                        <select className="form-select" value={violationStatus} onChange={e=> setViolationStatus(e.target.value)}>
                                                            <option value="">All</option>
                                                            <option value="violation_n_errors">Violation & Errors</option>
                                                            <option value="compliant_drivers">Compliant Drivers</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                </div>
                                                </div> 
                                                <div className="col-sm-1">
                                                    <div className="form-group">
                                                        <label className="form-label">&nbsp;</label>
                                                        <button type="button" className="btn btn border border-color d-block mx-2" onClick={clearFilter}><i className="ti ti-refresh"></i></button>
                                                    </div>
                                                </div>                                                   
                                            </div>
                                        </div>		
                                    </div>
                                </div>
                            </div>
                        </div>
                         {/* end page title */}
                        
                        <div className="row">
                            <div className="col-12 text-center">
                                <div className="mb-0">
                                {loading ?
                                    <Loading /> :
                                    <DataTableDriverHos totalRecord={totalRecord} currentPage={currentPage} setCurrentPage={setCurrentPage} data={driverHos} ref={childRef} itemsPerPage={itemsPerPage} mode='edit' />
                                }                               
                                </div>
                            </div>  
                            {/* end col */}
                        </div> 
                        {/* <!-- end row --> */}
                         {/* end row */}
                    </div> 
                    {/* container-fluid */}
                </div>
                 {/* End Page-content */}
            </div>
        </div>
        </>
    )
}

export default DriverHos;