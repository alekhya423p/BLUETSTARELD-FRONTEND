import React, { useState, useEffect } from "react"
import Header from "../layout/Header"
import Sidebar from "../layout/Sidebar"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { saveELDDevice, loadELDDevice, eldDeviceUpdate, eldDeviceDeactivate, eldDeviceRemove } from "../../actions/eldDevicesAction"
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import * as actionTypes from '../../constants/actionTypes'; 
import Loading from "../layout/Loading";
import { getVehicleMaster } from "../../actions/vehicleAction";
import { ALPHABATES_NUMERIC, VALIDATE_MAC_ADDRESS } from "../../constants/constants";
import Select from 'react-select';
import { formatMacAddress } from "../../functions/functions";

const ELDForm = () => {

	const navigate = useNavigate()
	const dispatch = useDispatch();
	const params = useParams();
	const { device, loading } = useSelector(state => state.elddevice)
	const { user } = useSelector(state => state.auth)
	const { masterVehicles } = useSelector(state => state.vehicles)
	const { isMinimize, isMode } = useSelector(state => state.dashboard)

	const validationSchema = yup.object().shape({
		// companyId: yup.string().required('Company Id is required'),
		macAddress: yup.string().required('Mac Address is required').test('macAddress', 'Mac address is required', (value) => value?.trim).matches(VALIDATE_MAC_ADDRESS, "Must specify in mac address format"),
		serialNumber: yup.string().required('Serial Number is required').matches(ALPHABATES_NUMERIC, "Only alphanumeric values are allowed for serial number").min(6, 'Serial Number should be greater than 6').max(12, 'Serial Number should be less than 12').test('serialNumber', 'Serial Number is required', (value) => value?.trim),
		eldModel: yup.string().required('Eld Model is required').test('eldModel', "Eld Model is required", (value) => value?.trim)
		// vehicleId: yup.string().required('Vehicle is required'),
	});

	const { register, handleSubmit, reset, setValue, formState: { errors, ...formState } } = useForm({
		mode: "onBlur",
		resolver: yupResolver(validationSchema),
	}),

	[inputMacAddress, setInputMacAddress] = useState(""),
	[inputSerialNumber, setInputSerialNumber] = useState(""),
	[inputeldModel, setInputEldModel] = useState(""),
	[inputVechiles, setInputVechiles] = useState(""),
	[inputAdminTitle, setInputELDDeviceTitle] = useState(""),
	// [load, setLoad] = useState(false),
	[loader, setLoader] = useState(false), 
	[editLoader, setEditLoader] = useState(false),
	// [isActive, setIsActive] = useState(true),
	
	[inputEdit, setInputEdit] = useState("");
	const [inputIsDisabled, setInputIsDisabled] = useState(false)
	const [options, setOptions] = useState()
	const { isValid } = formState
	const onSubmit = async (values, e) => {
		if (inputEdit === 'edit') {
			values.id = (device.id !== false) ? device.id : ''
		}
		(inputEdit && inputEdit === "edit") ? dispatch(eldDeviceUpdate(values, navigate)) : dispatch(saveELDDevice(values, navigate));

		setEditLoader(true);
		// setLoad(true);
	};

	useEffect(() => {
		dispatch(getVehicleMaster())
		if (params.id) {
			setInputEdit('edit')
			dispatch(loadELDDevice(params?.id))
		}else{
			dispatch({ type: actionTypes.UPDATE_ELD_DEVICES_RESET })
		}
    },[params, dispatch])

	useEffect(() => {
		if (Object.keys(device).length !== 0) {
			setInputVechiles({ value: device.vehicleId, label: device.vehicleNumber === "" ? "No Vehicle" : device.vehicleNumber });
			setValue('macAddress', device.macAddress)
			setValue('serialNumber', device.serialNumber)
			setValue('eldModel', device.eldModel)
			setValue('vehicleId', device.vehicleId)
			setValue('companyId', device.companyId)
			setInputMacAddress(device.macAddress);
			setInputSerialNumber(device.serialNumber);
			setInputELDDeviceTitle("Edit");
			setInputIsDisabled(true)
			// setIsActive(device.active)
			setInputEdit("edit");
		} else {
			setValue('macAddress', '')
			setValue('serialNumber', '')
			setValue('eldModel', '')
			setValue('vehicleId', '')
			setValue('companyId', user.companyId)
			setInputMacAddress("");
			setInputSerialNumber("");
			// setInputVehicleId("");
			setInputIsDisabled(false)
			setInputEdit("add");
			setInputELDDeviceTitle("Add");
		}
	},[reset, setValue, device, user, inputEdit]);

	const handleDeactivate = (data) => {
		setLoader(true);
		const payload = {
			id: data.id,
			status: data.active === true ? 'inactive' : 'active'
		}
		dispatch(eldDeviceDeactivate(payload, navigate));
	}

	const handleRemove = (data) => {
		setLoader(true);
		const payload = {
			id: data.id,
		}
		dispatch(eldDeviceRemove(payload, navigate));
	}


	const pageHead =  inputAdminTitle + ' ELD Devices'
	useEffect(() => {
		if(masterVehicles.vehicles) {
			masterVehicles.vehicles.unshift({
				_id: '',
				vehicleNumber: 'No Vehicle',
				vin: '',
				id: ''
			});
			var options = masterVehicles?.vehicles.map((item, index) => {
				return { value: item.id, label: item.vehicleNumber }
			})
		}
		setOptions(options);
	}, [masterVehicles])

	const handleAssignVehicle = (e) => {
		setInputVechiles(e);
		setValue('vehicleId', e.value);
	}

	const handleInput = (e) => {
		// console.log(e.target.value);
		const formattedMacAddress = formatMacAddress(e);
		setInputMacAddress(formattedMacAddress)
	}

	return (
		<>
		<div id="layout-wrapper" className={isMode}>
			<Header pageHead={pageHead}/>
			<Sidebar/>
			<div className={`main-content ${isMinimize === 'minimize' ? 'minimize-main' : ''}`}>
				<div className="page-content" style={{background:'#eff3f6'}}>
					<div className="container-fluid">
						<div className="row loader_class">
							{ loading ? <Loading /> :
								<div className="col-9 mt-3 mx-auto">
								<div className="page-title-box">
									<form className="search-data add-driver eld-create-drive" onSubmit={handleSubmit(onSubmit)}>
										{/* <input type="hidden" value={values.companyId} name="companyId"/> */}
										{/* <input type="hidden" value={values.id} name="id"/> */}
										<div className="row">
											<div className="col-4">
												<div className="row">
													<h3 className="text-capitalize"><strong>  ELD Device Info</strong></h3>
												</div>
											</div>		
											<div className="col-8 ps-4 ">
												<div className="create-driver-btns">								
													<div className="col-sm-2 btn-style-right">
														<div className="form-group">
															<Link to="/settings/elds" className="btn cancel-btn btn border border-color d-block  bg-white w-100 new-f-size">Cancel</Link>
														</div>
													</div>
													{inputEdit === 'edit' ? 
													<div className="col-sm-3 btn-style-right pr-20">
														<div className="form-group">
															<button type="button" onClick={() => handleDeactivate(device)} className={device.active === true ? 'btn w-100 btn-outline-danger text-danger bg-white border-radius-8' : 'btn w-100 btn-outline-success text-success bg-white border-radius-8'}>{(loader&& loading) ? <Loading/> :  device.active === true ? 'Deactivate' : 'Activate' }</button>
														</div>
													</div> : ''}

													{inputEdit === 'edit' ? 
													<div className="col-sm-3 btn-style-right pr-20">
														<div className="form-group">
															<button type="button" onClick={() => handleRemove(device)} className={device.active === true ? 'btn w-100 btn-outline-danger text-danger bg-white border-radius-8' : 'btn w-100 btn-outline-success text-success bg-white border-radius-8'}>{(loader&& loading) ? <Loading/> : 'Remove' }</button>
														</div>
													</div> : ''}

													<div className="col-sm-4 btn-style-right">
														<div className="form-group">
															<button disabled={isValid} type="submit" className="btn d-block add-button w-100 new-f-size">
																{ inputAdminTitle === 'Add' ? <i className="ti ti-plus font-size-17 vertical-align-top"></i> : ''}  { (editLoader&& loading)? <Loading /> : inputAdminTitle === 'Add' ?  inputAdminTitle + ' ELD Device' : 'Save Changes'}</button>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div className="row mt-4">
											<div className="col-md-12">
												<div className="card">
													<div className="card-body">
														<div className="row">
															<div className="col-md-12 mb-4">
																<div className="mb-0">
																	<label  className="form-label">ELD SN (Serial Number) <span className="text-danger">*</span> </label>
																	<input type="text" disabled={inputSerialNumber ? inputIsDisabled : ''}
																		{...register('serialNumber')}
																		defaultValue={inputSerialNumber}
																		onChange={(e) => setInputSerialNumber(e.target.value)}
																		className="form-control"
																		placeholder=""
																	/>
																</div>
																<span className="form-label">Please make sure ELD SN was entered correctly. Once the eld record is created it cannot be changed.</span>
																{errors.serialNumber && (
																	<div className="text-danger">{errors.serialNumber.message}</div>
																)}
															</div>
														</div>
														<div className="row">
															<div className="col-md-12 mb-4 ">
																<div className="mb-0">
																	<label  className="form-label">ELD MAC Address <span className="text-danger">*</span> </label>
																	<input type="text" disabled={inputMacAddress ? inputIsDisabled : ''}
																	{...register('macAddress')}  
																	defaultValue={inputMacAddress}
																	onChange={(e) => handleInput(e)} 
																	id="input-mask" 
																	placeholder="_:__:__:__:__" 
																	className="form-control input-mask" 
																	required />
																</div>
																<span className="form-label mb-4">Please make sure ELD MAC Address was entered correctly. Once the eld record is created it cannot be changed.</span>
																{errors.macAddress && (
																	<div className="text-danger">{errors.macAddress.message}</div>
																)}
															</div>
														</div>
														<div className="row">
															<div className="col-md-12 mb-4 ">
																<div className="mb-0">
																	<label  className="form-label">ELD Model <span className="text-danger">*</span> </label>
																	<select className="form-control form-select"  
																		{...register('eldModel')} disabled={inputIsDisabled} onChange={(e) => setInputEldModel(e.target.value)}  defaultValue={inputeldModel}
																		name="eldModel">
																		<option value="PT30-T">PT30-T</option>
																		<option value="PT30-U">PT30-U</option>
																	</select>
																	{/* <input type="text" 
																	{...register('eldModel')}  
																	defaultValue={inputeldModel}
																	onChange={(e) => setInputEldModel(e.target.value)} 
																	id="input-mask" 
																	placeholder="" 
																	className="form-control input-mask" 
																	/> */}
																</div>
																<span className="form-label mb-4">Please make sure ELD Model was entered correctly. Once the eld record is created it cannot be changed.</span>
																{errors.eldModel && (
																	<div className="text-danger">{errors.eldModel.message}</div>
																)}
															</div>
														</div>
														<div className="row">
															<div className="col-md-12 mb-4">
																<div className="mb-0">
																	<label  className="form-label">Assign Vehicle </label>
																	<Select value={inputVechiles} onChange={(e) => handleAssignVehicle(e)} name="vehicleId" options={options} placeholder="Select Vehicle" />
																	
																	{/* <select className="form-control select2" 
																	{...register('vehicleId')}
																	defaultValue={inputVechiles}
																	onChange={(e) => setInputVechiles(e)} name="vehicleId">
																	<option value={''}>Select Vehicle</option>                   
																	{masterVehicles.vehicles && masterVehicles.vehicles.map((item, index) => (
																		<option key={index} value={item.id}>{item.vehicleNumber}</option>
																	))}
																</select> */}
																	{errors.vehicleId && (
																		<div className="text-danger">{errors.vehicleId.message}</div>
																	)}
																</div>
																<span className="form-label mb-4">Mobile app will automatically connect to eld device during login process.</span>
															</div>
														</div>
														<div>
															<h4 className="text-capitalize"><strong>  ELD Device Firmware Update</strong></h4>
															<div className="row">
																<div className="col-md-12 mb-4">
																	<div className="mb-0">
																		<label  className="form-label">Select Firmware Version </label>
																		<select className="form-control form-select" 
																			{...register('fwVersion')} 
																			name="fwVersion" disabled>
																			<option value="cancel_update">Cancel Update</option>                   
																			<option value="16.5,96">16.5,96</option>
																			<option value="16.7,96">16.7,96</option>
																			<option value="16.7,96">1.7.1,96</option>
																		</select>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</form>		
								</div> 
								{/* page title end */}
							</div>
							}							
						</div>							
					</div> 
				</div>					
			</div>
		</div>
		</>
	)
}

export default ELDForm