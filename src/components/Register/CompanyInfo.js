import { useFormik } from 'formik';
import React from 'react'
import * as Yup from "yup";
import db from "../../../src/data/db.json";
import { ALPHABATES_NUMERIC } from '../../constants/constants';

const CompanyInfo = (props) => {

    const formik = useFormik({
        initialValues: {
            companyName: '',
            dotNumber: '',
            timeZone: '',
        }, 
        validationSchema: Yup.object({
            companyName: Yup.string().required('Company Name is required').matches(ALPHABATES_NUMERIC, "Only alphanumeric values are allowed for company name").max(20, 'Company Name should be less than 20').test('companyName', 'Company name is required', (value) => value?.trim()),
            dotNumber:Yup.number().typeError('you must specify a number').required('Dot Number is required').max(99999999, "Dot number should be of length 8"),
            timeZone: Yup.string().required('Timezone is required'),
        }),
        onSubmit: (value) => {
           props.setCompanyInfo(value);
           props.setPage('Contact')
        },
    })

  return (
    <fieldset>
        <form className="register_form" id="msform" onSubmit={formik.handleSubmit}>
            <div className="form-card">
                <div className="form-group mb-3 row">
                    <div className="col-12">
                        <label className="form-label ms-1 mb-1 font-light">Company Name <span className='text-danger'>*</span></label>
                        <input className="form-control"
                                type="text"
                                placeholder="Company Name"
                                {...formik.getFieldProps('companyName')}
                            />

                            {formik.touched.companyName && formik.errors.companyName ? (
                                <div className="text-danger pt-1">{formik.errors.companyName}</div>
                            ) : null}
                    </div>
                </div>


                <div className="form-group mb-3 row">
                    <label className="form-label ms-1 mb-1 font-light">USDOT <span className='text-danger'>*</span></label>
                    <div className="col-12">
                    <input className="form-control"
                        type="text"
                        placeholder="USDOT Number"
                        {...formik.getFieldProps('dotNumber')}/>
                        {formik.touched.dotNumber && formik.errors.dotNumber ? (
                            <div className="text-danger pt-1">{formik.errors.dotNumber}</div>
                        ) : null}
                    </div>
                </div>


                <div className="form-group mb-3 row">
                    <label className="form-label ms-1 mb-1 font-light">Time Zone <span className='text-danger'>*</span></label>
                    <div className="col-12">
                        <select className="form-select" aria-label="Default select example" {...formik.getFieldProps('timeZone')}>
                            <option value={''}>Select a Time Zone</option>
                            {db.timeZone.map((e, key) => {
                                return <option key={key} value={e.value}>{e.key}</option>
                            })}
                        </select>
                        {formik.touched.timeZone && formik.errors.timeZone ? (
                            <div className="text-danger pt-1">{formik.errors.timeZone}</div>
                        ) : null}
                    </div>
                </div>
            </div>
            <button type='submit' className="btn btn-primary  wave-effect wave-light custom-btn  float-right"> Next <i className="dripicons-arrow-thin-right" aria-hidden="true"></i>
            </button>
        </form>
            <button 
                type='button'
                onClick={() => {props.setPage('Home')}}
                className="previous btn btn-outline-secondary custom-btn">
                <i className="dripicons-arrow-thin-left" aria-hidden="true"></i>&nbsp; Back
            </button>
        {/* <a className="nav-link active show" onClick={() => {props.setPage('Home')}}  data-toggle="tab" href="#Home">Home</a> */}
    </fieldset>
  )
}

export default CompanyInfo