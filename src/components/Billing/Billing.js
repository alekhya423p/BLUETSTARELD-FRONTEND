import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";
import { getSubscription, getBillingHistory, getPaymentMethods, getPlanDetails } from "../../actions/subscriptionActions";
import BillingHistory from "./components/BillingHistory";
import UpgradeSubscription from './components/UpgradeSubscription'
import UpdateSubscription from './components/UpdateSubscription'
import CancelSubscription from './components/CancelSubscription'
import { getActiveVehiclesList } from "../../actions/vehicleAction";
import PaymentForm from './components/PaymentForm'
import { loadStripe } from '@stripe/stripe-js';
import { useForm } from "react-hook-form";
import { Elements } from '@stripe/react-stripe-js';
import * as actionTypes from '../../constants/actionTypes';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import Loading from "../layout/Loading";
// import { Navigate } from "react-router-dom";

const stripePromise = loadStripe('pk_test_51HKt1MAGomY21Z83KFawWITEq61a67k4EXIO5GesVy8a9vr9SPBSJH9gs8607ohkyaH6P6RpdB72Zny7hIYPYNcR00POwY9dYq');

const Billing = (props) => {
    
    const pageHead = 'Billing';
    const dispatch = useDispatch();
    const { isMinimize } = useSelector(state => state.dashboard)
    const { transactions, subscriptions, payments, upgraded_plan ,loading ,credits } = useSelector(state => state.subscriptionStore)
    const { activeVehicles } = useSelector(state => state.vehicles)
    const [selectedRowData, setSelectedRowData] = useState(false);
    const [cancelSubsModal, setCancelSubsModal] = useState(false);
    const [updateSubsModal, setUpdateSubsModal] = useState(false);
    const [upgradeSubsModal, setUpgradeSubsModal] = useState(false);
    const [paymentFormModal, setPaymentFormModal] = useState(false);
    const [updateValue , setUpdateValue] = useState()
    const [defaultPayment, setDefaultPayment] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [type, setType] = useState("");
    const [priceID, setPriceID] = useState("");
    const [totalBill, setTotalBill] = useState(0);
    const [vehicleCount, setVehicleCount] = useState(0);
    const [quantity, setQuantity] = useState("");
    const [mode, setMode] = useState("");
    const[showUpgrade,setShowUpgrade]=useState(false)
    const itemsPerPage = 5;
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const custId = userInfo && userInfo.companyInfo && userInfo.companyInfo.subscription && userInfo.companyInfo.subscription.stripeCustomerId ? userInfo.companyInfo.subscription.stripeCustomerId : '';
    const subscriptionInfo = userInfo && userInfo.companyInfo && userInfo.companyInfo.subscription && userInfo.companyInfo.subscription.subscriptionInfo ? userInfo.companyInfo.subscription.subscriptionInfo : '';
    const allow_system_user = userInfo && userInfo.user && userInfo.user.userType ? (userInfo.user.userType === 'company-administrator' || 'system-super-admin' ||'system-administrator') : false;
    const priceId = userInfo && userInfo.companyInfo && userInfo.companyInfo.subscription && userInfo.companyInfo.subscription.subscriptionInfo && userInfo.companyInfo.subscription.subscriptionInfo.price;
    let finalCredit = credits > 0 ? 0 : Math.abs(credits/100)
    if (isNaN(finalCredit)) finalCredit = 0;
    // console.log(finalCredit);

    const validationSchema = yup.object().shape({
        vehicle_count: yup.number().typeError('vehicle count must be a number').positive().label('vehicle count').required('Vehicle Count is required').min(1),
    });
    const { register, handleSubmit, formState: { errors, ...formState } } = useForm({
        mode: "onBlur",
        resolver: yupResolver(validationSchema),
    });
    // console.log(custId);
    const { isValid } = formState
    const subscribedVehicle = subscriptionInfo?.vehicleCount;
    let numberVehicle = Number(subscribedVehicle);
    if (isNaN(numberVehicle)) numberVehicle = 0;
    const onSubmit = async (values, e) => {
        if (values.vehicle_count < activeVehicles) {
            toast.warning('You need to deactivate vehicles to update subscription');
        }// else if (values.vehicle_count > vehicleCount && upgraded_plan ? upgraded_plan?.planName !== "Enterprise Fleet Plan" :upgraded_plan?.planName !== undefined ) {
        //     // console.log(values.vehicle_count , vehicleCount ,upgraded_plan?.planName !== "Enterprise Fleet Plan", upgraded_plan?.planName,65)
        //     toast.info('You need to upgrade your plan');
        // } 
        else if (defaultPayment) {
            setUpdateSubsModal(true);
            setSelectedRowData(false);
        } else {
            toast.warning('You need to set a default payment method');
        }
    };
    const userType =userInfo && userInfo.user 
    const handleUpgradeSubsShow = () => {
        if(defaultPayment){
            setUpgradeSubsModal(true);
            setSelectedRowData(false);
            if (priceId) {
                const formData = {
                    price: priceId
                };
                dispatch(getPlanDetails(formData));
            }
            dispatch(getSubscription())
            dispatch(getActiveVehiclesList())
        }else if (payments.length===0){
            toast.warning('You need to set a default payment method')
        }else{
            toast.warning('You need to set a default payment method')
        }
      

    };

    const handleUpgradeSubsModalClose = () => {
        setUpgradeSubsModal(false);
        setSelectedRowData(false);
    }
    const handleUpdateSubsModalClose = () => {
        setUpdateSubsModal(false);
        setSelectedRowData(false);
    }
    const handleCancelSubsShow = () => {
        setCancelSubsModal(true);
        setSelectedRowData(false);
    };
    const handleCancelSubsModalClose = () => {
        setCancelSubsModal(false);
        setSelectedRowData(false);
    }

    const handlePaymentFormShow = (type, mode, payment) => {
        setPaymentFormModal(true);
        setSelectedRowData(payment);
        setType(type);
        setMode(mode);
        // let formValue ={
        //     customerId:custId,
        //     type:"card"
        // }
        // dispatch(getPaymentMethods(formValue))
    };

    const handlePaymentFormModalClose = () => {
        setPaymentFormModal(false);
        setSelectedRowData(false);
    }

    useEffect(() => {
        if (priceId) {
            // const formData = {
            //     price: priceId
            // };
            // dispatch(getPlanDetails(formData));
        }
        dispatch(getSubscription())
        dispatch(getActiveVehiclesList())
    }, [dispatch,priceId]);

    useEffect(() => {
        if (custId) {
            const formValue = {
                customerId: custId,
                type: 'card'
            };
            dispatch(getPaymentMethods(formValue));
        } else {
            dispatch({ type: actionTypes.CLEAR_PAYMENT_METHOD_RESET })
        }
    }, [dispatch, custId]);

    useEffect(() => {
        if (userInfo?.companyInfo?.stripeCustomerId) {
            const dataValue = {
                customerId: userInfo?.companyInfo?.stripeCustomerId
            };
            dispatch(getBillingHistory(dataValue));
        } else {
            dispatch({ type: actionTypes.CLEAR_GET_BILLING_HISTORYS })
        }
    }, [dispatch,  userInfo?.companyInfo?.stripeCustomerId]);

    const handleCalculate = (e, planAmount, vehicleCount) => {
        
        setVehicleCount(vehicleCount)
        // setUpdateValue(subscriptionInfo?.vehicleCount +Number(e.target.value) )
        setQuantity(e.target.value)
        setTotalBill(planAmount * e?.target?.value)
    }
    
    useEffect(() => {
        if (transactions) {
            setPriceID(transactions.stripePriceId);
        }
    }, [transactions]);

    useEffect(() => {
        if (payments) {
            payments.filter((item) => {
                return item.defaultPaymentMethod ? setDefaultPayment(item.id) : null
            })
        }
    }, [payments]); // eslint-disable-next-line

    useEffect(() =>{
        if(custId){
            const dataValue = {
                customerId: custId
            };
            dispatch(getBillingHistory(dataValue));  
        }
        // eslint-disable-next-line
    },[dispatch ,userType.userType==="system-technician"])
    

//    const creditAmount = Number(totalBill ? totalBill : 0) - numberVehicle * (Object.keys(upgraded_plan).length === 0 ? Object.keys(transactions).length === 0 ? 0 : transactions?.price : Object.keys(upgraded_plan).length === 0 ? 0 : upgraded_plan?.price) < 0 ? 0 : Number(totalBill ? totalBill : 0) - numberVehicle * (Object.keys(upgraded_plan).length === 0 ? Object.keys(transactions).length === 0 ? 0 : transactions?.price : Object.keys(upgraded_plan).length === 0 ? 0 : upgraded_plan?.price)
    // const finalBill =date<= 10 ?Number(totalBill ? totalBill : 0) + numberVehicle*(priceId ? upgraded_plan ? upgraded_plan?.price : 0 : transactions? transactions?.price : 0) : date<=20 ?(totalBill ? totalBill : 0 +  numberVehicle *(priceId ? upgraded_plan ? upgraded_plan?.price : 0 : transactions? transactions?.price : 0)  )/2 : date<=31 ? (totalBill ? totalBill : 0 + numberVehicle *(priceId ? upgraded_plan ? upgraded_plan?.price : 0: transactions? transactions?.price : 0))/3 : 0 
    
    const handleUpdateQuantity = () =>{
        setUpdateValue(quantity);
    }
    let planNameCheck = upgraded_plan?.planName === "Large Fleet Plan" || upgraded_plan?.planName === "Enterprise Fleet Plan"
        useEffect(()=>{
            
           if( (upgraded_plan ? upgraded_plan?.planName === "Large Fleet Plan" : null)  &&  (subscriptionInfo?.vehicleCount === undefined ? 0 :subscriptionInfo?.vehicleCount>25 ) ){
            setShowUpgrade(true)
            
           }else if((upgraded_plan ? upgraded_plan?.planName === "Enterprise Fleet Plan" : null) && subscriptionInfo?.vehicleCount === undefined ? 0 :subscriptionInfo?.vehicleCount<75 ){
            setShowUpgrade(false)
            
           }else if((upgraded_plan ? upgraded_plan?.planName === "Enterprise Fleet Plan" : null)  &&  (subscriptionInfo?.vehicleCount === undefined ? 0 :subscriptionInfo?.vehicleCount>75 )){
            setShowUpgrade(true)
            

           }else{
            setShowUpgrade(false)
           } 
           // eslint-disable-next-line react-hooks/exhaustive-deps
        },[planNameCheck ,showUpgrade])

    // console.log(showUpgrade,upgraded_plan?.planName === "Enterprise Fleet Plan",subscriptionInfo?.vehicleCount<75,upgraded_plan?.planName === "Large Fleet Plan" ,subscriptionInfo?.vehicleCount>25,212)

    console.log(updateValue , vehicleCount); 
    
    return (
        <>
            <Header pageHead={pageHead} />
            <Sidebar />
            <Elements stripe={stripePromise}>
                <div className={`main-content ${isMinimize === 'minimize' ? 'minimize-main' : ''}`}>
                    <div className={userType.userType === "company-administrator" ? "page-content billing-page-sec company-admin" : "page-content billing-page-sec"}>
                        <div className="container">
                        <div className="billing_loader">{loading ? <Loading/>: null}</div>
                        
                            <div className="row">
                                <div className="col-md-10 billing-box">
                                    <div className="headings-billing">
                                        <h1>Billing</h1>
                                        {/* <p className="sub-heading-billing">Manage your billing and payment details</p> */}
                                    </div>
                                    <div className="row">
                                        <div className="col-md-5">
                                            <div className="billing-plan-box">
                                                <ul className="billing-plan-ul">
                                                    <li>
                                                        <h5>{ transactions?.planName } <span>Monthly</span></h5>
                                                        <p>Active Vehicles Count: {activeVehicles ? activeVehicles : 0}</p>
                                                        {/* {console.log(subscriptionsUpdate,223)} */}
                                                    </li>
                                                    <li className="price-per-veh">
                                                        <h2>${ transactions?.price}<sub>Per Vehicle</sub></h2>
                                                       
                                                    </li>
                                                </ul>
                                                <form onSubmit={handleSubmit(onSubmit)}>
                                                    <div className="add-vehicles-div">
                                                        <label>Subscribed Vehicles Count:</label><br />
                                                        <span className="input-credits">
                                                            <input type="text" disabled={!allow_system_user} name="vehicle_count" defaultValue={subscriptionInfo?.vehicleCount || 0} {...register('vehicle_count')} placeholder={transactions.vehicleCount} onChange={(e) => handleCalculate(e, !transactions?0 : transactions?.price, transactions.vehicleCount)} />
                                                            <i className="ri-truck-line"></i>
                                                            <button className="input-filter"><i className="ri-arrow-up-down-fill"></i></button>
                                                            {errors.vehicle_count && (
                                                                <div className="text-danger">{errors.vehicle_count.message}</div>
                                                            )}
                                                            <p>Your Credits: ${finalCredit}</p>
                                                            {/* {console.log(totalBill, transactions?.price, numberVehicle, 214)} */}
                                                        </span>
                                                    </div>
                                                    <div className="subscription-box">
                                                        <p className="total_price">Total: $ {Number(totalBill ? totalBill : 0) - numberVehicle * ( Object.keys(transactions).length===0 ? 0 :transactions?.price) < 0 ? 0 : Number(totalBill ? totalBill : 0) - numberVehicle * ( Object.keys(transactions).length===0 ? 0 :transactions?.price)}</p>
                                                        {/* {console.log(totalBill,numberVehicle,transactions,231)} */}
                                                        <button type="submit" disabled={isValid || !allow_system_user || quantity <= subscriptionInfo?.vehicleCount } onClick={()=>handleUpdateQuantity()} className="update-subscription">Update Subscription</button>
                                                        {/* {console.log(quantity < subscriptionInfo?.vehicleCount ,isValid , !allow_system_user,254)} */}
                                                    </div>
                                                    
                                                </form>
                                                <div className={showUpgrade ? "update_plan": "update_plan_no_line" }>
                                                    {/* {console.log(upgraded_plan,258)} */}
                                                    {showUpgrade && allow_system_user ? <button type="button" disabled={!allow_system_user} className="btn-update-plan" onClick={() => handleUpgradeSubsShow()}>Plan Upgrade Available <i className="ri-arrow-right-up-line"></i></button> : showUpgrade && allow_system_user ? <button type="button" disabled={!allow_system_user} className="btn-update-plan" onClick={() => handleUpgradeSubsShow()}>Plan Upgrade Available <i className="ri-arrow-right-up-line"></i></button> : null }
                                                </div>
                                             
                                            </div>
                                         {/* {console.log(quantity > subscriptionInfo?.vehicleCount,quantity,subscriptionInfo?.vehicleCount, 224)}  */}
                                        </div>
                                        <div className="col-md-7">
                                            <div className="billing-plan-box">
                                                <ul className="billing-plan-ul">
                                                    <li>
                                                        <h5>Payment method</h5>
                                                        <p>Change how you pay for your plan.</p>
                                                    </li>
                                                </ul>
                                                {payments?.filter((index) => index.defaultPaymentMethod === true)?.map((item, index) => (

                                                    <div key={index} className="card-detail">
                                                        {/* {console.log(item, "item")} */}
                                                        <ul className="card-detail-ul active-card">
                                                            <li className="brand-img">
                                                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="user" />
                                                            </li>
                                                            <li className="card-details-li">
                                                                <p className="default_payment">Default Payment Method</p>
                                                                <p><strong>Visa ending in {item.card.last4}</strong></p>
                                                                <p>Expire {item.card.exp_month}/{item.card.exp_year}</p>
                                                                <p><i className="ri-mail-line"></i> {item.billing_details.email ? item.billing_details.email : 'NA'}</p>
                                                            </li>
                                                            <li className="edit-detail-btn">
                                                                <button type="button" disabled={!allow_system_user} onClick={() => handlePaymentFormShow("visa", "edit", item, payments.defaultPayment)} className="edit-card-btn">Edit</button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                ))}
                                                {payments?.filter((index) => index.defaultPaymentMethod === false)?.map((item, index) => (

                                                    <div key={index} className="card-detail">
                                                        {/* {console.log(item, "item")} */}
                                                        <ul className="card-detail-ul active-card">
                                                            <li className="brand-img">
                                                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="user" />
                                                            </li>
                                                            <li className="card-details-li">
                                                                <p><strong>Visa ending in {item.card.last4}</strong></p>
                                                                <p>Expire {item.card.exp_month}/{item.card.exp_year}</p>
                                                                <p><i className="ri-mail-line"></i> {item.billing_details.email ? item.billing_details.email : 'NA'}</p>
                                                            </li>
                                                            <li className="edit-detail-btn">
                                                                <button type="button" disabled={!allow_system_user} onClick={() => handlePaymentFormShow("visa", "edit", item, payments.defaultPayment)} className="edit-card-btn">Edit</button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                ))}

                                                {/* <div className="card-detail">
                                                <ul className="card-detail-ul">
                                                    <li className="brand-img">
                                                        <img src="https://cdn.iconscout.com/icon/free/png-256/chase-282443.png" alt="user" />
                                                    </li>
                                                    <li className="card-details-li">
                                                        <p><strong>ACH Account ending in 1234</strong></p>
                                                        <p>JPMorgan Chase Bank, N.A.</p>
                                                        <p><i className="ri-mail-line"></i> billing@abctrans.com</p>
                                                    </li>
                                                    <li className="edit-detail-btn">
                                                        <button type="button" onClick={() => handlePaymentFormShow("bank", "edit")} className="edit-card-btn">Edit</button>
                                                    </li>
                                                </ul>
                                            </div> */}
                                                {/* <div className="card-detail">
                                                <ul className="card-detail-ul">
                                                    <li className="brand-img">
                                                        <img src="https://festivals-india.com/wp-content/uploads/2022/01/unnamed.png" alt="user" />
                                                    </li>
                                                    <li className="card-details-li">
                                                        <p><strong>ACH Account ending in 1234</strong></p>
                                                        <p>Bank of America</p>
                                                        <p><i className="ri-mail-line"></i> billing@abctrans.com</p>
                                                    </li>
                                                    <li className="edit-detail-btn">
                                                        <button type="button" onClick={() => handlePaymentFormShow()} className="edit-card-btn">Edit</button>
                                                    </li>
                                                </ul>
                                            </div> */}
                                                <div className="update_plan">
                                                    <button className="btn-add-payment" disabled={!allow_system_user} onClick={() => handlePaymentFormShow()}><i className="ri-add-line"></i> Add new payment method</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className="billing-hr-line"></hr>
                                    <div className="row">
                                        <div className="col-12">
                                            <ul className="invoice-download-ul">
                                                <li>
                                                    <h4>Billing History</h4>
                                                    {/* <p>pick an account plan that fits your workflow</p> */}
                                                </li>
                                                {/* <li className="download-all">
                                                <button className="download-all-btn"><i className="ri-download-cloud-2-line"></i> Download All</button>
                                            </li> */}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-12 text-center">
                                            <div className="mb-0">
                                                <BillingHistory data={subscriptions} itemsPerPage={itemsPerPage}  quantity={quantity} numberVehicle={numberVehicle} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                                            </div>
                                        </div>
                                    </div>
                                    <hr className="billing-hr-line"></hr>
                                    {subscriptionInfo?.stripeSubscriptionId ?
                                        <div className="row">
                                            <div className="col-12">
                                                <ul className="invoice-download-ul cancel-subs">
                                                    <li className="cancel-subs-content">
                                                        <h4>Cancel Subscription</h4>
                                                        <p>When subscription is canceled, you will have 1 month to access and download your driver logs. We recommend you to download driver logs.</p>
                                                    </li>
                                                    <li className="download-all">
                                                        <   button onClick={() => handleCancelSubsShow()} className="download-all-btn"> Cancel Subscription</button>

                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        : ''}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!--Transfer Event Modal --> */}
                <UpgradeSubscription setShowUpgrade={setShowUpgrade} userInfo={userInfo} open={upgradeSubsModal} close={handleUpgradeSubsModalClose} data={selectedRowData} quantity={quantity} priceId={priceID} defaultPayment={defaultPayment}  upgraded_plan={upgraded_plan} transactions={transactions} />
                <UpdateSubscription userInfo={userInfo}  open={updateSubsModal} close={handleUpdateSubsModalClose} data={selectedRowData} quantity={quantity} priceId={priceID} defaultPayment={defaultPayment} transactions={transactions} finalCredit={finalCredit}/>
                <CancelSubscription userInfo={userInfo} open={cancelSubsModal} close={handleCancelSubsModalClose} data={selectedRowData} />
                <PaymentForm custId={custId} userInfo={userInfo} open={paymentFormModal} close={handlePaymentFormModalClose} data={selectedRowData} paymentIntend={type} mode={mode} defaultPayment={defaultPayment} />
            </Elements>
        </>
    );

}




export default Billing;