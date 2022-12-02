
import * as actionTypes from '../constants/actionTypes';

const defaultState = {
    logs: [],
    vehicleLogs: [],
    vehicleEvents: [],
    logDetails: {},
    vehicleInfo: {},
    isComplete: false,
    driverData: [],
    coDriverData: [],
    pdfLogs: {},
    loading: false,
    dayLightSavings: false,
    event: {},
    events: [],
    eventCodes: [],
    errors: {},
    filterDates: {},
}

export const logReducers = (state = defaultState, action = {}) => {
    switch (action.type) {

        case actionTypes.GET_LOGS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.GET_LOGS_SUCCESS:
            return {
                ...state,
                loading: false,
                logs: action.payload?.data?.drivers,
                count: action.payload?.data?.count,
                totalRecord: action.payload?.data?.totalRecord,
            }
        case actionTypes.GET_LOGS_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.CLEAR_GET_LOGS:
            return {
                ...state,
                error: null,
                message: null
            }
        // LOAD log
        case actionTypes.LOAD_LOGS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.LOAD_LOGS_SUCCESS:
            return {
                ...state,
                loading: false,
                logDetails: action.payload?.data?.logs,
                count: action.payload?.data?.count,
                totalRecord: action.payload?.data?.totalRecord,
            }
        case actionTypes.LOAD_LOGS_FAIL:
            return {
                ...state,
                error: action.payload.logs
            }
        case actionTypes.LOAD_LOGS_RESET:
            return {
                ...state,
                error: action.payload,
                logDetails: {}
            }

        // LOAD Driver Graph log
        case actionTypes.LOAD_GRAPH_LOG_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.LOAD_GRAPH_LOG_SUCCESS:
            return {
                ...state,
                loading: false,
                driverData: action.payload.data,
                dayLightSavings: action.payload?.data?.dayLightSavingsTime
                // events: action.payload?.data.events,
            }
        case actionTypes.LOAD_GRAPH_LOG_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.LOAD_GRAPH_LOG_RESET:
            return {
                ...state,
                error: action.payload,
                driverData: []
            }
        // LOAD Driver Graph log
        case actionTypes.LOAD_CO_DRIVER_GRAPH_LOG_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.LOAD_CO_DRIVER_GRAPH_LOG_SUCCESS:
            return {
                ...state,
                loading: false,
                coDriverData: action.payload.data
            }
        case actionTypes.LOAD_CO_DRIVER_GRAPH_LOG_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.LOAD_CO_DRIVER_GRAPH_LOG_RESET:
            return {
                ...state,
                error: action.payload,
                coDriverData: []
            }
        // Event code
        case actionTypes.LOAD_EVENT_CODE_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.LOAD_EVENT_CODE_SUCCESS:
            return {
                ...state,
                loading: false,
                eventCodes: action?.payload?.data?.eventCodes
            }
        case actionTypes.LOAD_EVENT_CODE_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.LOAD_EVENT_CODE_RESET:
            return {
                ...state,
                error: action.payload,
                eventCodes: []
            }
        // CREATE ADD EVENT log
        case actionTypes.CREATE_ADD_EVENT_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.CREATE_ADD_EVENT_SUCCESS:
            return {
                ...state,
                loading: false,
                driverData: [...state.driverData.logs, action.payload?.data?.log_info],
                message: action.payload.message,
                errors: {},
            }
        case actionTypes.CREATE_ADD_EVENT_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case actionTypes.CLEAR_EVENT:
            return {
                ...state,
                error: null,
                message: null
            }
        // Update EVENT log
        case actionTypes.UPDATE_EVENT_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.UPDATE_EVENT_SUCCESS:
           
            return {
                ...state,
                loading: false,
                driverData: [...state.driverData.logs, action.payload?.data?.newRow],
                // events: state.events.map(item => item.id === action.payload?.data?.log_info?.id ? action.payload.data.log_info : item),
                message: action.payload.message,
                errors: {},
            }
        case actionTypes.UPDATE_EVENT_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        // LOAD Vehicle log
        case actionTypes.LOAD_VEHICLE_LOG_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.LOAD_VEHICLE_LOG_SUCCESS:
            return {
                ...state,
                loading: false,
                vehicleLogs: action.payload?.data.logsList,
                count: action.payload?.data?.count,
                totalRecord: action.payload?.data?.totalRecord,
                vehicleInfo: action.payload?.data.info,
            }
        case actionTypes.LOAD_VEHICLE_LOG_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.CLEAR_VEHICLE_LOG:
            return {
                ...state,
                error: null,
                message: null
            }
         //load eld events

         case actionTypes.LOAD_ELD_DEVICES_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.LOAD_ELD_EVENTS_SUCCESS:
            return {
                ...state,
                loading: false,
                vehicleEvents: action.payload?.data?.vehicles,
                count: action.payload?.data?.count,
                totalRecord: action.payload?.data?.totalRecord,
                totalPages: action.payload?.data?.totalPages
            }
        case actionTypes.LOAD_ELD_EVENTS_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.CLEAR_ELD_EVENTS:
            return {
                ...state,
                error: null,
                message: null
            }
        //transport data 
        case actionTypes.TRANSPORT_DATA_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.TRANSPORT_DATA_SUCCESS:
            return {
                ...state,
                loading: false,
                driverData: action.payload.data,
                message: action.payload.message,
                errors: {},
            }
        case actionTypes.TRANSPORT_DATA_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case actionTypes.TRANSPORT_DATA_RESET:
            return {
                ...state,
                error: null,
                message: null
            }
        case actionTypes.SET_LOG_FILTER_DATE:
            return {
                ...state,
                filterDates: action.payload
            }
        //bulk update event
        case actionTypes.BULK_EVENT_UPDATE_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.BULK_EVENT_UPDATE_SUCCESS:
            return {
                ...state,
                loading: false,
                isComplete: action.payload.success,
                message: action.payload.message,
                errors: {},
            }
        case actionTypes.BULK_EVENT_UPDATE_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case actionTypes.BULK_EVENT_UPDATE_RESET:
            return {
                ...state,
                loading: false,
                isComplete: false,
                error: action.payload
            }
        
        // get pdf logs

        case actionTypes.GET_PDF_LOGS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.GET_PDF_LOGS_SUCCESS:
            return {
                ...state,
                loading: false,
                pdfLogs: action.payload.data,
                message: action.payload.message,
                errors: {},
            }
        case actionTypes.GET_PDF_LOGS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case actionTypes.GET_PDF_LOGS_RESET:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        // get pdf range download

        case actionTypes.DOWNLOAD_PDF_LOGS_RANGE_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.DOWNLOAD_PDF_LOGS_RANGE_SUCCESS:
            return {
                ...state,
                loading: false,
                pdfLogs: action.payload.data,
                message: action.payload.message,
                errors: {},
            }
        case actionTypes.DOWNLOAD_PDF_LOGS_RANGE_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case actionTypes.DOWNLOAD_PDF_LOGS_RANGE_RESET:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        default:
            return state;
    }
}