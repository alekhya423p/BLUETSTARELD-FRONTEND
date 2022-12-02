import * as actionTypes from '../constants/actionTypes';

const defaultState = {
    driverHos: [],
    loading: false,
    errors: {}
}

export const driverHosReducers = (state = defaultState, action = {}) => {
    switch (action.type) {
        case actionTypes.GET_DRIVER_HOS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.GET_DRIVER_HOS_SUCCESS:
            return {
                ...state,
                loading: false,
                driverHos: action.payload?.data?.driverhos,
                count: action.payload?.data?.count,
                totalRecord: action.payload?.data?.totalRecord,
            }
        case actionTypes.GET_DRIVER_HOS_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.CLEAR_DRIVER_HOS:
            return {
                ...state,
                error: null,
                message: null
            }
        default:
            return state;
    }
}