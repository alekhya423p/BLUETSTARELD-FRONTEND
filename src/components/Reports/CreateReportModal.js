import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button } from 'react-bootstrap';
import * as yup from "yup";
import { createReport } from "../../actions/reportsAction";
import DateRangePicker from "react-bootstrap-daterangepicker";
import moment from "moment";
import { yupResolver } from '@hookform/resolvers/yup';
import Loading from "../layout/Loading";

const CreateReportModal = (props) => {

    const dispatch = useDispatch();
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
	const { loading } = useSelector(state => state.logs)
    const { isMode } = useSelector(state => state.dashboard)
	const validationSchema = yup.object().shape({
		vehicleId: yup.string().required('Vehicle Id is required'),
	});

	const { register, handleSubmit, reset, setValue, formState: { errors, ...formState } } = useForm({
		mode: "onBlur",
		resolver: yupResolver(validationSchema),
	}),
    [inputVehicle, setInputVehicle] = useState(""),
    [inputModalTitle, setInputModalTitle] = useState("");
    const [load, setLoad] = useState(false);
	const { isValid } = formState
    const range = {
        Today: [moment(), moment()],
        Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
        "Last 7 Days": [moment().subtract(6, "days"), moment()],
        "Last 30 Days": [moment().subtract(29, "days"), moment()],
        "This Month": [moment().startOf("month"), moment().endOf("month")],
        "Last Month": [ moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")],
        "Last Year": [moment().subtract(1, "year").startOf("year"), moment().subtract(1, "year").endOf("year")]
    };

    const handleDateEvent = (event, picker) => {
      
        // setFromDate(picker.startDate._d.toISOString());
        // setToDate(picker.endDate._d.toISOString());
        // setSearchDate(moment(picker.startDate._d).format('YYYY/MM/DD') + '-' + moment(picker.endDate._d).format('YYYY/MM/DD'));
    };
    
    const handleCallback = (start, end) => {
        setFromDate(start._d.toISOString());
        setToDate(end._d.toISOString());
        setStartDate(moment(start._d).format('YYYY-MM-DD'));
        setEndDate(moment(end._d).format('YYYY-MM-DD'));
    }

    const onSubmit = async (values, e) => {
        setLoad(true);
        const dataValue = {
            vehicleIds: [values.vehicleId],
            startDate: startDate,
            endDate: endDate
        }
        dispatch(createReport(dataValue))
        props.close();
    };

    useEffect(() => {
            setValue('vehicleId', '')
            setInputVehicle(" ");
            setInputModalTitle("IFTA Report");
            reset();
    }, [reset, setValue]);

    return (
        props.open && (
            <Modal show={props.open} onHide={props.close} className={isMode}>
                <Modal.Header>
                    <Modal.Title id="contained-modal-title">{inputModalTitle}</Modal.Title>
                    <Button variant="outline-danger" onClick={props.close}><i className="ti ti-x"></i></Button>
                </Modal.Header>
                <Modal.Body>
                    <form className="search-data add-driver" onSubmit={handleSubmit(onSubmit)}>
                            <div className='row'>
                                <div className='col-sm-12'>
                                    <label>Vehicle </label>
                                </div>
                            </div>
                            <div className="row">
                                <div className='col-sm-12'>
                                    <select className="form-select"  {...register('vehicleId')} defaultValue={inputVehicle} onChange={(e) => setInputVehicle(e)}>
                                        <option value={''}>Vehicle</option>
                                        {props?.vehicles?.vehicles && props?.vehicles?.vehicles.map((item, index) => (
                                            <option key={index} value={item.id}>{item.vehicleNumber}</option>
                                        ))}
                                    </select>
                                    {errors.vehicleId && (
                                        <div className="text-danger">{errors.vehicleId.message}</div>
                                    )}
                                </div>
                            </div><br/>
                            <div className="row">
                                <div className="col-sm-12">
                                    <label>Dates</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 ift_mod_date">
                                    <DateRangePicker
                                        ranges={range}
                                        onCallback={handleCallback}
                                        onEvent={handleDateEvent}
                                    >
                                        <button type="button" className="date_filter_style align-left"><i className="ti ti-calendar"></i> &nbsp;
                                            {moment(fromDate).format("MMM DD, YYYY")} to {moment(toDate).format("MMM DD, YYYY")}
                                        </button>
                                    </DateRangePicker>
                                </div>
                            </div>
                        <div className="modal-footer">
                            <button type="button" onClick={props.close} className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button disabled={(props.data.mode !== 'edit') && isValid} type="submit" className="btn btn-primary">{ (load && loading) ? <Loading /> : 'Run IFTA'}</button>
                        </div>
                    </form> 
                </Modal.Body>
            </Modal>
        )
    );
}

export default CreateReportModal;