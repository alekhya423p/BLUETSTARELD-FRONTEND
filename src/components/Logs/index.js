import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from '../layout/Header'
import Sidebar from '../layout/Sidebar'
import Loading from "../layout/Loading";
import DataTableLogs from "./DataTables/DataTableLogs";
import { getLogs } from "../../actions/logAction";
import { getDriver } from "../../actions/driverAction";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import db from '../../data/db.json'
import TransferData from "./components/TransferData";
import { SET_LOG_FILTER_DATE } from '../../constants/actionTypes'
import LogPdfDownload from "./components/LogPdfDownloadModal";

const Logs = () => {
    const dispatch = useDispatch()
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKey, setSearchKey] = useState("");
    const [violationStatus, setViolationStatus] = useState("");
    const [mannererrors, setMannerErrors] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const [fromDate, setFromDate] = useState(+new Date() - 12096e5);
    const [toDate, setToDate] = useState(new Date());
    const [showAddAdminModal, setAddAdminModal] = useState(false);
    const [showLogsPdfModal, setLogsPdfModal] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(false);
    

    const { logs, count, totalRecord, loading } = useSelector(state => state.logs)
    const { isMinimize, isMode } = useSelector(state => state.dashboard)
    const { drivers } = useSelector(state => state.drivers)
    const childRef = useRef();

    const range = {
        Today: [moment(), moment()],
        Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
        "Last 7 Days": [moment().subtract(6, "days"), moment()],
        "Last 30 Days": [moment().subtract(29, "days"), moment()],
        "This Month": [moment().startOf("month"), moment().endOf("month")],
        "Last Month": [moment().subtract(1, "month").startOf("month"),moment().subtract(1, "month").endOf("month")],
        "Last Year": [moment().subtract(1, "year").startOf("year"),moment().subtract(1, "year").endOf("year")]
    };

    const callSearch = (e) => {
        setSearchKey(e.target.value);
    }

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
        dispatch({type: SET_LOG_FILTER_DATE, payload: {start: start._d.toISOString(), end: end._d.toISOString()}})
        setSearchDate(moment(start._d).format('YYYY-MM-DD') + '/' + moment(end._d).format('YYYY-MM-DD'));
        // console.log(start, end, 'kamal');
    }
    useEffect(() => {
        dispatch(getLogs(currentPage, searchKey, searchDate, mannererrors, violationStatus))
    },[dispatch, currentPage, searchKey, searchDate, mannererrors, violationStatus])

    useEffect(() => {
        dispatch(getDriver())
    },[dispatch])
    // const submitHandler = (e) => {
    //     e.preventDefault();
    //     console.log(dutyStatus, 'dutyStatus2');
    //     if (searchKey === "" || hosStatus === "" || dutyStatus === "") {
    //         dispatch(getLogs(searchKey, hosStatus, dutyStatus));
    //     }
    // };

    const clearFilter = (e) => {
        e.preventDefault();
        setViolationStatus('')
        setSearchKey("");
        setMannerErrors("");
        dispatch(getLogs());
    }

    const handleAddModalClose = () => {
        setAddAdminModal(false);
        setSelectedRowData(false);
    };

    const handleAddModalShow = () => {
        setAddAdminModal(true);
        setSelectedRowData();
    };

    const handleDownloadModalShow = () => {
        setLogsPdfModal(true);
    };

    const handleClosePdfModal = () => {
        setLogsPdfModal(false);
    };

    const pageHead = `Logs(${count ? count : 0})`

    return(
        <>
        <div id="layout-wrapper" className={isMode}>
            <Header pageHead={pageHead} />
            <Sidebar/>
            <div className={`main-content ${isMinimize === 'minimize' ? 'minimize-main' : ''}`}>
                <div className="page-content">
                    <div className="container-fluid">
                         {/* start page title  */}
                         <div className="row">
                            <div className="col-12">
                                <div className="page-title-box">
                                    <div className="row">
                                        <div className="col-12 flex-grow-1">
                                            {/* <form className="search-data_n"> */}
                                                <div className="row">
                                                    <div className="col-sm-5 logs_date_col">
                                                        <div className="row">
                                                            <div className="col col-sm-5 tob-section-option">
                                                                <div className="form-group app-search p-0 ">
                                                                    <label>&nbsp;</label>
                                                                    <div className="position-relative">
                                                                        <input type="text"  className="form-control font-size-11" onBlur={callSearch} defaultValue={searchKey} placeholder="Search by Driver"/>
                                                                        <span className="ti ti-search"></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col col-sm-7 tob-section-option">
                                                                <div className="form-group">
                                                                    <label >&nbsp;</label>
                                                                    <div>
                                                                        <DateRangePicker
                                                                            ranges={range}
                                                                            onCallback={handleCallback}
                                                                            onEvent={handleDateEvent}
                                                                        >
                                                                            <button className="date_filter_style"><i className="ti ti-calendar"></i> &nbsp;
                                                                            {moment(fromDate).format("MMM DD, YYYY")} - {moment(toDate).format("MMM DD, YYYY")}
                                                                            </button>
                                                                        </DateRangePicker>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-4 logs_filter_col">
                                                        <div className="row">
                                                            <div className="col col-sm-4 form-label-logs tob-section-option">
                                                                <div className="form-group">
                                                                    <label className="form-label">Filter by HOS Violation</label>
                                                                    <select className="form-select" value={violationStatus} onChange={e=>{setViolationStatus(e.target.value) }}>
                                                                        {db.hosViolations.map((e,key) => (
                                                                         <option key={key} value={e.value}>{e.key}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col col-sm-6 form-label-logs tob-section-option">
                                                                <div className="form-group">
                                                                    <label className="form-label manager-error-label">Filter by Form & Manner Errors</label>
                                                                    <select className="form-select manager-error-select" onChange={e=>{setMannerErrors(e.target.value)}} value={mannererrors}>
                                                                    {db.mannerErrors.map((e,key) => {
                                                                        return <option key={key} value={e.value}>{e.key}</option>
                                                                        })}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-2 p-0">
                                                                <div className="form-group">
                                                                    <label className="form-label">&nbsp;</label>
                                                                    <button type="button" className="btn btn border border-color d-block  mx-2" onClick={clearFilter}><i className="ti ti-refresh"></i></button>
                                                                </div>
                                                            </div>
                                                        </div>                                                 
                                                    </div>
                                                    <div className="col-sm-3 logs_filter_buttons">
                                                        <div className="col-auto col-12">
                                                            <div className="row">
                                                                <div className="d-inline-flex">
                                                                    <div className="col-sm-6">
                                                                        <div className="form-group">
                                                                            <label className="form-label">&nbsp;</label>
                                                                            <button onClick={() => handleAddModalShow()} type="button" className="btn d-block add-button"><i className="ti ti-cloud-upload"></i> Transfer Data</button>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-6">
                                                                        <div className="form-group">
                                                                            <label className="form-label">&nbsp;</label>
                                                                            <button onClick={() => handleDownloadModalShow()} type="button" className="btn d-block add-button mx-2"><i className="ti ti-file-download"></i> Download</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            {/* </form> */}
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
                                    <DataTableLogs count={20} currentPage={currentPage} setCurrentPage={setCurrentPage} totalRecord={totalRecord} data={logs} ref={childRef} searchDate={searchDate} mode='edit' />
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
        {/* <!-- Modal --> */}
        <TransferData
            open={showAddAdminModal}
            close={handleAddModalClose}
            data={selectedRowData}
            drivers={drivers}
            mode={'create'}
        />
        <LogPdfDownload open={showLogsPdfModal}
            close={handleClosePdfModal}
            data={selectedRowData} 
            drivers={drivers}
            mode={'create'}
        />
        </>
    )
}
export default Logs