import React from 'react';
import { useFormik } from 'formik'
import * as Yup from "yup";
import { VALIDATE_NAME } from '../../constants/constants';

const PersonalInfo = (props) => {
    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: ''
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required('First name is required').matches(VALIDATE_NAME, "Only alphabets are allowed for this field ").min(2, 'First name should be greater than 2').max(30, 'First name should be less than 30').test('firstName', 'First name is required', (value) => value?.trim()),
            lastName: Yup.string().required('Last Name is required').matches(VALIDATE_NAME, "Only alphabets are allowed for this field").min(2, 'Last name should be greater than 2').max(30, 'Last name should be less than 30').test('lastName', 'Last name is required', (value) => value?.trim()),
            email: Yup.string().required('Email is required').email("Email is invalid").max(40, 'Email should be less than 40')
        }),
        onSubmit: (value) => {
            props.setPersonalInfo(value);
            props.setPage('Profile')
        },
    })

    return (
        <fieldset>					
			<form className="register_form" id="msform" onSubmit={formik.handleSubmit}>
                <div className="form-card">
                    
                    <div className="form-group mb-3 row">
                        <div className="col-12">
                            <label className="form-label ms-1 mb-1 font-light">First Name <span className='text-danger'>*</span></label>
                            <input className="form-control"
                                type="text"
                                placeholder="First Name"
                                {...formik.getFieldProps('firstName')}
                            />
                            {formik.touched.firstName && formik.errors.firstName ? (
                                <div className="text-danger pt-1">{formik.errors.firstName}</div>
                            ) : null}
                        </div>
                    </div>
    
                                                
                    <div className="form-group mb-3 row">
                        <label className="form-label ms-1 mb-1 font-light">Last Name <span className='text-danger'>*</span></label>
                        <div className="col-12">
                            <input className="form-control"
                                type="text"
                                placeholder="Last Name"
                                {...formik.getFieldProps('lastName')}
                                />
                                {formik.touched.lastName && formik.errors.lastName ? (
                                    <div className="text-danger pt-1">{formik.errors.lastName}</div>
                                ) : null}
                        </div>
                    </div>
                    <div className="form-group mb-3 row">
                        <label className="form-label ms-1 mb-1 font-light">E-mail <span className='text-danger'>*</span></label>
                        <div className="col-12">
                            <input className="form-control"
                                type="text"
                                placeholder="Enter Your Email"
                                {...formik.getFieldProps('email')}
                                />
                            {formik.touched.email && formik.errors.email ? (
                                <div className="text-danger pt-1">{formik.errors.email}</div>
                            ) : null}
                        </div>
                    </div>
                </div>
                <button type='submit' className="btn btn-primary  wave-effect wave-light custom-btn  float-right"> Next <i className="dripicons-arrow-thin-right" aria-hidden="true"></i>
                </button>

            </form>		
        </fieldset>
    )
}

export default PersonalInfo