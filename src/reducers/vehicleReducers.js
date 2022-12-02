import * as actionTypes from '../constants/actionTypes';

const defaultState = {
    vehicles: [],
    masterVehicles:[],
    activeVehicles: 0,
    vehicle: {},
    loading: false,
    errors:{}
  }
  
  export const vehicleReducers = (state=defaultState, action={}) => {
    switch (action.type) {

        case actionTypes.GET_VEHICLE_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.GET_VEHICLE_SUCCESS:
            return {
                ...state,
                loading: false,
                vehicles: action.payload?.data?.vehicles,
                count: action.payload?.data?.count,
                totalRecord: action.payload?.data?.totalRecord,
                totalPages: action.payload?.data?.totalPages
            }
        case actionTypes.GET_VEHICLE_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.CLEAR_GET_VEHICLES:
            return {
                ...state,
                error: null,
                message: null
            }
        // GET vehicle location 

        case actionTypes.GET_VEHICLE_LOCATION_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.GET_VEHICLE_LOCATION_SUCCESS:
            return {
                ...state,
                loading: false,
                locationHistory: action.payload?.data?.locationHistory,
            }
        case actionTypes.GET_VEHICLE_LOCATION_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.CLEAR_GET_VEHICLE_LOCATION:
            return {
                ...state,
                error: null,
                message: null
            }
        // CREATE ACTION
        case actionTypes.CREATE_VEHICLE_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.CREATE_VEHICLE_SUCCESS:
            return {
                loading: false,
                message: action.payload.message,
                errors: {},
                vehicles: [...state.vehicles, action.payload.data],
            }
        case actionTypes.CREATE_VEHICLE_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case actionTypes.CLEAR_VEHICLE:
            return {
                ...state,
                error: null,
                message: null
            }
        // // DELETE ACTION
        case actionTypes.DELETE_VEHICLE_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.DELETE_VEHICLE_SUCCESS:
            return {
                ...state,
                loading: false,
                vehicles: state.vehicles.filter(item => item.id !== action.payload),
                message: action.payload.message

            }
        case actionTypes.DELETE_VEHICLE_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload

            }
        case actionTypes.DELETE_VEHICLE_RESET:
            return {
                ...state,
                error: null,
                message: null
            }
        //Deactivate Vehicle
        case actionTypes.DEACTIVATE_VEHICLE_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.DEACTIVATE_VEHICLE_SUCCESS:
            return {
                ...state,
                loading: false,
                vehicles: state.vehicles.filter(item => item.id !== action.payload),
                message: action.payload.message

            }
        case actionTypes.DEACTIVATE_VEHICLE_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload

            }
        case actionTypes.DEACTIVATE_VEHICLE_RESET:
            return {
                ...state,
                error: null,
                message: null
            }
        // LOAD Vehicle
        case actionTypes.LOAD_VEHICLE_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.LOAD_VEHICLE_SUCCESS:
            return {
                ...state,
                loading: false,
                vehicle: action.payload.data,
            }
        case actionTypes.LOAD_VEHICLE_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.LOAD_VEHICLE_RESET:
            return {
                ...state,
                error: action.payload,
                vehicle: {}
            }
        // UPDATE 
        case actionTypes.UPDATE_VEHICLE_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.UPDATE_VEHICLE_SUCCESS:
            return {
                ...state,
                loading: false,
                vehicles: state.vehicles.map(item => item.id === action.payload?.data?.vehicle_info?.id ? action.payload?.data?.vehicle_info : item),
                message: action.payload.message,
                status: action.payload.success
            }
        case actionTypes.UPDATE_VEHICLE_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case actionTypes.UPDATE_VEHICLE_RESET:
            return {
                ...state,
                error: null,
                message: null
            }
        // get vehicle list 
        case actionTypes.GET_ACTIVE_VEHICLE_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.GET_ACTIVE_VEHICLE_SUCCESS:
            return {
                ...state,
                loading: false,
                activeVehicles: action.payload?.data?.vehicles,
            }
        case actionTypes.GET_ACTIVE_VEHICLE_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.CLEAR_GET_ACTIVE_VEHICLES:
            return {
                ...state,
                error: null,
                message: null
            }

        // GET HOS Rules
        case actionTypes.GET_VEHICLE_MASTER_REQUEST:
            return {
                ...state,
                loading: false
            }
        case actionTypes.GET_VEHICLE_MASTER_SUCCESS:
            return {
                ...state,
                loading: false,
                masterVehicles: action.payload?.data,
            }
        case actionTypes.GET_VEHICLE_MASTER_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.CLEAR_GET_VEHICLE_MASTER:
            return {
                ...state,
                error: null,
                message: null
            }
  
        default:
            return state;
    }
  }