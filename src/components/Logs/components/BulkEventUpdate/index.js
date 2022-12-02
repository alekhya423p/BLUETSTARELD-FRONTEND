import React, { useEffect, useState } from "react";
import { bulkEventUpdateByTechnician } from '../../../../actions/logAction';
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button } from 'react-bootstrap';
import { useForm } from "react-hook-form";
// import Loading from "../../../layout/Loading";
import { useParams } from "react-router-dom";
// import moment from "moment";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { getDriverLog} from '../../../../actions/logAction';
import {BULK_EVENT_UPDATE_RESET} from '../../../../constants/actionTypes'
import { VALIDATE_POSITIVE_NEGATIVE } from "../../../../constants/constants";

const BulkEventUpdate = (props) => {

	const transferLogsLength = props?.ids?.length;
	const params = useParams();
	const { isMode } = useSelector(state => state.dashboard)
	const dispatch = useDispatch();
	const { isComplete } = useSelector(state => state.logs)
	const [type, setType] = useState("hours");
	const [showForm, setShowForm] = useState("bulkEventForm");
	const [inputButton, setInputButton] = useState("Shift");
	const [inputData, setInputData] = useState("");
	const [shiftHours, setShiftHours] = useState("");
	const [shiftDays, setShiftDays] = useState("");

	const validationSchema = yup.object().shape({
		isHours: yup.boolean(), 
		isDays: yup.boolean(),
		shiftHours: yup.string().when('isHours', {
            is: true,
            then: yup.string().required('Please enter shift hours').matches(VALIDATE_POSITIVE_NEGATIVE, 'shiftHours should not contain decimal value'),
        }),
		shiftDays: yup.string().when('isDays', {
            is: true,
            then: yup.string().required('Please enter shift days').matches(VALIDATE_POSITIVE_NEGATIVE, 'shiftDays should not contain decimal value'),
        }),
	});

	const { register, handleSubmit, setValue, formState: { errors, ...formState } } = useForm({
		mode: "onBlur",
		resolver: yupResolver(validationSchema),
	});

	const { isValid } = formState
	const onSubmit = async (values, e) => {
		setShiftHours(values.shiftHours);
		setShiftDays(values.shiftDays);
		const data = {
			ids: props.ids,
			type: type,
			value: values.shiftDays ? values.shiftDays : values.shiftHours
		}
		dispatch(bulkEventUpdateByTechnician(data))
		setShowForm("processing")
		setInputData(data);
	};

	useEffect(() => {
		if(isComplete === true){
			setShowForm("complete");
		}else {
			setValue('isHours', true)
			setType('hours')
			// setShowForm("bulkEventForm");
			setValue("shiftHours", "");
			setValue("shiftDays", "");
			setInputButton("Shift")
		}
		// dispatch({type: BULK_EVENT_UPDATE_RESET})
	}, [isComplete, props, setValue]);

	const handleTypeChange = (type) => {
		
		if(type === 'hours') {
			setValue('isHours', true)
			setValue('isDays', false)
		}else if(type === 'days') {
			setValue('isDays', true); 
			setValue('isHours', false)}
		setType(type);
	}
	const handleShiftDays = (e) => {
		setInputButton("Shift ( "+ e.target.value + " days)");
	}
	const handleShiftHours = (e) => {
		setInputButton("Shift ( "+ e.target.value + " hours)");
	}
	// const handleFormSubmit = () => {
	// 	dispatch(bulkEventUpdateByTechnician(inputData))
	// }

	console.log(inputData)

	const handleClose = () => {
		setShowForm("bulkEventForm");		
		dispatch(getDriverLog(params.id,props.logDate))
		setValue("shiftHours", "");
		setValue("shiftDays", "");
		setInputButton("Shift")
		setType('hours')
		dispatch({type: BULK_EVENT_UPDATE_RESET})
		props.close();
	}

	return (
		props.open && (
			<Modal className={`edit_form_modal ${isMode}`} show={props.open} onHide={() =>handleClose()}>
				<Modal.Header>
					<Modal.Title id="contained-modal-title">{'Bulk Edit Event (System Adminstrator)'}</Modal.Title>
					<Button variant="outline-danger" onClick={props.close}><i className="ti ti-x"></i></Button>
				</Modal.Header>
				<Modal.Body>
					{showForm === "bulkEventForm" ?
						<form className="search-data add-driver" onSubmit={handleSubmit(onSubmit)}>
							<div className="">
								<p>Shift selected events in bulk either in days or hours. Negative number will shift forward</p>
							</div>
							<div className="col-sm-12 pt-3">
								<div className="row">
									<div className="col-sm-3">
										<label>Type</label>
									</div>
									<div className="col-sm-9">
										<input type='radio' name="type" value="hours" checked={type === "hours"} onChange={(e) => handleTypeChange(e.target.value)} /> Hours &nbsp; &nbsp; &nbsp;
										<input type='radio' name="type" value="days" checked={type === "days"} onChange={(e) => handleTypeChange(e.target.value)} /> Days
									</div>
								</div>
							</div>
							<div className='col-sm-12 pt-3'>
								{type === "days" ? 
								<div className='row'>
									<div className='col-sm-3'>
										<label>Shift in Days<span className="text-danger">*</span></label>
									</div>
									<div className='col-sm-9'>
										<input type='number' className="form-control" min="-12" max="12"  name='shiftDays' {...register('shiftDays')} placeholder="DD" onChange={(e) => handleShiftDays(e)} />
										{errors.shiftDays && (
											<div className="text-danger">{errors.shiftDays.message}</div>
										)}
									</div>
								</div> : 
								<div className='row'>
									<div className='col-sm-3'>
										<label>Shift in Hours<span className="text-danger">*</span></label>
									</div>
									<div className='col-sm-9'>
										<input type='number' className="form-control" name='shiftHours' min="-48" max="48" {...register('shiftHours')} placeholder="HH" onChange={(e) => handleShiftHours(e)} />
										{errors.shiftHours && (
											<div className="text-danger">{errors.shiftHours.message}</div>
										)}
									</div>
								</div>
								}

							</div>
							<div className="add_event_pehra">
								<p>Lucid ELD Inc, as your service provider, is not responsible for any financial or legal repercussions resulting from facilitating your request. It is the sole responsibility of the user to maintain legal compliance while using ELD.</p>
							</div>
							<div className="modal-footer">
								<button type="button" onClick={props.close} className="btn btn-secondary" data-dismiss="modal">Cancel</button>
								<button type="submit" disabled={isValid} className="btn d-block add-button">{inputButton}</button>
							</div>
						</form>
						: null}
					{showForm === "processing" ? 
					<div className="search-data add-driver">
					<div className="">
						<p>Your request is being processed. Please don’t close the page or submit new Bulk request.</p>
					</div>
					<div className="col-sm-12 pt-3">
						<div className="row">
							<ul className="process-bar-ul">
								<li className="process-bar-li">
									<ProgressBar now={20} />
								</li>
								<li className="process-bar-disacription">
									<p className="proces-bar-label">{transferLogsLength/2}/{transferLogsLength} Events</p>
								</li>
							</ul>
						</div>
					</div>
					<div className="process-bottom-pehra">
						<p><strong>Shifting {transferLogsLength} Events, {shiftHours ? shiftHours + ' hours'   : shiftDays + ' days' }</strong></p>
					</div>
					<div className="modal-footer">
						<button type="submit" className="btn d-block add-button" disabled>Processing...</button>
					</div>
				</div> : null }

				{ showForm === "complete" ?  <div className="search-data add-driver">
						<div className="">
							<p>Finished!</p>
						</div>
						<div className="col-sm-12 pt-3">
							<div className="row">
								<ul className="process-bar-ul">
									<li className="process-bar-li modal-bar">
										<ProgressBar variant="success" now={100} />
									</li>
									<li className="process-bar-disacription">
										<p className="proces-bar-label">{transferLogsLength}/{transferLogsLength} Events</p>
									</li>
								</ul>
							</div>
						</div>
						<div className="process-bottom-pehra">
							<p><strong>Shifted {transferLogsLength} Events, {shiftHours ? shiftHours + ' hours'   : shiftDays + ' days' }</strong></p>
						</div>
						<div className="modal-footer">
							<button type="submit" onClick={() => handleClose()} className="btn d-block add-button">Close</button>
						</div>
					</div> : null}
					
					
				</Modal.Body>
			</Modal>
		)
	);


}



export default BulkEventUpdate;
