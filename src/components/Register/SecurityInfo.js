import React from 'react'
import { Link } from 'react-router-dom';
// import ReCAPTCHA from "react-google-recaptcha";
import Loading from '../layout/Loading';
import { formatPhoneNumber } from "../../functions/functions";

const SecurityInfo = ({ formik, setVerifyCaptcha, setPage, loader, loading, inputContactNo,setInputContactNo }) => {
    // function onChange(value) {
    //     setVerifyCaptcha(value)
    // }

    const handleInput = (e) => {
        const formattedPhoneNumber = formatPhoneNumber(e.target.value);
        setInputContactNo(formattedPhoneNumber);
        formik.setFieldValue('phoneNumber' ,formattedPhoneNumber)
    };

    return (
        <fieldset>
            <form className="register_form" id="msform" onSubmit={formik.handleSubmit}>
                <div className="form-card">
                    <div className="form-group mb-3 row">
                        <div className="col-12">
                            <label className="form-label ms-1 mb-1 font-light">Phone Number <span className='text-danger'>*</span></label>
                            <input className="form-control"
                                type="text" name="phoneNumber" 
                                placeholder="Phone Number"
                                {...formik.getFieldProps('phoneNumber')}
                                onChange={(e) => handleInput(e)}
                                value={inputContactNo}
                            />
                            {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                                <div className="text-danger pt-1">{formik.errors.phoneNumber}</div>
                            ) : null}
                        </div>
                    </div>
                    <div className="form-group mb-3 row">
                        <label className="form-label ms-1 mb-1 font-light">Password <span className='text-danger'>*</span></label>
                        <div className="col-12">
                            <input className="form-control"
                                type="password"
                                placeholder="At least 8 characters"
                                {...formik.getFieldProps('password')}
                            />
                            {formik.touched.password && formik.errors.password ? (
                                <div className="text-danger pt-1">{formik.errors.password}</div>
                            ) : null}
                        </div>
                    </div>
                    <div className="form-group mb-3 row">
                        <label className="form-label ms-1 mb-1 font-light">Confirm Passowrd <span className='text-danger'>*</span></label>
                        <div className="col-12">
                            {/* <input className="form-control" type="password" required="" placeholder="Confirm Password"/> */}
                            <input className="form-control"
                                type="password"
                                placeholder="At least 8 characters"
                                {...formik.getFieldProps('confirmPassword')}
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                <div className="text-danger pt-1">{formik.errors.confirmPassword}</div>
                            ) : null}
                        </div>
                    </div>
                    <div className="form-group mb-3 row">
                        <div className="col-12">
                            <div className="form-check">
                                <input type="checkbox" id="policy" name="policy" value="true" className='form-check-input' {...formik.getFieldProps('policy')} />
                                <label className="form-check-label" htmlFor="formCheck2">
                                    Agree to the <Link to="/terms-n-privacy" target="_blank">Terms and Privacy</Link>
                                </label>
                                {formik.touched.policy && formik.errors.policy ? (
                                    <div className='text-danger pt-1'>{formik.errors.policy}</div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-group pb-2" style={{ marginLeft: "65px" }}>
                    {/* <ReCAPTCHA
                        sitekey="6LdOxlcgAAAAAJ0pqldSVAnViqNb3ipYV1YijBYM"
                        render="explicit"
                        onChange={onChange}
                    /> */}
                </div>
                <button type='submit' className="btn btn-primary  wave-effect wave-light custom-btn  float-right"> {(loader && loading) ? <Loading /> : <>Create <i className="fa fa-plus" aria-hidden="true"></i></>}</button>
                <button
                    onClick={() => { setPage('Profile') }}
                    className="previous btn btn-outline-secondary custom-btn">
                    <i className="dripicons-arrow-thin-left" aria-hidden="true"></i>&nbsp; Back
                </button>
            </form>
        </fieldset>
    )
}

export default SecurityInfo