import React, { useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import PersonalInfo from "./PersonalInfo"
import CompanyInfo from "./CompanyInfo"
import SecurityInfo from "./SecurityInfo"
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../actions/authAction';
import { useFormik } from 'formik';
import * as Yup from "yup";
// import { toast } from "react-toastify";
import { VALIDATE_US_PHONE_NUMBER, VALIDATE_PASSWORD } from '../../constants/constants';

const Register = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [personalInfo, setPersonalInfo] = useState();
    const [companyInfo, setCompanyInfo] = useState();
    const [inputContactNo, setInputContactNo] = useState("");
    // const [isVerified, setVerifyCaptcha] = useState(false);
    // const [loader, setLoader] = useState(false)

    const { loading } = useSelector(state => state.register)
    const [page, setPage] = useState('Home');
    const FormTitles = ["Sign Up", "Personal Info", "Other"];

    const formik = useFormik({
        initialValues: {
            phoneNumber: '',
            password: '',
            confirmPassword: '',
            policy: false
        },
        validationSchema: Yup.object({
            phoneNumber: Yup.string().required('Mobile Number is required').matches(VALIDATE_US_PHONE_NUMBER, "Phone number is not valid"),
            password: Yup.string().min(8, 'Must be 8 characters or more').max(12, 'Password must be of 12 characters').required('Please Enter your password').matches(VALIDATE_PASSWORD, "Must contain 8 characters, one uppercase, one lowercase, one number and one special case character"),
            confirmPassword: Yup.string().required('Confirm password is required').oneOf([Yup.ref('password'), null], 'Passwords must match'),
            policy: Yup.boolean().oneOf([true], 'Terms and Privacy must be checked')
        }),
        onSubmit: (value) => {
            // setLoader(true);
            // !isVerified && toast.error("Please verify ReCAPTCHA");
            let payload = { ...personalInfo, ...companyInfo, ...value }
            // isVerified && 
            dispatch(register(payload, navigate));
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
                                    <a href="index.html" className="auth-logo">
                                        <img src="assets/images/BLE-Logo.png" className="logo-dark mx-auto" alt="logo" />
                                    </a>
                                </div>

                                <h4 className="text-center font-size-25 mb-3"><b>Create an account</b></h4>
                            </div>
                            <div className="row">
                                <div className="col-md-12 mx-0">
                                    <ul id="progressbar">
                                        <li className={`${page === 'Home' ? "active" : ""} ${page === 'Profile' ? "activated" : ""} || ${page === 'Contact' ? "activated" : ""} `}>{FormTitles[page]}</li>
                                        <li className={`${page === 'Profile' ? "active" : ""} ${page === 'Contact' ? "active activated" : ""}`}>{FormTitles[page]}</li>
                                        <li className={(page === 'Contact') ? "active" : ""}>{FormTitles[page]}</li>
                                    </ul>
                                    <div className="tab-content">
                                        <div className={`tab-pane ${page === 'Home' ? "show active" : ""}`} id={page}>
                                            <PersonalInfo page={page} personalInfo={personalInfo} setPage={setPage} setPersonalInfo={setPersonalInfo} />
                                        </div>
                                        <div className={`tab-pane ${page === 'Profile' ? "show active" : ""}`} id={page}>
                                            <CompanyInfo page={page} setPage={setPage} setCompanyInfo={setCompanyInfo} />
                                        </div>
                                        <div className={`tab-pane ${page === 'Contact' ? "show active" : ""}`} id={page}>
                                            {/* <SecurityInfo formik={formik} loading={loading} loader={loader} setInputContactNo={setInputContactNo} inputContactNo={inputContactNo} setVerifyCaptcha={setVerifyCaptcha} page={page} setPage={setPage} /> */}
                                            <SecurityInfo formik={formik} loading={loading}  setInputContactNo={setInputContactNo} inputContactNo={inputContactNo} page={page} setPage={setPage} />
                                        </div>
                                    </div>
                                    <div className="col-12 mt-3 border-top text-center register_line">
                                        <label className="pt-4">Already Registered ? <Link to="/login">Login</Link></label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register