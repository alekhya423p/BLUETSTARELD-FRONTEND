import * as actionTypes from '../constants/actionTypes';

const defaultState = {
    transactions: [],
    subscription: {},
    subscriptions: [],
    upgraded_plan: {},
    saved_payments:[],
    defaultPayment: {},
    payments: [],
    credits:'',
    loading: false,
    errors:{}
  }
  
  export const subscriptionReducers = (state=defaultState, action={}) => {
    switch (action.type) {
        //get current subscription 
        case actionTypes.GET_SUBSCRIPTION_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.GET_SUBSCRIPTION_SUCCESS:
            return {
                ...state,
                loading: false,
                transactions: action.payload?.data,
            }
        case actionTypes.GET_SUBSCRIPTION_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.GET_SUBSCRIPTION_RESET:
            return {
                ...state,
                error: null,
                message: null
            }
        // get billing history request
        case actionTypes.GET_BILLING_HISTORY_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.GET_BILLING_HISTORY_SUCCESS:
            return {
                ...state,
                loading: false,
                subscriptions: action.payload?.data,
                credits:action.payload?.credit
            }
        case actionTypes.GET_BILLING_HISTORY_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.CLEAR_GET_BILLING_HISTORYS:
            return {
                ...state,
                error: null,
                message: null
            }
        // LOAD SUBSCRIPTION
        case actionTypes.LOAD_SUBSCRIPTION_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.LOAD_SUBSCRIPTION_SUCCESS:
            return {
                ...state,
                loading: false,
                subscription: action.payload.data,
            }
        case actionTypes.LOAD_SUBSCRIPTION_FAIL:
            return {
                ...state,
                error: action.payload
            }
        // get upgraded plan details
        case actionTypes.GET_UPGRADED_PLAN_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.GET_UPGRADED_PLAN_SUCCESS:
            return {
                ...state,
                loading: false,
                upgraded_plan: action.payload.data,
                message: action.payload.message,
            }
        case actionTypes.GET_UPGRADED_PLAN_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case actionTypes.CLEAR_GET_UPGRADED_PLAN:
            return {
                ...state,
                error: null,
                message: null
            }
        // UPDATE 
        case actionTypes.UPDATE_SUBSCRIPTION_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.UPDATE_SUBSCRIPTION_SUCCESS:
            return {
                ...state,
                loading: false,
                message: action.payload.message,
                errors: {},
                subscriptions: [...state.subscriptions, action.payload.data],
            }
        case actionTypes.UPDATE_SUBSCRIPTION_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case actionTypes.UPDATE_SUBSCRIPTION_RESET:
            return {
                ...state,
                error: null,
                message: null
            }
        //upgrade
        case actionTypes.UPGRADE_SUBSCRIPTION_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.UPGRADE_SUBSCRIPTION_SUCCESS:
            return {
                ...state,
                loading: false,
                subscriptions: action.payload.data,
                message: action.payload.message,
                status: action.payload.success
            }
        case actionTypes.UPGRADE_SUBSCRIPTION_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case actionTypes.UPGRADE_SUBSCRIPTION_RESET:
            return {
                ...state,
                error: null,
                message: null
            }
        // GET ALL PAYMENT METHOD
        case actionTypes.GET_PAYMENT_METHOD_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.GET_PAYMENT_METHOD_SUCCESS:
            return {
                ...state,
                loading: false,
                payments: action.payload?.data,
            }
        case actionTypes.GET_PAYMENT_METHOD_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.CLEAR_PAYMENT_METHOD_RESET:
            return {
                ...state,
                error: null,
                message: null
            }
         // CREATE ACTION
         case actionTypes.CREATE_PAYMENT_METHOD_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.CREATE_PAYMENT_METHOD_SUCCESS:
            return {
                ...state,
                loading: false,
               // payments: [...state.payments, action.payload.data],
                payments: action.payload.data.paymentMethods,
                message: action.payload.message,
                errors: {},
            }
        case actionTypes.CREATE_PAYMENT_METHOD_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        // CREATE ACTION
        case actionTypes.UPDATE_PAYMENT_METHOD_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.UPDATE_PAYMENT_METHOD_SUCCESS:
            return {
                ...state,
                loading: false,
                payments: action.payload.data.paymentMethods,
                payment_method : action.payload.data.paymentMethod,
                // payments: state.payments.map(item => item.id === action.payload.data.id ? action.payload.data : item),
                message: action.payload.message,
                errors: {},
            }
        case actionTypes.UPDATE_PAYMENT_METHOD_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        // DELETE ACTION
        case actionTypes.DELETE_PAYMENT_METHOD_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.DELETE_PAYMENT_METHOD_SUCCESS:
            return {
                ...state,
                loading: false,
                payments: state?.payments?.filter(item => item.id !== action?.payload?.data?.id),
                message: action.payload.message
            }
        case actionTypes.DELETE_PAYMENT_METHOD_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload

            }
        case actionTypes.DELETE_PAYMENT_METHOD_RESET:
            return {
                ...state,
                error: null,
                message: null
            }
        // default payment method
        case actionTypes.CREATE_DEFAULT_PAYMENT_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.CREATE_DEFAULT_PAYMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                defaultPayment: action.payload?.data,
            }
        case actionTypes.CREATE_DEFAULT_PAYMENT_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.CREATE_DEFAULT_PAYMENT_CLEAR:
            return {
                ...state,
                error: null,
                message: null
            }
        // CANCEL 
        case actionTypes.CANCEL_SUBSCRIPTION_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.CANCEL_SUBSCRIPTION_SUCCESS:
            return {
                ...state,
                loading: false,
                cancel: state.subscriptions.map(item => item.id === action.payload.data.id ? action.payload.data : item),
                message: action.payload.message,
                status: action.payload.success
            }
        case actionTypes.CANCEL_SUBSCRIPTION_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case actionTypes.CANCEL_SUBSCRIPTION_RESET:
            return {
                ...state,
                error: null,
                message: null
            }

        
        default:
        return state;
    }
  }