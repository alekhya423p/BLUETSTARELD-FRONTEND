import React from "react"
import { useDispatch, useSelector} from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../actions/authAction';
import * as Yup from "yup";
import { useFormik } from 'formik';
import Loading from "../layout/Loading";
import logoNight from '../../assets/BLE-Logo.png';

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loading } = useSelector(state => state.auth)
    const formik = useFormik({
        initialValues: {
            password: '',
            email: '',
            rememberMe: false
        },
        validationSchema: Yup.object({
            email: Yup.string().required('Email is required').email("Email is not valid"),
            password: Yup.string().max(14, 'Must be 12 characters or less').min(8, 'Must be 6 characters or more').required('Please Enter your password'),
            rememberMe: Yup.boolean()
        }),
        onSubmit: (value, { resetForm }) => { 
            dispatch(login(value, navigate))
            // resetForm();
        },
    });
   
    return (
        <>
        <div className="wrapper-page">
            <div className="container-fluid p-0">
                <div className="card ">
                    <div className="card-body">
                        <div className="text-center mt-4">
                            <div className="mb-3">
                                <div  className="auth-logo">
                                    <img src={logoNight}  className="logo-dark mx-auto" alt="logo" width="65"/>
                                </div>
                            </div>
                            <h4 className="text-center font-size-18 mb-3"><b>Login to your Account</b></h4>
                        </div>
                        <div className="row">
                            <div className="col-md-12 mx-0">
                                {/* <div className="text-danger">{loginResponse}</div> */}
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="form-card">
                                        <div className="form-group mb-3 row">
                                            <div className="col-12">
                                                <label className="form-label ms-1 mb-1 font-light">E-mail <span className="required text-danger ds-none">*</span></label>
                                                <input type="text" name='email' {...formik.getFieldProps('email')} placeholder="Enter your email" className="form-control"/>
                                                {formik.touched.email && formik.errors.email ? (
                                                    <div className="text-danger">{formik.errors.email}</div>
                                                ) : null}
                                            </div>
                                        </div>
                                            
                                        <div className="form-group mb-3 row">
                                            <label className="form-label ms-1 mb-1 font-light">Password <span className="required text-danger ds-none">*</span></label>
                                            <div className="col-12">
                                                <input type="password" name='password' {...formik.getFieldProps('password')} placeholder="Password" className="form-control"/>
                                                {formik.touched.password && formik.errors.password ? (
                                                    <div className="text-danger">{formik.errors.password}</div>
                                                ) : null}
                                            </div>
                                        </div>
                                                
                                        <div className="form-group mb-3 row">
                                            <div className="col-12">
                                                <button className="btn btn-primary custom-btn w-100 waves-effect waves-light" disabled={loading ? true : false} type="submit"> {loading ? <Loading /> : 'Log In'}</button>
                                            
                                            </div>
                                        </div>
            
                                    </div>
                                </form>
                                <div className="form-group mb-3 row mt-2">
                                    <div className="col-sm-12">
                                        <Link to="/forgot-password" className="float-end"><strong>Forgot password</strong></Link>
                                    </div>
                                </div>
                                {/* <div className="col-12 mt-3 border-top text-center">
                                    <label className="pt-4">Don't have an Account? <Link to="" aria-disabled="true" className="disabled-link">Create your  Account</Link></label>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    
    )
}

export default Login