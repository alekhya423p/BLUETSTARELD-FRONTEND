import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { resetPassword } from '../../actions/authAction'
// import { RESET_PASSWORD_RESET } from '../../constants/actionTypes'
import * as Yup from "yup";
import { useFormik } from 'formik';
import Loading from "../layout/Loading";
import logo from '../../assets/BLE-Logo.png'
import { toast } from 'react-toastify'

const ResetPassword = ({ match }) => {
    const navigate = useNavigate();
    const param = useParams();
    const [id, setId] = useState('');
    const [inputSecret, setSecret] = useState('');
    const [inputType, setType] = useState('');
    const dispatch = useDispatch()
    const { loading } = useSelector(state => state.resetPassword)
    const [loader, setLoader] = useState(false);
    useEffect(() => {
        // if (!localStorage.getItem('forgotPassword')) {
        //     navigate.push('/')
        // }
        
        const search = window.location.search;
            const params = new URLSearchParams(search);
            const id = params.get('id');
            const type = param.type;
            const secret = params.get('secret');
        if (id && secret&& type) {
            setId(id);
            setSecret(secret);
            setType(type);
        }else {
            toast.error('Url is invalid')
            navigate('/login')
        }
    }, [navigate, param])

    const formik = useFormik({
		initialValues: {
			password: '',
			passwordConfirmation: '',
		},
		validationSchema: Yup.object({
            password: Yup.string().max(14, 'Must be 14 characters or less').min(8, 'Must be 8 characters or more').required('Please Enter your password'),
            passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Please Enter your confirmation password'),
		}),
		onSubmit: (value, { resetForm }) => {
            setLoader(true);
            const formData = {
                newPassword: value.password,
                confirmPassword: value.passwordConfirmation,
                id: id,
                secret: inputSecret,
                type: inputType,
             };
           
             dispatch(resetPassword(formData, navigate))
            //  dispatch({ type: RESET_PASSWORD_RESET })
			//  resetForm();
		},
	});
    
    return (
        <>
        <div className="wrapper-page">
            <div className="container-fluid p-0">
                <div className="card">
                    <div className="card-body">
                        <div className="text-center mt-4">
                            <div className="mb-3">
                                <Link to="/" className="auth-logo">
                                <img src={logo} className="logo-dark mx-auto" alt="logo"/>
                                    
                                </Link>
                            </div>
                        </div>
                        <h4 className=" text-center font-size-18"><b>Reset Password</b></h4>
        
                        <div className="p-3">
                            <form className="form-horizontal mt-3" onSubmit={formik.handleSubmit}>
                                <div className="form-group mb-3">
                                    <div className="col-xs-12">
                                        <input type="password" {...formik.getFieldProps('password')} className="form-control" placeholder="Password"/>
                                        {formik.touched.password && formik.errors.password ? (
                                            <div className="text-danger p-1">{formik.errors.password}</div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="form-group mb-3">
                                    <div className="col-xs-12">
                                        <input type="password" {...formik.getFieldProps('passwordConfirmation')} className="form-control" placeholder="Password Confirmation"/>
                                        {formik.touched.passwordConfirmation && formik.errors.passwordConfirmation ? (
                                            <div className="text-danger p-1">{formik.errors.passwordConfirmation}</div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="form-group pb-2 text-center row mt-3">
                                    <div className="col-12">
                                        <button className=" btn btn-primary custom-btn  w-100 waves-effect" type="submit" disabled={loading ? true : false}>{(loader && loading) ? <Loading /> : 'Update'} </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default ResetPassword
