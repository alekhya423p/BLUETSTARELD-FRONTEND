import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button } from 'react-bootstrap';
import * as yup from "yup";
import { createReport } from "../../actions/reportsAction";
import { yupResolver } from '@hookform/resolvers/yup';
import Loading from "../layout/Loading";
import Select from 'react-select';

const AddAlertModal = (props) => {

    const dispatch = useDispatch();
    const [allOptions, setAllOptions] = useState();
	const { loading } = useSelector(state => state.logs)
    const { isMode } = useSelector(state => state.dashboard)
    
	const validationSchema = yup.object().shape({
        alert_name: yup.string().required('Alert Name is required'),
        alert_type: yup.string().required('Alert type is required'),
        sms_notification: yup.string().required('Sms Notification is reqired'),
        email_notification: yup.string().required('Email Notification is required'),
	});

	const { register, handleSubmit, setValue, formState: { errors, ...formState } } = useForm({
		mode: "onBlur",
		resolver: yupResolver(validationSchema),
	}),
    [inputAlertName , setInputAlertName] = useState(""),
    [inputAlertType , setInputAlertType] = useState(""),
    [inputSmsNotification , setInputSmsNotification] = useState(""),
    [inputEmailNotification, setInputEmailNotification] = useState(""),
    [inputVehicle, setInputVehicle] = useState(""),
    [inputVehicleSpeed, setInputVehicleSpeed] = useState("");
    // [inputModalTitle, setInputModalTitle] = useState("");
	const { isValid } = formState

    const onSubmit = async (values, e) => {
        const dataValue = {
            vehicleIds: [values.vehicleId],
        }
        dispatch(createReport(dataValue))
        props.close();
    };

    // useEffect(() => {
    //     if(props.data){
    //         setInputModalTitle("Edit Alert")
    //     }else{
    //         setInputModalTitle("Add Alert");
    //     }
    // }, [reset, setValue, dispatch, props]);

    useEffect(() => {
        if(props.masterVehicles) {
            var allOptions = props.masterVehicles?.vehicles.map((item) => {
				return { value: item.id, label: item.vehicleNumber }
			})
        }
        setAllOptions(allOptions);
    },[props, dispatch])

    const handleAssignVehicle = (e) => {
        setInputVehicle(e.value);
        setValue('vehicleId', e.value);
    }

    return (
        props.open && (
            <Modal show={props.open} onHide={props.close} className={isMode}>
                <Modal.Header>
                    <Modal.Title id="contained-modal-title">Add Alert</Modal.Title>
                    <Button variant="outline-danger" onClick={props.close}><i className="fa fa-close"></i></Button>
                </Modal.Header>
                <Modal.Body>
                    <form className="search-data add-driver" onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body">
                            <div className='row'>
                                <div className='col-sm-12'>
                                    <label>Alert Name</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className='col-sm-12'>
                                    <input type="text" className="form-control" defaultValue={inputAlertName} onChange={(e) => setInputAlertName(e.target.value)} {...register('alert_name')} />
                                </div>
                            </div><br/>
                            <div className="row">
                                <div className="col-sm-12">
                                    <label>Alert Type</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <select className="form-select form-control" {...register('alert_type')} defaultValue={inputAlertType} onChange={(e) => setInputAlertType(e.target.value)}>
                                        <option>Select Alert Type</option>
                                        <option>Vehicle Speeding</option>
                                        <option>Device Disconnected</option>
                                        <option>HOS Violation-Break</option>
                                        <option>HOS Violation-Driving</option>
                                        <option>HOS Violation-Shift</option>
                                    </select>
                                </div>
                            </div><br/>
                            {
                                props.data ? 
                                <>
                                <h5>Monitor All Vehicles</h5>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <label>Select Vehicle</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <Select className="assign_vehicles" defaultValue={inputVehicle} onChange={(e) => handleAssignVehicle(e)} name="vehicleId" options={allOptions} placeholder="Select Vehicle" />
                                            {errors.driver && (
                                                <div className="text-danger">{errors.driver.message}</div>
                                            )}
                                        </div>
                                    </div><br/>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <label>Alert If Speed is above</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <input type="text" {...register('inputVehicleSpeed')} defaultValue={inputVehicleSpeed} onChange={(e) => setInputVehicleSpeed(e.target.value)}  />
                                        </div>
                                    </div>
                                </>
                                :
                               ''
                            }
                            <h5>Additional Notification</h5>
                            <div className="row">
                                <div className="col-sm-12">
                                    <label>SMS Notification</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <input type="text" className="form-control" {...register('sms_notification')} defaultValue={inputSmsNotification} onChange={(e) => setInputSmsNotification(e.target.value)} />
                                </div>
                            </div><br/>
                            <div className="row">
                                <div className="col-sm-12">
                                    <label>Email Notification</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <input type="text" className="form-control" {...register('email_notification')} defaultValue={inputEmailNotification} onChange={(e) => setInputEmailNotification(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={props.close} className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button disabled={(props.data.mode !== 'edit') && isValid} type="submit" className="btn btn-primary">{ loading ? <Loading /> : 'Add Alert' }</button>
                        </div>
                    </form> 
                </Modal.Body>
            </Modal>
        )
    );
}

export default AddAlertModal;