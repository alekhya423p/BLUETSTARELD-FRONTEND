import * as actionTypes from '../constants/actionTypes';

const defaultState = {
    alerts: [],
    alert: {},
    loading: false,
    errors: {}
}

export const alertReducers = (state = defaultState, action = {}) => {
    switch (action.type) {

        case actionTypes.GET_ALERT_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.GET_ALERT_SUCCESS:
            return {
                ...state,
                loading: false,
                alerts: action.payload?.data?.alerts,
                count: action.payload?.data?.count,
                totalRecord: action.payload?.data?.totalRecord,
            }
        case actionTypes.GET_ALERT_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.CLEAR_GET_ALERTS:
            return {
                ...state,
                error: null,
                message: null
            }

        // CREATE ACTION
        case actionTypes.CREATE_ALERT_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case actionTypes.CREATE_ALERT_SUCCESS:
            return {
                ...state,
                loading: false,
                alerts: [...state.alerts, action.payload.data.alert_info],
                // message: action.payload.message,
                // errors: {},
            }
        case actionTypes.CREATE_ALERT_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case actionTypes.CLEAR_ALERT:
            return {
                ...state,
                error: null,
                message: null
            }
        // DELETE ACTION
        case actionTypes.DELETE_ALERT_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.DELETE_ALERT_SUCCESS:
            return {
                ...state,
                loading: false,
                alerts: state.alerts.filter(item => item.id !== action.payload),
                message: action.payload.message
            }
        case actionTypes.DELETE_ALERT_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case actionTypes.DELETE_ALERT_RESET:
            return {
                ...state,
                error: null,
                message: null
            }
        // LOAD driver
        case actionTypes.LOAD_ALERT_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.LOAD_ALERT_SUCCESS:
            return {
                ...state,
                loading: false,
                alert: action.payload.data,
            }
        case actionTypes.LOAD_ALERT_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.LOAD_ALERT_RESET:
            return {
                ...state,
                error: action.payload,
                alert: {}
            }
        // UPDATE 
        case actionTypes.UPDATE_ALERT_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.UPDATE_ALERT_SUCCESS:
            return {
                ...state,
                loading: false,
                alerts: state.alerts.map(item => item.id === action.payload.data.id ? action.payload.data : item),
                message: action.payload.message,
                status: action.payload.success
            }
        case actionTypes.UPDATE_ALERT_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case actionTypes.UPDATE_ALERT_RESET:
            return {
                ...state,
                error: null,
                message: null
            }
        default:
            return state;
    }   

}