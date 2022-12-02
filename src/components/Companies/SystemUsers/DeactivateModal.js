import React from "react";
import { useDispatch } from "react-redux";
import { Modal, Button } from 'react-bootstrap';
import { deactivateUser } from '../../../actions/systemUserActions'
import { useNavigate } from "react-router-dom";

const DeactivateModal = (props) => {
	const navigate = useNavigate()
	const dispatch = useDispatch();
	const handleSubmit = async () => {
		dispatch(deactivateUser(props.data, navigate));
		props.close();
	};
	return (
		props.open && (
			<Modal className="edit_form_modal" show={props.open} onHide={props.close}>
				<Modal.Header>
					<Modal.Title id="contained-modal-title">{'Deactivate System User?'}</Modal.Title>
					<Button variant="outline-danger" onClick={props.close}><i className="ti ti-x"></i></Button>
				</Modal.Header>
				<Modal.Body>
					<form className="search-data add-driver">
						<div className="add_event_pehra">
							{/* <p className="add_event_pehra_black">Please make sure that drive is online before transfering the event log, because if driver went offline the logs which has been stored in their mobile or tablet might conflict with previous logs.</p> */}
						</div>
						<div className="add_event_pehra">
							<p>Deactivating the user will prevent user from entering into the portal.</p>
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
