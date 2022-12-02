import *  as actionTypes from '../constants/actionTypes'
import * as api from '../api';

/**
 * function for get asset listing
 * @param {*} data asset id 
 * @description get asset by id 
 * @param { function } getAsset getAsset function
*/

export const getAllAssets = (currentPage, searchKey = '') => async dispatch => {
    try{
        dispatch({ type: actionTypes.GET_ASSETS_REQUEST })
        const { data } = await api.getAllAssets(currentPage, searchKey)
        dispatch({ type: actionTypes.GET_ASSETS_SUCCESS, payload: data })
    }catch (err){
        // console.log(err)
        dispatch({ type: actionTypes.GET_ASSETS_FAIL, payload: err.response.data.message })
    }
}


/**
 * function for get asset detail
 * @param {*} data asset id
 * @description get asset by id
 * @param { function } getAsset getAsset function
*/

export const getAssetDetail = (vehicleId = '') => async dispatch => {
    try{
        dispatch({ type: actionTypes.GET_ASSETS_DETAIL_REQUEST })
        const { data } = await api.getAssetDetail(vehicleId)
        dispatch({ type: actionTypes.GET_ASSETS_DETAIL_SUCCESS, payload: data })
    }catch (err){
        // console.log(err)
        dispatch({ type: actionTypes.GET_ASSETS_DETAIL_FAIL, payload: err.response.data.message })
    }
}