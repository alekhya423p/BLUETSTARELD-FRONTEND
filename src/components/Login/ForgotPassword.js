import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from 'react-router-dom';
import { getUserByEmail } from "../../actions/authAction";
import { useFormik } from 'formik';
import * as Yup from "yup";
import Loading from "../layout/Loading";
const ForgotPassword = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector(state => state.getUserByEmail)
    const { isAuthenticated } = useSelector(state => state.auth)

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/login')
        }
    }, [isAuthenticated, navigate])
    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().required('Email is required').email("Email is not valid"),
        }),
        onSubmit: (value, { resetForm }) => {
            dispatch(getUserByEmail(value, navigate))
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
                                    <img src="assets/images/BLE-Logo.png"  className="logo-dark mx-auto" alt="logo"/>
                                    
                                </Link>
                            </div>
                        </div>
                        <h4 className=" text-center font-size-18"><b>Reset Password</b></h4>
        
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
                                        <button className=" btn btn-primary custom-btn  w-100 waves-effect" type="submit" disabled={loading ? true : false}>{loading ? <Loading /> : 'Send Email'} </button>
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

export default ForgotPassword