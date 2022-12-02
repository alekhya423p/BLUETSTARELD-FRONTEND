import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Modal, Button } from 'react-bootstrap';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import Loading from "../../layout/Loading";
import { createPaymentMethod, updatePaymentMethod, destroyPaymentMethod } from "../../../actions/subscriptionActions";
import { getAllStates } from "../../../actions/reportsAction";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Card from "./Card";
import mastercard from "../../../assets/mastercard.png";
import amex from "../../../assets/amex.png";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
// import { getPaymentMethods } from "../../../api";

const PaymentForm = (props) => {
	const stripe = useStripe();
	const elements = useElements();
	const { loading } = useSelector(state => state.subscriptionStore)
	const { isMode } = useSelector(state => state.dashboard)
	const { states } = useSelector(state => state.reports)
	const [type, setType] = useState("card");
	// const [updateValue , setUpdateValue] = useState("")
	const [buttonText, setButtonText] = useState();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const userInfo = JSON.parse(localStorage.getItem("userInfo"));
	const customerId = userInfo && userInfo.companyInfo && userInfo.companyInfo.subscription && userInfo.companyInfo.subscription.stripeCustomerId ? userInfo.companyInfo.subscription.stripeCustomerId : '';

	const companyId = userInfo && userInfo.companyInfo && userInfo.companyInfo && userInfo.companyInfo._id ? userInfo.companyInfo._id : '';
	const userId = userInfo && userInfo.user && userInfo.user && userInfo.user.id ? userInfo.user.id : '';
	const validationSchema = yup.object().shape({
		isAddDefault: yup.boolean(),
		isCard: yup.boolean(),
		isBank: yup.boolean(),
		email: yup.string().when('isCard', { is: true, then: yup.string().required('Please enter email') }),
		name: yup.string().when('isCard', { is: true, then: yup.string().required('Please enter name') }),
		line1: yup.string().required('Please enter address'),
		state: yup.string().required('Please enter state'),
		city: yup.string().required('Please enter city'),
		postal_code: yup.string().required('Please enter postal code')
		// email_address: yup.string().when('isBank', { is: true, then: yup.string().required('Please enter email address') }),
		// routing_number: yup.string().when('isBank', { is: true, then: yup.string().required('Please enter routing number') }),
		// account_number: yup.string().when('isBank', { is: true, then: yup.string().required('Please enter account number') }),
		// confirm_account_number: yup.string().oneOf([yup.ref('account_number'), null], 'Confirm Account numbers must match').when('isBank', { is: true, then: yup.string().required('Please enter confirm account number')}),
	})
	// const formValue = {
	// 	customerId: customerId,
	// 	type: 'card'
	// }; 

	// dispatch(getPaymentMethods(formValue));

	const { reset, register, handleSubmit, setValue, formState: { errors, ...formState } } = useForm({
		mode: "onBlur",
		resolver: yupResolver(validationSchema),
	}),

		[inputModalTitle, setInputModalTitle] = useState("");
	const { isValid } = formState
	const onSubmit = async (values, e) => {
		if (type === "card") {
			e.preventDefault();
			if (props.data && props.mode === "edit") {
				values.payment_id = props.data.id
			} else {
				if (!stripe || !elements) return null;
				const cardElement = elements.getElement(CardElement);
				const { error, paymentMethod } = await stripe.createPaymentMethod({
					type: "card",
					card: cardElement,
				});
				if (error) {
					toast.error("Something went wrong with payment");
					return;
				}
				values.payment_id = paymentMethod.id
			}
			// console.log(values, "79")
			values.customerId = customerId;
			values.companyId = companyId;
			values.userId = userId;
			values.isAddDefault=true;
			// delete values.isCard
			// delete values.isBank
			// delete values.email_address
			
			const formValue = {
				customerId: props.custId,
				type: 'card'
			};
			(props.data && props.mode === "edit") ? dispatch(updatePaymentMethod(values, formValue, navigate)) : dispatch(createPaymentMethod(values, formValue, navigate));

		}
		// console.log(values.payment_id ,"loading")
		// setUpdateValue(values.payment_id)
		// console.log(dispatch,"dispatch")
		// dispatch(getPaymentMethods(formData))
		// 	}else{
		// 		const dataValue = {
		// 			routing_number: values.routing_number,
		// 			account_number : values.account_number,
		// 			email_address: values.email_address

		// 		}
		// 	}			
		// if (props.data) {
		// 	dataValue.id = (props.data !== false) ? props.data.id : ''
		// }
		// (props.data) ? dispatch(subscriptionUpdate(values)) : dispatch(saveSubscription(values));
		props.close();
	};

	// 	useEffect(() => {
	// 		// console.log(updateValue, customerId , 119)
	// 		if (updateValue && customerId) {
	// 		  const formValue = {
	// 			customerId: customerId,
	// 			type: 'card'
	// 		}; 
	// 		 dispatch(getPaymentMethods(formValue));
	// 		}

	//   // eslint-disable-next-line react-hooks/exhaustive-deps
	// 	  }, [updateValue , dispatch])

	useEffect(() => {
		dispatch(getAllStates())
	}, [dispatch])

	
	useEffect(() => {
		if (props?.data && props?.mode === "edit") {
			// payments?.map((item, index) => {
			//     if(item.id === props.data.id && props.data?.defaultPaymentMethod) item.defaultPaymentMethod = true;
			//     else item.defaultPaymentMethod = false;
			// 	return item ;
			// });
			
			setValue('isAddDefault', props?.data?.defaultPaymentMethod)
			setValue('email', props.data.billing_details.email)
			setValue('name', props.data.billing_details.name)
			setValue('line1', props.data.billing_details.address.line1)
			setValue('line2', props.data.billing_details.address.line2)
			setValue('state', props.data.billing_details.address.state)
			setValue('city', props.data.billing_details.address.city)
			setValue('postal_code', props.data.billing_details.address.postal_code)
			setInputModalTitle("Edit Payment Method");
			setButtonText('Update')
			// setValue('email_address', props.data.email_address)
			// setValue('routing_number', props.routing_number)
			// setValue('account_number', props.data.account_number)
			// setValue('confirm_account_number', props.data.confirm_account_number)
		} else {
			setValue('email', '')
			setValue('name', '')
			setValue('line1', '')
			setValue('line2', '')
			setValue('state', '')
			setValue('city', '')
			setValue('postal_code', '')
			setValue('isAddDefault', false)
			setInputModalTitle("Add Payment Method");
			setButtonText('Add');
			// setValue('email_address', '')
			// setValue('routing_number', '')
			// setValue('account_number', '')
			// setValue('confirm_account_number', '')

		}
		// eslint-disable-next-line
	}, [props, reset, setValue]);
	
	const deleteSubscription = () => {
		const data = {
			paymentMethodId: props.data.id
		};
		dispatch(destroyPaymentMethod(data, navigate));
		props.close();
	}

	const handleTypeChange = (type) => {
		if (type === "card") {
			setValue("isCard", true);
			setValue("isBank", false);
		} else if (type === "bank") {
			setValue("isBank", true);
			setValue("isCard", false);
		}
		setType(type);
	}

	useEffect(() => {
		if (type === "card") {
			setValue("isCard", true);
			setValue("isBank", false);
		} else if (type === "bank") {
			setValue("isBank", true);
			setValue("isCard", false);
		}
	}, [type, setValue]);

	return (
		props.open && (
			<Modal className={isMode} show={props.open} onHide={props.close}>
				<Modal.Header>
					<Modal.Title id="contained-modal-title">{inputModalTitle}</Modal.Title>
					<Button variant="outline-danger" onClick={props.close}><i className="ti ti-x"></i></Button>
				</Modal.Header>
				<Modal.Body>
					<form onSubmit={handleSubmit(onSubmit)} method="POST">
						{props.mode === "edit" ?
							<ul className="default-pay-methord">
								<li className="default-check-methord">
									<input type="checkbox" name="isAddDefault" {...register('isAddDefault')} />
								</li>
								<li className="default-content-methord">
									<p><strong>Set as Default Payment Method</strong></p>
									<p>Future charges will default to this Payment Method</p>
								</li>
							</ul> : ""}
						{props.mode !== "edit" ?
							<ul className="nav nav-pills card-tabs mb-3" id="pills-tab" role="tablist">
								<li className="nav-item" role="presentation">
									<button className="nav-link active" id="pills-card-tab" data-bs-toggle="pill" data-bs-target="#pills-card" type="button" role="tab" aria-controls="pills-card" aria-selected="false" onClick={() => handleTypeChange("card")}><span>Card</span>
										<img className="visa_logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="user" />
										<img className="master_logo" src={mastercard} alt="user" />
										<img className="am_logo" src={amex} alt="user" />
										<i className="ti ti-circle-check"></i>
										<i className="ti ti-circle"></i>
									</button>
								</li>
								{/* <li className="nav-item" role="presentation">
								<button className="nav-link" id="pills-bank-tab" data-bs-toggle="pill" data-bs-target="#pills-bank" type="button" role="tab" aria-controls="pills-bank" aria-selected="false" onClick={() => handleTypeChange("bank")}>Bank
									<p>ACH Bank Transfer</p>
									<i className="ti ti-circle-check"></i>
									<i className="ti ti-circle"></i>
								</button>
							</li> */}
							</ul> : ""}

						<div className="tab-content" id="pills-tabContent">
							<div className="tab-pane fade show active" id="pills-card" role="tabpanel" aria-labelledby="pills-card-tab">
								<div className='row'>
									{props.mode !== "edit" ? <div className='col-sm-12'>
										<div className="input_cards">
											<label>Email</label>
											<input type="email" {...register('email')} className="form-control" name="email" required="" placeholder="" />
											{errors.email && (
												<div className="text-danger">{errors.email.message}</div>
											)}
										</div>
									</div> : ""}
									{props.paymentIntend !== "bank" ?
										<>
											<p className="title_names">Card Info</p>
											<div className='col-sm-12'>
												<div className="input_cards">
													<label>Card Holder</label>
													<input type="text" className="form-control" name="name" {...register('name')} required="" placeholder="Card Holder Name" />
													{errors.name && (
														<div className="text-danger">{errors.name.message}</div>
													)}
												</div>
											</div>
											{!(props.data && props.mode === "edit") ?
												<div className='col-sm-12 new_card_div'>
													<div className="input_cards">
														<label>Card Details</label>
														<Card />
													</div>
												</div> : null}
										</>
										: ""}
								</div>
							</div>
							<div className={props.mode === "edit" && props.paymentIntend === "bank" ? "tab-pane fade show active" : "tab-pane fade "} id="pills-bank" role="tabpanel" aria-labelledby="pills-bank-tab">
								<div className="row">
									{props.mode !== "edit" ?
										<div className='col-sm-12'>
											<div className="input_cards">
												<label>Email</label>
												<input type="email" className="form-control" name="email_address" {...register('email_address')} required="" placeholder="" />
												{errors.email_address && (
													<div className="text-danger">{errors.email_address.message}</div>
												)}
											</div>
										</div>
										: ""}
									{/* { props.paymentIntend === "bank" || props.mode !== "edit" ?
									<>
									<p className="title_names">Bank Info</p>
									<div className='col-sm-12'>
										<div className="input_cards">
											<label>Routing Number</label>
											<input type="text" className="form-control" name="name" {...register('routing_number')} required="" placeholder="Routing Number" />
											{errors.routing_number && (
												<div className="text-danger">{errors.routing_number.message}</div>
											)}
										</div>
									</div>
									<div className='col-sm-12'>
										<div className="input_cards">
											<label>Account Number</label>
											<input type="text" className="form-control" {...register('account_number')} name="account_number" required="" placeholder="Account Number" />
											{errors.account_number && (
												<div className="text-danger">{errors.account_number.message}</div>
											)}
										</div>
									</div>
									<div className='col-sm-12'>
										<div className="input_cards">
											<label>Confirm Account Number</label>
											<input type="password" className="form-control" name="name" {...register('confirm_account_number')} required="" onPaste={(e)=>{
												e.preventDefault()
												return false;
												}} onCopy={(e)=>{
												e.preventDefault()
												return false;
											}}  placeholder="***********" />
											{errors.confirm_account_number && (
												<div className="text-danger">{errors.confirm_account_number.message}</div>
											)}
										</div>
									</div>
									</>
									: ""} */}

								</div>
							</div>
							<div className='row'>
								<p className="title_names">Billing Address</p>
								<div className='col-sm-12'>
									<div className="input_cards">
										<label>Address Line 1</label>
										<input type="text" className="form-control" name="name" required="" {...register('line1')} placeholder="" />
										{errors.line1 && (
											<div className="text-danger">{errors.line1.message}</div>
										)}
									</div>
								</div>
								<div className='col-sm-12'>
									<div className="input_cards">
										<label>Address Line 2</label>
										<input type="text" className="form-control" name="name" required="" {...register('line2')} placeholder="" />
										{errors.line2 && (
											<div className="text-danger">{errors.line2.message}</div>
										)}
									</div>
								</div>
								<div className='col-sm-12'>
									<div className="input_cards">
										<label>State</label>
										<select className="form-control" {...register('state')}>
											{states?.map((item, index) => {

												return <option key={index}> {item.state}</option>


											})}


										</select>
									</div>
									{errors.state && (
										<div className="text-danger">{errors.state.message}</div>
									)}
								</div>
								<div className='col-sm-6'>
									<div className="input_cards">
										<label>City</label>
										<input type="text" className="form-control" name="name" {...register('city')} required="" placeholder="" />
										{errors.city && (
											<div className="text-danger">{errors.city.message}</div>
										)}
									</div>
								</div>
								<div className='col-sm-6'>
									<div className="input_cards">
										<label>Postal code</label>
										<input type="number" className="form-control" name="name" {...register('postal_code')} required="" placeholder="" />
										{errors.postal_code && (
											<div className="text-danger">{errors.postal_code.message}</div>
										)}
									</div>
								</div>
							</div>
						</div>

						<div className="modal-footer">
							{props.mode === 'edit' ? <button type="button" className="btn btn-secondary danger-btn" data-dismiss="modal" onClick={deleteSubscription}>Delete</button> : ''}
							<button type="button" onClick={props.close} className="btn btn-secondary" data-dismiss="modal">Cancel</button>
							<button disabled={(props.mode !== 'edit') && isValid} type="submit" className="btn d-block add-button">{loading ? <Loading /> : buttonText}</button>
						</div>
					</form>
				</Modal.Body>
			</Modal>
		)
	);
};


export default PaymentForm;
