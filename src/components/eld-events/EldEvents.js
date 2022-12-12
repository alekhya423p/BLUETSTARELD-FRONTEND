import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from '../layout/Header'
import Sidebar from '../layout/Sidebar'
import Loading from "../layout/Loading";
import DataTableEvents from "./DataTableVehicles";
import { loadVehicles } from "../../actions/eventAction";
// import DateRangePicker from "react-bootstrap-daterangepicker";
// import "bootstrap-daterangepicker/daterangepicker.css";
// import moment from "moment";


const EldEvents = () => {
    const dispatch = useDispatch()
    const [searchKey, setSearchKey] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    // const [searchDate, setSearchDate] = useState("");
    // const [fromDate, setFromDate] = useState(new Date());
    // const [toDate, setToDate] = useState(new Date());
    const { isMinimize, isMode } = useSelector(state => state.dashboard)
    const { user } = useSelector(state => state.auth)
    const { vehicles, count, totalRecord, loading } = useSelector(state => state.vehicles)
    const itemsPerPage = 20;
    const childRef = useRef();
    var userType = user && user.user && user.user.userType;

    // const range = {
    //     Today: [moment(), moment()],
    //     Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
    //     "Last 7 Days": [moment().subtract(6, "days"), moment()],
    //     "Last 30 Days": [moment().subtract(29, "days"), moment()],
    //     "This Month": [moment().startOf("month"), moment().endOf("month")],
    //     "Last Month": [moment().subtract(1, "month").startOf("month"),moment().subtract(1, "month").endOf("month")],
    //     "Last Year": [moment().subtract(1, "year").startOf("year"),moment().subtract(1, "year").endOf("year")]
    // };

    // const handleDateEvent = (event, picker) => {
    // };

    // const handleCallback = (start, end, label) => {
    //     setFromDate(start._d.toISOString());
    //     setToDate(end._d.toISOString());
    //     setSearchDate(moment(start._d).format('YYYY-MM-DD') + '/' + moment(end._d).format('YYYY-MM-DD'));
    // }

    useEffect(() => {
        dispatch(loadVehicles(currentPage, searchKey))

    },[dispatch, currentPage, searchKey])

    const clearFilter = (e) => {
        e.preventDefault();
        setSearchKey('');
        dispatch(loadVehicles(currentPage,searchKey));
    }

    const callSearch = (e) => {
        setSearchKey(e.target.value);
    }

    const pageHead = `ELD Events(${count ? count : 0})`

    return(
        <>
        <div id="layout-wrapper" className={isMode}>
            <Header pageHead={pageHead} />
            <Sidebar/>
            <div className={`main-content ${isMinimize === 'minimize' ? 'minimize-main' : ''}`}>
                <div className={userType === "company-administrator" ? "page-content company-admin" : "page-content"}>
                    <div className="container-fluid">
                         {/* start page title  */}
                         <div className="row">
                            <div className="col-12">
                                <div className="page-title-box">
                                    <div className="row">
                                        <div className="col-12 flex-grow-1">
                                            {/* <form className="search-data_n" onSubmit={submitHandler}> */}
                                                <div className="row">
                                                    <div className="col-sm-7">
                                                        <div className="row">
                                                            <div className="col col-sm-6 eld_event-record">
                                                                <div className="form-group app-search p-0 ">
                                                                    <label>&nbsp;</label>
                                                                    <div className="position-relative">
                                                                        <input type="text"defaultValue={searchKey}  className="form-control font-size-11" onBlur={callSearch}  placeholder="Search by Vehicle ID or ELD SN (MAC)" />
                                                                        <span className="ti ti-search"></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* <div className="col col-sm-6 eld_event-record">
                                                                <div className="form-group">
                                                                    <label>&nbsp;</label>
                                                                    <div>
                                                                        <DateRangePicker
                                                                            ranges={range}
                                                                            onCallback={handleCallback}
                                                                            onEvent={handleDateEvent}>
                                                                            <button className="date_filter_style"><i className="ti ti-calendar"></i>&nbsp; 
                                                                            {moment(fromDate).format("MMM DD, YYYY")} - {moment(toDate).format("MMM DD, YYYY")}
                                                                            </button>
                                                                        </DateRangePicker>           
                                                                    </div>
                                                                </div>
                                                            </div> */}
                                                            {/* <div className="col col-sm-2">
                                                                <div className="form-group">
                                                                    <label className="form-label">&nbsp;</label>
                                                                    <button type="submit" className="btn btn border border-color d-block wd_100 filter-button">Filter</button>
                                                                </div>
                                                            </div> */}
                                                            {/* <div className="col-sm-1">
                                                                
                                                            </div> */}
                                                        </div>                                                 
                                                    </div>
                                                    <div className="col-sm-5 refresh-btn-div">
                                                        <div className="d-inline-flex">
                                                        <div className="form-group">
                                                            <label className="form-label">&nbsp;</label>
                                                            <button type="button" className="btn btn border border-color d-block  mx-2" onClick={clearFilter}><i className="ti ti-refresh"></i></button>
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
                                { (loading) ?  <Loading />
                                    : <DataTableEvents count={count} currentPage={currentPage} setCurrentPage={setCurrentPage} totalRecord={totalRecord} data={vehicles} ref={childRef} itemsPerPage={itemsPerPage} mode='edit' />
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
        <div className={`modal fade ${isMode}`} id="transferDataModal" tabIndex="-1" role="dialog" aria-labelledby="transferModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="transferModalLabel">Transfer Data</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <label>Driver</label><br/>                        
                        <label>Dates</label>
                        <input placeholder="Select date" type="date" className="form-control" /> <br/>
                        <label>Data Transfer Type</label><br/>
                        <input type="radio" />&nbsp;Web Services&nbsp;
                        <input type="radio" />&nbsp;Email<br/>
                        <label>Comment</label><br/>
                        <textarea cols="55" rows="4" placeholder="Enter a comment..."></textarea>  
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button type="button" className="btn btn-primary">Transfer Data</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default EldEvents