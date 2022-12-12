import * as actionTypes from '../constants/actionTypes';

const defaultState = {
    locationUrl:"",
    loading: false,
    locationToken:"",
    locationData:{},
    errors: {}
}

export const locationsharingReducers = (state = defaultState, action = {}) => {
    switch (action.type) {
        case actionTypes.GET_CREATELOCATION_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.GET_CREATELOCATION_SUCCESS:
            return {
                ...state,
                loading: false,
                locationUrl: action.payload?.data?.link_url,
                locationToken:action.payload?.data?.tokenId,
                locationData:action.payload?.data
            }
        case actionTypes.GET_CREATELOCATION_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.CLEAR_GET_CREATELOCATION:
            return {
                ...state,
                error: null,
                message: null
            }
            case actionTypes.GET_DEACTIVATE_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.GET_DEACTIVATE_SUCCESS:
            return {
                ...state,
                loading: false,
                locationUrl: action.payload?.data?.link_url,
            }
        case actionTypes.GET_DEACTIVATE_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.CLEAR_GET_DEACTIVATE:
            return {
                ...state,
                error: null,
                message: null
            }
            case actionTypes.GET_LOCATIONDATA_REQUEST:
                return {
                    ...state,
                    loading: true
                }
            case actionTypes.GET_LOCATIONDATA_SUCCESS:
                return {
                    ...state,
                    loading: false,
                   locationData:action.payload?.data
                }
            case actionTypes.GET_LOCATIONDATA_FAIL:
                return {
                    ...state,
                    error: action.payload
                }
            case actionTypes.CLEAR_GET_LOCATIONDATA:
                return {
                    ...state,
                    error: null,
                    message: null
                }
        default:
            return state;
    }
}