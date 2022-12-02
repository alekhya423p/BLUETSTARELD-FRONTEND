import * as actionTypes from '../constants/actionTypes';

const defaultState = {
    assets: [],
    assetsDetail: {},
    loading: false,
    errors: {}
}

export const assetReducers = (state = defaultState, action = {}) => {
    switch (action.type) {
        case actionTypes.GET_ASSETS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.GET_ASSETS_SUCCESS:
            return {
                ...state,
                loading: false,
                assets: action.payload?.data?.assets,
                count: action.payload?.data?.count,
                totalRecord: action.payload?.data?.totalRecord,
            }
        case actionTypes.GET_ASSETS_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.CLEAR_ASSETS:
            return {
                ...state,
                error: null,
                message: null
            }
        // asset detail listing
        case actionTypes.GET_ASSETS_DETAIL_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.GET_ASSETS_DETAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                assetsDetail: action.payload?.data,
                count: action.payload?.data?.count,
                totalRecord: action.payload?.data?.totalRecord,
            }
        case actionTypes.GET_ASSETS_DETAIL_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case actionTypes.CLEAR_ASSETS_DETAIL:
            return {
                ...state,
                error: null,
                message: null
            }
        default:
            return state;
    }
}