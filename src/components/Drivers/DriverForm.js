import React, { useState, useEffect } from "react"
import Header from "../layout/Header"
import Sidebar from "../layout/Sidebar"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { saveDriver, loadDriver, driverUpdate, getHOSRules, deactivateDriver, getDriverMaster } from "../../actions/driverAction";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import * as actionTypes from '../../constants/actionTypes';
import Loading from "../layout/Loading";
import { getVehicleMaster } from "../../actions/vehicleAction";
import { ALPHABATES_NUMERIC } from "../../constants/constants";
import { getAllStates } from "../../actions/reportsAction";
import db from "../../../src/data/db.json";
import { formatPhoneNumber } from "../../functions/functions";
import Select from 'react-select';
import { useParams } from 'react-router-dom'

const DriverForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const params = useParams();
  const [options, setOptions] = useState()
  const [optionsEdit, setOptionsEdit] = useState()

  const [allOptions, setAllOptions] = useState();
  const { driver, hosRules, loading } = useSelector(state => state.drivers)
  const { user } = useSelector(state => state.auth)
  const { masterVehicles } = useSelector(state => state.vehicles)
  const { states } = useSelector(state => state.reports)
  const { isMinimize, isMode } = useSelector(state => state.dashboard)
  const { masterDrivers } = useSelector(state => state.drivers)
  const company = user ? user.companyInfo : '';
  const homeTerminals = user ? user.companyInfo.terminals : '';
  const companyAddress = company?.address ? company.address : 'New York, US';

  const validationSchema = yup.object().shape({
    coDriverId: yup.string().required('Driver ID is required').min(4, 'Driver Id should be greater than 4').max(60, 'Driver Id should be less than 60').test('coDriverId', 'Driver ID is required', (value) => value?.trim()),
    firstName: yup.string().required('First Name is required').matches(/^[^\s][a-zA-Z\s]+[^\s]$/, "Only alphabets are allowed for this field").min(2, 'First Name should be greater than 2').max(30, 'First Name should be less than 30').test('firstName', 'First Name is required', (value) => value?.trim()),
    lastName: yup.string().required('Last Name is required').matches(/^[^\s][a-zA-Z\s]+[^\s]$/, "Only alphabets are allowed for this field").min(2, 'Last name should be greater than 2').max(30, 'Last name should be less than 30').test('lastName', 'Last Name is required', (value) => value?.trim()),
    email: yup.string().email("Email is invalid").max(40, 'Email should be less than 40'),
    isEditble: yup.boolean(),
    assignedCoDriverId: yup.string(),
    password: yup.string().when('isEditble', {
      is: true,
      then: yup.string().max(14, 'Must be 14 characters or less').min(8, 'Must be 8 characters or more').required('Please Enter your password'),
    }),
    confirmPassword: yup.string().when('isEditble', {
      is: true,
      then: yup.string().required('Confirm passwords is required').oneOf([yup.ref('password'), null], 'Passwords must match'),
    }),
    //confirmPassword: Yup.string().required('Confirm password is required').oneOf([Yup.ref('password'), null], 'Passwords must match'),
    phoneNumber: yup.string().nullable(),
    licenseState: yup.string().required('License State is required'),
    licenseNumber: yup.string().required('License Number is required').matches(ALPHABATES_NUMERIC, 'License number should be alphanumeric').min(1, 'License number should be more than 1').max(20, 'License number should be less than 20').test('licenseNumber', 'License Number is required', (value) => value?.trim()),
    homeTerminal: yup.string().required('Home Terminal is required'),
    assignedVehicleId: yup.string(),
    cycle: yup.string().required('Cycle is required'),
    restartHours: yup.string().required('Hos Rule is required'),
    cargoType: yup.string().required('Cargo Type is required'),
    restBreak: yup.string().required('Rest Break is required'),
    pcAllowed: yup.boolean(),
    shortHaulAllowed: yup.boolean(),
    splitSBAllowed: yup.boolean(),
    ymAllowed: yup.boolean(),
    manualDriveAllowed: yup.boolean(),
  });
  const { register, handleSubmit, reset, setValue, clearErrors, formState: { errors, ...formState } } = useForm({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
  }),
    [inputDriverId, setInputDriverId] = useState(""),
    [inputUserFirstName, setInputUserFirstName] = useState(""),
    [inputEmail, setInputEmail] = useState(""),
    [inputUserLastName, setInputUserLastName] = useState(""),
    [inputContactNo, setInputContactNo] = useState(""),
    [inputPassword, setInputPassword] = useState(""),
    [inputConfirmPassword, setInputConfirmPassword] = useState(""),
    [inputLicenseState, setInputLicenseState] = useState(""),
    [inputLicenseNumber, setInputLicenseNumber] = useState(""),
    [inputVechiles, setInputVechiles] = useState(""),
    [inputCoDriver, setInputCoDriver] = useState(""),
    [inputDriverTitle, setInputDriverTitle] = useState(""),
    [inputIsDisabled, setInputIsDisabled] = useState(false),
    [loader, setLoader] = useState(false),
    [load, setLoad] = useState(false),
    [editLoader, setEditLoader] = useState(false),
    [inputEdit, setInputEdit] = useState('');

  const { isValid } = formState
  var userType = user && user.user && user.user.userType;
  const { id } = useParams()
  // console.log(id,90)
  const onSubmit = async (values, e) => {

    values.userName = values.coDriverId
    delete values.coDriverId;

    if (inputEdit === 'edit') {
      // delete values.userName;
      delete values.email;
      values.id = (driver._id !== false) ? driver._id : '';
      dispatch(driverUpdate(values, navigate))
    } else {
      dispatch(saveDriver(values, navigate))
    }
    setEditLoader(true)
    // setLoad(true)
  };

  useEffect(() => {
    if (Object.keys(driver).length !== 0) {

      for (let i = 0; i < states.length; i++) {
        if (states[i].stateKey === driver?.licenseState) {
          setInputLicenseState({ value: driver?.licenseState, label: states[i].state + ' (' + driver?.licenseState + ')' })
        }
      }
      setInputCoDriver({ label: driver?.assignedCoDriverId })
      setInputVechiles({ value: driver?.vehicleId, label: driver?.vehicleNo })
      setValue('firstName', driver.firstName)
      setValue('lastName', driver.lastName)
      setValue('email', driver.email)
      setValue('phoneNumber', driver.phoneNumber)
      setValue('coDriverId', driver.userName)
      setValue('assignedVehicleId', driver.vehicleId)
      setValue('licenseState', driver.licenseState)
      setValue('licenseNumber', driver.licenseNumber)
      setValue('homeTerminal', driver.homeTerminal)
      setValue('restartHours', driver?.restartHours)
      setValue('cycle', driver?.cycle)
      setValue('cargoType', driver?.cargoType)
      setValue('restBreak', driver?.restBreak)
      setValue('shortHaulAllowed', driver?.shortHaulAllowed)
      setValue('splitSBAllowed', driver?.splitSBAllowed)
      setValue('pcAllowed', driver?.pcAllowed)
      setValue('ymAllowed', driver?.ymAllowed)
      setValue('manualDriveAllowed', driver?.manualDriveAllowed)
      setValue('companyId', company._id)
      setValue('isEditble', false)
      setValue('assignedCoDriverId', inputCoDriver.value)
      setInputDriverTitle("Edit");
      setInputIsDisabled(true)
      setInputEdit('edit');
      const formattedPhoneNumber = formatPhoneNumber(driver.phoneNumber);
      setInputContactNo(formattedPhoneNumber);
    } else {
      setValue('coDriverId', '')
      setValue('firstName', '')
      setValue('lastName', '')
      setValue('phoneNumber', '')
      setValue('password', '')
      setValue('email', '')
      setValue('confirmPassword', '')
      setValue('homeTerminal', companyAddress)
      setValue('restartHours', company.restartHours)
      setValue('cycle', company.cycle)
      setValue('assignedVehicleId', '')
      setValue('licenseState', '')
      setValue('cargoType', company.cargoType)
      setValue('restBreak', company.restBreak)
      setValue('shortHaulAllowed', company.shortHaulAllowed)
      setValue('splitSBAllowed', company.splitSBAllowed)
      setValue('licenseNumber', '')
      setValue('pcAllowed', company.pcAllowed)
      setValue('ymAllowed', company.ymAllowed)
      setValue('manualDriveAllowed', company.manualDriveAllowed)
      setValue('isEditble', true)
      setValue('companyId', company._id)
      setInputEdit("add");
      setInputIsDisabled(false)
      setInputEmail('')
      setInputVechiles('')
      setInputLicenseState('')
      setInputCoDriver('')
      setInputContactNo('')
      setInputDriverTitle("Add");
    }

  }, [reset, setValue, driver, user, inputEdit, states, company, companyAddress]);

  useEffect(() => {
    dispatch(getAllStates());
    dispatch(getHOSRules());
    dispatch(getVehicleMaster())
    dispatch(getDriverMaster())

    if (params.id) {
      setInputEdit('edit')
      setLoad(true);
      dispatch(loadDriver(params?.id))
    } else {
      dispatch({ type: actionTypes.LOAD_DRIVER_RESET })
    }
  }, [params, dispatch])

  const handleDeactivate = (data) => {

    setLoader(true);
    const payload = {
      id: data._id,
      status: data.isActive === true ? 'inactive' : 'active'
    };

    dispatch(deactivateDriver(payload, navigate))
  }

  const pageHead = inputDriverTitle + ' Driver';

  useEffect(() => {
    if (masterVehicles.vehicles || inputEdit === 'edit') {
      
      var options = masterVehicles?.vehicles?.map((item, index) => {
        // console.log(inputVechiles.label !=item?.vehicleNumber)
        return { value: item.id, label: item.vehicleNumber }
      })
      options?.unshift({
        _id: '',
        label: 'No Vehicle',
        vin: '',
        id: ''
      });
      
        var optionsEdit = masterDrivers?.filter((item, index) => {
          if (id != item?.id) return item
        }).map((item, index) => {
          return { value: item.id, label: item?.name }
        })
        optionsEdit.unshift({
          value: '',
          label: 'No Co-Driver Selected'
        });
      
      


    }
    setOptions(options);
    setOptionsEdit(optionsEdit);
  }, [masterVehicles, inputEdit])
  useEffect(() => {
    if (states) {
      var allOptions = states.map((item, index) => {
        return { value: item.stateKey, label: item.state + ' (' + item.stateKey + ')' }
      })
    }
    setAllOptions(allOptions);
  }, [states])

  const handleAssignVehicle = (e) => {
    setInputVechiles(e);
    setValue('assignedVehicleId', e.value);
    clearErrors("assignedVehicleId")
  }
  const handleAssignCoDriver = (e) => {
    setInputCoDriver(e);
    setValue('assignedCoDriverId', e.value);

  }
  console.log(driver, 256)
  const handleAssignStates = (e) => {
    setInputLicenseState(e);
    setValue('licenseState', e.value);
  }
  // console.log(inputCoDriver,253)
  const handleInput = (e) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setInputContactNo(formattedPhoneNumber);
  };
  //  console.log(inputDriverId,239)
  return (
    <>
      <div id='layout-wrapper' className={isMode}>
        <Header pageHead={pageHead} />
        <Sidebar />
        <div className={`main-content ${isMinimize === 'minimize' ? 'minimize-main' : ''}`}>
          <div className={userType === "company-administrator" ? "page-content company-admin" : "page-content"} style={{ background: "#eff3f6" }}>
            <div className="container-fluid">
              <div className="row loader_class logs-card-style">
                {(loading && load) ? <Loading /> :
                  <div className="col-10 mt-3 mx-auto">
                    <div className="page-title-box">
                      <form className="search-data add-driver" onSubmit={handleSubmit(onSubmit)}>
                        <div className="row">
                          <div className="col-6">
                            <div className="row">
                              <h3 className="text-capitalize"><strong>Personal Info</strong></h3>
                            </div>
                          </div>
                          <div className="col-6 ps-4">
                            <div className="create-driver-btns">
                              <div className="col-sm-3 ps-4 btn-style-right">
                                <div className="form-group">
                                  <Link to='/settings/drivers' className="btn cancel-btn btn border border-color d-block  bg-white ">Cancel</Link>
                                </div>
                              </div>
                              {
                                inputEdit === 'edit' ? <div className="col-sm-4 btn-style-right pr-20" >
                                  <div className="form-group">
                                    <button type="button" onClick={() => handleDeactivate(driver)} className={driver.isActive === true ? 'btn w-100 btn-outline-danger text-danger bg-white border-radius-8' : 'btn w-100 btn-outline-success text-success bg-white border-radius-8'}>{(loader && loading) ? <Loading /> : driver.isActive === true ? 'Deactivate' : 'Activate'}</button>
                                  </div>
                                </div> : ''
                              }

                              <div className="col-sm-4 btn-style-right">
                                <div className="form-group">
                                  <button disabled={isValid} type="submit" className="btn d-block w-100 add-button">
                                    {inputDriverTitle === 'Add' && (!editLoader && !loading) ? <i className="ti ti-plus font-size-17 vertical-align-top"></i> : ''}
                                    {(editLoader && loading) ? <Loading /> : inputDriverTitle === 'Add' ? 'Add Driver' : 'Save Changes'} </button>
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
                                  <div className="col-md-12">
                                    <div className="mb-4 user-input">
                                      <label className="form-label">Driver ID <span className="text-danger">*</span></label>
                                      <input type="text"
                                        name="coDriverId"
                                        className="form-control"
                                        placeholder=""
                                        defaultValue={inputDriverId}
                                        onChange={(e) => setInputDriverId(e.target.value)}
                                        {...register('coDriverId')}
                                        disabled={inputIsDisabled}
                                        required="" />
                                      {errors.coDriverId && (
                                        <div className="text-danger">{errors.coDriverId.message}</div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="mb-4">
                                      <label htmlFor="validationCustom01" className="form-label">First name <span className="text-danger">*</span> </label>
                                      <input type="text" className="form-control" name=''
                                        defaultValue={inputUserFirstName}
                                        onChange={(e) => setInputUserFirstName(e.target.value)}
                                        {...register('firstName')}
                                        placeholder="" required="" />
                                      {errors.firstName && (
                                        <div className="text-danger">{errors.firstName.message}</div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-4">
                                      <label htmlFor="validationCustom02" className="form-label">Last name <span className="text-danger">*</span> </label>
                                      <input type="text" className="form-control" name="" id="validationCustom02"
                                        defaultValue={inputUserLastName}
                                        onChange={(e) => setInputUserLastName(e.target.value)}
                                        placeholder=""
                                        {...register('lastName')} required="" />
                                      {errors.lastName && (
                                        <div className="text-danger">{errors.lastName.message}</div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-12">
                                    <div className="mb-4 e-mail-icon">
                                      <label className="form-label">E-mail </label>
                                      <input type="text" className="form-control" name="email"
                                        defaultValue={inputEmail}
                                        onChange={(e) => setInputEmail(e.target.value)}
                                        {...register('email')}
                                        placeholder=""
                                        required="" />
                                      {errors.email && (
                                        <div className="text-danger">{errors.email.message}</div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-12">
                                    <div className="mb-4 phone-icon">
                                      <label className="form-label">Phone </label>

                                      <input id="input-mask"
                                        name="phoneNumber" className="form-control input-mask"
                                        {...register('phoneNumber')}
                                        value={inputContactNo}
                                        onChange={(e) => handleInput(e)} />
                                      {errors.phoneNumber && (
                                        <div className="text-danger">{errors.phoneNumber.message}</div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="mb-4">
                                      <label htmlFor="validationCustom01" className="form-label">Password </label>
                                      <input type="password" className="form-control"
                                        name="password"
                                        //  placeholder="New Password" 
                                        {...register('password')}
                                        defaultValue={inputPassword}
                                        onChange={(e) => setInputPassword(e)}
                                        required="" />
                                      {errors.password && (
                                        <div className="text-danger">{errors.password.message}</div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-4">
                                      <label htmlFor="validationCustom02" className="form-label">Confirm Password </label>
                                      <input type="password"
                                        className="form-control"
                                        name="confirmPassword"
                                        //  placeholder="Confirm New Password"
                                        {...register('confirmPassword')}
                                        defaultValue={inputConfirmPassword}
                                        onChange={(e) => setInputConfirmPassword(e)}
                                        required="" />
                                      {errors.confirmPassword && (
                                        <div className="text-danger">{errors.confirmPassword.message}</div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="mb-4">
                                      <label htmlFor="validationCustom01" className="form-label">Driving License Issuing State <span className="text-danger">*</span> </label>
                                      <Select className="select-boz-style" value={inputLicenseState}
                                        onChange={(e) => handleAssignStates(e)}
                                        options={allOptions} placeholder="" name="licenseState" />
                                      {errors.licenseState && (
                                        <div className="text-danger">{errors.licenseState.message}</div>
                                      )}
                                    </div>
                                    <div>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-4">
                                      <label htmlFor="validationCustom02" className="form-label">Driver License Number <span className="text-danger">*</span> </label>
                                      <input type="text" className="form-control"
                                        placeholder=""
                                        name='licenseNumber'
                                        {...register('licenseNumber')}
                                        defaultValue={inputLicenseNumber}
                                        onChange={(e) => setInputLicenseNumber(e)}
                                        required="" />
                                      {errors.licenseNumber && (
                                        <div className="text-danger">{errors.licenseNumber.message}</div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <h3 className="text-capitalize"><strong>Carrier Settings </strong></h3>
                        </div>
                        <div className="row mt-4">
                          <div className="col-md-12">
                            <div className="card">
                              <div className="card-body">
                                <div className="row">
                                  <div className="col-md-12">
                                    <div className="mb-4">
                                      <label className="form-label">Home Terminal <span className="text-danger">*</span> </label>
                                      <select className="form-control form-select select2-search-disable" defaultValue={companyAddress || 'New York, US'} disabled>
                                        <option value="New York, US">New York, US</option>
                                        {homeTerminals && homeTerminals.map((terminal, index) => {
                                          return <option key={index} value={terminal.address}>{terminal.address}</option>
                                        })}
                                      </select>
                                      {errors.homeTerminal && (
                                        <div className="text-danger">{errors.homeTerminal.message}</div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-12">
                                    <div className="mb-4">
                                      <label htmlFor="validationCustom01" className="form-label">Assign Vehicles</label>
                                      <Select className="select-boz-style" value={inputVechiles}
                                        onChange={(e) => handleAssignVehicle(e)}
                                        options={options} placeholder="Select Vehicle" name="assignedVehicleId" />
                                      {errors.assignedVehicleId && (
                                        <div className="text-danger">{errors.assignedVehicleId.message}</div>
                                      )}
                                    </div>
                                  </div>
                                  {inputEdit === 'edit' &&
                                    <div className="col-md-12">
                                      <div className="mb-4">
                                        <label htmlFor="validationCustom01" className="form-label">Assign Co- Driver</label>
                                        <Select className="select-boz-style" value={inputCoDriver}
                                          onChange={(e) => handleAssignCoDriver(e)}
                                          options={optionsEdit} placeholder="Select Co-Driver" name="assignedCoDriverId" />
                                        {errors.assignedCoDriverId && (
                                          <div className="text-danger">{errors.assignedCoDriverId.message}</div>
                                        )}
                                      </div>
                                    </div>
                                  }
                                </div>
                                <div className="mt-1s">
                                  <p className="text-muted mb-3 font-14">
                                    Please note: if the <code>alwaysShow</code> option is enabled, the <code>threshold</code> option is ignored.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <h3 className="text-capitalize"><strong>Log Settings</strong></h3>
                        </div>
                        <div className="row mt-4">
                          <div className="col-md-12">
                            <div className="card">
                              <div className="card-body">
                                {/* <div className="form-check mb-3 disabled">
                               <input className="form-check-input text-muted" type="checkbox" id="formCheck1" disabled/>
                               <label className="form-check-label text-muted" htmlFor="formCheck1">Form Checkbox </label>
                             </div> */}
                                <div className="row">
                                  <div className="col-md-12">
                                    <div className="mb-4">
                                      <label className="form-label">HOS Rules <span className="text-danger">*</span> </label>
                                      <select className="form-control form-select"
                                        {...register('cycle')}
                                        name="cycle" disabled>
                                        <option value="">Select</option>
                                        {Array.isArray(hosRules) && hosRules.map((item, index) => (
                                          <option key={index} value={item.rule}>{item.value}</option>
                                        ))}
                                      </select>
                                      {errors.cycle && (
                                        <div className="text-danger">{errors.cycle.message}</div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-12">
                                    <div className="mb-4">
                                      <label htmlFor="validationCustom01" className="form-label">Cargo Type <span className="text-danger">*</span> </label>
                                      <select className="form-control form-select"
                                        {...register('cargoType')}
                                        name="cargoType" disabled>
                                        <option value="">Select</option>
                                        <option value="PASSENGER">Passenger</option>
                                        <option value="PROPERTY">Property</option>
                                      </select>
                                      {errors.cargoType && (
                                        <div className="text-danger">{errors.cargoType.message}</div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="row">
                                  <div className="col-md-12">
                                    <div className="mb-4">
                                      <label htmlFor="validationCustom01" className="form-label">Restart <span className="text-danger">*</span> </label>
                                      <select className="form-control form-select" {...register("restartHours")} defaultValue={company.restartHours} disabled>
                                        <option value={''}>Select</option>
                                        {db.restartHours && db.restartHours.map((item, index) => (
                                          <option key={index} value={item.value}>{item.key}</option>
                                        ))}
                                      </select>
                                      {errors.restartHours && (
                                        <div className="text-danger">{errors.restartHours.message}</div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="row">
                                  <div className="col-md-12">
                                    <div className="mb-4">
                                      <label className="form-label">Rest Break <span className="text-danger">*</span></label>
                                      <select className="form-control form-select"
                                        {...register('restBreak')}
                                        name="restBreak" disabled>
                                        <option value="">Select</option>
                                        <option value="30M_REST_BREAK">30 min Break</option>
                                        <option value="NO_REST_BREAK">No break required</option>
                                      </select>
                                      {errors.restBreak && (
                                        <div className="text-danger">{errors.restBreak.message}</div>
                                      )}
                                      {/* <SelectDropdown type={1} options={['30 mint Break','No break required']}/> */}
                                    </div>
                                  </div>
                                </div>

                                <div className="form-check mb-3">
                                  <input className="form-check-input" disabled type="checkbox" {...register('shortHaulAllowed')} />
                                  <label className="form-check-label" htmlFor="invalidCheck">Allow Short-Haul Exception  </label>
                                </div>

                                <div className="form-check mb-3">
                                  <input className="form-check-input" disabled type="checkbox" {...register('splitSBAllowed')} />
                                  <label className="form-check-label" htmlFor="invalidCheck">Allow Split-sleeper Berth  </label>

                                </div>

                                <div className="form-check mb-3">
                                  <input className="form-check-input" type="checkbox" {...register('pcAllowed')} />
                                  <label className="form-check-label" htmlFor="invalidCheck">Allow Personal Conveyance  </label>

                                </div>
                                <div className="form-check mb-3">
                                  <input className="form-check-input" type="checkbox"  {...register('ymAllowed')} />
                                  <label className="form-check-label" htmlFor="invalidCheck">Allow Yard Move  </label>
                                </div>
                                <div className="form-check mb-3">
                                  <input className="form-check-input" type="checkbox" {...register('manualDriveAllowed')} />
                                  <label className="form-check-label" htmlFor="invalidCheck">Allow Manual Driver  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                }

              </div>
            </div>
            {/* <!-- container-fluid --> */}
          </div>
          {/* <!-- End Page-content --> */}
        </div>
      </div>
    </>
  )
}

export default DriverForm