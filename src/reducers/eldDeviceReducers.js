import * as actionTypes from '../constants/actionTypes';

const defaultState = {
    elddevices: [],
    masterElds:[],
    device: {},
    elddevice: {},
    loading: false,
    errors:{}
  }
  
  export const eldDeviceReducers = (state=defaultState, action={}) => {
    switch (action.type) {

        case actionTypes.GET_ELD_DEVICES_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.GET_ELD_DEVICES_SUCCESS:
            return {
                ...state,
                loading: false,
                elddevices: action.payload?.data?.elds,
                count: action.payload?.data?.count,
                totalRecord: action.payload?.data?.totalRecord,
            }
        case actionTypes.GET_ELD_DEVICES_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.CLEAR_GET_ELD_DEVICESS:
            return {
                ...state,
                error: null,
                message: null
            }
        // CREATE ACTION
        case actionTypes.CREATE_ELD_DEVICES_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.CREATE_ELD_DEVICES_SUCCESS:
            return {
                loading: false,
                message: action.payload.message,
                errors: {},
                elddevices: [...state.elddevices, action.payload.data?.eld_info],
            }
        case actionTypes.CREATE_ELD_DEVICES_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case actionTypes.CLEAR_ELD_DEVICES:
            return {
                ...state,
                error: null,
                message: null
            }
        //Deactive action
        case actionTypes.DEACTIVATE_ELD_DEVICE_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.DEACTIVATE_ELD_DEVICE_SUCCESS:
            return {
                ...state,
                loading: false,
                elddevice: state.elddevices.filter(item => item.id !== action.payload),
                message: action.payload.message,
                
            }
        case actionTypes.DEACTIVATE_ELD_DEVICE_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case actionTypes.DEACTIVATE_ELD_DEVICE_RESET:
            return {
                ...state,
                error: null,
                message: null
            }
        
        // // DELETE ACTION
        case actionTypes.DELETE_ELD_DEVICES_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.DELETE_ELD_DEVICES_SUCCESS:
            return {
                ...state,
                loading: false,
                elddevices: state.elddevices.filter(item => item.id !== action.payload),
                message: action.payload.message

            }
        case actionTypes.DELETE_ELD_DEVICES_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload

            }
        case actionTypes.DELETE_ELD_DEVICES_RESET:
            return {
                ...state,
                error: null,
                message: null
            }
        // LOAD device
        case actionTypes.LOAD_ELD_DEVICES_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.LOAD_ELD_DEVICES_SUCCESS:
            return {
                ...state,
                loading: false,
                device: action.payload?.data?.detail,
            }
        case actionTypes.LOAD_ELD_DEVICES_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.UPDATE_ELD_DEVICES_RESET:
            return {
                ...state,
                error: null,
                device: {},
                message: null
            }
        // UPDATE 
        case actionTypes.UPDATE_ELD_DEVICES_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.UPDATE_ELD_DEVICES_SUCCESS:
            return {
                ...state,
                loading: false,
                elddevices: state.elddevices?.elds?.map(item => item.id === action.payload?.data?.eld_info?.id ? action.payload.data.eld_info : item),
                message: action.payload.message,
                status: action.payload.success
            }
        case actionTypes.UPDATE_ELD_DEVICES_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        // GET ELD Mater
        case actionTypes.GET_ELD_MASTER_REQUEST:
            return {
                ...state,
                loading: false
            }
        case actionTypes.GET_ELD_MASTER_SUCCESS:
            return {
                ...state,
                loading: false,
                masterElds: action.payload?.data,
            }
        case actionTypes.GET_ELD_MASTER_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.CLEAR_GET_ELD_MASTER:
            return {
                ...state,
                error: null,
                message: null
            }
  
        default:
            return state;
    }
  }