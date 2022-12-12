import React, { useEffect, useState } from "react";
import { reassignEventByTechnician } from '../../../../actions/logAction';
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button } from 'react-bootstrap';
import { useForm } from "react-hook-form";
// import Loading from "../../../layout/Loading";
import { useParams } from "react-router-dom";
// import moment from "moment";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import Select from 'react-select';

const ReassignEvent = (props) => {
	
	const params = useParams();
	const dispatch = useDispatch();
	const { masterDrivers } = useSelector(state => state.drivers)
	const { isMode } = useSelector(state => state.dashboard)

    const validationSchema = yup.object().shape({
		driverId: yup.string().required('Driver is required'),
	})
	const { setValue, handleSubmit, formState: { errors, ...formState } } = useForm({
		mode: "onBlur",
		resolver: yupResolver(validationSchema),
	});

	const { isValid } = formState;
	const [codriver, setCoDriver] = useState("");
	const [options, setOptions] = useState();
	
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

	const handleAssignDriver = (e) => {
		setCoDriver(e);
		setValue('driverId', e.value);
	};

	useEffect(() => {
		setValue('driverId' , params.id)
	}, [props,params ,setValue]);

	useEffect(() => {
		if (masterDrivers) {
			var options = masterDrivers?.map((item, index) => {
			  return { value: item.id, label: item.name }
			});
			var ops = options.filter(
				({ value }) => !props.driverId.includes(value)
			);
		  }
		setOptions(ops);
	},[masterDrivers, props]);

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
									<Select className="select-boz-style"
                                      onChange={(e) => handleAssignDriver(e)} 
                                      value={codriver}
                                      options={options} placeholder="" name="driverId" />
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
