import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unAssignEld } from "../../actions/vehicleAction";
import { Modal } from 'react-bootstrap';
import Loading from "../layout/Loading";
import {useNavigate } from "react-router-dom";

const UnassignEldModal = (props) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { loading } = useSelector(state => state.logs)
    const [inputModalTitle, setInputModalTitle] = useState();

	const handleSubmit = () => {
		const dataValue = {
			vehicleId: props.vehicle
		}
		
		dispatch(unAssignEld(dataValue, navigate))
		props.close();
	};


	useEffect(() => {
		// console.log(props.data)
		if (props.data && props.data.mode === "edit") {
			// console.log("my props", props);
			// setValue('startTime', props.data.start)
			// setValue('vehicleId', props.data.vehicleId)
			// setInputDriver(props.data.start);
			// setInputModalTitle("Edit Event");
		} else {
			// setValue('driverId', '')
			// setInputDriver("");
			setInputModalTitle("Unassign ELD");
		}
	}, [props]);

	return (
		props.open && (
			<Modal show={props.open} onHide={props.close}>
				<Modal.Header>
					<Modal.Title id="contained-modal-title">{inputModalTitle}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form className="search-data add-driver unassign-modal-bar">
						<div className="modal-body">
							<div className='col-sm-12 pt-3'>
										ELD: <span>{props.serialNumber + '(' + props.eldMacAddress + ')'}</span>
                                        <p>Unassigning ELD will remove ELD Device from being associated with this vehicle, and when this vehicle is selected on mobile app, it will not automatically connect to ELD Device</p>
									
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" onClick={props.close} className="btn btn-secondary" data-dismiss="modal">Cancel</button>
							<button type="submit" className="btn btn-primary unassign_buttons" onClick={handleSubmit}>{loading ? <Loading /> : 'Unassign ELD'}</button>
						</div>
					</form>
				</Modal.Body>
			</Modal>
		)
	);
}

export default UnassignEldModal;
