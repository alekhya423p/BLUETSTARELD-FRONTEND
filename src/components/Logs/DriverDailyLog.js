import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from '../layout/Header'
import Sidebar from '../layout/Sidebar'
import Loading from "../layout/Loading";
import { Link, useParams } from 'react-router-dom';
import DataTableDriverDailyLogs from "./DataTables/DataTableDriverDailyLogs";
import { loadLog } from "../../actions/logAction";
import * as actionTypes from '../../constants/actionTypes';
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import db from "../../data/db.json";

const DriverLogDetails = (props) => {

    const dispatch = useDispatch()
    const params = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [violationStatus, setViolationStatus] = useState("");
    const [mannererrors, setMannerErrors] = useState("");
    const [fromDate, setFromDate] = useState(+new Date() - 12096e5);
    const [toDate, setToDate] = useState(new Date());
    const { filterDates, logDetails, count, totalRecord, loading } = useSelector(state => state.logs)
    const { user } = useSelector(state => state.auth)
    const [searchDate, setSearchDate] = useState(filterDates.start ? moment(filterDates.start).format('YYYY-MM-DD') + '/' + moment(filterDates.end).format('YYYY-MM-DD') : '');
    const { isMinimize, isMode } = useSelector(state => state.dashboard)
    const itemsPerPage = 20;
    const childRef = useRef();
    var userType = user && user.user && user.user.userType;

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
        // setFromDate(picker.startDate._d.toISOString());
        // setToDate(picker.endDate._d.toISOString());
        // setSearchDate(moment(picker.startDate._d).format('YYYY/MM/DD') + '-' + moment(picker.endDate._d).format('YYYY/MM/DD'));
    };
    const handleCallback = (start, end, label) => {
        setFromDate(start._d.toISOString());
        setToDate(end._d.toISOString());
        setSearchDate(moment(start._d).format('YYYY-MM-DD') + '/' + moment(end._d).format('YYYY-MM-DD'));
       
    }
    useEffect(() => {
        setFromDate(filterDates.start);
        setToDate(filterDates.end);
        let startDate = filterDates.start ? moment(filterDates.start).format('YYYY-MM-DD') : ''
        let endDate = filterDates.end ? moment(filterDates.end).format('YYYY-MM-DD') : ''
            setSearchDate(startDate ? startDate + '/' + endDate : '');       
    }, [filterDates])

    useEffect(() => {        
        if (params.id) {
			dispatch(loadLog(params?.id, currentPage, searchDate, mannererrors, violationStatus))
		}else {
            dispatch({ type: actionTypes.LOAD_LOGS_RESET })
        }
    },[dispatch, params, currentPage, searchDate, mannererrors, violationStatus ])

    const clearFilter = (e) => {
        e.preventDefault();
        setViolationStatus('')
        setMannerErrors('')
        if(params.id){
            dispatch(loadLog(params?.id))
        }
    }

    // const  setSelectedRowsCount = (newCount) => {
		// setSelectedCount(newCount);
	// };

    const pageHead = `Logs/${logDetails?.[0]?.driverName ? logDetails?.[0]?.driverName : ''}(${count ? count : 0})`

    return(
        <>
        <div id="layout-wrapper" className={isMode}>
            <Header pageHead={pageHead} />
            <Sidebar/>
            <div className={`main-content ${isMinimize === 'minimize' ? 'minimize-main' : ''}`}>
                <div className={userType === "company-administrator" ? "page-content company-admin" :"page-content"}>
                    <div className="container-fluid">
                         {/* start page title  */}
                         <div className="row">
                            <div className="col-12">
                                <div className="page-title-box">
                                    <div className="row">
                                        <div className="col-12 flex-grow-1 driver-logs-detail-section">
                                            <div className="row">
                                                <div className="col col-sm-2">                                                
                                                    <div className="form-group">
                                                        <label>&nbsp;</label>
                                                        <div>
                                                            <Link to="/logs"><button type="button" className="btn btn-sm btn-outline-secondary return_btn_style"><i className="ti ti-arrow-left mtr10"></i>Return</button></Link>
                                                        </div>
                                                    </div>
                                                </div>                                                   
                                                <div className="col col-sm-3">
                                                    <div className="form-group">
                                                        <label>&nbsp;</label>
                                                        <div>
                                                            <DateRangePicker  
                                                                ranges={range}
                                                                initialSettings={{ startDate: moment(filterDates.start).format('MM-DD-YYYY'), endDate: moment(filterDates.end).format('MM-DD-YYYY') }}
                                                                onCallback={handleCallback}
                                                                onEvent={handleDateEvent}>
                                                                <button className="date_filter_style"><i className="ti ti-calendar"></i>&nbsp;
                                                                {moment(fromDate).format("MMM DD, YYYY")} - {moment(toDate).format("MMM DD, YYYY")}
                                                                </button>
                                                            </DateRangePicker>           
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col col-sm-3">
                                                    <div className="form-group">
                                                        <label className="form-label">Filter by HOS Violation</label>
                                                        <select className="form-select" onChange={e=>{setViolationStatus(e.target.value) }} value={violationStatus}>
                                                            {db.hosViolations.map((e,key) => {
                                                            return <option key={key} value={e.value}>{e.key}</option>
                                                            })}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col col-sm-3">
                                                    <div className="form-group">
                                                        <label className="form-label">Filter by Form & Manner Errors</label>
                                                        <select className="form-select" onChange={e=>{setMannerErrors(e.target.value)}} value={mannererrors}>
                                                        {db.mannerErrors.map((e,key) => {
                                                            return <option key={key} value={e.value}>{e.key}</option>
                                                            })}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-sm-1">
                                                    <div className="form-group">
                                                        <label className="form-label">&nbsp;</label>
                                                        <button type="button" className="btn btn border border-color d-block  mx-2" onClick={clearFilter}><i className="ti ti-refresh"></i></button>
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
                                    <DataTableDriverDailyLogs count={count} currentPage={currentPage} setCurrentPage={setCurrentPage} data={logDetails ? logDetails : ''} totalRecord={totalRecord} ref={childRef} itemsPerPage={itemsPerPage} mode='edit' />
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
export default DriverLogDetails