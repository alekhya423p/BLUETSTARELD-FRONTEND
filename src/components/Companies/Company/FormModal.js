import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from 'react-bootstrap';
import * as yup from "yup";
import { createCompany } from "../../../actions/companyAction";
import { yupResolver } from '@hookform/resolvers/yup';
import Loading from "../../layout/Loading";
import Select from 'react-select';
import db from "../../../data/db.json";
import { ALPHABATES_NUMERIC } from '../../../constants/constants';

const FormModal = (props) => {

    const dispatch = useDispatch();
    const [options, setOptions] = useState();
	const { loading } = useSelector(state => state.logs)
    const { isMode } = useSelector(state => state.dashboard)
    
	const validationSchema = yup.object().shape({
       companyName: yup.string().required('Company Name is required').matches(ALPHABATES_NUMERIC, "Only alphanumeric values are allowed for company name").max(20, 'Company Name should be less than 20').test('companyName', 'Company name is required', (value) => value?.trim()),
       dotNumber: yup.string().required("Dot number is required").max(8, 'Dot number should be of length 8'),
       address: yup.string().required("Company Address is required").max(50, 'Company Name should be less than 50'),
       terminalAddress: yup.string().required("Terminal Address is required").max(50, 'Company Name should be less than 50'),
       timeZone: yup.string().required("timeZone  is required")
	});

	const { register, handleSubmit, reset, setValue, formState: { errors, ...formState } } = useForm({
		mode: "onBlur",
		resolver: yupResolver(validationSchema),
	}),
    [inputModalTitle, setInputModalTitle] = useState(""),
    [inputTimezone, setInputTimeZone] = useState(""),
    [inputCompanyName, setInputCompanyName] = useState(""),
    [inputUSDotNumber, setInputUSDOTNumber] = useState(""),
    [inputCompanyAddress, setInputCompanyAddress] = useState(""),
    [inputTerminalAddress, setInputTerminalAddress] = useState("")
	const { isValid } = formState

    const onSubmit = async (values, e) => {
        dispatch(createCompany(values))
        props.close();
        reset();
    };

    useEffect(() => {
        setValue('companyName', '')
        setValue('dotNumber', '')
        setValue('address', '')
        setValue('terminalAddress', '')
        setValue('timeZone', '')
        setInputCompanyName("");
        setInputCompanyAddress("");
        setInputTerminalAddress("");
        setInputUSDOTNumber("");
        setInputTimeZone("");
        setInputModalTitle("Create Company");
        reset();
    }, [reset, setValue, dispatch, props]);
    useEffect(() => {
        if(db.timeZone) {
            var options = db.timeZone.map((item) => {
                return { value: item.value, label: item.key }
            })
        }
        setOptions(options);
    },[props, dispatch])

    const handleInputTimeZone = (e) => {
        setInputTimeZone(e);
        setValue('timeZone', e.value)
    }

    return (
        props.open && (
            <Modal show={props.open} onHide={props.close} className={isMode}>
                <Modal.Header>
                    <Modal.Title id="contained-modal-title">{inputModalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="search-data add-driver" onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body">
                            <div className="row">
                                <div className='col-sm-6'>
                                    <label>Company Name</label>
                                </div>
                                <div className="col-sm-6">
                                    <label>Time Zone</label>
                                </div>
                            </div>
                            <div className="row">                               
                                <div className='col-sm-6'>
                                    <input type="text" placeholder="Company Name" className="form-control" {...register('companyName')} defaultValue={inputCompanyName} onChange={(e) => setInputCompanyName(e.target.value)} />
                                    {errors.companyName && (
                                       <div className="text-danger">{errors.companyName.message}</div>
                                     )}
                                </div>
                                <div className="col-sm-6">
                                    <Select className="assign_vehicles" defaultValue={inputTimezone} onChange={(e) => handleInputTimeZone(e)} name="timezone" options={options} placeholder="Select a Time Zone" />
                                </div>
                            </div>
                            <br/>
                            <div className="row">
                                <div className="col-sm-12">
                                    <label>USDOT Number</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <input type="text" className="form-control" placeholder="USDOT Number" {...register('dotNumber')} defaultValue={inputUSDotNumber} onChange={(e) => setInputUSDOTNumber(e.target.value)} />
                                    {errors.dotNumber && (
                                       <div className="text-danger">{errors.dotNumber.message}</div>
                                     )}
                                </div>
                            </div><br/>
                            <div className="row">
                                <div className="col-sm-12">
                                    <label>Company Address</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <input type="text" className="form-control" placeholder="Company Address" {...register('address')} defaultValue={inputCompanyAddress} onChange={(e) => setInputCompanyAddress(e.target.value)} />
                                    {errors.address && (
                                       <div className="text-danger">{errors.address.message}</div>
                                     )}
                                </div>
                            </div><br/>
                            <div className="row">
                                <div className="col-sm-12">
                                    <label>Terminal Address</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                <input type="text" className="form-control" placeholder="Terminal Address" {...register('terminalAddress')} defaultValue={inputTerminalAddress} onChange={(e) => setInputTerminalAddress(e.target.value)} />
                                {errors.terminalAddress && (
                                    <div className="text-danger">{errors.terminalAddress.message}</div>
                                )}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={props.close} className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button disabled={(props.data.mode !== 'edit') && isValid} type="submit" className="btn btn-primary">{ loading ? <Loading /> : 'Confirm' }</button>
                        </div>
                    </form> 
                </Modal.Body>
            </Modal>
        )
    );
}

export default FormModal;