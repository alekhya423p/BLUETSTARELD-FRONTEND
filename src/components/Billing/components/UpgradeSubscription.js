import React, { useEffect } from "react";
import { changeSubscriptionStatus, getPlanDetails } from "../../../actions/subscriptionActions";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const UpgradeSubscription = (props) => {
	
	const navigate = useNavigate();
	const price_id = props.priceId;
	const dispatch = useDispatch();
	const { isMode } = useSelector(state =>  state.dashboard)
	const { upgraded_plan } = useSelector(state => state.subscriptionStore)
	
	
	const { handleSubmit } = useForm({
		mode: "onBlur",
	});

	const userInfo = JSON.parse(localStorage.getItem("userInfo"));
	const customerId = userInfo && userInfo.companyInfo && userInfo.companyInfo.subscription && userInfo.companyInfo.subscription.stripeCustomerId ? userInfo.companyInfo.subscription.stripeCustomerId : '';
	const subscriptionInfo = userInfo && userInfo.companyInfo && userInfo.companyInfo.subscription && userInfo.companyInfo.subscription.subscriptionInfo ? userInfo.companyInfo.subscription.subscriptionInfo : '';

	// const { isValid } = formState
	
    const onSubmit = async (values, e) => {
		const dataValue = {
			priceId: upgraded_plan.stripePriceId,
			customerId: customerId,
			paymentMethodId: props?.defaultPayment,
			subscriptionId: subscriptionInfo?.stripeSubscriptionId ? subscriptionInfo?.stripeSubscriptionId : '',
			quantity: Number(props.quantity) - (subscriptionInfo ?subscriptionInfo?.vehicleCount : 0 ) < 0 ? 0 :Number(props.quantity) - (subscriptionInfo ?subscriptionInfo?.vehicleCount : 0 ) ,
			updateQuantity :Number(props.quantity),
			companyId: userInfo.companyInfo._id
		}
		dispatch(changeSubscriptionStatus(dataValue));
		props.close();
    };
const handleClose =()=>{
	 props.close();
	 navigate(0)
}
	useEffect(() => {
		if(price_id ){
			const formData = {
				price: price_id
			};
			dispatch(getPlanDetails(formData));
		}		
	},[dispatch, price_id ]);
	return (
		props.open && (
			<Modal className={`edit_form_modal ${isMode}`} show={props.open} onHide={props.close}>
				<Modal.Header>
					<Modal.Title id="contained-modal-title">{'Upgrade Subscription'}</Modal.Title>
					<Button variant="outline-danger" onClick={props.close}><i className="ti ti-x"></i></Button>
				</Modal.Header>
				<Modal.Body>
					<form className="search-data add-driver" onSubmit={handleSubmit(onSubmit)}>
						<div className="add_event_pehra">
							<p className="add_event_pehra_black">You are eligable to upgrade your Subscription</p>
						</div>
						<div className="add_event_pehra">
							<p><strong>New Plan: {upgraded_plan?.planName}</strong></p>
							<p><strong>New Per Vehicle Charge:${upgraded_plan?.price}</strong></p>
						</div>
						<div className="add_event_pehra">
							<p className="add_event_pehra_black">New Plan Vehicle payment will take effect in next recurring payment.</p>
						</div>
						<div className="modal-footer">
							<button type="button" onClick={() => handleClose()} className="btn btn-secondary" data-dismiss="modal">Cancel</button>
							<button type="submit" className="btn d-block add-button">Confirm</button>
						</div>
					</form>
				</Modal.Body>
			</Modal>
		)
	);
}

export default UpgradeSubscription;
