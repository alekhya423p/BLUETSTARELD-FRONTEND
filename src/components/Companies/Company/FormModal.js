import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from 'react-bootstrap';
import * as yup from "yup";
import { createCompany, loadCompanies } from "../../../actions/companyAction";
import { yupResolver } from '@hookform/resolvers/yup';
import Loading from "../../layout/Loading";
import Select from 'react-select';
import db from "../../../data/db.json";
import { ALPHABATES_NUMERIC, VALIDATE_NAME, VALIDATE_PASSWORD, VALIDATE_US_PHONE_NUMBER } from '../../../constants/constants';
import { formatPhoneNumber } from "../../../functions/functions";
import { useNavigate } from "react-router-dom";


const FormModal = (props) => {

    const dispatch = useDispatch();
    const [options, setOptions] = useState();
    const { loading } = useSelector(state => state.logs)
    const { isMode } = useSelector(state => state.dashboard)

    const validationSchema = yup.object().shape({
        companyName: yup.string().required('Company Name is required').matches(ALPHABATES_NUMERIC, "Only alphanumeric values are allowed for company name").max(20, 'Company Name should be less than 20').test('companyName', 'Company name is required', (value) => value?.trim()),
        dotNumber: yup.string().required("Dot number is required").max(8, 'Dot number should be of length 8'),
        address: yup.string().required("Company Address is required").max(50, 'Company Name should be less than 50'),
        terminalAddress: yup.string().required("Terminal Address is required").max(50, 'Company Name should be less than 50'),
        timeZone: yup.string().required("timeZone  is required"),
        phoneNumber: yup.string().required('Mobile Number is required').matches(VALIDATE_US_PHONE_NUMBER, "Phone number is not valid"),
        firstName: yup.string().required('First name is required').matches(VALIDATE_NAME, "Only alphabets are allowed for this field ").min(2, 'First name should be greater than 2').max(30, 'First name should be less than 30').test('firstName', 'First name is required', (value) => value?.trim()),
        lastName: yup.string().required('Last Name is required').matches(VALIDATE_NAME, "Only alphabets are allowed for this field").min(2, 'Last name should be greater than 2').max(30, 'Last name should be less than 30').test('lastName', 'Last name is required', (value) => value?.trim()),
        email: yup.string().required('Email is required').email("Email is invalid").max(40, 'Email should be less than 40'),
        password: yup.string().min(8, 'Must be 8 characters or more').max(12, 'Password must be of 12 characters').required('Please Enter your password').matches(VALIDATE_PASSWORD, "Must contain 8 characters, one uppercase, one lowercase, one number and one special case character"),
        confirmPassword: yup.string().required('Confirm password is required').oneOf([yup.ref('password'), null], 'Passwords must match'),



    });

    const { register, handleSubmit, reset, setValue, formState: { errors, ...formState } } = useForm({
        mode: "onBlur",
        resolver: yupResolver(validationSchema),
    }),
        [inputModalTitle, setInputModalTitle] = useState(""),
        [inputTimezone, setInputTimeZone] = useState(""),
        [inputCompanyName, setInputCompanyName] = useState(""),
        [inputUSDotNumber, setInputUSDOTNumber] = useState(""),
        [inputCompanyAddress, setInputCompanyAddress] = useState(""),
        [inputTerminalAddress, setInputTerminalAddress] = useState(""),
        [inputPhoneNumber, setInputPhoneNumber] = useState(""),
        [inputFirstName, setInputFirstName] = useState(""),
        [inputLastName, setInputLastName] = useState(""),
        [inputEmail, setInputEmail] = useState(""),
        [inputPassword, setInputPassword] = useState(""),
        [inputConfirmPassword, setInputConfirmPassword] = useState("")



    const { isValid } = formState
    const navigate = useNavigate()
    const onSubmit = async (values, e) => {
        dispatch(createCompany(values ,navigate));
        console.log(loading,63)
        if(values){
            dispatch(loadCompanies(props?.searchKey,props?.searchStatus,props?.searchCompany))
        }
        props.close();
        reset();
    };

    useEffect(() => {
        setValue('companyName', '')
        setValue('dotNumber', '')
        setValue('address', '')
        setValue('terminalAddress', '')
        setValue('timeZone', '')
        setValue('firstName', '')
        setValue('lastName', '')
        setValue('phoneNumber', '')
        setValue('email', '')
        setValue('password', '')
        setValue('confirmPassword', '')
        setInputCompanyName("");
        setInputCompanyAddress("");
        setInputTerminalAddress("");
        setInputUSDOTNumber("");
        setInputTimeZone("");
        setInputPhoneNumber("");
        setInputFirstName("");
        setInputLastName("");
        setInputEmail("");
        setInputPassword("");
        setInputConfirmPassword("");
        setInputModalTitle("Create Company");
        reset();
    }, [reset, setValue, dispatch, props]);
    useEffect(() => {
        if (db.timeZone) {
            var options = db.timeZone.map((item) => {
                return { value: item.value, label: item.key }
            })
        }
        setOptions(options);
    }, [props, dispatch])

    const handleInputTimeZone = (e) => {
        setInputTimeZone(e);
        setValue('timeZone', e.value)
    }
    const handleInput = (e) => {
        const formattedPhoneNumber = formatPhoneNumber(e.target.value);
        setInputPhoneNumber(formattedPhoneNumber);
        setValue('phoneNumber', formattedPhoneNumber)
    };
    return (
        props.open && (
            <Modal show={props.open} onHide={props.close} className={isMode}>
                <Modal.Header>
                    <Modal.Title id="contained-modal-title">{inputModalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="search-data add-driver" onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body">
                            <div className="row">
                                <div className='col-sm-6'>
                                    <label>Company Name</label>
                                </div>
                                <div className="col-sm-6">
                                    <label>Time Zone</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className='col-sm-6'>
                                    <input type="text" placeholder="Company Name" className="form-control" {...register('companyName')} defaultValue={inputCompanyName} onChange={(e) => setInputCompanyName(e.target.value)} />
                                    {errors.companyName && (
                                        <div className="text-danger">{errors.companyName.message}</div>
                                    )}
                                </div>
                                <div className="col-sm-6">
                                    <Select className="assign_vehicles" defaultValue={inputTimezone} onChange={(e) => handleInputTimeZone(e)} name="timezone" options={options} placeholder="Select a Time Zone" />
                                </div>
                            </div>
                            <br />
                            <div className="row">
                                <div className="col-sm-12">
                                    <label>USDOT Number</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <input type="text" className="form-control" placeholder="USDOT Number" {...register('dotNumber')} defaultValue={inputUSDotNumber} onChange={(e) => setInputUSDOTNumber(e.target.value)} />
                                    {errors.dotNumber && (
                                        <div className="text-danger">{errors.dotNumber.message}</div>
                                    )}
                                </div>
                            </div><br />
                            <div className="row">
                                <div className="col-sm-12">
                                    <label>Company Address</label>
                                    <input type="text" className="form-control" placeholder="Company Address" {...register('address')} defaultValue={inputCompanyAddress} onChange={(e) => setInputCompanyAddress(e.target.value)} />
                                    {errors.address && (
                                        <div className="text-danger">{errors.address.message}</div>
                                    )}
                                </div>
                            </div><br />
                            <div className="row">
                                <div className="col-sm-12">
                                    <label>Terminal Address</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <input type="text" className="form-control" placeholder="Terminal Address" {...register('terminalAddress')} defaultValue={inputTerminalAddress} onChange={(e) => setInputTerminalAddress(e.target.value)} />
                                    {errors.terminalAddress && (
                                        <div className="text-danger">{errors.terminalAddress.message}</div>
                                    )}
                                </div>
                            </div><br />
                            <div className="company_admin_heading">
                                <h4>Company Adminstrator User</h4>
                                <p>This will be company owners information. Plese input company owners legal name.</p>    
                            </div>
                            <div className="form-group row">
                            <div className="col-sm-6">
                                    <label className="form-label ms-1 mb-1 font-light">First Name </label>
                                    
                                        <input className="form-control"
                                            type="text"
                                            placeholder="First Name"
                                            {...register('firstName')} defaultValue={inputFirstName}
                                            onChange={(e) => setInputFirstName(e.target.value)}
                                        />
                                        {errors.firstName && (
                                            <div className="text-danger">{errors.firstName.message}</div>
                                        )}
                                    </div>
                                    <div className="col-sm-6">
                                    <label className="form-label ms-1 mb-1 font-light">Last Name</label>
                                    
                                        <input className="form-control"
                                            type="text"
                                            placeholder="Last Name"
                                            {...register('lastName')} defaultValue={inputLastName}
                                            onChange={(e) => setInputLastName(e.target.value)}
                                        />
                                        {errors.lastName && (
                                            <div className="text-danger">{errors.lastName.message}</div>
                                        )}
                                    </div>

                                </div><br />
                            <div className="form-group row">
                                <div className="col-12">
                                    <label className="form-label ms-1 mb-1 font-light">Phone Number</label>
                                    <div className="driver_phone">
                                    <input className="form-control"
                                        type="text" name="phoneNumber"
                                        placeholder="Phone Number"
                                        {...register('phoneNumber')} defaultValue={inputPhoneNumber}
                                        onChange={(e) => handleInput(e)}
                                        value={inputPhoneNumber}
                                    />
                                    <i class="ti ti-phone"></i>
                                    </div>
                                    {errors.phoneNumber && (
                                        <div className="text-danger pt-1">{errors.phoneNumber.message}</div>
                                    )}
                                </div>
                                </div><br />
                                <div className="form-group row">
                                    <label className="form-label ms-1 mb-1 font-light">E-mail </label>
                                    <div className="col-12">
                                        <div className="driver_email">
                                        <input className="form-control"
                                            type="text"
                                            placeholder="Enter Your Email"
                                            {...register('email')} defaultValue={inputEmail}
                                            onChange={(e) => setInputEmail(e.target.value)}
                                        />
                                        <i class="ti ti-mail"></i>
                                        </div>
                                        {errors.email && (
                                            <div className="text-danger">{errors.email.message}</div>
                                        )}
                                    </div>

                                </div><br />
                                
                                <div className="form-group row">
                                <div className="col-sm-6">
                                    <label className="form-label ms-1 mb-1 font-light">Password </label>
                                    
                                        <input className="form-control"
                                            type="password"
                                            placeholder="At least 8 characters"
                                            {...register('password')} defaultValue={inputPassword}
                                            onChange={(e) => setInputPassword(e.target.value)}
                                        />
                                        {errors.password && (
                                            <div className="text-danger">{errors.password.message}</div>
                                        )}
                                    </div>
                                    <div className="col-sm-6">
                                    <label className="form-label ms-1 mb-1 font-light">Confirm Password </label>
                                    
                                        <input className="form-control"
                                            type="password"
                                            placeholder="At least 8 characters"
                                            {...register('confirmPassword')} defaultValue={inputConfirmPassword}
                                            onChange={(e) => setInputConfirmPassword(e.target.value)}
                                        />
                                        {errors.confirmPassword && (
                                            <div className="text-danger">{errors.confirmPassword.message}</div>
                                        )}
                                    </div>

                                </div>

                            </div>
                        <div className="modal-footer">
                            <button type="button" onClick={props.close} className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button disabled={(props.data.mode !== 'edit') && isValid} type="submit" className="btn btn-primary">{loading ? <Loading /> : 'Confirm'}</button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        )
    );
}

export default FormModal;