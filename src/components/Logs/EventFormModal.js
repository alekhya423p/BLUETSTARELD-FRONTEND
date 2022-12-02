import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { storeEvent, eventUpdate} from '../../actions/logAction';
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button } from 'react-bootstrap';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
// import db from "../../../src/data/db.json";
import Loading from "../layout/Loading";
import { useParams } from "react-router-dom";
import moment from "moment";
import { times } from "./utils";
import { isoDateWithoutTimeZone } from './components/EventFormTechModal/utils'

const EventFormModal = (props) => {
    const params = useParams();
	const { tz } = times();

	// console.log(moment(props.logDate).format('YYYY-MM-DD'), props.logDate);
	const { loading } = useSelector(state => state.logs)
	const { companyUsers } = useSelector(state => state.companyDetail)
	const { eventCodes } = useSelector(state => state.logs)
	const { masterVehicles } = useSelector(state => state.vehicles)
	const { isMode } = useSelector(state => state.dashboard)
	const { user } = useSelector(state => state.auth)
	const dispatch = useDispatch();
	// const [logDate, setLogDate] = useState();

	const validationSchema = yup.object().shape({
		startTime: yup.string().required('Time is required'),
		vehicleId: yup.string().required('Vehicle is required'),
		userId: yup.string().required('User is required'),
		driverStatus: yup.string().required('Status is required'),
		location: yup.string().required('Location is required'),
		notes: yup.string()
	})

	const { register, handleSubmit, reset, setValue, formState: { errors, ...formState } } = useForm({
		mode: "onBlur",
		resolver: yupResolver(validationSchema),
	}),
		[inputTime, setInputTime] = useState(""),
		[inputVechiles, setInputVechiles] = useState(""),
		[inputdriverstatus, setInputDriverStatus] = useState(""),
		[inputresponsibleUser, setInputResponsibleUser] = useState(""),
		[inputlocation, setInputLocation] = useState(""),
		[inputnotes, setInputNotes] = useState(""),
		[inputModalTitle, setInputModalTitle] = useState("");

	const { isValid } = formState
	const onSubmit = async (values, e) => {
		var startTime1= new Date(props?.logDate?.concat(' ',values?.startTime));
		var convertDate = isoDateWithoutTimeZone(startTime1)
		var startDateISO = convertDate.substring(0,convertDate.length-5)
		let convertTimeZone = moment.tz(startDateISO, tz).toISOString();
		const dataValue = {
			startTime: convertTimeZone,
			vehicleId: values.vehicleId,
			userId: values.userId,
			driverStatus: values.driverStatus,
			location: values.location,
			logDate: props.logDate,
			notes: values.notes,
			lat: "",
			lng: "",
			companyId: values.companyId,
			driverId: params.id ? params.id : "",
			logId: props.logId ? props.logId : ""
		}
		console.log(dataValue, 'dataValue');
		if (props.data) {
			dataValue.id = (props.data !== false) ? props.data.id : ''
		}
		(props.data) ? dispatch(eventUpdate(dataValue, params.logId)) : dispatch(storeEvent(dataValue));
		props.close();
	};

	useEffect(() => {
		if (props.data) {
			let convertTimeZone = moment.tz(props.data.start_date, tz).format('HH:mm:ss');
			setValue('startTime', convertTimeZone)
			setValue('vehicleId', props.data.vehicleId)
			setValue('userId', props.data.userId)
			setValue('driverStatus', props.data.status)
			setValue('location', props.data.address)
			setValue('notes', props.data.notes)
			setInputTime(convertTimeZone);
			setInputDriverStatus(props.data.status);
			setInputVechiles(props.data.vehicleId);
			setInputResponsibleUser(props.data.userId);
			setInputLocation(props.data.address);
			setInputNotes(props.data.notes);
			setInputModalTitle("Edit Event");
		} else {
			//console.log("within add");
			setValue('startTime', '')
			setValue('vehicleId', '')
			setValue('userId', '')
			setValue('driverStatus', '')
			setValue('location', '')
			setValue('notes', '')
			setInputTime("");
			setInputDriverStatus("");
			setInputVechiles("");
			setInputResponsibleUser("");
			setInputLocation("");
			setInputNotes("");
			setInputModalTitle("Add Event");
		}
	}, [props, reset, setValue, tz]);

	return (
		props.open && (
			<Modal className={isMode} show={props.open} onHide={props.close}>
				<Modal.Header>
					<Modal.Title id="contained-modal-title">{inputModalTitle}</Modal.Title>
					<Button variant="outline-danger" onClick={props.close}><i className="ti ti-x"></i></Button>
				</Modal.Header>
				<Modal.Body>
					<form className="search-data add-driver" onSubmit={handleSubmit(onSubmit)}>
						<div className='col-sm-12'>
							<div className='row'>
								<div className='col-sm-3'>
									<label>Time <span className="text-danger">*</span></label>
								</div>
								<div className='col-sm-9'>
									{/* <input id="appt-time" type="time" className="form-control" name="appt-time" step="2" /> */}
									<input placeholder="Select Time"  step="1"  type="time" className="form-control" name="startTime" defaultValue={inputTime} onChange={(e) => setInputTime(e.target.value)} {...register('startTime')} required="" />
									{errors.startTime && (
										<div className="text-danger">{errors.startTime.message}</div>
									)}
									<input type="hidden" className="form-control"  {...register('driverId')} defaultValue={params.id ? params.id : ""} required="" />

									<input type="hidden" className="form-control" {...register('companyId')} defaultValue={user.companyId} required="" />

								</div>
							</div>
						</div>
						<div className='col-sm-12 pt-3'>
							<div className='row'>
								<div className='col-sm-3'>
									<label>Status<span className="text-danger">*</span></label>
								</div>
								<div className='col-sm-9'>
									<select className="form-select" 
									onChange={(e) => setInputDriverStatus(e.target.value)}
									{...register('driverStatus')} defaultValue={inputdriverstatus} name="driverStatus">
										{eventCodes.map((e, key) => (
											<option key={key} value={e.id}>{e.value}</option>
										))}
									</select>
									{errors.driverStatus && (
										<div className="text-danger">{errors.driverStatus.message}</div>
									)}
								</div>
							</div>
						</div>
						<div className='col-sm-12 pt-3'>
							<div className='row'>
								<div className='col-sm-3'>
									<label>Vehicle<span className="text-danger">*</span></label>
								</div>
								<div className='col-sm-9'>
									<select className="form-select"
										defaultValue={inputVechiles}
										onChange={(e) => setInputVechiles(e.target.value)}
										{...register('vehicleId')}
										name="vehicleId">
										<option value={''}>No Vehicle</option>
										{masterVehicles.vehicles && masterVehicles.vehicles.map((item, index) => (
											<option key={index} value={item.id}>{item.vehicleNumber}</option>
										))}
									</select>
									{errors.vehicleId && (
										<div className="text-danger">{errors.vehicleId.message}</div>
									)}
								</div>
							</div>
						</div>
						<div className='col-sm-12 pt-3'>
							<div className='row'>
								<div className='col-sm-3'>
									<label>Responsible User<span className="text-danger">*</span></label>
								</div>
								<div className='col-sm-9'>
									<select className="form-select" 
									onChange={(e) => setInputResponsibleUser(e.target.value)}
									{...register('userId')} defaultValue={inputresponsibleUser} 
									name="userId">
										<option value={''}>Select User</option>
										{companyUsers.map((item, index) => (
											<option key={index} value={item.id}>{item.name }</option>
										))}
									</select>
									{errors.userId && (
										<div className="text-danger">{errors.userId.message}</div>
									)}
								</div>
							</div>
						</div>
						<div className='col-sm-12 pt-3'>
							<div className='row'>
								<div className='col-sm-3'>
									<label>Location<span className="text-danger">*</span></label>
								</div>
								<div className='col-sm-9'>
									<input type="text" className="form-control" name="location" defaultValue={inputlocation} onChange={(e) => setInputLocation(e.target.value)} {...register('location')} required="" />
									{errors.location && (
										<div className="text-danger">{errors.location.message}</div>
									)}
								</div>
							</div>
						</div>
						<div className='col-sm-12 pt-3'>
							<div className='row'>
								<div className='col-sm-3'>
									<label>Notes</label>
								</div>
								<div className='col-sm-9'>
									<input type="text" className="form-control" name="notes" defaultValue={inputnotes} onChange={(e) => setInputNotes(e.target.value)} {...register('notes')} required="" />
									{errors.notes && (
										<div className="text-danger">{errors.notes.message}</div>
									)}
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" onClick={props.close} className="btn btn-secondary" data-dismiss="modal">Cancel</button>
							<button  disabled={(props.data.mode !== 'edit') && isValid} type="submit" className="btn d-block add-button">{loading ? <Loading /> : 'Submit'}</button>
						</div>
					</form>
				</Modal.Body>
			</Modal>
		)
	);
}

export default EventFormModal;
