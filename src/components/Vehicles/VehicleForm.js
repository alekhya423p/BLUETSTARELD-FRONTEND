import React, { useState, useEffect } from "react";
import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { saveVehicle, loadVehicle, getActiveVehiclesList ,vehicleUpdate, deactivateVehicle} from "../../actions/vehicleAction";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import * as actionTypes from '../../constants/actionTypes'; 
import { getELDMaster } from "../../actions/eldDevicesAction";
import Loading from "../layout/Loading";
import { ALPHABATES_NUMERIC } from "../../constants/constants";
import Select from 'react-select';
import { getAllStates } from "../../actions/reportsAction";
import UnassignEldModal from "./UnassignEldModal";
import { verifyVIN } from "../../functions/functions";
import { toast } from "react-toastify";

const VehicleForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [allOptions, setAllOptions] = useState();
  const { vehicle, loading, activeVehicles } = useSelector((state) => state.vehicles);
  const { states } = useSelector(state => state.reports)
  const { user } = useSelector((state) => state.auth);
  const { masterElds } = useSelector(state => state.elddevice)
  const { isMinimize, isMode } = useSelector(state => state.dashboard)
  var userType = user && user.user && user.user.userType;

  const validationSchema = yup.object().shape({
    vehicleNumber: yup.string().required("Vehicle Number is required").matches(ALPHABATES_NUMERIC, 'Only alphanumeric values are allowed for vehicle number').min(1, 'Vehicle Id should be greater than 1').max(10, 'Vehicle Id should be less than 10').test('vehicleNumber', 'Vehicle Number is required', (value) => value?.trim()),
    vin: yup.string().required("VIN is required").matches(ALPHABATES_NUMERIC, 'Only alphabet characters are allowed for vin').matches(/^(?!.*I|.*Q|.*O).*$/, 'Should not contain I, O and Q character').min(17, 'VIN should be of 17 Characters').max(17, 'VIN should be of 17 Characters').test('vin', 'VIN is required', (value) => value?.trim()),
    // eld: yup.string().required("ELD is required"),
    plateNumber: yup.string().required("Plate Number is required").matches(ALPHABATES_NUMERIC, 'Only alphanumeric values are allowed for plate number').min(5, 'Plate number should be greater than 5').max(25, 'Plate number should be less than 25').test('plateNumber', 'Plate Number is required', (value) => value?.trim()),
    make: yup.string().required("Make is required").max(25, 'Make should be less than 25').test('make', 'Make is required', (value) => value?.trim()),
    model: yup.string().required("Vehicle Model is required").max(25, 'Vehicle Model should be less than 25 ').test('model', 'Vehicle Model is required', (value) => value?.trim()),
    plateLicenseState: yup.string().required("Plate Make Name is required"),
    year: yup.string().required("Year is required").max(4, 'Year should be of length 4'),
    fuelType: yup.string().required("Fuel Type is required"),
  });
  const {register,handleSubmit,reset,setValue,formState: { errors, ...formState },} = useForm({
      mode: "onBlur",
      resolver: yupResolver(validationSchema),
    }),
    [inputVehicleNumber, setInputVehicleNumber] = useState(""),
    [inputMake, setInputMake] = useState(""),
    [inputPlateNumber, setInputPlateNumber] = useState(""),
    [inputVehicleModel, setInputVehicleModel] = useState(""),
    [inputYear, setInputYear] = useState(""),
    [inputFuelType, setInputFuelType] = useState(""),
    [inputPlateMake, setInputPlateMake] = useState(""),
    [inputELD, setInputELD] = useState(""),
    [inputVehicleTitle, setInputVehicleTitle] = useState(""),
    [inputVinNumber, setInputVinNumber] = useState(""),
    [loader, setLoader] = useState(false), 
    [editLoader, setEditLoader] = useState(false),
    [inputEdit, setInputEdit] = useState("");
    const [inputIsDisabled, setInputIsDisabled] = useState(false)
    const [options, setOptions] = useState();
    // const [load, setLoad] = useState(false);
    const [showAddAdminModal, setAddAdminModal] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(false);
    const allow_correction = user && user.user && user.user.userType ? (user.user.userType === 'system-technician' || user.user.userType === 'system-administrator') : false;
    // const allow_correction = user && user.user && user.user.userType ? (user.user.userType === 'company-administrator' || user.user.userType === 'company-portal-user') : false;
    
    const { isValid } = formState;
    const onSubmit = async (values, e) => {
      if (inputEdit === 'edit') {
        values.id = (vehicle.id !== false) ? vehicle.id : ''
      }
  
    setEditLoader(true)
    // setLoad(true)
    let year = parseInt(values.year)
    values.year = year;
    (inputEdit && inputEdit === "edit") ? dispatch(vehicleUpdate(values, navigate)) : dispatch(saveVehicle(values, navigate));
  };

  useEffect(() => {
    if (Object.keys(vehicle).length !== 0) {
      if(states){
        for(let i = 0; i < states.length; i++){
           if(states[i].stateKey === vehicle?.plateState){
             setInputPlateMake({ value: vehicle?.plateState, label: states[i].state + ' (' + vehicle?.plateState + ')' })
           }
        }
      }
      
      const vin = verifyVIN(vehicle.vin);
      setInputVinNumber(vin);
      setInputELD({value: vehicle.eld, label: vehicle.eldSerialNumber === ""  ? "No ELD" : vehicle.eldSerialNumber + (vehicle.eldMacAddress ? '(' + vehicle.eldMacAddress + ')' : '') })
      setValue('vehicleNumber', vehicle.vehicleNumber)
      setValue('vin', vin)
      setValue('eld', vehicle.eld)
      setValue('year', vehicle.year)
      setValue('fuelType', vehicle.fuelType)
      setValue('vehicle', vehicle.vehicle)
      setValue('make', vehicle.make)
      setValue('model', vehicle.vehicleModel)
      setValue('plateNumber', vehicle.plateNumber)
      setValue('plateLicenseState', vehicle.plateState)
      setValue('companyId', user.companyId)
      setInputMake(vehicle.make);
      setInputPlateNumber(vehicle.plateNumber);
      setInputVehicleModel(vehicle.vehicleModel);
      setInputVehicleNumber(vehicle.vehicleNumber);
      setInputVehicleTitle("Edit");
      setInputIsDisabled(true)
      setInputEdit("edit");
    } else {
      setValue('vehicleNumber', '')
      setValue('eld', '')
      setValue('vehicle', '')
      setValue('make', '')
      setValue('model', '')
      setValue('year', '')
      setValue('fuelType', '')
      setValue('vehicleModel', '')
      setValue('plateNumber', '')
      setValue('companyId', user.companyId)
      setInputMake("");
      setInputPlateNumber(user.PlateNumber);
      setInputVehicleModel("");
      setInputVehicleNumber("");
      setInputPlateMake('')
      setInputFuelType('')
      setInputELD('')
      setInputVinNumber('')
      setInputIsDisabled(false)
      setInputEdit("add");
      setInputVehicleTitle("Add");
    }
  }, [reset, setValue, vehicle, user, inputEdit, states]);

  useEffect(() => {
    dispatch(getAllStates())
    dispatch(getActiveVehiclesList())
    dispatch(getELDMaster())
    if (params.id) {
    	setInputEdit('edit')
    	dispatch(loadVehicle(params?.id))
    }else{
			dispatch({ type: actionTypes.LOAD_VEHICLE_RESET })
		}
  }, [params, dispatch]);

  useEffect(() => {
    const company = user ? user.companyInfo : null;
    if (!allow_correction) {
      if (!Object.keys(vehicle).length) {
        if (company &&company.subscription && !company?.subscription?.subscriptionInfo && company?.subscription.subscriptionInfo?.vehicleCount && activeVehicles  ) {
          const existingvehicles = activeVehicles;
          const quantity = company.subscription.subscriptionInfo.vehicleCount;
          if (existingvehicles >= quantity && !params.id) {
              toast.warning(`Your current ELD subscription lets you to use up to ${quantity}vehicle ELDs.Please upgrade your subscription ?`)
              navigate('/billing')
            }
        }
        if (company && (!company.subscription && !company.subscription?.stripeCustomerId) && activeVehicles >= 1 && !params.id) {
          toast.warning('Please create subscription to add new vehicles')
          navigate('/billing')
        }
      }
    }
  }, [user,vehicle,params,activeVehicles,allow_correction,navigate]);


  const handleDeactivate = (data) => {
    setLoader(true);
    const payload = {
			id: data.id,
			status: data.active === true ? 'inactive' : 'active'
		}
    dispatch(deactivateVehicle(payload, navigate));
  }

  const pageHead = inputVehicleTitle + ' Vehicle';
  
  useEffect(() => {
    if (masterElds.elds) {
      masterElds.elds.unshift({
        id: '',
        serialNumber: 'No ELD',
        macAddress: ''
      });
      var options = masterElds?.elds.map((item, index) => {
        return { value: item.id, label: item.serialNumber + (item.macAddress ? '(' + item.macAddress + ')' : '') }
     })
    }
    setOptions(options);
  }, [masterElds])

  const handleAssignEld = (e) => {
    setInputELD(e);
    setValue('eld', e.value);
  }
  const handleAddAdminShow = () => {
    setAddAdminModal(true);
  };
  const handleAddAdminClose = () => {
    setAddAdminModal(false);
    setSelectedRowData(false);
  };
  useEffect(() => {
    if(states) {
      var allOptions = states.map((item, index) => {
        return { value: item.stateKey, label: item.state + ' (' + item.stateKey + ')' }
      })
    }
    setAllOptions(allOptions);
  }, [states])

  const handleAssignStates = (e) => {
    setInputPlateMake(e);
    setValue('plateLicenseState', e.value);
  }
  
  const handleVinFormat = (value) => {
    let input = value;
    if(input.length === 17){
      const vin = verifyVIN(input);
      setInputVinNumber(vin);
    }    
  }

  return (
    <>
      <div id="layout-wrapper" className={isMode}>
        <Header pageHead={pageHead} />
        <Sidebar />
        <div className={`main-content ${isMinimize === 'minimize' ? 'minimize-main' : ''}`}>
          <div className={userType === "company-administrator" ? "page-content company-admin" : "page-content"} style={{ background: "#eff3f6" }}>
            <div className="container-fluid">
              {/* <!-- start page title --> */}
              <div className="row loader_class">
                { loading ? <Loading /> :
                <div className="col-10 mt-3 mx-auto">
                  <div className="page-title-box">
                    <form
                      className="search-data add-driver"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <div className="row">
                        <div className="col-4">
                          <div className="row">
                            <h3 className="text-capitalize">
                              <strong>Vehicle Info</strong>
                            </h3>
                          </div>
                        </div>
                        <div className="col-8 ps-4">
                          <div className="create-driver-btns">
                            <div className="col-sm-2 ps-4 btn-style-right">
                              <div className="form-group">
                                <Link to={'/settings/vehicles'} className="btn cancel-btn btn border border-color d-block  bg-white">Cancel</Link>
                              </div>
                            </div>

                            {
                              inputEdit === 'edit' && (vehicle?.eldSerialNumber && vehicle?.eldMacAddress) ? 
                              <div className="col-sm-3 btn-style-right pr-20">
                                <div className="form-group">
                                  <button type="button" onClick={() => handleAddAdminShow()} className='btn w-100 btn-outline-danger text-danger bg-white border-radius-8'>Unassign ELD</button>
                                </div>
                              </div> : ''
                            }
                            {
                              inputEdit === 'edit' ? 
                              <div className="col-sm-3 btn-style-right pr-20">
                                <div className="form-group">
                                  <button type="button" onClick={() => handleDeactivate(vehicle)} className={vehicle.active === true ? 'btn w-100 btn-outline-danger text-danger bg-white border-radius-8' : 'btn w-100 btn-outline-success text-success bg-white border-radius-8'}>{(loader&& loading) ? <Loading/> : vehicle.active === true ? 'Deactivate' : 'Activate'}</button>
                                </div>
                              </div> : ''
                            }
                            

                            <div className="col-sm-3 btn-style-right">
                              <div className="form-group">
                                <button
                                 disabled={isValid}
                                  type="submit"
                                  className="btn d-block w-100 add-button"
                                >
                                  { inputVehicleTitle === 'Add'  && (!editLoader && !loading) ? <i className="ti ti-plus font-size-17 vertical-align-top"></i> : ''}{" "}
                                  {(editLoader&& loading) ? <Loading /> : inputVehicleTitle === 'Add' ? 'Add Vehicle' : 'Save Changes'} 
                                </button>
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
                                    <label className="form-label">
                                      Vehicle ID <span className="text-danger">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      defaultValue={inputVehicleNumber}
                                      onChange={(e) =>
                                        setInputVehicleNumber(e.target.value)
                                      }
                                      {...register("vehicleNumber")}
                                      className="form-control"
                                      placeholder=""
                                      required=""
                                    />
                                    {errors.vehicleNumber && (
                                      <div className="text-danger">{errors.vehicleNumber.message}</div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-md-6">
                                  <div className="mb-4">
                                    <label
                                      htmlFor="validationCustom01"
                                      className="form-label"
                                    >
                                      Make <span className="text-danger">*</span> {" "}
                                    </label>
                                    <input
                                      type="text"
                                      defaultValue={inputMake}
                                      onChange={(e) =>
                                        setInputMake(e.target.value)
                                      }
                                      {...register("make")}
                                      className="form-control"
                                      placeholder=""
                                      required=""
                                    />
                                    { errors.make && (
                                      <div className="text-danger">{errors.make.message}</div>
                                    )}
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="mb-4">
                                    <label
                                      htmlFor="validationCustom02"
                                      className="form-label"
                                    >
                                      Model <span className="text-danger">*</span> {" "}
                                    </label>
                                    <input
                                      type="text"
                                      defaultValue={inputVehicleModel}
                                      onChange={(e) =>
                                        setInputVehicleModel(e.target.value)
                                      }
                                      {...register("model")}
                                      className="form-control"
                                      id="validationCustom02"
                                      placeholder=""
                                      required=""
                                    />
                                    {errors.model && (
                                      <div className="text-danger">{errors.model.message}</div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-md-12">
                                  <div className="mb-4">
                                    <label className="form-label">Year <span className="text-danger">*</span> </label>
                                    <input
                                      type="text"
                                      defaultValue={inputYear}
                                      onChange={(e) =>
                                        setInputYear(e.target.value)
                                      }
                                      {...register("year")}
                                      className="form-control"
                                      placeholder=""
                                      required=""
                                    />
                                    {errors.year && (
                                      <div className="text-danger">{errors.year.message}</div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-md-12 mb-4">
                                  <div className="mb-0">
                                    <label className="form-label">VIN <span className="text-danger">*</span> </label>
                                    <input
                                      type="text" name="vin"
                                      disabled={inputIsDisabled}
                                      {...register("vin")}
                                      className="form-control"
                                      placeholder=""
                                      required="" 
                                      defaultValue={inputVinNumber} 
                                      onChange={(e) => handleVinFormat(e.target.value)}
                                    />
                                    {errors.vin && (
                                      <div className="text-danger">{errors.vin.message}</div>
                                    )}
                                  </div>
                                  {inputEdit === 'edit' ? 
                                  <span className="form-label">
                                    You may not modify the VIN on existing vehicle. To change the VIN you can create a new vehicle with that VIN and deactivate the current vehicle. Please contact technical support if you have questions or concerns
                                  </span>
                                    : <span className="form-label">
                                    Please make sure your VIN was entered correctly. Once the vehicle record is created its VIN cannot be changed 
                                  </span> }
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-md-12">
                                  <div className="mb-4">
                                    <label className="form-label">
                                      Fuel Type <span className="text-danger">*</span>
                                    </label>
                                    <select
                                      className="form-control form-select"
                                      defaultValue={inputFuelType}
                                      onChange={(e) =>
                                        setInputFuelType(e.target.value)
                                      }
                                      {...register("fuelType")}
                                    >
                                      <option value="Diesel">Diesel</option>
                                      <option value="Petrol">Petrol</option>
                                    </select>
                                    {errors.fuelType && (
                                      <div className="text-danger">{errors.fuelType.message}</div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-md-6">
                                  <div className="mb-4 states_dropdown">
                                    <label
                                      htmlFor="validationCustom01"
                                      className="form-label"
                                    >
                                      Plate License Issuing State <span className="text-danger">*</span>{" "}
                                    </label>
                                    <Select className="select-boz-style"
                                      onChange={(e) => handleAssignStates(e)} 
                                      value={inputPlateMake}
                                      options={allOptions} placeholder="" name="inputPlateMake" />
                                    {/* <select
                                      className="form-control form-select"
                                      defaultValue={inputPlateMake}
                                      onChange={(e) =>
                                        setInputPlateMake(e.target.value)
                                      }
                                      {...register("plateLicenseState")}
                                    >
                                      <option value="{}">Select</option>
                                      <option value="Alaska">Alaska</option>
                                      <option value="Hawaii">Hawaii</option>
                                    </select> */}
                                    {errors.plateLicenseState && (
                                      <div className="text-danger">{errors.plateLicenseState.message}</div>
                                    )}
                                  </div>
                                  <div></div>
                                </div>
                                <div className="col-md-6">
                                  <div className="mb-4">
                                    <label
                                      htmlFor="validationCustom02"
                                      className="form-label"
                                    >
                                      License Plate Number <span className="text-danger">*</span>{" "}
                                    </label>
                                    <input
                                      type="text"
                                      defaultValue={inputPlateNumber}
                                      onChange={(e) =>
                                        setInputPlateNumber(e.target.value)
                                      }
                                      {...register("plateNumber")}
                                      className="form-control"
                                      placeholder=""
                                      required=""
                                    />
                                    {errors.plateNumber && (
                                      <div className="text-danger">{errors.plateNumber.message}</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <h3 className="text-capitalize">
                          <strong>ELD Settings</strong>
                        </h3>
                      </div>

                      <div className="row mt-4">
                        <div className="col-md-12">
                          <div className="card">
                            <div className="card-body">
                              <div className="row">
                                <div className="col-md-12">
                                  <div className="mb-4">
                                    <label className="form-label">
                                      Assign ELD
                                    </label>
                                    <Select value={inputELD}
                                      onChange={(e) => handleAssignEld(e)} 
                                      options={options} placeholder="Select ELD Device" name="eld" />
                                    {errors.eld && (
                                      <div className="text-danger">{errors.eld.message}</div>
                                    )}
                                  </div>
                                </div>
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
          </div>
        </div>
      </div>
       {/* <!--Add Event Modal --> */}
       <UnassignEldModal
          open={showAddAdminModal}
          close={handleAddAdminClose}
          data={selectedRowData}
          serialNumber={vehicle?.eldSerialNumber} eldMacAddress={vehicle?.eldMacAddress} vehicle={vehicle?.id}
        />
    </>
  );
};

export default VehicleForm;