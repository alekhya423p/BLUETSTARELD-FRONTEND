import *  as actionTypes from '../constants/actionTypes'
import * as api from '../api';
import { toast } from "react-toastify";


/**
 * function for get asset listing
 * @param {*} data asset id 
 * @description get asset by id 
 * @param { function } createShareLocation getAsset function
*/

export const createShareLocation = (currentPage, searchKey = '') => async dispatch => {
    try{
        dispatch({ type: actionTypes.GET_CREATELOCATION_REQUEST })
        const { data } = await api.createShareLocation(currentPage, searchKey)
        dispatch({ type: actionTypes.GET_CREATELOCATION_SUCCESS, payload: data })
    }catch (err){
        // console.log(err)
        dispatch({ type: actionTypes.GET_CREATELOCATION_FAIL, payload: err.response.data.message })
    }
}



/**
 * function for get asset listing
 * @param {*} data asset id 
 * @description get asset by id 
 * @param { function } expireLocationUrl getAsset function
*/

export const expireLocationUrl = (driverId,tokenId) => async dispatch => {
    try{
        dispatch({ type: actionTypes.GET_DEACTIVATE_REQUEST })
        const { data } = await api.expireLocationUrl(driverId, tokenId)
        dispatch({ type: actionTypes.GET_DEACTIVATE_SUCCESS, payload: data })
        toast.success(data.message);
    }catch (err){
         console.log(err)
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.GET_DEACTIVATE_FAIL, payload: err.response.data.message })
    }
}

/**
 * function for get asset listing
 * @param {*} data asset id 
 * @description get asset by id 
 * @param { function } getShareLocation getAsset function
*/

export const getShareLocation = (tokenId) => async dispatch => {
    try {
        dispatch({ type: actionTypes.GET_LOCATIONDATA_REQUEST })
        const  { data }  = await api.getShareLocation(tokenId);
        dispatch({ type: actionTypes.GET_LOCATIONDATA_SUCCESS, payload: data })

    } catch (err) {
        
        dispatch({ type: actionTypes.GET_LOCATIONDATA_FAIL, payload: err.response.data })
    }
}