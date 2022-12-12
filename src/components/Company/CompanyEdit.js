import React, { useEffect, useState } from "react";
import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom"
import { loadCompanyDetail, companyUpdate } from "../../actions/companyAction";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import * as actionTypes from '../../constants/actionTypes';
import project from '../../assets/projec-44.jpg'
import decrete from '../../assets/decrete.jpg'
import { getHOSRules } from "../../actions/driverAction";
import Loading from "../layout/Loading";
  import db from "../../../src/data/db.json";

const CompanyEdit = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const params = useParams();
  const [terminal, setTerminail] = useState([{ timeZone: '', address: '' }])
  const { company, loading } = useSelector(state => state.companyDetail)
  const { isMinimize, isMode } = useSelector(state => state.dashboard)
  const { hosRules } = useSelector(state => state.drivers)
  const { user } = useSelector(state => state.auth)
  const validationSchema = yup.object().shape({
    companyName: yup.string().required('Company Name is required'),
    dotNumber: yup.string().required('DOT Number is required'),
    address: yup.string().required('Address is required'),
    timeZoneId: yup.string().required('Time zone is required'),
    restartHours: yup.string().required('HOS Rules is required'),
    cargoType: yup.string().required('Cargo Type is required'),
    cycle: yup.string().required("Cycle is required"),
    restBreak: yup.string().required('Rest Break is required'),
    terminals: yup.array().of(
      yup.object().shape({
        timeZone: yup.string().required("Time zone is Required"),
        address:  yup.string().required("Address is Required"),
      })
    )
  });
  const { register, handleSubmit, reset, setValue, formState: { errors, ...formState } } = useForm({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      terminals: [{ timeZone: "", address: '' }],
      // address: [{ street: "Jaipur", zipCode: 303007 }]
    }
  });

  const { isValid } = formState;
  var userType = user && user.user && user.user.userType;
  const onSubmit = async (values, e) => {

    const hosSettings = {
      cargoType: values.cargoType,
      restBreak: values.restBreak,
      pcAllowed: values.pcAllowed,
      shortHaulAllowed: values.shortHaulAllowed,
      splitSBAllowed: values.splitSBAllowed,
      ymAllowed: values.ymAllowed,
      manualDriveAllowed: values.manualDriveAllowed
    }
   
    values.hosSettings = hosSettings;
    values.integration = { dascarate : values.dascarate, project44 : values.project44};
    values.id = user.companyId
    dispatch(companyUpdate(values, navigate))
  };

  useEffect(() => {
    dispatch(getHOSRules());
    if (params.id) {
      dispatch(loadCompanyDetail(params?.id))
    } else {
      dispatch({ type: actionTypes.LOAD_USERS_RESET })
    }
  }, [params, dispatch])

  useEffect(() => {
    if (Object.keys(company).length !== 0) {

      setValue('companyName', company.companyName)
      setValue('dotNumber', company.dotNumber)
      setValue('address', company.address)
      setValue('timeZoneId', company.timeZoneId)
      setValue('complianceMode', company.complianceMode)
      setValue('restartHours', company?.restartHours)
      setValue('cargoType', company?.cargoType)
      setValue('cycle', company?.cycle)
      setValue('restBreak', company?.restBreak)
      setValue('terminals', company?.terminals)
      setValue('shortHaulAllowed', company?.shortHaulAllowed)
      setValue('splitSBAllowed', company?.splitSBAllowed)
      setValue('manualDriveAllowed', company?.manualDriveAllowed)
      setValue('ymAllowed', company?.ymAllowed)
      setValue('pcAllowed', company?.pcAllowed)
      setValue('project44', company?.project44)
      setValue('macropoint', company?.macropoint)
      setValue('id', company.id)
      
      setTerminail(company?.terminals);
    }
  }, [reset, setValue, company, user]);

  // const addElement = () => {
  //   setTerminail([...terminal, {key: Date.now(), timeZone: "", address: ""}])
  // };

  const removeElement = (id) => {
    const terminalData = terminal.filter((user) => user._id !== id)
    setTerminail(terminalData)
    setValue('terminals', terminalData);
  };
  
  const pageHead = 'Company Edit'
  return (
    <div id="layout-wrapper" className={isMode}>
      <Header pageHead={pageHead} />
      <Sidebar />
      <div className={`main-content ${isMinimize === 'minimize' ? 'minimize-main' : ''}`}>
        <div className={userType === "company-administrator" ? "page-content company-admin" : "page-content"}>
          <div className="container-fluid">
            <div className="row loader_class">
              { loading ? <Loading /> :
                <div className="col-10 mt-3 mx-auto">
                <div className="page-title-box">
                  <form className="search-data add-driver" onSubmit={handleSubmit(onSubmit)}>
                    <div className="row flex-row">
                      <div className="float-start col-4">
                        <h3 className="text-capitalize">
                          <strong>General Settings</strong>
                        </h3>
                      </div>
                      <div className="col-8 pe-4 edit_company-setting">
                        <div className="row float-end">
                          <div className="col-sm-5">
                            <div className="form-group">
                              <Link to={'/settings/company'} className="btn w-100 cancel-btn btn border border-color d-block  bg-white ">
                                Cancel
                              </Link>
                            </div>
                          </div>

                          <div className="col-sm-7">
                            <div className="form-group">
                              <button
                                disabled={isValid}
                                type="submit"
                                className="btn d-bl ock add-button"
                              >
                                {" "}
                                { loading ? <Loading /> : 'Save Changes' } 
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
                              <div className="col-md-6">
                                <div className="mb-4">
                                  <label
                                    htmlFor="validationCustom01"
                                    className="form-label"
                                  >
                                    Company name
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="ABC Trans"
                                    required=""
                                    {...register("companyName")}
                                  />
                                  {errors.companyName && (
                                    <div className="text-danger">{errors.companyName.message}</div>
                                  )}
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="mb-4">
                                  <label
                                    htmlFor="validationCustom02"
                                    className="form-label"
                                  >
                                    Dot Number
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="validationCustom02"
                                    placeholder="0000000"
                                    required=""
                                    {...register("dotNumber")}
                                  />
                                  {errors.dotNumber && (
                                    <div className="text-danger">{errors.dotNumber.message}</div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-12">
                                <div className="mb-4 mt-4">
                                  <label className="form-label">Time Zone</label>
                                  <select className="form-select form-control select2"  {...register("timeZoneId")}>
                                  {db.timeZone.map((e, key) => {
                                    return <option key={key} value={e.value}>{e.key}</option>
                                  })}
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-12">
                                <div className="mb-4 ">
                                  <label className="form-label">Address</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder=""
                                    required=""
                                    {...register("address")}
                                  />
                                  {errors.address && (
                                    <div className="text-danger">{errors.address.message}</div>
                                  )}
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row ">
                      <div className="col-md-12">
                        <div className="card">
                          <div className="card-body">
                            {terminal && terminal.map((user, index) => (
                              <div key={index}>
                                <div
                                  className="alert  p-0 alert-dismissible fade show"
                                  role="alert"
                                >
                                  <h3 className="text-capitalize">
                                    <strong>Terminal {index+1}</strong>
                                  </h3>
                                  <button
                                    type="button"
                                    className="btn-close font-size-16 pt-0 ps-0"
                                    data-bs-dismiss="alert"
                                    aria-label="Close"
                                    onClick={() => removeElement(user._id)}
                                    disabled={terminal.length <= 1}
                                  ></button>
                                  <div className="row">
                                    <div className="col-md-12">
                                      <div className="mb-4 mt-4">
                                        <label className="form-label">Time Zone</label>
                                        <select {...register(`terminals.${index}.timeZone`)} className="form-select form-control select2" disabled>
                                            {db.timeZone.map((e, key) => {
                                             return <option key={key} value={e.value}>{e.key}</option>
                                            })}
                                        </select>
                                        { errors?.terminals && errors?.terminals[index]?.timeZone && (
                                          <div className="text-danger">{errors?.terminals[index]?.timeZone?.message }</div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-md-12">
                                      <div className="mb-0 ">
                                        <label className="form-label">Address</label>
                                        <input type="text" {...register(`terminals.${index}.address`)} className="form-control" placeholder="" required="" disabled />
                                        { errors?.terminals && errors?.terminals[index]?.address && (
                                          <div className="text-danger">{errors?.terminals[index]?.address?.message }</div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>                            
                            ))}
                            <p className="ps-2 text-primary">
                              {/* <button 
                              className="btn btn-primary btn-sm"
                              type="button" onClick={addElement}>
                                <i className="ti ti-plus font-size-17 vertical-align-top"></i>
                                &nbsp;Add New terminal
                              </button> */}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row flex-row">
                      <div className="float-start col-4">
                        <h3 className="text-capitalize">
                          <strong>Compliance Settings</strong>
                        </h3>
                      </div>
                    </div>

                    <div className="row mt-4">
                      <div className="col-md-12">
                        <div className="card">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-12">
                                <div className="mb-4 disabled">
                                  <label
                                    htmlFor="validationCustom02"
                                    className="form-label"
                                  >
                                    Compliance Mode
                                  </label>
                                  <input className="form-select form-control" readOnly value={'ELD'} {...register("complianceMode")} />
                                  {/* <select className="form-control form-select" {...register("complianceMode")}>
                                    {" "}
                                    <option value={'ELD'}>ELD</option>
                                    <option value={'Elsi'}>Elsi</option>
                                  </select> */}
                                  {errors.complianceMode && (
                                    <div className="text-danger">{errors.complianceMode.message}</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row flex-row">
                      <div className="float-start col-12">
                        <h3 className="text-capitalize">
                          <strong>Default Drive Log Settings</strong>
                        </h3>
                      </div>
                    </div>

                    <div className="row mt-4">
                      <div className="col-md-12">
                        <div className="card">
                          <div className="card-body">
                            {/* <div className="form-check mb-3 disabled">
                              <input
                                className="form-check-input text-muted"
                                type="checkbox"
                                id="formCheck1"
                                disabled=""
                              />
                              <label
                                className="form-check-label text-muted"
                                htmlFor="formCheck1"
                              >
                                Form Checkbox{" "}
                              </label>
                            </div> */}
                            <div className="row">
                              <div className="col-md-12">
                                <div className="mb-4">
                                  <label className="form-label">HOS Rules</label>

                                  <select className="form-control form-select" {...register("cycle")}>
                                    <option value={''}>Select</option>
                                    {Array.isArray(hosRules) ? hosRules?.map((item, index) => (
                                      <option key={index} value={item.rule}>{item.value}</option>
                                    )) : []}
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
                                  <label
                                    htmlFor="validationCustom01"
                                    className="form-label"
                                  >
                                    Cargo Type{" "}
                                  </label>

                                  <select className="form-control form-select" {...register("cargoType")}>
                                    <option value={''}>Select</option>
                                    {db.cargoType && db.cargoType.map((item, index) => (
                                        <option key={index} value={item.value}>{item.key}</option>
                                    ))}
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
                                  <label
                                    htmlFor="validationCustom01"
                                    className="form-label"
                                  >
                                    Restart{" "}
                                  </label>

                                  <select className="form-control form-select" {...register("restartHours")}>
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
                                  <label className="form-label">Rest Break </label>
                                  <select className="form-control form-select" {...register("restBreak")}>
                                    <option value={''}>Select</option>
                                    <option value="30M_REST_BREAK">30 min Break</option>
                                    <option value="NO_REST_BREAK">No break required</option>
                                  </select>
                                  {errors.restBreak && (
                                    <div className="text-danger">{errors.restBreak.message}</div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="form-check mb-3">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                required=""
                                {...register("shortHaulAllowed")}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="invalidCheck"
                              >
                                Allow Short-Haul Exceptaion{" "}
                              </label>
                            </div>

                            <div className="form-check mb-3">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                required=""
                                {...register("splitSBAllowed")}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="invalidCheck"
                              >
                                Allow Split-sleeper Birth{" "}
                              </label>
                            </div>

                            <div className="form-check mb-3">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                required=""
                                {...register("pcAllowed")}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="invalidCheck"
                              >
                                Allow Personal Conveyance{" "}
                              </label>
                            </div>

                            <div className="form-check mb-3">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                required=""
                                {...register("ymAllowed")}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="invalidCheck"
                              >
                                Allow Yard Move{" "}
                              </label>
                            </div>

                            <div className="form-check mb-3">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                required=""
                                {...register("manualDriveAllowed")}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="invalidCheck"
                              >
                                Allow Manual Driver{" "}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row flex-row">
                      <div className="float-start col-4">
                        <h3 className="text-capitalize">
                          <strong>Integrations</strong>
                        </h3>
                      </div>
                    </div>

                    <div className="row mt-4">
                      <div className="col-md-6">
                        <div className="card">
                          <div className="card-body">
                            <img
                              src={project}
                              alt="project-44"
                              className="img-fluid"
                            />

                            <div className="row">
                              <div className="col-md-12 ">
                                <div className="mt-2 ms-2">
                                  <div>
                                    <div className="form-check form-check-right">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="formCheckRight1"
                                        {...register("project44")}
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="formCheckRight1"
                                      >
                                        Integrations:&nbsp;
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card">
                          <div className="card-body">
                            <img
                              src={decrete}
                              alt="img-discrete"
                              className="img-fluid"
                            />
                            <div className="row">
                              <div className="col-md-12 ">
                                <div className="mt-2 ms-2">
                                  <div>
                                    <div className="form-check form-check-right">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        {...register("macropoint")}
                                      />
                                      <label className="form-check-label">
                                        Integrations:&nbsp;
                                      </label>
                                    </div>
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
              </div> 
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyEdit;
