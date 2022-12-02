import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { UPDATE_PASSWORD_RESET } from '../../constants/actionTypes'
import { updatePassword } from '../../actions/authAction'
import * as Yup from "yup";
import { useFormik } from 'formik';
import Loading from '../layout/Loading';

const ChangePassword = () => {

    const dispatch = useDispatch()
    const { message, loading } = useSelector(state => state.updatePassword)
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        if (message) {
            toast.success(message)
        }

    }, [message])

    useEffect(() => {
        return () => { dispatch({ type: UPDATE_PASSWORD_RESET }) }
    }, [dispatch])

    const formik = useFormik({
        initialValues: {
            oldPassword: '',
            newPassword: '',
            passwordConfirmation: '',
        },
        validationSchema: Yup.object({
            oldPassword: Yup.string().required("Old password is required"),
            newPassword: Yup.string()
                .min(6, 'Must be 6 characters or more')
                .max(12, 'Atmost 12 characters or less')
                .required('Please Enter your password')
                .matches(
                    /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{6,12}$/,
                    "Must contain 6 characters, one uppercase, one lowercase, one number and one special case character"
                ),
            passwordConfirmation: Yup.string()
                .oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
        }),
        onSubmit: (value, { resetForm }) => {
            setLoader(true);
            const password = {
                oldPassword: value.oldPassword,
                newPassword: value.newPassword,
            };
            dispatch({ type: UPDATE_PASSWORD_RESET })
            dispatch(updatePassword(password))
            resetForm();
        },
    });
    return (
        <>
            <div className="col-md-12">
                <div className="card">
                    <div className="card-body">
                        <form className="search-data add-driver" onSubmit={formik.handleSubmit}>
                            <h6>Current Password <span className='text-danger'>*</span></h6>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="mb-4">
                                        <input type="password" {...formik.getFieldProps('oldPassword')} className="form-control" placeholder="Current Password" />
                                        {formik.touched.oldPassword && formik.errors.oldPassword ? (
                                            <div className="text-danger">{formik.errors.oldPassword}</div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            <h6>New Password <span className='text-danger'>*</span></h6>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="mb-4">
                                        <input type="password" {...formik.getFieldProps('newPassword')} className="form-control" placeholder="New Password" />
                                        {formik.touched.newPassword && formik.errors.newPassword ? (
                                            <div className="text-danger">{formik.errors.newPassword}</div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            <h6>Confirm Password <span className='text-danger'>*</span></h6>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="mb-4">
                                        <input type="password" {...formik.getFieldProps('passwordConfirmation')} className="form-control" placeholder="Confirm New Password" />
                                        {formik.touched.passwordConfirmation && formik.errors.passwordConfirmation ? (
                                            <div className="text-danger">{formik.errors.passwordConfirmation}</div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            <div className="dropdown-divider m-0 pb-4"></div>
                            <div className="d-inline-flex float-end me-2">
                                <div className="col-sm-5">
                                    <div className="form-group">
                                        <button className="btn cancel-btn btn border border-color d-block bg-white">Cancel</button>
                                    </div>
                                </div>
                                <div className="col-sm-8">
                                    <div className="form-group">
                                        <button type="submit" disabled={!formik.isValid} className="btn d-block add-button">{ (loader && loading) ? <Loading /> : 'Save Changes' }</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ChangePassword
