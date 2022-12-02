import React from "react";
import { processData} from '../../../../actions/logAction';
import { useDispatch } from "react-redux";
import { Modal, Button } from 'react-bootstrap';
// import Loading from "../../../layout/Loading";
import { useParams } from "react-router-dom";
// import moment from "moment";

const ProcessDataModal = (props) => {
    const params = useParams();
	const dispatch = useDispatch();

	const handleSubmit = async () => {
		const date = new Date().toISOString();
		dispatch(processData(params?.id, date, props.logDate));
		props.close();
	};

	return (
		props.open && (
			<Modal className="edit_form_modal" show={props.open} onHide={props.close}>
				<Modal.Header>
					<Modal.Title id="contained-modal-title">{'Process Data (System Adminstrator)'}</Modal.Title>
					<Button variant="outline-danger" onClick={props.close}><i className="ti ti-x"></i></Button>
				</Modal.Header>
				<Modal.Body>
					<form className="search-data add-driver">
						<div className="add_event_pehra">
							<p className="add_event_pehra_black">Please make sure that drive is online before processing the data, because if driver went offline the logs which has been stored in their mobile or tablet might conflict with previous logs.</p>
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

export default ProcessDataModal;
