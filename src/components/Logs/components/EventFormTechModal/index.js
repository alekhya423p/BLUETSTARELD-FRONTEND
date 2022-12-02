import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { storeEventByTechnician, eventUpdateByTechnician } from '../../../../actions/logAction';
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button } from 'react-bootstrap';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import Loading from "../../../layout/Loading";
import { useParams } from "react-router-dom";
import { checkCertifyStatus } from "../../utils";
import { getELDMaster } from "../../../../actions/eldDevicesAction";
import { getVehicleMaster } from "../../../../actions/vehicleAction";
import * as geolib from 'geolib';
import geoLocation from './csvjson.json'
import { distance, isoDateWithoutTimeZone } from './utils.js'
import _ from 'lodash'
import Select from 'react-select';
// import "react-datepicker/dist/react-datepicker.css";
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';
// import ReactDatePicker from "react-datepicker";
import { times } from "../../utils";
import moment from "moment-timezone";
import { VALIDATE_NUMBERS, VALIDATE_DECIMAL } from "../../../../constants/constants";
// import 'react-datetime-picker/dist/DateTimePicker.css'

const EventFormTechModal = (props) => {
	const params = useParams();
	const { tz } = times();
	const { loading } = useSelector(state => state.logs)
	// const { companyUsers } = useSelector(state => state.companyDetail)
	const { eventCodes } = useSelector(state => state.logs)
	const { masterVehicles } = useSelector(state => state.vehicles)
	const { masterElds } = useSelector(state => state.elddevice)
	const { isMode } = useSelector(state => state.dashboard)
	const modalType = props?.title?.split(' ', 2).join('').toLowerCase();
	const dispatch = useDispatch();
	const validationSchema = yup.object().shape({
		seqId: yup.string().required('Sequence id is required'),
		isCreate: yup.boolean(),
		startTime: yup.string().when('isCreate', { is: true, then: yup.string().required('Time is required') }),
		start_date: yup.string().when('isCreate', { is: false, then: yup.string().required('Time is required') }),
		driverStatus: yup.string().required('Status is required'),
		vehicleId: yup.string().required('Vehicle is required'),
		certifyDate: yup.string(),
		origin: yup.string().required('Origin is required'),
		state: yup.string().required('State is required'),
		odometer: yup.string().min(1, 'Odometer should be of minimum length 1').max(7, 'Odometer should be of maximun length 7').matches(VALIDATE_NUMBERS, 'Odometer should not contain decimal value'),
		engineHours: yup.string().min(3, 'Engine hours should be of minimum length 3').max(7, 'Engine hours should be of maximum length 7').matches(VALIDATE_DECIMAL, 'Engine hours should contain decimal at tenth place value'),
		eldId: yup.string(),
		locSource: yup.string().required('Location Source is required'),
		positioning: yup.string().required('Positioning is required'),
		isPositioning: yup.boolean(),
		lat: yup.string().when('isPositioning', { is: true, then: yup.string().required('Lat is required').nullable() }),
		lng: yup.string().when('isPositioning', { is: true, then: yup.string().required('Lng is required').nullable() }),
		locNote: yup.string().when('isPositioning', { is: false, then: yup.string().required('Location note is required').nullable() }),
		calcLoc: yup.string(),
		notes: yup.string()
	})
	const { register, handleSubmit, reset, setValue, formState: { errors, ...formState } } = useForm({
		mode: "onBlur",
		resolver: yupResolver(validationSchema),
	}),
		[inputLat, setInputLat] = useState(),
		[inputLng, setInputLng] = useState(),
		[eventNotes, setEventNotes] = useState(),
		[isCertifyVisible, setIsCertifyVisible] = useState(false),
		[isFrozenEvent, setIsFrozenEvent] = useState(false),
		[isAutomatic, setIsAutomatic] = useState(true),
		[inputELD, setInputELD] = useState(""),
		[isManual, setIsManual] = useState(true),
		[startDate, setStartDate] = useState(),
		[inputVechiles, setInputVechiles] = useState(""),
		[error, setErrors] = useState('');
	const [options, setOptions] = useState();
	const [allOptions, setAllOptions] = useState();
	const { isValid } = formState

	const onSubmit = async (values, e) => {
		values.driverId = params.id ? params.id : "";
		values.logId = props.logId ? props.logId : ""
		values.logDate = props.logDate ? props.logDate : ""
		// values.type = modalType
		var startDateISO;
		var startTime1 = new Date(props?.logDate?.concat(' ', values?.startTime));
		var convertDate = isoDateWithoutTimeZone(startTime1)
		// startDateISO = convertDate.substring(0,convertDate.length-1);
		if (modalType === 'addevent') startDateISO = convertDate.substring(0, convertDate.length - 1);
		else startDateISO = startDate;
		let splitDate = startDateISO.substring(0, startDateISO.length - 4);
		const currentTime = moment.tz(splitDate, tz).toISOString();
		values.start_date = currentTime;
		if (props.data) values.id = (props.data !== false) ? props.data.id : '';
		if (modalType !== 'editevent') {
			delete values.id
		}
		(props.data && modalType !== 'dublicateevent') ? dispatch(eventUpdateByTechnician(values)) : dispatch(storeEventByTechnician(values));
		props.close();
	};

	useEffect(() => {
		dispatch(getELDMaster());
		dispatch(getVehicleMaster())
	}, [dispatch])

	useEffect(() => {
		// console.log(props.data);
		if (props.data) {
			// console.log(props.data, 'data');
			if (checkCertifyStatus(props.data.status)) {
				setIsCertifyVisible(true);
				setValue('certifyDate', moment(props.data.certify_date).format('yyyy-MM-DD'))
			} else setIsCertifyVisible(false)
			if (modalType !== 'addevent') setValue('isCreate', false);
			if (modalType !== 'dublicateevent') setValue('seqId', props.data.sequenceId);
			if (modalType === 'frozenevent') setIsFrozenEvent(true)
			else setIsFrozenEvent(false);
			if (props.data.positioning === 'automatic') {
				setIsAutomatic(false)
				setIsManual(true)
				setValue('isPositioning', true)
			} else if (props.data.positioning === 'manual') {
				setIsManual(false)
				setIsAutomatic(true)
				setValue('isPositioning', false)
			} else {
				setIsAutomatic(true)
				setIsManual(true)
			}
			console.log(props.data.address, 'addresslocation', props.data.location);
			setInputVechiles({ value: props.data.vehicleId, label: props.data.vehicleNumber });
			setInputELD({ value: props.data.eldId, label: props.data.eld_address });
			setValue('vehicleId', props.data.vehicleId)
			setValue('driverStatus', props.data.status)
			setValue('origin', props.data.recordOrigin)
			setValue('state', props.data.record_status)
			setValue('odometer', props.data.odometr)
			setValue('engineHours', props.data.engine_hours)
			setValue('eldId', props.data.eldId)
			setValue('locSource', props.data.source)
			setValue('positioning', props.data.positioning)
			setValue('locNote', props.data.manualLocation)
			setValue('lat', props.data.coordinates.lat ? props.data.coordinates.lat : '')
			setValue('lng', props.data.coordinates.lng ? props.data.coordinates.lng : '')
			setValue('calcLoc', props.data.location)
			setValue('notes', props.data.notes)
			setEventNotes(props.data.notes);
			let convertTimeZone = moment.tz(props.data.start_date, tz).format('yyyy-MM-DDTHH:mm:ss.SSS');
			// let date = new Date(props.data.start_date).toISOString()
			// let convertDate = date.substring(0,date.length-1);
			setValue('start_date', convertTimeZone)
			setStartDate(convertTimeZone)
		} else {
			//console.log("within add");
			if (modalType === 'addevent') setValue('isCreate', true)
			setValue('seqId', '')
			setValue('origin', '')
			setValue('state', '')
			setValue('odometer', '')
			setValue('engineHours', '')
			setValue('eldId', '')
			setValue('locSource', '')
			setValue('positioning', '')
			setValue('locNote', '')
			setValue('lat', '')
			setValue('lng', '')
			setValue('startTime', '')
			setValue('vehicleId', '')
			setValue('driverStatus', '')
			setValue('calcLoc', '')
			setValue('notes', '')
			setEventNotes('');
			setInputVechiles({ value: '', label: '' });
			setInputELD({ value: '', label: '' });
		}
	}, [props, reset, setValue, modalType, tz]);
	useEffect(() => {
		if (inputLng && inputLat) {
			let geoLocationList = JSON.parse(JSON.stringify(geoLocation.geoLocationList));
			geoLocationList = _.map(geoLocationList, (location) => {
				location.distance = distance(inputLat, inputLng, location.Lat, location.Lon, 'M');
				return location;
			})
			let distanceList = _.map(geoLocationList, (list) => list.distance);
			let closetDistance = _.min(distanceList);
			let closetLocation = _.find(geoLocationList, { distance: closetDistance });
			if (distanceList && closetDistance && closetLocation) {
				let result = geolib.getCompassDirection(
					{ latitude: closetLocation.Lat, longitude: closetLocation.Lon },
					{ latitude: inputLat, longitude: inputLng }
				);
				if (result && closetLocation) {
					setValue('calcLoc', `${closetLocation.distance}mi ${result} from ${closetLocation.City}, ${closetLocation.State}`);
					setErrors('')
				} else {
					setValue('calcLoc', '');
					setErrors('Please Enter correct coordinate');
				}
			} else {
				setValue('calcLoc', '');
				setErrors('Please Enter correct coordinate');
			}
		}
	}, [inputLat, inputLng, setValue])

	const onChangeLat = (e) => {
		setInputLat(e.target.value);
	}
	const onChangeLng = (e) => {
		setInputLng(e.target.value);
	}
	const onChangeDriverStatus = (status) => {
		if (checkCertifyStatus(status) === status) setIsCertifyVisible(true);
		else setIsCertifyVisible(false);
	}
	const onChangePositioning = (value) => {
		if (value === 'automatic') {
			setIsAutomatic(false)
			setIsManual(true)
			setValue('isPositioning', true)
		} else if (value === 'manual') {
			setIsManual(false)
			setIsAutomatic(true)
			setValue('isPositioning', false)
		} else {
			setIsAutomatic(true)
			setIsManual(true)
		}
	}
	const onChangeStartDate = (date) => {
		// console.log(date, 'date');
		let convertDate = date.concat('', '.000')
		// console.log(convertDate, 'convertDate');
		setStartDate(convertDate)
	}

	useEffect(() => {
		if (masterVehicles.vehicles) {
			masterVehicles.vehicles.unshift({
				_id: '',
				vehicleNumber: 'No Vehicle',
				vin: '',
				id: ''
			});
			var options = masterVehicles?.vehicles.map((item, index) => (
				{ value: item.id, label: item.vehicleNumber }
			))
		}
		setOptions(options);
	}, [masterVehicles])

	const handleAssignVehicle = (e) => {
		setInputVechiles(e);
		setValue('vehicleId', e.value);
	}

	useEffect(() => {
		if (masterElds.elds) {
			masterElds.elds.unshift({
				id: '',
				serialNumber: 'No ELD',
				macAddress: ''
			});
			var allOptions = masterElds?.elds.map((item, index) => {
				return { value: item.id, label: item.serialNumber + (item.macAddress ? '(' + item.macAddress + ')' : '') }
			})
		}
		setAllOptions(allOptions);
	}, [masterElds])

	const handleAssignEld = (e) => {
		setInputELD(e);
		setValue('eldId', e.value);
	}
	const getSlectedText = (value) => {
        setEventNotes(value);
		setValue('notes', value)
	}

	// console.log(moment().format('YYYY-MM-DD H:mm'));

	return (
		props.open && (
			<Modal className={`add_event-modal ${isMode}`} show={props.open} onHide={props.close}>
				<Modal.Header>
					<Modal.Title id="contained-modal-title">{props.title}</Modal.Title>
					<Button variant="outline-danger" onClick={props.close}><i className="ti ti-x"></i></Button>
				</Modal.Header>
				<Modal.Body>
					<form className="search-data add-driver add_logss_event" onSubmit={handleSubmit(onSubmit)}>
						<div className='col-sm-6 left-select-box'>
							<div className='row'>
								<div className='col-sm-4'>
									<label>Event Id<span className="text-danger">*</span></label>
								</div>
								<div className='col-sm-8'>
									<input type="text" disabled={isFrozenEvent} placeholder="Sequance ID" className="form-control" name="seqId"  {...register('seqId')} required="" />
									{errors.seqId && (
										<div className="text-danger">{errors.seqId.message}</div>
									)}
								</div>
							</div>
							<div className='row'>
								<div className='col-sm-4'>
									<label>{modalType === 'addevent' ? 'Time' : 'Date & Time'}<span className="text-danger">*</span></label>
								</div>
								<div className='col-sm-8'>
									{modalType === 'addevent' ?
										<input disabled={isFrozenEvent} placeholder="Select Time" step="1" type="time" className="form-control" name="startTime" {...register('startTime')} required="" />
										:
										<input defaultValue={startDate}  {...register('start_date')} type="datetime-local" min="2022-02-20 10:00" max={moment().format('YYYY-MM-DD H:mm')}  id="start_date" step='any' onChange={(e) => onChangeStartDate(e.target.value)} name="start_date" className="form-control" />
									}
									{errors.start_date && (
										<div className="text-danger">{errors.start_date.message}</div>
									)}
									{errors.startTime && (
										<div className="text-danger">{errors.startTime.message}</div>
									)}
								</div>
							</div>
							<div className='row'>
								<div className='col-sm-4'>
									<label>Status<span className="text-danger">*</span></label>
								</div>
								<div className='col-sm-8'>
									<select className="form-select" disabled={isFrozenEvent}
										{...register('driverStatus')} name="driverStatus" onChange={(e) => onChangeDriverStatus(e.target.value)}>
										{eventCodes.map((e, key) => (
											<option key={key} value={e.id}>{e.value}</option>
										))}
									</select>
									{errors.driverStatus && (
										<div className="text-danger">{errors.driverStatus.message}</div>
									)}
								</div>
							</div>
							<div className='row' style={{ display: isCertifyVisible ? 'flex' : 'none' }}>
								<div className='col-sm-4'>
									<label>Date to Certify</label>
								</div>
								<div className='col-sm-8'>
									<input placeholder="Select Date" {...register('certifyDate')} disabled={isFrozenEvent} type="date" className="form-control" name="certifyDate" />
									{errors.certifyDate && (
										<div className="text-danger">{errors.certifyDate.message}</div>
									)}
								</div>
							</div>
							<div className='row'>
								<div className='col-sm-4'>
									<label>Origin<span className="text-danger">*</span></label>
								</div>
								<div className='col-sm-8'>
									<select className="form-select" {...register('origin')} disabled={isFrozenEvent}>
										<option value={''}>Choose Origin</option>
										<option value={'AUTO'}>Auto</option>
										<option value={'DRIVER'}>Driver</option>
										<option value={'OTHER_USER'}>Other User</option>
										<option value={'UNIDENTIFIED_DRIVER'}>Unidentified Driver</option>
									</select>
									{errors.origin && (
										<div className="text-danger">{errors.origin.message}</div>
									)}
								</div>
							</div>
							<div className='row'>
								<div className='col-sm-4'>
									<label>State<span className="text-danger">*</span></label>
								</div>
								<div className='col-sm-8'>
									<select className="form-select" {...register('state')} disabled={isFrozenEvent}>
										<option value={''}>None</option>
										<option value={'ACTIVE'}>Active</option>
										<option value={'INACTIVE_CHANGED'}>Inactive - Changed</option>
										<option value={'INACTIVE_CHANGE_REQUESTED'}>Inactive - Change Requested</option>
										<option value={'INACTIVE_CHANGE_REJECTED'}>Inactive - Change Rejected</option>
									</select>
									{errors.state && (
										<div className="text-danger">{errors.state.message}</div>
									)}
								</div>
							</div>
							<div className='row'>
								<div className='col-sm-4'>
									<label>Vehicle<span className="text-danger">*</span></label>
								</div>
								<div className='col-sm-8'>
									{/* <select className="form-select"  {...register('vehicleId')} disabled={isFrozenEvent}>
										<option value={''}>Select Vehicle</option>
										{masterVehicles.vehicles && masterVehicles.vehicles.map((item, index) => (
											<option key={index} value={item.id}>{item.vehicleNumber}</option>
										))}
									</select> */}
									<Select className="vehicle-handle" value={inputVechiles} onChange={(e) => handleAssignVehicle(e)} name="vehicleId" options={options} placeholder="Select Vehicle" />
									{errors.vehicleId && (
										<div className="text-danger">{errors.vehicleId.message}</div>
									)}
								</div>
							</div>
							<div className='row'>
								<div className='col-sm-4'>
									<label>Odometer(mi)</label>
								</div>
								<div className='col-sm-8'>
									<input step={'2'} type="text" disabled={isFrozenEvent} placeholder="Vehicle Odometer" className="form-control" name="odometer" {...register('odometer')} required="" />
									{errors.odometer && (
										<div className="text-danger">{errors.odometer.message}</div>
									)}
								</div>
							</div>
							<div className='row'>
								<div className='col-sm-4'>
									<label>Engine Hours</label>
								</div>
								<div className='col-sm-8'>
									<input type="text" step={'3'} disabled={isFrozenEvent} placeholder="Vehicle Engine Hours" className="form-control" name="engineHours" {...register('engineHours')} required="" />
									{errors.engineHours && (
										<div className="text-danger">{errors.engineHours.message}</div>
									)}
								</div>
							</div>
							<div className='row'>
								<div className='col-sm-4'>
									<label>ELD</label>
								</div>
								<div className='col-sm-8'>
									{/* <select className="form-select" {...register('eldId')} disabled={isFrozenEvent}>
										<option>No ELD</option>
										{elddevices && elddevices.map((item, index) => (
											<option key={index} value={item.id}>{item.serialNumber} ({item.macAddress})</option>
										))}
									</select> */}
									<Select className="vehicle-handle" value={inputELD}
										onChange={(e) => handleAssignEld(e)}
										options={allOptions} placeholder="Select ELD Device" name="eldId" />
									{errors.eldId && (
										<div className="text-danger">{errors.eldId.message}</div>
									)}
								</div>
							</div>
						</div>
						<div className='col-sm-6 right-select-box'>
							<div className='row'>
								<div className='col-sm-4'>
									<label>Location Source<span className="text-danger">*</span> </label>
								</div>
								<div className='col-sm-8 location_select'>
									<select className="form-select" {...register('locSource')} disabled={isFrozenEvent}>
										<option value={''}>Not Selected</option>
										<option value={'ELDConnected'}>Generateed when connected to ECM</option>
										<option value={'ELDDisconnected'}>Generateed when NOT connected to ECM</option>
									</select>
									{errors.locSource && (
										<div className="text-danger">{errors.locSource.message}</div>
									)}
								</div>
							</div>
							<div className='row'>
								<div className='col-sm-4'>
									<label>Positioning<span className="text-danger">*</span></label>
								</div>
								<div className='col-sm-8'>
									<select className="form-select" disabled={isFrozenEvent} {...register('positioning')} onClick={(e) => onChangePositioning(e.target.value)}>
										<option value={''}>Not Selected</option>
										<option value={'automatic'}>Automatic</option>
										<option value={'manual'}>Manual</option>
									</select>
									{errors.positioning && (
										<div className="text-danger">{errors.positioning.message}</div>
									)}
								</div>
							</div>
							<div className='row'>
								<div className='col-sm-4'>
									<label>Location Note</label>
								</div>
								<div className='col-sm-8'>
									<input type="text" disabled={isManual} className="form-control" placeholder="Location Note" name="locNote" {...register('locNote')} required="" />
									{errors.locNote && (
										<div className="text-danger">{errors.locNote.message}</div>
									)}
								</div>
							</div>
							<div className='row'>
								<div className='col-sm-4'>
									<label>Location Lat.</label>
								</div>
								<div className='col-sm-8'>
									<input type="text" disabled={isAutomatic} placeholder="Enter Location Latitude" {...register('lat')} onBlur={onChangeLat} defaultValue={inputLat} className="form-control" name="lat" required="" />
									{errors.lat && (
										<div className="text-danger">{errors.lat.message}</div>
									)}
								</div>
							</div>
							<div className='row'>
								<div className='col-sm-4'>
									<label>Location Lon.</label>
								</div>
								<div className='col-sm-8'>
									<input type="text" disabled={isAutomatic} placeholder="Enter Location Longitude" {...register('lng')} onBlur={onChangeLng} defaultValue={inputLng} className="form-control" name="lng" required="" />
									{errors.lng && (
										<div className="text-danger">{errors.lng.message}</div>
									)}
								</div>
							</div>
							<div className='row'>
								<div className='col-sm-4'>
									<label>Calc. Location</label>
								</div>
								<div className='col-sm-8'>
									<input type="text" readOnly placeholder="Enter Latitude & longitude above" className="form-control" name="calcLoc" {...register('calcLoc')} required="" />
									{errors.calcLoc && (
										<div className="text-danger">{errors.calcLoc.message}</div>
									)}
									{error && (
										<div className="text-danger">{error}</div>
									)}
								</div>
							</div>
							<div className='row'>
								<div className='col-sm-4'>
									<label>Notes</label>
								</div>
								<div className='col-sm-8'>
									<input type="text" defaultValue={eventNotes} disabled={isFrozenEvent} placeholder="Notes" className="form-control" name="notes" {...register('notes')} required="" />
									{errors.notes && (
										<div className="text-danger">{errors.notes.message}</div>
									)}
									
									<div className="event_points">
										<span className="cursor-pointer" onClick={() => getSlectedText('PTI')}>PTI</span>
										<span className="cursor-pointer" onClick={() => getSlectedText('Pick up')}>Pick up</span>
										<span className="cursor-pointer" onClick={() => getSlectedText('Delivery')}>Delivery</span>
										<span className="cursor-pointer" onClick={() => getSlectedText('Break')}>Break</span>
										<span className="cursor-pointer" onClick={() => getSlectedText('Fuel')}>Fuel</span>
										<span className="cursor-pointer" onClick={() => getSlectedText('Scale')}>Scale</span>
										<span className="cursor-pointer" onClick={() => getSlectedText('Dot Inspection')}>DOT Inspection</span>
										<span className="cursor-pointer" onClick={() => getSlectedText('Drop')}>Drop</span>
										<span className="cursor-pointer" onClick={() => getSlectedText('Hook')}>Hook</span>
										<span className="cursor-pointer" onClick={() => getSlectedText('Drop & Hook')}>Drop & Hook</span>
									</div>


								</div>
							</div>
						</div>
						<div className="add_event_pehra">
							<p>Lucid ELD Inc, as your service provider, is not responsible for any financial or legal repercussions resulting from facilitating your request. It is the sole responsibility of the user to maintain legal compliance while using ELD.</p>
						</div>
						<div className="modal-footer">
							{!isFrozenEvent ? <button disabled={(props.data.mode !== 'edit') && isValid} type="submit" className="btn d-block add-button">{loading ? <Loading /> : 'Submit'}</button> : null}
							<button type="button" onClick={props.close} className="btn btn-secondary" data-dismiss="modal">Close</button>
						</div>
					</form>
				</Modal.Body>
			</Modal>
		)
	);
}

export default EventFormTechModal;
