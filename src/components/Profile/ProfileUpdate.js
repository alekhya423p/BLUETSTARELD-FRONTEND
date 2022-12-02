import React, { useState, useEffect } from 'react';
// import { useHistory } from 'react-router-dom';
import { updateProfile } from '../../actions/authAction'
// import { Error, Loading } from '../../shared';
import { UPDATE_PROFILE_RESET } from '../../constants/actionTypes'
import { toast } from 'react-toastify';
import Loading from '../layout/Loading';
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { VALIDATE_NAME } from '../../constants/constants';

const ProfileUpdate = (props) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loading, message, user } = useSelector(state => state.updateProfile)

    useEffect(() => {
        return () => {
            dispatch({ type: UPDATE_PROFILE_RESET })
        }
    }, [dispatch]);
    

    useEffect(() => {
        if (message) {
            toast.success(message)
        }
    }, [message])

    const [first_name, setFirstName] = useState();
    const [last_name, setLastName] = useState();
    const [email, setEmail] = useState();
    const [contact_no, setContactNo] = useState();
    // const [isUpdated, setIsUpdated] = useState(false);
    // const [password, setPassword] = useState()
    // const [confirmPassword, setConfirmPassword] = useState();

    const validationSchema = yup.object().shape({
        firstName: yup.string().required('First name is required').matches(VALIDATE_NAME, "Only alphabets are allowed for this field ").min(2, 'First name should be greater than 2').max(30, 'First name should be less than 30').test('firstName', 'First name is required', (value) => value?.trim()),
        lastName: yup.string().required('Last Name is required').matches(VALIDATE_NAME, "Only alphabets are allowed for this field").min(2, 'Last name should be greater than 2').max(30, 'Last name should be less than 30').test('lastName', 'Last name is required', (value) => value?.trim()),
        // email: yup.string().required('Email is required').email('Invaild Email'),
        phoneNumber: yup.string().required('Phone Number is required'),
        landingPage: yup.string().required('Landing Page is required'),
        // password: yup.string().max(14, 'Must be 14 characters or less').min(8, 'Must be 8 characters or more').required('Please Enter your password'),
        // confirmPassword: yup.string().required('Confirm passwords is required').oneOf([yup.ref('password'), null], 'Passwords must match'),
    });
    const { register, handleSubmit, reset, setValue, formState: { errors, ...formState } } = useForm({
        mode: "onBlur",
        resolver: yupResolver(validationSchema),
    });

       

    const { isValid } = formState
    const onSubmit = async (values, e) => {
        values._id = (user._id !== false) ? user._id : ''
        dispatch(updateProfile(values, navigate))
    };
    useEffect(() => {
        if (user) {
            setValue('firstName', user.firstName)
            setValue('lastName', user.lastName)
            setValue('landingPage', user.landingPage)
            setValue('phoneNumber', user.phoneNumber)
            setValue('companyId', user.companyId)
            setFirstName(user?.firstName)
            setLastName(user?.lastName)
            setEmail(user?.email)
            setContactNo(user?.phoneNumber)
        } 
    }, [reset, setValue, user]);

  
    return (
        <div className="card">
            <div className="card-body">
                <form className="search-data add-driver" onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-4">
                                <label htmlFor="validationCustom01" className="form-label">First name <span className='text-danger'>*</span></label>
                                <input type="text"  {...register('firstName')}  onClick={(e) => setFirstName(e.target.value)} defaultValue={first_name} className="form-control" placeholder="First name" required="" />
                                {errors.firstName && (
                                    <div className="text-danger">{errors.firstName.message}</div>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-4">
                                <label htmlFor="validationCustom02" className="form-label">Last name <span className='text-danger'>*</span></label>
                                <input type="text" {...register('lastName')}  onClick={(e) => setLastName(e.target.value)} defaultValue={last_name} className="form-control" id="validationCustom02" placeholder="Last name" required="" />
                                {errors.lastName && (
                                    <div className="text-danger">{errors.lastName.message}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <div className="mb-4 e-mail-icon">
                                <label className="form-label">E-mail <span className='text-danger'>*</span></label>
                                <input type="text" onClick={(e) => setEmail(e.target.value)} defaultValue={email} className="form-control" placeholder="" disabled required="" />
                                {errors.email && (
                                    <div className="text-danger">{errors.email.message}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <div className="mb-4 phone-icon">
                                <label className="form-label">Phone <span className='text-danger'>*</span></label>
                                <input id="input-mask" {...register('phoneNumber')}  onClick={(e) => setContactNo(e.target.value)} defaultValue={contact_no} placeholder="Tel:(+1)( _ ) - (_____)" className="form-control input-mask" data-inputmask="'mask': '99-9999999999'" inputMode="text" />
                                {errors.phoneNumber && (
                                    <div className="text-danger">{errors.phoneNumber.message}</div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                            <div className="col-md-12">
                                <div className="mb-4">
                                    <label htmlFor="validationCustom01" className="form-label">Landing Page <span className='text-danger'>*</span></label>
                                    <select className="form-control form-select" {...register('landingPage')}>
                                        <option value={''}>Select</option>
                                        <option value="/dashboard">Dashboard</option>
                                        <option value="/driver-hos">Driver HOS</option>
                                        <option value="/logs">Logs</option>
                                    </select>
                                    {errors.landingPage && (
                                    <div className="text-danger">{errors.landingPage.message}</div>
                                )}
                                </div>
                            </div>
                    </div>
                    {/* <div className="row">
                        <div className="col-md-6">
                            <div className="mb-4">
                                <label htmlFor="validationCustom01" className="form-label">Password </label>
                                <input type="text"  {...register('password')} onClick={(e) => setPassword(e.target.value)} defaultValue={password} className="form-control" placeholder="New Passowrd" required="" />
                                {errors.password && (
                                    <div className="text-danger">{errors.password.message}</div>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-4">
                                <label htmlFor="validationCustom02" className="form-label">Confirm Password </label>
                                <input type="text"  {...register('confirmPassword')} onClick={(e) => setConfirmPassword(e.target.value)} defaultValue={confirmPassword} className="form-control" placeholder="Confirm Passowrd" required="" />
                                {errors.confirmPassword && (
                                    <div className="text-danger">{errors.confirmPassword.message}</div>
                                )}
                            </div>
                        </div>
                    </div> */}
                    <div className="dropdown-divider m-0 pb-4"></div>
                    <div className="d-inline-flex float-end me-2">
                        <div className="col-sm-5">
                            <div className="form-group">
                                <button className="btn cancel-btn btn border border-color d-block  bg-white ">Cancel</button>
                            </div>
                        </div>
                        <div className="col-sm-8">
                            <div className="form-group">
                                <button type="submit" disabled={isValid} className="btn d-block add-button" >{ loading ? <Loading /> : 'Save Changes' }</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default ProfileUpdate;