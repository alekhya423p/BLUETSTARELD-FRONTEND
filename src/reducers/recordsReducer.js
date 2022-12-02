import * as actionTypes from '../constants/actionTypes';

const defaultState = {
    reports: [],
    reportDetails: [],
    vehicleDetails: [],
    fmcsaRecords: [],
    states: [],
    reportLinks:{},
    vehicleReportLinks: {},
    loading: false,
    errors: {}
}

export const recordsReducers = (state = defaultState, action = {}) => {
    switch (action.type) {

        case actionTypes.GET_IFTA_RECORDS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.GET_IFTA_RECORDS_SUCCESS:
            return {
                ...state,
                loading: false,
                reports: action.payload?.data?.reports,
                count: action.payload?.data?.count,
                totalRecord: action.payload?.data?.totalRecord,
            }
        case actionTypes.GET_IFTA_RECORDS_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.IFTA_RECORDS_RESET:
            return {
                ...state,
                error: null,
                message: null
            }

        // load ifta records vehicle wise

        case actionTypes.GET_IFTA_DETAILS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.GET_IFTA_DETAILS_SUCCESS:
            return {
                ...state,
                loading: false,
                reportDetails: action.payload?.data?.vehicles,
                reportLinks : action.payload?.data?.reportLinks,
                count: action.payload?.data?.count,
                totalMiles: action.payload?.data?.totalMiles,
            }
        case actionTypes.GET_IFTA_DETAILS_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.GET_IFTA_DETAILS_RESET:
            return {
                ...state,
                error: null,
                message: null
            }
        // load ifta records by vehicles

        case actionTypes.GET_IFTA_BY_VEHICLE_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.GET_IFTA_BY_VEHICLE_SUCCESS:
            return {
                ...state,
                loading: false,
                vehicleDetails: action.payload?.data?.list,
                vehicleReportLinks: action.payload?.data?.reportLinks,
                count: action.payload?.data?.count,
            }
        case actionTypes.GET_IFTA_BY_VEHICLE_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.GET_IFTA_BY_VEHICLE_RESET:
            return {
                ...state,
                error: null,
                message: null
            }
        
        // load fmcsa records 

        case actionTypes.GET_FMCSA_RECORDS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.GET_FMCSA_RECORDS_SUCCESS:
            return {
                ...state,
                loading: false,
                fmcsaRecords: action.payload?.data?.list,
                count: action.payload?.data?.count,
            }
        case actionTypes.GET_FMCSA_RECORDS_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.GET_FMCSA_RECORDS_RESET:
            return {
                ...state,
                error: null,
                message: null
            } 
            
        // load all states

        case actionTypes.GET_ALL_STATES_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.GET_ALL_STATES_SUCCESS:
            return {
                ...state,
                loading: false,
                states: action.payload?.data,
                count: action.payload?.data?.count,
            }
        case actionTypes.GET_ALL_STATES_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.GET_ALL_STATES_RESET:
            return {
                ...state,
                error: null,
                message: null
            } 

        default:
            return state;
    }
}