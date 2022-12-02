import * as actionTypes from '../constants/userActionTypes';

const defaultState = {
    isMinimize: '',
    loading: false,
    isOpenMobileMenu: '',
    isMode: 'nModeOff',
    dashboardStatus: [],
    vehicleStatus: [],
    drivers: [],
    vehicles: [],
    errors: {}
}

export const dashboardReducers = (state = defaultState, action = {}) => {
    switch (action.type) {
        case actionTypes.SET_MINIMIZE_REQUEST:
            return {
                ...state,
                loading: false,
                isMinimize: action.payload,
            }
        case actionTypes.SET_OPEN_MOBILE_REQUEST:
            return {
                ...state,
                loading: false,
                isOpenMobileMenu: action.payload,
            }
        case actionTypes.SET_COLOR_THEME_REQUEST:
            return {
                ...state,
                loading: false,
                isMode: action.payload,
            }
        case actionTypes.GET_DASHBOARD_COUNT_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.GET_DASHBOARD_COUNT_SUCCESS:
            return {
                ...state,
                loading: false,
                dashboardStatus: action.payload?.data?.drivers,
                vehicleStatus: action.payload?.data?.vehicles
            }
        case actionTypes.GET_DASHBOARD_COUNT_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.GET_DASHBOARD_COUNT_RESET:
            return {
                ...state,
                error: null,
                message: null
            }
        case actionTypes.GET_VEHICLE_AND_DRIVER_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.GET_VEHICLE_AND_DRIVER_SUCCESS:
            return {
                ...state,
                loading: false,
                drivers: action.payload?.data?.drivers,
                vehicles: action.payload?.data?.vehicles
            }
        case actionTypes.GET_VEHICLE_AND_DRIVER_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.GET_VEHICLE_AND_DRIVER_RESET:
            return {
                ...state,
                error: null,
                message: null
            }
        default:
            return state;
    }
}