import React, { useState, useEffect } from "react";
import { Modal, Button } from 'react-bootstrap';
import DateRangePicker from "react-bootstrap-daterangepicker";
import moment from "moment";
import { useSelector } from "react-redux";
import Loading from "../../../layout/Loading";

const LocationShareModal = (props) => {

	const { loading } = useSelector(state => state.logs)
    const [inputModalTitle, setInputModalTitle] = useState("");
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    // const [startDate, setStartDate] = useState("");
    // const [endDate, setEndDate] = useState("");

    const range = {
        Today: [moment(), moment()],
        Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
        "Last 7 Days": [moment().subtract(6, "days"), moment()],
        "Last 30 Days": [moment().subtract(29, "days"), moment()],
        "This Month": [moment().startOf("month"), moment().endOf("month")],
        "Last Month": [ moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")],
        "Last Year": [moment().subtract(1, "year").startOf("year"),moment().subtract(1, "year").endOf("year")]
    };
    const handleDateEvent = (event, picker) => {
        // console.log("start: ", picker.startDate._d);
        // console.log("end: ", picker.endDate._d);
        // setFromDate(picker.startDate._d.toISOString());
        // setToDate(picker.endDate._d.toISOString());
        // setSearchDate(moment(picker.startDate._d).format('YYYY/MM/DD') + '-' + moment(picker.endDate._d).format('YYYY/MM/DD'));
    };
    
    const handleCallback = (start, end) => {
        setFromDate(start._d.toISOString());
        setToDate(end._d.toISOString());
        // setStartDate(moment(start._d).format('YYYY-MM-DD'));
        // setEndDate(moment(end._d).format('YYYY-MM-DD'));
    }

    useEffect(() => {
        setInputModalTitle("Create Live Share Link");
    },[setInputModalTitle]);

    return (
        props.open && (
            <Modal show={props.open} onHide={props.close} className="create-live-modal">
                <Modal.Header>
                    <Modal.Title id="contained-modal-title">{inputModalTitle}</Modal.Title>
                    <Button variant="outline-danger" onClick={props.close}><i className="fa fa-close"></i></Button>
                </Modal.Header>
                <Modal.Body>
                    <form className="search-data add-driver create-live-share">
                        <div className="modal-body">
                            <label>Expiration Date</label>
                            <DateRangePicker
                                ranges={range}
                                onCallback={handleCallback}
                                onEvent={handleDateEvent}
                            >
                                <button type="button" className="date_filter_style align-left"><i className="ri-calendar-event-line"></i> &nbsp;
                                    {moment(fromDate).format("LL")} to {moment(toDate).format("LL")}
                                </button>
                            </DateRangePicker>
                            <div className="toggle-create-live">
                                <p>Drive Phone Number
                                    <label className="switch">
                                        <input type="checkbox" />
                                        <span className="slider round"></span>
                                    </label>
                                </p>

                                <p>Driver Trailer and Shipping Documents
                                    <label className="switch">
                                        <input type="checkbox" />
                                        <span className="slider round"></span>
                                    </label>
                                </p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button disabled={(props.data.mode !== 'edit')} type="submit" className="btn btn-primary">{loading ? <Loading /> : 'Create Live Share Link'}</button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        )
    )
}

export default LocationShareModal;