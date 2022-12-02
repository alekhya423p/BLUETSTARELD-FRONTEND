import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from 'react-router-dom';
import { resendVerificationEmail } from "../../actions/authAction";
import { VERIFY_EMAIL_RESET, RESEND_VERIFY_EMAIL_RESET } from '../../constants/actionTypes'
import { useFormik } from 'formik';
import * as Yup from "yup";
import Loading from "../layout/Loading";
import logo from '../../assets/BLE-Logo.png'

const VerifyEmail = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector(state => state.verifyEmail)
    const { user } = useSelector(state => state.getUser)

    useEffect(() => {
        dispatch({ type: VERIFY_EMAIL_RESET })
        // dispatch(getUser(match.params.id))
    }, [dispatch])

    useEffect(() => {
        if (user && user.isVerified) {
            navigate('/login')
        }
    }, [user, navigate])
    
    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().required('Email is required').email("Email is not valid"),
        }),
        onSubmit: (value, { resetForm }) => {
            dispatch({ type: VERIFY_EMAIL_RESET })
            dispatch({ type: RESEND_VERIFY_EMAIL_RESET })
            dispatch(resendVerificationEmail(value.email, navigate))
            // resetForm();
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
                                    <img src={logo}  className="logo-dark mx-auto" alt="logo"/>
                                    
                                </Link>
                            </div>
                        </div>
                        <h4 className=" text-center font-size-18"><b>Verify Email</b></h4>
        
                        <div className="p-3">
                            <form className="form-horizontal mt-3" onSubmit={formik.handleSubmit}>
                                <div className="form-group mb-3">
                                    <div className="col-xs-12">
                                        <input type="text" {...formik.getFieldProps('email')} className="form-control" placeholder="Email"/>
                                        {formik.touched.email && formik.errors.email ? (
                                            <div className="text-danger p-1">{formik.errors.email}</div>
                                        ) : null}
                                    </div>
                                </div>
        
                                <div className="form-group pb-2 text-center row mt-3">
                                    <div className="col-12">
                                        <button className=" btn btn-primary custom-btn  w-100 waves-effect" type="submit" disabled={loading ? true : false}>{loading ? <Loading /> : 'Verify Email'} </button>
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

export default VerifyEmail