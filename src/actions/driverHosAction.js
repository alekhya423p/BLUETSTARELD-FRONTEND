import *  as actionTypes from '../constants/actionTypes'
import * as api from '../api';

/**
 * function for get driver hos listing
 * @param {*} data driverHos id 
 * @description get driverHos by id 
 * @param { function } getLog getdriverHos function
*/

export const getAllDriverHos = (currentPage= '', searchKey = '', eldStatus = '', dutyStatus = '', violationStatus = '') => async dispatch => {
    try{
        dispatch({ type: actionTypes.GET_DRIVER_HOS_REQUEST })
        const { data } = await api.getAllDriverHos(currentPage, searchKey, eldStatus, dutyStatus, violationStatus)
        dispatch({ type: actionTypes.GET_DRIVER_HOS_SUCCESS, payload: data })
    }catch (err){
        // console.log(err)
        dispatch({ type: actionTypes.GET_DRIVER_HOS_FAIL, payload: err.response.data.message })
    }
}