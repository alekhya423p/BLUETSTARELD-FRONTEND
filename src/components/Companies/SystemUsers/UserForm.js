import React, { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { storeSystemUser, updateSystemUser, deactivateUser, loadUser } from "../../../actions/systemUserActions";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import * as actionTypes from '../../../constants/actionTypes';
import Loading from "../../layout/Loading";
import { VALIDATE_NAME } from "../../../constants/constants";
import Select from 'react-select';
import { loadCompanies } from "../../../actions/companyAction";

const UserForm = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch();
    const params = useParams();
    const { isMode } = useSelector(state => state.dashboard)
    const { user, loading } = useSelector(state => state.systemUsers)
    const { companies } = useSelector(state => state.companyDetail)
    const validationSchema = yup.object().shape({
        firstName: yup.string().required('First Name is required').matches(VALIDATE_NAME, 'Only alphabets allowed for this field').min(2, 'First Name should be greater than 2').max(30, 'First Name should be less than 30').test('firstName', 'First Name is required', (value) => value?.trim()),
        lastName: yup.string().required('Last Name is required').matches(VALIDATE_NAME, 'Only Characters are allowed for this field').min(2, 'Last Name should be greater than 2').max(30, 'Last Name should be less than 30').test('lastName', 'Last Name is required', (value) => value?.trim()),
        email: yup.string().required('Email is required').email('Invaild Email').max(50, 'Email should be less than 50'),
        role: yup.string().required('Role is required'),
        nickName: yup.string().required('Nick Name is required'),
        isEditble: yup.boolean(),
        accessAllCompanies: yup.boolean(),
        password: yup.string().when('isEditble', {
            is: true,
            then: yup.string().required('Please Enter your password').max(14, 'Must be 14 characters or less').min(8, 'Must be 8 characters or more'),
        }),
        confirmPassword: yup.string().when('isEditble', {
            is: true,
            then: yup.string().required('Confirm passwords is required').oneOf([yup.ref('password'), null], 'Passwords must match'),
        }),
        // companiesId: yup.string().when('accessAllCompanies', {
        //     is : true,
        //     then : yup.array().of(yup.string()).nullable().required("Companies are required") 
        // })
    });
    const { register, handleSubmit, reset, setValue, formState: { errors, ...formState } } = useForm({
        mode: "onBlur",
        resolver: yupResolver(validationSchema),
    }),
        [inputUserTitle, setInputUserTitle] = useState(""),
        [allOptions, setAllOptions] = useState(""),
        [loader, setLoader] = useState(false),
        [editLoader, setEditLoader] = useState(false),
        [inputEdit, setInputEdit] = useState(""),
        [inputIsDisabled, setInputIsDisabled] = useState(false),
        [companyId, setCompanyId] = useState([]);
    // const [showValidate, setShowValidate] = useState(false);

    const { isValid } = formState
    const [showError, setShowError ] = useState(false);
    const onSubmit = async (values, e) => {
        delete values.confirmPassword;
        delete values.isEditble;
        if (values.password === '') delete values.password;
        values.timeZone = "America/Chicago";
        if(values.accessAllCompanies === false && values.companiesId === "") {
            // console.log("message should show ");
            return setShowError(true);
        }
        if (values.companiesId === ""){
            delete values.companiesId;
        }
        // if(values.accessAllCompanies === false){
        //     delete values.accessAllCompanies;
        // }
        if (inputEdit === 'edit') {
            values.id = (user._id !== false) ? user._id : ''
        }
        (inputEdit && inputEdit === "edit") ? dispatch(updateSystemUser(values, navigate)) : dispatch(storeSystemUser(values, navigate));
        setEditLoader(true)
    };

    useEffect(() => {
        dispatch(loadCompanies())
        if (params.id) {
            setInputEdit('edit')
            dispatch(loadUser(params?.id))
        } else {
            dispatch({ type: actionTypes.LOAD_SYSTEM_USER_RESET })
        }
    }, [params, dispatch])

    useEffect(() => {
        if (Object.keys(user).length !== 0) {
            if (user.accessAllCompanies) setInputIsDisabled(true)
            setCompanyId(user.companiesObject)
            setValue('firstName', user.firstName)
            setValue('lastName', user.lastName)
            setValue('email', user.email)
            setValue('nickName', user.nickName)
            setValue('role', user.role)
            setValue('accessAllCompanies', user.accessAllCompanies)
            setValue('isEditble', false)
            setValue('companiesId', user.companiesObject ? user.companiesObject?.map((companies) => companies.value) : '')
            setInputUserTitle("Edit");
            setInputEdit("edit");
        } else {
            setValue('firstName', '')
            setValue('lastName', '')
            setValue('email', '')
            setValue('nickName', '')
            setValue('role', '')
            setValue('accessAllCompanies', '')
            setCompanyId('')
            setValue('companiesId', '')
            setValue('isEditble', true)
            setInputEdit("add");
            setInputUserTitle("");
        }
    }, [reset, setValue, user, inputEdit]);

    const handleDeactivate = (data) => {
        setLoader(true);
        dispatch(deactivateUser(data._id, navigate));
    }

    const handleCompanyName = (companies) => {
        setCompanyId(companies);
        let companyIds = [];
        companies.map((comp) => companyIds.push(comp.value));
        setValue('companiesId', companyIds);
    }

    const handleAccessChange = (e) => {

        if (e.target.value === 'on' && inputIsDisabled === false) {
            setInputIsDisabled(true)
        } else {
            setInputIsDisabled(false)
        }
    }

    useEffect(() => {
        if (companies) {
            var options = companies.map((item) => {
                return { value: item._id, label: item.companyName }
            })
            setAllOptions(options)
        }
    }, [companies])

    return (
        <>
            <div id="layout-wrapper" className={isMode}>
                <div className="">
                    <div className="page-content">
                        <div className="container-fluid">
                            <div className="row loader_class">
                                {loading ? <div className="companies-loader"><Loading /></div> :
                                    <div className="col-8 mt-3 mx-auto">
                                        <div className="page-title-box">
                                            <form className="search-data add-driver" onSubmit={handleSubmit(onSubmit)}>
                                                <div className="row flex-row">
                                                    <div className="float-start col-6">
                                                        <h3 className="text-capitalize"><strong>{inputUserTitle} User Info</strong></h3>
                                                    </div>
                                                    <div className="col-6 pe-2">
                                                        <div className="create-driver-btns">
                                                            <div className="col-sm-3 btn-style-right pr-20">
                                                                <div className="form-group">
                                                                    <Link to={'/companies'} className="btn w-100 cancel-btn btn border border-color d-block  bg-white ">Cancel</Link>
                                                                </div>
                                                            </div>
                                                            {inputEdit === 'edit' ?
                                                                <div className="col-sm-4 btn-style-right pr-20" >
                                                                    <div className="form-group">
                                                                        <button type="button" onClick={() => handleDeactivate(user)} className={user.isActive === true ? 'btn w-100 btn-outline-danger text-danger bg-white border-radius-8' : 'btn w-100 btn-outline-success text-success bg-white border-radius-8'}>{(loader && loading) ? <Loading /> : user.isActive === true ? 'Deactivate' : 'Activate'}</button>
                                                                    </div>
                                                                </div> : ''}
                                                            <div className="col-sm-4 btn-style-right">
                                                                <div className="form-group">
                                                                    <button type="submit" disabled={isValid} className="btn d-block w-100 add-button">
                                                                        {inputUserTitle === 'Add' ? <i className="dripicons-plus font-size-20 vertical-align-top"></i> : ''} {(editLoader && loading) ? <Loading /> : inputUserTitle === 'Add' ? 'Add User' : 'Save Changes'} </button>
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
                                                                            <input type="text" className="form-control" placeholder="" {...register('email')} required="" />
                                                                            {errors.email && (
                                                                                <div className="text-danger">{errors.email.message}</div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-md-12">
                                                                        <div className="mb-4">
                                                                            <label className="form-label">Nickname <span className="text-danger">*</span> </label>
                                                                            <input className="form-control " {...register('nickName')} inputMode="text" />
                                                                            {errors.nickName && (
                                                                                <div className="text-danger">{errors.nickName.message}</div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-md-6">
                                                                        <div className="mb-4">
                                                                            <label htmlFor="validationCustom01" className="form-label">Password </label>
                                                                            <input type="password" className="form-control" placeholder="New Password" {...register('password')} required="" />
                                                                            {errors.password && (
                                                                                <div className="text-danger">{errors.password.message}</div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <div className="mb-4">
                                                                            <label htmlFor="validationCustom02" className="form-label">Confirm Password </label>
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
                                                                            <label htmlFor="validationCustom01" className="form-label">Role</label>
                                                                            <select className="form-control form-select" {...register('role')}>
                                                                                <option value={''}>Select</option>
                                                                                <option value="system-technician">System Technicians</option>
                                                                                <option value="system-administrator">System Admin</option>
                                                                            </select>
                                                                            {errors.role && (
                                                                                <div className="text-danger">{errors.role.message}</div>
                                                                            )}
                                                                        </div>
                                                                        <div>
                                                                        </div>
                                                                        <div className="row">
                                                                            <div className="col-md-12">
                                                                                <div className="mb-2 input_text_color">
                                                                                    <label htmlFor="validationCustom01" className="form-label">Access to Companies</label><br />
                                                                                    <input type="checkbox"  {...register('accessAllCompanies')} required=""
                                                                                        onChange={(e) => handleAccessChange(e)} />  Allow Access to ALL Companies
                                                                                    <p className="allow_access_policy pt-2">Cheking this box will allow user to view and access all companies. System will discard the selected companies in the form field below.</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="row">
                                                                            <div className="col-md-12">
                                                                                <div className="mb-2">
                                                                                    <label htmlFor="validationCustom01" className="form-label">Select Companies</label><br />
                                                                                    <Select
                                                                                        {...register("companiesId")}
                                                                                        value={companyId}
                                                                                        isDisabled={inputIsDisabled}
                                                                                        className="select-boz-style" isMulti options={allOptions} onChange={(e) => handleCompanyName(e)} placeholder="" />
                                                                                </div>
                                                                                {/* {errors.companiesId && (
                                                                                        <div className="text-danger">{errors.companiesId.message}</div>)} */}
                                                                                {showError ? 
                                                                                <div className="text-danger">Please select any one of the above </div> : ''}
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
                                }</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserForm