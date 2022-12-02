import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { downloadPdfRangeLogs } from "../../../../actions/logAction";
import { Modal, Button } from 'react-bootstrap';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import Loading from "../../../layout/Loading";
import moment from "moment";
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToPdfmake from 'html-to-pdfmake';

const LogPdfDownload = (props) => {

    const range = {
        Today: [moment(), moment()],
        Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
        "Last 7 Days": [moment().subtract(6, "days"), moment()],
        "Last 30 Days": [moment().subtract(29, "days"), moment()],
        "This Month": [moment().startOf("month"), moment().endOf("month")],
        "Last Month": [moment().subtract(1, "month").startOf("month"),moment().subtract(1, "month").endOf("month")],
        "Last Year": [moment().subtract(1, "year").startOf("year"),moment().subtract(1, "year").endOf("year")]
    };

	const dispatch = useDispatch();
	const { loading, pdfLogs } = useSelector(state => state.logs)
    const { isMode } = useSelector(state => state.dashboard)

	const validationSchema = yup.object().shape({
		driverId: yup.string().required('Driver is required'),
	})

	const { register, handleSubmit, reset, setValue, formState: { errors, ...formState } } = useForm({
		mode: "onBlur",
		resolver: yupResolver(validationSchema),
	}),
		[inputDriver, setInputDriver] = useState(""),
		[inputModalTitle, setInputModalTitle] = useState("");
		const [fromDate, setFromDate] = useState(new Date());
		const [toDate, setToDate] = useState(new Date());
        const [startDate, setStartDate] = useState();
		const [endDate, setEndDate] = useState();

	const { isValid } = formState

	const onSubmit = async (values, e) => {
		dispatch(downloadPdfRangeLogs(values.driverId, startDate, endDate));
        downloadPdf();
        props.close();
	};

    const downloadPdf = () => {
        if(pdfLogs?.html){
            const doc = new jsPDF();
            console.log(doc)
            var pdfContent =  pdfLogs?.html;

            //html to pdf format
            var html = htmlToPdfmake(pdfContent);      
            const documentDefinition = { content: html };
            pdfMake.vfs = pdfFonts.pdfMake.vfs;
            pdfMake.createPdf(documentDefinition).open();
        }
    };        
   
	const handleDateEvent = (event, picker) => {
    };

    const handleCallback = (start, end, label) => {
        setFromDate(start._d.toISOString());
        setToDate(end._d.toISOString());
        setStartDate(moment(start._d).format('YYYY-MM-DD'))  
        setEndDate(moment(end._d).format('YYYY-MM-DD'));
    }

	useEffect(() => {
		// console.log(props.data)
		if (props.data && props.mode === "edit") {
			// console.log("my props", props);
			// setValue('startTime', props.data.start)
			// setValue('vehicleId', props.data.vehicleId)
			// setInputDriver(props.data.start);
			// setInputModalTitle("Edit Event");
		} else {
			setValue('driverId', '')
			setInputDriver("");
			setInputModalTitle("Download Logs");
		}
	}, [props, reset, setValue]);

	return (
		props.open && (
            <Modal className={isMode} show={props.open} onHide={props.close}>
                <Modal.Header>
                    <Modal.Title id="contained-modal-title">{inputModalTitle}</Modal.Title>
                    <Button variant="outline-danger" onClick={props.close}><i className="ti ti-x"></i></Button>
                </Modal.Header>
                <Modal.Body>
                    <form className="search-data add-driver transfer_modal" onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body">
                            <div className='row'>
                                <div className='col-sm-12'>
                                    <label>Driver </label>
                                </div>
                            </div>
                            <div className="row">
                                <div className='col-sm-12'>
                                    <select className="form-select"  {...register('driverId')} defaultValue={inputDriver} onChange={(e) => setInputDriver(e)}>
                                        <option value={''}>Select Driver</option>
                                        	{props?.drivers && props?.drivers.map((item, index) => (
												<option key={index} value={item.id}>{item.firstName} {item.lastName}</option>
                                            ))}
                                    </select>
                                    {errors.driverId && (
                                        <div className="text-danger">{errors.driverId.message}</div>
                                    )}                                    
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <label>Dates</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 open-date">
                                    <DateRangePicker
                                    applyClass="open-calender-view"
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
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={props.close} className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button disabled={(props.mode !== 'edit') && isValid} type="submit" className="btn d-block add-button">{loading ? <Loading /> : 'Download Logs'}</button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        )
	);
}

export default LogPdfDownload;
