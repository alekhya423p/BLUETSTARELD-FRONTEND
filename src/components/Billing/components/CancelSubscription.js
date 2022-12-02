import React from "react";
import { subscriptionCancel } from '../../../actions/subscriptionActions';
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';

const CancelSubscription = (props) => {

    const dispatch = useDispatch()
	const { isMode } = useSelector(state => state.dashboard)
	const userInfo = JSON.parse(localStorage.getItem("userInfo"));
	const subscriptionInfo = userInfo && userInfo.companyInfo && userInfo.companyInfo.subscription && userInfo.companyInfo.subscription.subscriptionInfo ? userInfo.companyInfo.subscription.subscriptionInfo : '';

	const validationSchema = yup.object().shape({
		feedback: yup.string().required('Feedback is required'),
	});
	const { register, handleSubmit, formState: { errors, ...formState } } = useForm({
		mode: "onBlur",
		resolver: yupResolver(validationSchema),
	});
	const { isValid } = formState
	const onSubmit = async (values, e) => {
		if(subscriptionInfo.stripeSubscriptionId){
			const dataValue = {
				feedback: values.feedback,
				subscriptionId: subscriptionInfo.stripeSubscriptionId,
			};
			dispatch(subscriptionCancel(dataValue));
		}
		props.close();
	};

	return (
		props.open && (
			<Modal className={`edit_form_modal ${isMode}`} show={props.open} onHide={props.close}>
				<Modal.Header>
					<Modal.Title id="contained-modal-title">{'Cancel Subscription'}</Modal.Title>
					<Button variant="outline-danger" onClick={props.close}><i className="ti ti-x"></i></Button>
				</Modal.Header>
				<Modal.Body>
					<form className="search-data add-driver" onSubmit={handleSubmit(onSubmit)}>
						<div className="add_event_pehra">
							<p className="add_event_pehra_black">Sorry to see you leave, please leave feedback.</p>
						</div>
						<div className="feed-label-box">
							<label>Feedback (Optional)</label>
							<textarea placeholder="Please leave us feedback" {...register('feedback')}></textarea>
                            {errors.feedback && (
								<div className="text-danger">{errors.feedback.message}</div>
							)}
                        </div>
						<div className="add_event_pehra danger-text">
							<p className="text-danger">Subscribe will be canceled right away and you will have 6 month to access and dowload your driver’s logs.</p>
						</div>
						<div className="modal-footer">
							<button type="button" onClick={props.close} className="btn btn-secondary" data-dismiss="modal">Cancel</button>
							<button type="submit" disabled={isValid} onClick={handleSubmit} className="btn d-block add-button danger-btn">Cancel Subscription</button>
						</div>
					</form>
				</Modal.Body>
			</Modal>
		)
	);
}

export default CancelSubscription;
