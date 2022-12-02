import * as actionTypes from '../constants/actionTypes';

const defaultState = {
    users: [],
    userDetail: {},
    loading: false,
    errors:{}
  }
  
  export const userReducers = (state=defaultState, action={}) => {
    switch (action.type) {

        case actionTypes.GET_USERS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.GET_USERS_SUCCESS:
            return {
                ...state,
                loading: false,
                users: action.payload?.data?.users,
                count: action.payload?.data?.count,
                totalRecord: action.payload?.data?.totalRecord,
            }
        case actionTypes.GET_USERS_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.CLEAR_GET_USERS:
            return {
                ...state,
                error: null,
                message: null
            }
        // LOAD user
        case actionTypes.LOAD_USERS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.LOAD_USERS_SUCCESS:
            return {
                ...state,
                loading: false,
                userDetail: action.payload.data,
            }
        case actionTypes.LOAD_USERS_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.LOAD_USERS_RESET:
            return {
                ...state,
                error: null,
                userDetail: {}
            }
        // CREATE ACTION
        case actionTypes.CREATE_USER_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.CREATE_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                message: action.payload.message,
                errors: {},
                users: [...state.users, action.payload?.data?.portel_info],
            }
        case actionTypes.CREATE_USER_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case actionTypes.CLEAR_USER:
            return {
                ...state,
                error: null,
                message: null
            }
        // DEACTIVATE ACTION
        case actionTypes.DEACTIVATE_USER_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.DEACTIVATE_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                message: action.payload.message,
                errors: {},
                users: [...state.users, action.payload?.data],
            }
        case actionTypes.DEACTIVATE_USER_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case actionTypes.DEACTIVATE_USER_RESET:
            return {
                ...state,
                error: null,
                message: null
            }
        
        // DELETE ACTION
        case actionTypes.DELETE_USER_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.DELETE_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                users: state.users.filter(item => item.id !== action.payload),
                message: action.payload.message

            }
        case actionTypes.DELETE_USER_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload

            }
        case actionTypes.DELETE_USER_RESET:
            return {
                ...state,
                error: null,
                message: null
            }
        // UPDATE 
        case actionTypes.UPDATE_USER_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.UPDATE_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                users: state.users.map(item => item.id === action.payload.data.id ? action.payload.data : item),
                message: action.payload.message,
                status: action.payload.success
            }
        case actionTypes.UPDATE_USER_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case actionTypes.UPDATE_USER_RESET:
            return {
                ...state,
                error: null,
                message: null
            }
        // unassign ELD

        case actionTypes.GET_UNASSIGN_VEHICLE_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.GET_UNASSIGN_VEHICLE_SUCCESS:
            return {
                ...state,
                loading: false,
                message: action.payload.message,
                errors: {},
                users: [...state.users, action.payload?.data],
            }
        case actionTypes.GET_UNASSIGN_VEHICLE_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case actionTypes.GET_UNASSIGN_VEHICLE_RESET:
            return {
                ...state,
                error: null,
                message: null
            }
  
      default:
        return state;
    }
  }