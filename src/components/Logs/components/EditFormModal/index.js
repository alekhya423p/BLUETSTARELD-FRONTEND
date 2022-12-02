import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { updateDriverLog , removeViolations} from '../../../../actions/logAction';
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button } from 'react-bootstrap';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import Loading from "../../../layout/Loading";
import { useParams } from "react-router-dom";

const EditFormModal = (props) => {
	const params = useParams();
	const [defaultDriver, setDefaultDriver] = useState(null);
	const { loading } = useSelector(state => state.logs);
	const { isMode } = useSelector(state => state.dashboard);
	const { masterDrivers } = useSelector(state => state.drivers);
	const dispatch = useDispatch();
	const validationSchema = yup.object().shape({
		// coDriverId: yup.string().required('Driver is required'),
		trailers: yup.string(),
		shippingDocuments: yup.string(),
		isCertified: yup.boolean(),
	})

	const { register, handleSubmit, reset, setValue, formState: { errors, ...formState } } = useForm({
		mode: "onBlur",
		resolver: yupResolver(validationSchema),
	}),
	[inputCoDriver, setInputCoDriver] = useState(""),
	[inputTrailers, setInputTrailers] = useState(""),
	[inputShippingDocs, setInputShippingDocs] = useState(""),
	[inputCertified, setInputCertified] = useState(false),
	[inputModalTitle, setInputModalTitle] = useState("");
	

	console.log(setDefaultDriver, defaultDriver, 'defaultdriver');

	const { isValid } = formState
	const onSubmit = async (values, e) => {
		console.log(values, 'values');
		values.coDriverId = values.coDriverId === "" ? null : values.coDriverId;
		values.logDate = props.logDate;
		values.driverId = params.id;
		values.logId = props.logId ? props.logId : ""
		if (props.data) dispatch(updateDriverLog(values))
		props.close();
	};


	useEffect(() => {
		if (props.data) {
			setValue('coDriverId', props.data?.driver?.coDriverId)
			setValue('isCertified', props.data?.isCertified)
			setValue('trailers', props.data?.trailers?.join(', '))
			setValue('shippingDocuments', props.data?.shippingDocuments?.join(', '))
			setInputCoDriver(props.data?.driver?.coDriverId);
			setInputTrailers(props.data.status);
			setInputCertified(props.data.userId);
			setInputModalTitle("Edit Form (System Admistrator)");
		} else {
			setValue('coDriverId', '')
			setValue('isCertified', '')
			setValue('trailers', '')
			setValue('shippingDocuments', '')
			setInputCoDriver("");
			setInputTrailers("");
			setInputCertified("");
			setInputShippingDocs("");
			setInputModalTitle("Edit Form (System Admistrator)");
		}
	}, [props, reset, setValue]);

	const violationsRemove = () => {
		const formData = {
			logDate : props.logDate,
			logId : props.logId,
			driverId : params.id,
		}
		dispatch(removeViolations(formData))
		props.close();
	}
	
	return (
		props.open && (
			<Modal className={`edit_form_modal ${isMode}`} show={props.open} onHide={props.close}>
				<Modal.Header>
					<Modal.Title id="contained-modal-title">{inputModalTitle}</Modal.Title>
					<Button variant="outline-danger" onClick={props.close}><i className="ti ti-x"></i></Button>
				</Modal.Header>
				<Modal.Body>
					<form className="search-data add-driver" onSubmit={handleSubmit(onSubmit)}>
						<div className='col-sm-12'>
							<div className='row'>
								<div className='col-sm-4'>
									<label>Co-Driver</label>
								</div>
								<div className='col-sm-8'>
									<select className="form-select" defaultValue={inputCoDriver} onChange={(e) => setInputCoDriver(e.target.value)} {...register('coDriverId')}>
										<option value="">No Co-Driver Selected</option>
										{masterDrivers && masterDrivers.map((item, index) => (
											item.id === props.driverId ?  false : <option key={index} value={item.id}>{item.name}</option>									
										))}
									</select>
									{errors.coDriverId && (
										<div className="text-danger">{errors.coDriverId.message}</div>
									)}
								</div>
							</div>
							<div className='row'>
								<div className='col-sm-4'>
									<label>Trailers</label>
								</div>
								<div className='col-sm-8'>
									<input type="text" className="form-control" name="trailers" defaultValue={inputTrailers} onChange={(e) => setInputTrailers(e.target.value)} {...register('trailers')} required="" />
									{errors.trailers && (
										<div className="text-danger">{errors.trailers.message}</div>
									)}
                                    <p className="small-info">Seperated by “space”; example: val1 val2</p>
								</div>
							</div>
							<div className='row'>
								<div className='col-sm-4'>
									<label>Shipping Docs</label>
								</div>
								<div className='col-sm-8'>
									<input type="text" className="form-control" name="shippingDocuments" defaultValue={inputShippingDocs} onChange={(e) => setInputShippingDocs(e.target.value)} {...register('shippingDocuments')} required="" />
									{errors.shippingDocuments && (
										<div className="text-danger">{errors.shippingDocuments.message}</div>
									)}
                                    <p className="small-info">Seperated by “space”; example: val1 val2</p>
								</div>
							</div>
							<div className='row edit-check-box'>
								<div className='col-sm-4'>
									<label>Certified</label>
								</div>
								<div className='col-sm-8'>
                                <label className="switch">
                                    <input type="checkbox" name="isCertified" {...register('isCertified')} value={inputCertified} onChange={(e) => setInputCertified(e.target.value)} />
                                    <span className="slider round"></span>
                                </label>
									
								</div>
							</div>
						</div>
						<div className="add_event_pehra">
							<p>Lucid ELD Inc, as your service provider, is not responsible for any financial or legal repercussions resulting from facilitating your request. It is the sole responsibility of the user to maintain legal compliance while using ELD.</p>
						</div>
						<div className="modal-footer">
							<button type="button" onClick={props.close} className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button type="button" onClick={() => violationsRemove()} className="remove-label-btn">Remove All Violations</button>
							<button type="submit" disabled={(props.data.mode !== 'edit') && isValid} className="btn d-block add-button">{loading ? <Loading /> : 'Submit'}</button>
						</div>
					</form>
				</Modal.Body>
			</Modal>
		)
	);
}

export default EditFormModal;
