import * as actionTypes from '../constants/actionTypes';
import * as api from '../api';
import { toast } from "react-toastify";
import { refreshToken } from "../actions/authAction";

/**
* function for get user
* @param {*} data User id 
* @description get user by id
* @param {function} getUser getUser function
*/
export const getBillingHistory = (formData) => async dispatch => {
    try {
        dispatch({ type: actionTypes.GET_BILLING_HISTORY_REQUEST })
        const { data } = await api.getAllTransactions(formData)
        dispatch({ type: actionTypes.GET_BILLING_HISTORY_SUCCESS, payload: data })

    } catch (err) {
        // console.log(err)
        dispatch({ type: actionTypes.GET_BILLING_HISTORY_FAIL, payload: err.response.data.message })
    }
}

/**
* function for loadSubscription
* @param {*} data User data 
* @description get user infromation
* @param {function} loadSubscription loadSubscription function
*/
export const loadSubscription = id => async dispatch => {
    try {
        dispatch({ type: actionTypes.LOAD_SUBSCRIPTION_REQUEST })
        const { data } = await api.editSubscription(id);
        dispatch({ type: actionTypes.LOAD_SUBSCRIPTION_SUCCESS, payload: data })

    } catch (err) {
        // console.log(err)
        dispatch({ type: actionTypes.LOAD_SUBSCRIPTION_FAIL, payload: err.response.data })
    }
}

/**
* function for user saveSubscription
* @param {*} data form data and history
* @description user saveSubscription
* @param {function} saveSubscription saveSubscription function
*/
export const createPaymentMethod = (formData, custId) => async dispatch => {
    try {
        dispatch({ type: actionTypes.CREATE_PAYMENT_METHOD_REQUEST })
        const { data } = await api.storeSubscription(formData);        
        toast.success("Payment method added successfully");
        dispatch(refreshToken());
        //  if(data) dispatch(getPaymentMethods(custId));
        dispatch({ type: actionTypes.CREATE_PAYMENT_METHOD_SUCCESS, payload: data })

    } catch (err) {
        // console.log('error is: ', err?.response?.data)
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.CREATE_PAYMENT_METHOD_FAIL, payload: err.response.data.message })
    }
}

/**
* function for user saveSubscription
* @param {*} data form data and history
* @description user saveSubscription
* @param {function} saveSubscription saveSubscription function
*/
export const updatePaymentMethod = (formData) => async dispatch => {
    try {
        dispatch({ type: actionTypes.UPDATE_PAYMENT_METHOD_REQUEST })
        const data = await api.storeSubscription(formData)
        .then((data) => {
            if(data && data?.data && data?.data?.customer){
            dispatch(getPaymentMethods({
                customerId: data?.data?.data?.customer,
                type: 'card'
            }));
        }
            return data.data;
        })
        .catch((error) => console.log(error))   
        toast.success("Payment method update successfully");
        dispatch(refreshToken());
        //if(data) dispatch(getPaymentMethods(custId));
        dispatch({ type: actionTypes.UPDATE_PAYMENT_METHOD_SUCCESS, payload: data })

    } catch (err) {
        
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.UPDATE_PAYMENT_METHOD_FAIL, payload: err.response.data.message })
    }
}

