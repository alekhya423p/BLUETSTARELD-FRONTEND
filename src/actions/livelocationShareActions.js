import * as actionTypes from '../constants/actionTypes';
import * as api from '../api';
import { toast } from "react-toastify";

/**
* function for get driver and vehicle data
* @param {*} data driver and vehicle id 
* @description get driver and vehicle by id
* @param {function} getDriver getDriver function
*/
export const getDriverVehicle = () => async dispatch => {
    try {
        dispatch({ type: actionTypes.GET_DRIVER_VEHICLE_REQUEST })
        const { data } = await api.getDriverVehicle()
        dispatch({ type: actionTypes.GET_DRIVER_VEHICLE_SUCCESS, payload: data })

    } catch (err) {        
        dispatch({ type: actionTypes.GET_DRIVER_VEHICLE_FAIL, payload: err.response.data.message })
    }
}

/**
 * 
 * @param {*} data location share
 * @param {*} navigate 
 * @description getshare location information 
 */

export const getVehicleLocationShre = (vehicleId = '', searchDate = '') => async dispatch => {
    try {
        dispatch({ type: actionTypes.GET_VEHICLE_LOCATION_SHARE_REQUEST })
        const { data } = await api.getVehicleLocation(vehicleId, searchDate)
        dispatch({ type: actionTypes.GET_VEHICLE_LOCATION_SHARE_SUCCESS, payload: data })
    } catch(err){
        dispatch({ type: actionTypes.GET_VEHICLE_LOCATION_SHARE_FAIL, payload: err.response.data.message })
    }
 }

