import React from "react";
import { useDispatch } from "react-redux";
import { Modal, Button } from 'react-bootstrap';
import { useSelector } from "react-redux"
import { deactivateCompany } from '../../../actions/companyAction'

const DeactivateModal = (props) => {
	const dispatch = useDispatch();
	const { isMode } = useSelector(state => state.dashboard)
	const handleSubmit = async () => {
		dispatch(deactivateCompany(props.data));
		props.close();
	};

	return (
		props.open && (
			<Modal className={`edit_form_modal ${isMode}`} show={props.open} onHide={props.close}>
				<Modal.Header>
					<Modal.Title id="contained-modal-title">{'Deactivate Company'}</Modal.Title>
					<Button variant="outline-danger" onClick={props.close}><i className="ti ti-x"></i></Button>
				</Modal.Header>
				<Modal.Body>
					<form className="search-data add-driver">
						<div className="add_event_pehra">
							{/* <p className="add_event_pehra_black">Please make sure that drive is online before transfering the event log, because if driver went offline the logs which has been stored in their mobile or tablet might conflict with previous logs.</p> */}
						</div>
						<div className="add_event_pehra">
							<p>Deactivating the company will remove company from  being accessed and its all active users, vehicles, drivers, eld device will be deactivated. Vehicles Location logs and driver logs will still be accessable once re-activated .</p>
						</div>
						<div className="modal-footer">
							<button type="button" onClick={props.close} className="btn btn-secondary" data-dismiss="modal">Cancel</button>
							<button type="button" onClick={handleSubmit} className="btn d-block add-button">Confirm</button>
						</div>
					</form>
				</Modal.Body>
			</Modal>
		)
	);
}

export default DeactivateModal;
