import * as actionTypes from '../constants/actionTypes';

const defaultState = {
    fmcsaLogs: [],
    fmcsaLog: {},
    loading: false,
    errors: {}
}

export const systemUserReducers = (state = defaultState, action = {}) => {
    switch (action.type) {

        case actionTypes.GET_FMCSA_LOGS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.GET_FMCSA_LOGS_SUCCESS:
            return {
                ...state,
                loading: false,
                fmcsaLogs: action.payload?.data?.users,
                count: action.payload?.data?.count,
                totalRecord: action.payload?.data?.totalRecord,
            }
        case actionTypes.GET_FMCSA_LOGS_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.CLEAR_GET_FMCSA_LOGS:
            return {
                ...state,
                error: null,
                message: null
            }

        // CREATE ACTION
        case actionTypes.CREATE_FMCSA_LOGS_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case actionTypes.CREATE_FMCSA_LOGS_SUCCESS:
            return {
                ...state,
                loading: false,
                fmcsaLog: [...state.users, action.payload.data.alert_info],
                // message: action.payload.message,
                // errors: {},
            }
        case actionTypes.CREATE_FMCSA_LOGS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case actionTypes.CLEAR_FMCSA_LOGS:
            return {
                ...state,
                error: null,
                message: null
            }
        // LOAD system users
        case actionTypes.LOAD_FMCSA_LOGS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.LOAD_FMCSA_LOGS_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.payload.data,
            }
        case actionTypes.LOAD_FMCSA_LOGS_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.LOAD_FMCSA_LOGS_RESET:
            return {
                ...state,
                error: action.payload,
                user: {}
            }
        // UPDATE 
        case actionTypes.UPDATE_FMCSA_LOGS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.UPDATE_FMCSA_LOGS_SUCCESS:
            return {
                ...state,
                loading: false,
                fmcsaLogs: state.users.map(item => item.id === action.payload.data.id ? action.payload.data : item),
                message: action.payload.message,
                status: action.payload.success
            }
        case actionTypes.UPDATE_FMCSA_LOGS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case actionTypes.UPDATE_FMCSA_LOGS_RESET:
            return {
                ...state,
                error: null,
                message: null
            }
        default:
            return state;
    }   

}