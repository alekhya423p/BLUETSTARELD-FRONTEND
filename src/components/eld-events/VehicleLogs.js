import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from '../layout/Header'
import Sidebar from '../layout/Sidebar'
import Loading from "../layout/Loading";
import { useParams } from 'react-router-dom';
import { loadUnidentifiedVehicle } from "../../actions/logAction";
import { removeBulkEvent } from "../../actions/eventAction";
import DataTableVehicleLogs from "./DataTableVehicleLogs"
// import * as actionTypes from '../../constants/actionTypes';
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import { getDriverMaster } from "../../actions/driverAction"
import AssignDriverModal from "./AssignDriverModal";

const VehicleLogs = () => {
    const dispatch = useDispatch()
    const params = useParams();
    const [searchDate, setSearchDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const { vehicleEvents, count, totalRecord, loading } = useSelector(state => state.logs)
    const { isMinimize, isMode } = useSelector(state => state.dashboard)
    const { masterDrivers } = useSelector(state => state.drivers)
    const itemsPerPage = 20;

    const childRef = useRef();
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

    const handleDateEvent = (event, picker) => {
    };

    const handleCallback = (start, end, label) => {
        setFromDate(start._d.toISOString());
        setToDate(end._d.toISOString());
        setSearchDate(moment(start._d).format('YYYY-MM-DD') + '/' + moment(end._d).format('YYYY-MM-DD'));
    }

    useEffect(() => {
        dispatch(getDriverMaster())
        if (params.vehicleId) {
            dispatch(loadUnidentifiedVehicle(params?.vehicleId, currentPage, searchDate))
        } else {
            // dispatch({ type: actionTypes.CLEAR_ELD_EVENTS })
        }
    }, [params, dispatch, currentPage, searchDate])

    const [showAddAdminModal, setAddAdminModal] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(false);
    const [inputActionIds, setActionIds] = useState(null);

    const handleAddAdminClose = () => {
        setAddAdminModal(false);
        setSelectedRowData(false);
    };

    const handleAddAdminShow = () => {
        setAddAdminModal(true);
        setSelectedRowData(inputActionIds);
    };

    const selectedData = (data) => {
        setSelectedRowData([data]);
        setAddAdminModal(true);
    };

    const clearFilter = (e) => {
        e.preventDefault();
        let searchDate = '';
        dispatch(loadUnidentifiedVehicle(params?.vehicleId, currentPage, searchDate));
    }
	const findRows = (rows) => {
		setActionIds(rows);
		// console.log("checked rows", inputActionIds);
	};
    const handleBulkDelete = () => {
        dispatch(removeBulkEvent())
    };
    const pageHead = `ELD Events/${params?.vehicleNo}`
    return (
        <>
            <div id="layout-wrapper" className={isMode}>
                <Header pageHead={pageHead} />
                <Sidebar />
                <div className={`main-content ${isMinimize === 'minimize' ? 'minimize-main' : ''}`}>
                    <div className="page-content">
                        <div className="container-fluid">
                            {/* start page title  */}
                            <div className="row">
                                <div className="col-12">
                                    <div className="page-title-box">
                                        <div className="row">
                                            <div className="col-7 col-sm-12 col-xm-12 flex-grow-1">
                                                {/* <form className="search-data_n" onSubmit={submitHandler}> */}
                                                <div className="row">
                                                    <div className="col col-sm-3">
                                                        <div className="form-group">
                                                            <label>&nbsp;</label>
                                                            <div>
                                                                <DateRangePicker
                                                                    ranges={range}
                                                                    onCallback={handleCallback}
                                                                    onEvent={handleDateEvent}>
                                                                    <button className="date_filter_style for-side-bar"><i className="ti ti-calendar"></i>&nbsp;
                                                                        {moment(fromDate).format("MMM DD, YYYY")} - {moment(toDate).format("MMM DD, YYYY")}
                                                                    </button>
                                                                </DateRangePicker>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col col-sm-4 vechile-id-logs">
                                                    <label>&nbsp;</label>
                                                        <p>Vechile ID: <strong>{params?.vehicleNo}</strong></p>
                                                        <p>Vin: <strong>{params?.vin}</strong></p>
                                                    </div>
                                                    <div className="col-5 col-sm-5 col-xm-12 refresh-btn-div add-event-all">
                                                        <div className="row">
                                                            <div className="col-sm-12">
                                                                <div className="form-group">
                                                                    <label className="form-label">&nbsp;</label>
                                                                    <button type="button" className="btn btn border border-color d-block  filter-button" onClick={() => handleAddAdminShow()} disabled={(inputActionIds === null)}><i className="ti ti-user-plus"></i>&nbsp; Bulk Assign Events</button>
                                                                </div>
                                                                <div className="form-group">
                                                                    <label className="form-label">&nbsp;</label>
                                                                    <button type="button" className="btn btn-outline-danger text-danger" onClick={() => handleBulkDelete()} disabled={(inputActionIds === null)}><i className="ti ti-trash" aria-hidden="true"></i>&nbsp; Bulk Remove Events</button>
                                                                </div>
                                                                <div className="form-group">
                                                                    <label className="form-label">&nbsp;</label>
                                                                    <button type="button" className="btn btn border border-color d-block  mx-2" onClick={clearFilter}><i className="ti ti-refresh"></i></button>
                                                                </div>

                                                                {/* <div className="custom-checkbox custom-control inner-check"><button onClick={() => props.openModal(inputCheckedIds)} className="btn custom-btn-outline-info"><i className="ti ti-user"></i></button><input type="checkbox" className="custom-control-input table_checkbox" id={index} key={index} name={item.id} onChange={(e) => handleChange(e)} value={item.id} /><label htmlFor={index} className="custom-control-label"></label></div> */}
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
                                        { (loading && !vehicleEvents) ?
                                            <Loading /> :
                                            <DataTableVehicleLogs 
                                                count={count} 
                                                currentPage={currentPage} 
                                                totalRecord={totalRecord} 
                                                setCurrentPage={setCurrentPage} 
                                                openModal={selectedData} 
                                                data={vehicleEvents} 
                                                ref={childRef} 
                                                change={findRows}
                                                itemsPerPage={itemsPerPage} mode='edit' />
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

            {/* <!--Add Event Modal --> */}
            <AssignDriverModal
                open={showAddAdminModal}
                close={handleAddAdminClose}
                data={selectedRowData}
                drivers={masterDrivers}
                vehicle={params?.vehicleId}
            />
        </>
    )
}

export default VehicleLogs