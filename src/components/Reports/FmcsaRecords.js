import Header from '../layout/Header';
import Sidebar from '../layout/Sidebar';
import moment from "moment";
import  { useEffect, useState, useRef } from "react";
import Loading from "../layout/Loading";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import { useDispatch, useSelector } from 'react-redux';
import { getFmcsaRecords } from '../../actions/reportsAction';
import DataTableFmcsaRecords from './dataTables/DataTableFmcsaRecords';

const FmcsaRecords = () => {
    const dispatch = useDispatch();
    const { isMinimize, isMode } = useSelector(state => state.dashboard)
    const { user } = useSelector(state => state.auth)
    var userType = user && user.user && user.user.userType;
    const [searchKey, setSearchKey] = useState("");
    const childRef = useRef();
    const [searchDate, setSearchDate] = useState("");
    const {fmcsaRecords, count, loading} = useSelector(state => state.reports)
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const handleDateEvent = (event, picker) => {
    };

    const range = {
        Today: [moment(), moment()],
        Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
        "Last 7 Days": [moment().subtract(6, "days"), moment()],
        "Last 30 Days": [moment().subtract(29, "days"), moment()],
        "This Month": [moment().startOf("month"), moment().endOf("month")],
        "Last Month": [
          moment()
            .subtract(1, "month")
            .startOf("month"),
          moment()
            .subtract(1, "month")
            .endOf("month")
        ],
        "Last Year": [
          moment()
            .subtract(1, "year")
            .startOf("year"),
          moment()
            .subtract(1, "year")
            .endOf("year")
        ]
    };

    const handleCallback = (start, end, label) => {
        setFromDate(start._d.toISOString());
        setToDate(end._d.toISOString());
        setSearchDate(moment(start._d).format('YYYY-MM-DD') + '/' + moment(end._d).format('YYYY-MM-DD'));
        
    }

    useEffect(() => {
        dispatch(getFmcsaRecords(searchKey, searchDate));
    },[dispatch, searchKey, searchDate])

    const callSearch = (e) => {
        setSearchKey(e.target.value);
    }
    
    const pageHead =  `FMCSA Records(${count})`

    return (
        <>
        <div id="layout-wrapper" className={isMode}>
            <Header pageHead={pageHead} />
            <Sidebar />
            <div className={`main-content ${isMinimize === 'minimize' ? 'minimize-main' : ''}`}>
                <div className={userType === "company-administrator" ? "page-content company-admin" : "page-content"}>
                    <div className="container-fluid">
                        {/* start page title  */}
                         <div className="row">
                            <div className="col-12">
                                <div className="page-title-box">
                                    <div className="row">
                                        <div className="col-12 flex-grow-1">
                                            <div className='row'>
                                                <div className='col-sm-6'>
                                                    <div className='row'>
                                                        <div className='col col-md-6 col-sm-12 p-0 for_fmcs_record'>
                                                            <div className="form-group app-search p-0">
                                                                <label>&nbsp;</label>
                                                                <div className='position-relative'>
                                                                    <input type="text" className='form-control font-size-11' onBlur={callSearch} placeholder='Search by Driver or Vehicle ID' />
                                                                    <span className='ti ti-search'></span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col col-md-6 col-sm-12 for_fmcs_record">
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
                                    <DataTableFmcsaRecords itemsPerPage={20} ref={childRef} data={fmcsaRecords} mode='edit' count={count} />
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
export default FmcsaRecords;