/**
* function for user subscriptionUpdate
* @param {*} data User data 
* @description update user infromation
* @param {function} subscriptionUpdate subscriptionUpdate function
*/
export const subscriptionUpdate = (userData ,customerId) => async (dispatch, getState) => {
    try {
        dispatch({ type: actionTypes.UPDATE_SUBSCRIPTION_REQUEST })
        const { data } = await api.updateSubscription(userData)
       
        dispatch(refreshToken(data));
        dispatch(getBillingHistory({
            customerId:data?.data?.customer
        }));
        dispatch({ type: actionTypes.UPDATE_SUBSCRIPTION_SUCCESS, payload: data })
        
        toast.success("Subscription Updated Successfully");
        

    } catch (err) {
        
        dispatch({ type: actionTypes.UPDATE_SUBSCRIPTION_FAIL, payload: err.response.data.message })
        toast.error(err.response.data.message);
        
    }
}
/**
* function for user update SUBSCRIPTION
* @param {*} data User data 
* @description update user infromation
* @param {function} subscriptionUpdateBlockUnblock subscriptionUpdateBlockUnblock function
*/
export const changeSubscriptionStatus = (userData,customerId) => async (dispatch, getState) => {
    try {
        dispatch({ type: actionTypes.UPGRADE_SUBSCRIPTION_REQUEST })
        const { data } = await api.updateSubscriptionStatus(userData)
        dispatch(refreshToken());
        dispatch(getBillingHistory({
            customerId:customerId
        }));
        dispatch({ type: actionTypes.UPGRADE_SUBSCRIPTION_SUCCESS, payload: data })
        dispatch({ type: actionTypes.UPGRADE_SUBSCRIPTION_RESET })
        toast.success("Subscription Upgraded successfully");
        dispatch(getSubscription());
    } catch (err) {
       
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.UPGRADE_SUBSCRIPTION_FAIL, payload: err.response.data.message })
    }
}

/**
 * functions for get current subscription
 * @param {*} data Subscription data
 * @description get subscription information
 * @params { function } subscriptionInformation function
 */

export const getSubscription = () => async dispatch => {
    try{
        dispatch({ type: actionTypes.GET_SUBSCRIPTION_REQUEST})
        const { data } = await api.getSubscription()
        dispatch({ type: actionTypes.GET_SUBSCRIPTION_SUCCESS, payload: data })
        toast.success(data.message);
    } catch(err){
       
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.GET_SUBSCRIPTION_FAIL, payload: err.response.data.message })
    }
}

export const destroyPaymentMethod = (formData, navigate) => async dispatch => {
    try {
        dispatch({ type: actionTypes.DELETE_PAYMENT_METHOD_REQUEST })
        const { data } = await api.deletePaymentMethod(formData)      
        toast.success("Deleted Payment Method Successfully",{
            onClose: () => {
              navigate(0);
            }
        });
        dispatch({ type: actionTypes.DELETE_PAYMENT_METHOD_SUCCESS, payload: data })
    } catch (err) {
        
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.DELETE_PAYMENT_METHOD_FAIL, payload: err.response.data.message })
    }
}

//cancel subscription

export const subscriptionCancel = (formData) => async dispatch => {
    try{
        dispatch({ type: actionTypes.CANCEL_SUBSCRIPTION_REQUEST })
        const { data } = await api.cancelSubscription(formData)
        dispatch(refreshToken());
        dispatch({ type: actionTypes.CANCEL_SUBSCRIPTION_SUCCESS, payload: data })
        toast.success(data.message);
    } catch (err){
       
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.CANCEL_SUBSCRIPTION_FAIL, payload: err.response.data.message })
    }
}

export const getPaymentMethods = (formData) => async dispatch => {
    try{
        dispatch({ type: actionTypes.GET_PAYMENT_METHOD_REQUEST })
        const { data } = await api.getPaymentMethods(formData)
        dispatch({ type: actionTypes.GET_PAYMENT_METHOD_SUCCESS, payload: data })
    } catch(err) {
        
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.GET_PAYMENT_METHOD_FAIL, payload: err.response.data.message })
    }
}

export const getPlanDetails = (formData) => async dispatch => {
    try{
        dispatch({ type: actionTypes.GET_UPGRADED_PLAN_REQUEST })
        const { data } = await api.getUpgradedPlan(formData)
        // dispatch(refreshToken(formData.companyId));
        dispatch({ type: actionTypes.GET_UPGRADED_PLAN_SUCCESS, payload: data })
    } catch(err){
        
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.GET_UPGRADED_PLAN_FAIL, payload: err.response.data.message })
    }
}


export const defaultPayment = (formValue) => async dispatch => {
    try{
        dispatch({ type: actionTypes.CREATE_DEFAULT_PAYMENT_REQUEST })
        const { data } = await api.addDefaultPayment(formValue)
        dispatch({ type: actionTypes.CREATE_DEFAULT_PAYMENT_SUCCESS, payload: data})
    }catch(err) {
       
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.CREATE_DEFAULT_PAYMENT_FAIL, payload: err.response.data.message })
    }
}