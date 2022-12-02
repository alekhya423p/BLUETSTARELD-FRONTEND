import * as actionTypes from '../constants/actionTypes';

const defaultState = {
    users: [],
    user: {},
    loading: false,
    errors: {}
}

export const systemUserReducers = (state = defaultState, action = {}) => {
    switch (action.type) {

        case actionTypes.GET_SYSTEM_USERS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.GET_SYSTEM_USERS_SUCCESS:
            return {
                ...state,
                loading: false,
                users: action.payload?.data?.users,
                count: action.payload?.data?.count,
                totalRecord: action.payload?.data?.totalRecord,
            }
        case actionTypes.GET_SYSTEM_USERS_FAIL:
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
        case actionTypes.CREATE_SYSTEM_USER_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case actionTypes.CREATE_SYSTEM_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                users: [...state.users, action.payload.data],
                message: action.payload.message,
                errors: {},
            }
        case actionTypes.CREATE_SYSTEM_USER_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case actionTypes.CLEAR_SYSTEM_USER:
            return {
                ...state,
                error: null,
                message: null
            }
        // LOAD system users
        case actionTypes.LOAD_SYSTEM_USER_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.LOAD_SYSTEM_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.payload.data,
            }
        case actionTypes.LOAD_SYSTEM_USER_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.LOAD_SYSTEM_USER_RESET:
            return {
                ...state,
                error: action.payload,
                user: {}
            }
        // UPDATE 
        case actionTypes.UPDATE_SYSTEM_USER_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.UPDATE_SYSTEM_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                users: state.users.map(item => item._id === action.payload.data._id ? action.payload.data : item),
                message: action.payload.message,
                status: action.payload.success
            }
        case actionTypes.UPDATE_SYSTEM_USER_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case actionTypes.UPDATE_SYSTEM_USER_RESET:
            return {
                ...state,
                error: null,
                message: null
            }
        default:
            return state;
    }   

}