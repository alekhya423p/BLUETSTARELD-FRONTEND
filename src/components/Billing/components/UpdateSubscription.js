import React from "react";
import { subscriptionUpdate } from '../../../actions/subscriptionActions';
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button } from 'react-bootstrap';
import moment from "moment";




// import moment from "moment";

const UpdateSubscription = (props) => {
	const dispatch = useDispatch();
	const { isMode } = useSelector(state => state.dashboard)
	const userInfo = JSON.parse(localStorage.getItem("userInfo"));
	const customerId = userInfo && userInfo.companyInfo && userInfo.companyInfo.subscription && userInfo.companyInfo.subscription.stripeCustomerId ? userInfo.companyInfo.subscription.stripeCustomerId : '';
	const subscriptionInfo = userInfo && userInfo.companyInfo && userInfo.companyInfo.subscription && userInfo.companyInfo.subscription.subscriptionInfo ? userInfo.companyInfo.subscription.subscriptionInfo : '';
	const quantity = subscriptionInfo ? subscriptionInfo?.vehicleCount : 0
	const updatedquantity = Number(props?.quantity) - (subscriptionInfo ? subscriptionInfo?.vehicleCount : 0) < 0 ? 0 : Number(props?.quantity) - (subscriptionInfo ? subscriptionInfo?.vehicleCount : 0)
	let currentDate = new Date().getDate();
	let credits = props?.finalCredit;
	let prorationCharges
	let actualProrationCharges;
	let total_bill_amount = props?.transactions?.price * updatedquantity - (actualProrationCharges === undefined ? 0 : actualProrationCharges) - (credits === undefined ? 0 : credits) < 0 ? 0 : props?.transactions?.price * updatedquantity - (actualProrationCharges === undefined ? 0 : actualProrationCharges) - (credits === undefined ? 0 : credits)
	console.log(props,24)
	const handleSubmit = async () => {
		const dataValue = {
			priceId: props.priceId,
			customerId: customerId,
			subscriptionId: subscriptionInfo?.stripeSubscriptionId ? subscriptionInfo?.stripeSubscriptionId : '',
			companyId: userInfo.companyInfo._id,
			updatedquantity: updatedquantity,
			quantity: quantity,
			paymentMethodId: props?.defaultPayment,
			// productId:props?.transactions?.stripeProductId,
			// updatedAmount:updatePayloadAmount*100 
		};
		dispatch(subscriptionUpdate(dataValue));
		props.close();
	};

	//function to add extra month from current date
	moment.addRealMonth = function addRealMonth(d) {
		var fm = moment(d).add(1, 'M');
		var fmEnd = moment(fm).endOf('month');
		return d.date() !== fm.date() && fm.isSame(fmEnd.format('YYYY-MM-DD')) ? fm.add(1, 'd') : fm;
	}
	var nextMonth = moment.addRealMonth(moment());

    //function for rounding number upto two numbers 
	function roundToTwo(num) {
		return +(Math.round(num + "e+2") + "e-2");
	}
	// prorationCharges = currentDate <= 10 ? 0 : currentDate <= 21 ? roundToTwo((props?.transactions?.price * updatedquantity)*2 / 3) : roundToTwo(props?.transactions?.price * updatedquantity / 3)
	// actualProrationCharges = subscriptionInfo?.vehicleCount === 0 ||subscriptionInfo?.vehicleCount === undefined ? 0.00 : prorationCharges;
	total_bill_amount = props?.transactions?.price * updatedquantity - (actualProrationCharges === undefined ? 0 : actualProrationCharges) - (credits === undefined ? 0 : credits) < 0 ? 0 : props?.transactions?.price * updatedquantity - (actualProrationCharges === undefined ? 0 : actualProrationCharges) - (credits === undefined ? 0 : credits)
	let actualPayloadAmount = props?.transactions?.price * updatedquantity - (actualProrationCharges === undefined ? 0 : actualProrationCharges)  < 0 ? 0 : props?.transactions?.price * updatedquantity - (actualProrationCharges === undefined ? 0 : actualProrationCharges)
	let finalAmountRounded = roundToTwo(total_bill_amount)
    // let updatePayloadAmountRounded = roundToTwo(actualPayloadAmount)
	// let updatePayloadAmount = roundToTwo(updatePayloadAmountRounded/updatedquantity)
	const formatDate = nextMonth.format('L');
	// console.log(subscriptionInfo?.vehicleCount)
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
							{/* <p className="add_event_pehra_black">Please confirm the update</p> */}
							<div className="update_subs_content">
								{subscriptionInfo &&
									<div className="update_subs_amount">
										<p><strong>Updated subscription bill for {formatDate} </strong></p>
										<p>x{quantity + updatedquantity} {props?.transactions?.planName} (${props?.transactions?.price} per vehicle) <span>${props?.transactions?.price * (quantity + updatedquantity)}</span></p>
										<p className="total_bill_amount"><strong>Total <span>${props?.transactions?.price * (quantity + updatedquantity)}</span></strong></p>
									</div>
								}
								<div className="update_subs_add_new">
									<p><strong>Pay today (Adding new vehicles)</strong></p>
									<p>x{updatedquantity} {props?.transactions?.planName} (${props?.transactions?.price} per vehicle) <span>${props?.transactions?.price * updatedquantity}.00</span></p>
									<p>Prorated adjustment {actualProrationCharges ? <span>-${actualProrationCharges}</span> :<span>-${0}.00</span>} </p>
									<p>Your credits adjustment <span>-${credits ? credits : 0}.00</span></p>
									<p className="total_bill_amount"><strong>Total <span>${Number(finalAmountRounded)}</span></strong></p>
									<p className="bill_card_ending">Your <strong>Visa ending 4242</strong> will be charged immediately.</p>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" onClick={props.close} className="btn btn-secondary" data-dismiss="modal">Cancel</button>
							<button type="button" onClick={() => handleSubmit()} className="btn d-block add-button">Update</button>
						</div>
					</form>
				</Modal.Body>
			</Modal>
		)
	);
}

export default UpdateSubscription;
