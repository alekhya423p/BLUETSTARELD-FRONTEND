import React from "react";
import { eventDestroy} from '../../../../actions/logAction';
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button } from 'react-bootstrap';
import { useParams } from "react-router-dom";

// import moment from "moment";

const TransferModal = (props) => {
    const params = useParams();
	const dispatch = useDispatch();
	const { isMode } = useSelector(state => state.dashboard)
	const handleSubmit = async () => {
		const dataValue = {
			logDate: props.logDate,
			driverId: params.id ? params.id : "",
			logId: props.logId ? props.logId : "",
			ids: props.ids ? props.ids : ""
		}
		dispatch(eventDestroy(dataValue));
		props.close();
	};

	return (
		props.open && (
			<Modal className={`edit_form_modal ${isMode}`} show={props.open} onHide={props.close}>
				<Modal.Header>
					<Modal.Title id="contained-modal-title">{'Transfer Data (System Adminstrator)'}</Modal.Title>
					<Button variant="outline-danger" onClick={props.close}><i className="ti ti-x"></i></Button>
				</Modal.Header>
				<Modal.Body>
					<form className="search-data add-driver">
						<div className="add_event_pehra">
							<p className="add_event_pehra_black">Please make sure that drive is online before transfering the event log, because if driver went offline the logs which has been stored in their mobile or tablet might conflict with previous logs.</p>
						</div>
						<div className="add_event_pehra">
							<p>Lucid ELD Inc, as your service provider, is not responsible for any financial or legal repercussions resulting from facilitating your request. It is the sole responsibility of the user to maintain legal compliance while using ELD.</p>
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

export default TransferModal;
