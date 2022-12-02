import React, { useState, useEffect } from "react"
import Header from "../layout/Header"
import Sidebar from "../layout/Sidebar"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { createUser, loadUser, userUpdate, deactivateUser } from "../../actions/userAction"
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import * as actionTypes from '../../constants/actionTypes';
import Loading from "../layout/Loading";
import { VALIDATE_NAME, VALIDATE_US_PHONE_NUMBER } from "../../constants/constants";
import { formatPhoneNumber } from "../../functions/functions";

const UserForm = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch();
    const params = useParams();
    const { isMinimize, isMode } = useSelector(state => state.dashboard)
    const { userDetail, loading } = useSelector(state => state.user)
    const { user } = useSelector(state => state.auth)
    const validationSchema = yup.object().shape({
        firstName: yup.string().required('First Name is required').matches(VALIDATE_NAME, 'Only alphabets allowed for this field').min(2, 'First Name should be greater than 2').max(30, 'First Name should be less than 30').test('firstName', 'First Name is required', (value) => value?.trim()),
        lastName: yup.string().required('Last Name is required').matches(VALIDATE_NAME, 'Only Characters are allowed for this field').min(2, 'Last Name should be greater than 2').max(30, 'Last Name should be less than 30').test('lastName', 'Last Name is required', (value) => value?.trim()),
        email: yup.string().required('Email is required').email('Invaild Email').max(50, 'Email should be less than 50'),
        phoneNumber: yup.string().required('Phone number is required').matches(VALIDATE_US_PHONE_NUMBER, "Phone nuber is not valid"),
        role: yup.string().required('User role is required'),
        isEditble: yup.boolean(),
        password:  yup.string().when('isEditble', {
          is: true,
          then:yup.string().max(14, 'Must be 14 characters or less').min(8, 'Must be 8 characters or more').required('Please Enter your password'),
        }),
        confirmPassword:  yup.string().when('isEditble', {
          is: true,
          then:yup.string().required('Confirm passwords is required').oneOf([yup.ref('password'), null], 'Passwords must match'),
        }),
    });
    const { register, handleSubmit, reset, setValue, formState: { errors, ...formState } } = useForm({
        mode: "onBlur",
        resolver: yupResolver(validationSchema),
    }),

        // [inputUserFirstName, setInputUserFirstName] = useState(""),
        // [inputAdminEmail, setInputAdminEmail] = useState(""),
        // [inputUserLastName, setInputUserLastName] = useState(""),
        [inputContactNo, setInputContactNo] = useState(""),
        [inputUserTitle, setInputUserTitle] = useState(""),
        [loader, setLoader] = useState(false), 
        [editLoader, setEditLoader] = useState(false),
        [inputEdit, setInputEdit] = useState("");        
      const  [inputIsDisabled, setInputIsDisabled] = useState(false)

    const { isValid } = formState
    const onSubmit = async (values, e) => {
        if (inputEdit === 'edit') {
            delete values.email;
            values.id = (userDetail._id !== false) ? userDetail._id : ''
        }
        (inputEdit && inputEdit === "edit") ? dispatch(userUpdate(values, navigate)) : dispatch(createUser(values, navigate));

        setEditLoader(true)
    };

    useEffect(() => {
        if (params.id) {
            setInputEdit('edit')
            dispatch(loadUser(params?.id))
        } else {
            dispatch({ type: actionTypes.LOAD_USERS_RESET })
        }
    }, [params, dispatch])

    useEffect(() => {
        if (Object.keys(userDetail).length !== 0) {
            setValue('firstName', userDetail.firstName)
            setValue('lastName', userDetail.lastName)
            setValue('email', userDetail.email)
            setValue('phoneNumber', userDetail.phoneNumber)
            setValue('role', userDetail.role)
            // setValue('phoneNumber', userDetail.phoneNumber)
            setValue('companyId', userDetail.companyId)
            // setInputMacAddress(userDetail.macAddress);
            // setInputSerialNumber(userDetail.serialNumber);
            // setInputVehicleId(userDetail.vehicleId);
            setInputUserTitle("Edit");
            setInputIsDisabled(true)
            setInputEdit("edit");
        } else {
            setValue('companyId', user.companyId)
            // setInputMacAddress("");
            // setInputSerialNumber("");
            // setInputVehicleId("");
            setInputEdit("add");
            setInputUserTitle("Add");
        }
    }, [reset, setValue, userDetail, user, inputEdit]);

    
    const handleDeactivate = (data) => {
        setLoader(true);
        dispatch(deactivateUser(data._id, navigate));
    }

    const handleInput = (e) => {
        const formattedPhoneNumber = formatPhoneNumber(e.target.value);
        setInputContactNo(formattedPhoneNumber);
    };

    const pageHead = inputUserTitle + ' Portal User';

    return (
        <>
            <div id="layout-wrapper" className={isMode}>
                <Header pageHead={pageHead} />
                <Sidebar />
                <div className={`main-content ${isMinimize === 'minimize' ? 'minimize-main' : ''}`}>
                    <div className="page-content">
                        <div className="container-fluid">
                            <div className="row loader_class">
                                { loading ? <Loading/> : 
                                  <div className="col-10 mt-3 mx-auto">
                                  <div className="page-title-box">
                                      <form className="search-data add-driver"  onSubmit={handleSubmit(onSubmit)}>
                                      <div className="row flex-row">
                                          <div className="float-start col-6">
                                              <h3 className="text-capitalize"><strong>User Info </strong></h3>
                                          </div>
                                          <div className="col-6 pe-2">
                                              <div className="create-driver-btns">
                                                  <div className="col-sm-3 btn-style-right pr-20">
                                                      <div className="form-group">
                                                          <Link to={'/settings/portal-users'} className="btn w-100 cancel-btn btn border border-color d-block  bg-white ">Cancel</Link>
                                                      </div>
                                                  </div>
                                                  { inputEdit === 'edit' ?  <div className="col-sm-4 btn-style-right pr-20" >
                                                      <div className="form-group">
                                                          <button type="button" onClick={() => handleDeactivate(userDetail)} className={userDetail.isActive === true ? 'btn w-100 btn-outline-danger text-danger bg-white border-radius-8' : 'btn w-100 btn-outline-success text-success bg-white border-radius-8'}>{ (loader&& loading) ? <Loading/> : userDetail.isActive === true ? 'Deactivate' : 'Activate'}</button>
                                                      </div>
                                                  </div> : ''}
                                                  <div className="col-sm-4 btn-style-right">
                                                      <div className="form-group">
                                                          <button type="submit" disabled={isValid} className="btn d-block w-100 add-button">
                                                          { inputUserTitle === 'Add' ? <i className="ti ti-plus font-size-17 vertical-align-top"></i> : ''} {(editLoader&& loading) ? <Loading /> : inputUserTitle === 'Add' ? 'Add User' : 'Save Changes' } </button>
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
                                                                      <label htmlFor="validationCustom01" className="form-label">First name <span className="text-danger">*</span> </label>
                                                                      <input type="text" className="form-control" placeholder="" {...register('firstName')} required="" />
                                                                      {errors.firstName && (
                                                                          <div className="text-danger">{errors.firstName.message}</div>
                                                                      )}
                                                                  </div>
                                                              </div>
                                                              <div className="col-md-6">
                                                                  <div className="mb-4">
                                                                      <label htmlFor="validationCustom02" className="form-label">Last name <span className="text-danger">*</span> </label>
                                                                      <input type="text" className="form-control" id="validationCustom02" {...register('lastName')} placeholder="" required="" />
                                                                      {errors.lastName && (
                                                                          <div className="text-danger">{errors.lastName.message}</div>
                                                                      )}
                                                                  </div>
                                                              </div>
                                                          </div>
                                                          <div className="row">
                                                              <div className="col-md-12">
                                                                  <div className="mb-4 e-mail-icon">
                                                                      <label className="form-label">E-mail <span className="text-danger">*</span> </label>
                                                                      <input type="text" className="form-control"disabled={inputIsDisabled} placeholder="" {...register('email')} required="" />
                                                                      {errors.email && (
                                                                          <div className="text-danger">{errors.email.message}</div>
                                                                      )}
                                                                  </div>
                                                              </div>
                                                          </div>
                                                          <div className="row">
                                                              <div className="col-md-12">
                                                                  <div className="mb-4 phone-icon">
                                                                      <label className="form-label">Phone <span className="text-danger">*</span> </label>
                                                                      <input id="input-mask" placeholder="+1 (000) 000-0000" className="form-control " {...register('phoneNumber')} value={inputContactNo}  onChange={(e) => handleInput(e)} inputMode="text" />
                                                                      {errors.phoneNumber && (
                                                                          <div className="text-danger">{errors.phoneNumber.message}</div>
                                                                      )}
                                                                  </div>
                                                              </div>
                                                          </div>
                                                          <div className="row">
                                                              <div className="col-md-6">
                                                                  <div className="mb-4">
                                                                      <label htmlFor="validationCustom01" className="form-label">Password <span className="text-danger">*</span></label>
                                                                      <input type="password" className="form-control" placeholder="New Password" {...register('password')} required="" />
                                                                      {errors.password && (
                                                                          <div className="text-danger">{errors.password.message}</div>
                                                                      )}
                                                                  </div>
                                                              </div>
                                                              <div className="col-md-6">
                                                                  <div className="mb-4">
                                                                      <label htmlFor="validationCustom02" className="form-label">Confirm Password <span className="text-danger">*</span></label>
                                                                      <input type="password" className="form-control" placeholder="Confirm Password" {...register('confirmPassword')} required="" />
                                                                      {errors.confirmPassword && (
                                                                          <div className="text-danger">{errors.confirmPassword.message}</div>
                                                                      )}
                                                                  </div>
                                                              </div>
                                                          </div>
                                                          <div className="row">
                                                              <div className="col-md-12">
                                                                  <div className="mb-2">
                                                                      <label htmlFor="validationCustom01" className="form-label">Role <span className="text-danger">*</span></label>
                                                                      <select className="form-control form-select" {...register('role')}>
                                                                          <option value={''}>Select the role</option>
                                                                          <option value="company-administrator">Company Administrator</option>
                                                                          <option value="company-portal-user">Company Portal User</option>
                                                                          <option value="company-fleet-manager">Company Fleet Manager</option>
                                                                      </select>
                                                                      {errors.role && (
                                                                          <div className="text-danger">{errors.role.message}</div>
                                                                      )}
                                                                    </div>
                                                                <div>
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
        </>
    )
}

export default UserForm