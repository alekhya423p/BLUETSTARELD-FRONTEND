import React, { useEffect } from "react";
import { reassignEventByTechnician } from '../../../../actions/logAction';
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button } from 'react-bootstrap';
import { useForm } from "react-hook-form";
// import Loading from "../../../layout/Loading";
import { useParams } from "react-router-dom";
// import moment from "moment";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
const ReassignEvent = (props) => {
	
	const params = useParams();
	const dispatch = useDispatch();
	const { masterDrivers } = useSelector(state => state.drivers)
	const { isMode } = useSelector(state => state.dashboard)

    const validationSchema = yup.object().shape({
		driverId: yup.string().required('Driver is required'),
	})
	const { register, setValue, handleSubmit, formState: { errors, ...formState } } = useForm({
		mode: "onBlur",
		resolver: yupResolver(validationSchema),
	});

	const { isValid } = formState
	const onSubmit = async (values, e) => {
		const dataValue = {
			logDate: props.logDate,
			driverId: values.driverId,
			logId: props.logId ? props.logId : "",
			ids: props.ids,
			currentDriverId: params.id
		}
		// console.log(dataValue);
		dispatch(reassignEventByTechnician(dataValue)) ;
		props.close();
	};

	useEffect(() => {
		setValue('driverId' , params.id)
	}, [props,params ,setValue]);

	return (
		props.open && (
			<Modal className={`kjfs ${isMode}`} show={props.open} onHide={props.close}>
				<Modal.Header>
					<Modal.Title id="contained-modal-title">{'Reassign Event (System Adminstrator)'}</Modal.Title>
					<Button variant="outline-danger" onClick={props.close}><i className="ti ti-x"></i></Button>
				</Modal.Header>
				<Modal.Body>
					<form className="search-data add-driver" onSubmit={handleSubmit(onSubmit)}>
                    <div className='col-sm-12 pt-3'>
							<div className='row'>
								<div className='col-sm-3'>
									<label>Driver<span className="text-danger">*</span></label>
								</div>
								<div className='col-sm-9'>
									<select className="form-select" {...register('driverId')} name="driverId">
										<option value={''}>Select User</option>
										{masterDrivers.map((item, index) => (
											<option key={index} value={item.id}>{item.name }</option>
										))}
									</select>
									{errors.driverId && (
										<div className="text-danger">{errors.driverId.message}</div>
									)}
								</div>
							</div>
						</div>
						<div className="add_event_pehra">
							<p className="add_event_pehra_black">Please make sure that drive is online before processing the data, because if driver went offline the logs which has been stored in their mobile or tablet might conflict with previous logs.</p>
						</div>
						<div className="add_event_pehra">
							<p>Lucid ELD Inc, as your service provider, is not responsible for any financial or legal repercussions resulting from facilitating your request. It is the sole responsibility of the user to maintain legal compliance while using ELD.</p>
						</div>
						<div className="modal-footer">
							<button type="button" onClick={props.close} className="btn btn-secondary" data-dismiss="modal">Cancel</button>
							<button type="submit" disabled={isValid} className="btn d-block add-button">Confirm</button>
						</div>
					</form>
				</Modal.Body>
			</Modal>
		)
	);
}

export default ReassignEvent;
