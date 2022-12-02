import React from "react";
import { subscriptionUpdate } from '../../../actions/subscriptionActions';
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button } from 'react-bootstrap';




// import moment from "moment";

const UpdateSubscription = (props) => {
	const dispatch = useDispatch();
	const { isMode } = useSelector(state => state.dashboard)
	const userInfo = JSON.parse(localStorage.getItem("userInfo"));
	const customerId = userInfo && userInfo.companyInfo && userInfo.companyInfo.subscription && userInfo.companyInfo.subscription.stripeCustomerId ? userInfo.companyInfo.subscription.stripeCustomerId : '';
	const subscriptionInfo = userInfo && userInfo.companyInfo && userInfo.companyInfo.subscription && userInfo.companyInfo.subscription.subscriptionInfo ? userInfo.companyInfo.subscription.subscriptionInfo : '';
	const handleSubmit = async () => {
		const dataValue = {
			priceId: props.priceId,
			customerId: customerId,
			subscriptionId: subscriptionInfo?.stripeSubscriptionId ? subscriptionInfo?.stripeSubscriptionId : '',
			companyId: userInfo.companyInfo._id,
			updatedquantity: Number(props?.quantity) - (subscriptionInfo ?subscriptionInfo?.vehicleCount : 0) < 0 ? 0 :Number(props?.quantity) - (subscriptionInfo ?subscriptionInfo?.vehicleCount : 0) ,
		    quantity:subscriptionInfo ?subscriptionInfo?.vehicleCount : 0,
			paymentMethodId: props?.defaultPayment
		};
		dispatch(subscriptionUpdate(dataValue));
		// dispatch(refreshToken(props?.quantity))
	// 	if(dataValue){
	// 	dispatch(getAllTransactions({
	// 		customerId: customerId
	// 	}))
	// }
	
		props.close();
	};

	return (
		props.open && (
			<Modal className={`edit_form_modal ${isMode}`} show={props.open} onHide={props.close}>
				<Modal.Header>
					<Modal.Title id="contained-modal-title">{'Update Subscription'}</Modal.Title>
					<Button variant="outline-danger" onClick={props.close}><i className="ti ti-x"></i></Button>
				</Modal.Header>
				<Modal.Body>
					<form className="search-data add-driver">
						<div className="add_event_pehra">
							<p className="add_event_pehra_black">Please confirm the update</p>
						</div>
						<div className="modal-footer">
							<button type="button" onClick={props.close} className="btn btn-secondary" data-dismiss="modal">Cancel</button>
							<button type="button" onClick={()=>handleSubmit()} className="btn d-block add-button">Update</button>
						</div>
					</form>
				</Modal.Body>
			</Modal>
		)
	);
}

export default UpdateSubscription;
