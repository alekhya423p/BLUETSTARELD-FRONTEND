import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { assignDriver } from "../../actions/eventAction";
import { Modal, Button } from 'react-bootstrap';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import Loading from "../layout/Loading";

const AssignDriverModal = (props) => {
	const dispatch = useDispatch();
	const { loading } = useSelector(state => state.logs)
	const { isMode } = useSelector(state => state.dashboard)

	const validationSchema = yup.object().shape({
		driverId: yup.string().required('Driver is required'),
	})

	const { register, handleSubmit, reset, setValue, formState: { errors, ...formState } } = useForm({
		mode: "onBlur",
		resolver: yupResolver(validationSchema),
	}),
		[inputDriver, setInputDriver] = useState(""),
		[inputModalTitle, setInputModalTitle] = useState("");

	const { isValid } = formState

	const onSubmit = async (values, e) => {
		
		const dataValue = {
			driverId: values.driverId,
			vehicleId: props.vehicle,
			eventIds: props.data
		}
		dispatch(assignDriver(dataValue))
		props.close();
	};


	useEffect(() => {
		if (props.data && props.data.mode === "edit") {
			// console.log("my props", props);
			// setValue('startTime', props.data.start)
			// setValue('vehicleId', props.data.vehicleId)
			// setInputDriver(props.data.start);
			// setInputModalTitle("Edit Event");
		} else {
			setValue('driverId', '')
			setInputDriver("");
			setInputModalTitle("Assign Driver");
		}
	}, [props, reset, setValue]);

	return (
		props.open && (
			<Modal show={props.open} onHide={props.close} className={isMode}>
				<Modal.Header>
					<Modal.Title id="contained-modal-title">{inputModalTitle}</Modal.Title>
					<Button variant="outline-danger" onClick={props.close}><i className="ti ti-x"></i></Button>
				</Modal.Header>
				<Modal.Body>
					<form className="search-data add-driver" onSubmit={handleSubmit(onSubmit)}>
						<div className="modal-body">
							<div className='col-sm-12 pt-3'>
								<div className='row'>
									<div className='col-sm-3'>
										<label>Driver <span className="text-danger">*</span></label>
									</div>
									<div className='col-sm-9'>
										<select  className="form-select"  {...register('driverId')} defaultValue={inputDriver} onChange={(e) => setInputDriver(e)}>
											<option value={''}>Select Driver</option>
											{props?.drivers && props?.drivers.map((item, index) => (
												<option key={index} value={item.id}>{item.name}</option>
											))}
										</select>
										{errors.driverId && (
										   <div className="text-danger">{errors.driverId.message}</div>
										)}
									</div>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" onClick={props.close} className="btn btn-secondary" data-dismiss="modal">Cancel</button>
							<button disabled={(props.data.mode !== 'edit') && isValid} type="submit" className="btn btn-primary">{loading ? <Loading /> : 'Confirm'}</button>
						</div>
					</form>
				</Modal.Body>
			</Modal>
		)
	);
}

export default AssignDriverModal;
