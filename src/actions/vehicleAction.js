import * as actionTypes from '../constants/actionTypes';
import * as api from '../api';
import { toast } from "react-toastify";

/**
* function for get user
* @param {*} data User id 
* @description get user by id
* @param {function} getUser getUser function
*/
export const getVehicles = (currentPage = '', searchKey = '', searchStatus = '') => async dispatch => {
    try {
        dispatch({ type: actionTypes.GET_VEHICLE_REQUEST })
        const { data } = await api.getAllVehicle(currentPage, searchKey, searchStatus)
        dispatch({ type: actionTypes.GET_VEHICLE_SUCCESS, payload: data })

    } catch (err) {
        
        dispatch({ type: actionTypes.GET_VEHICLE_FAIL, payload: err.response.data.message })
    }
}

/**
 * 
 * @param {*} data location share
 * @param {*} navigate 
 * @description getshare location information 
 */

export const getVehicleLocation = (vehicleId = '', searchDate = '') => async dispatch => {
    try {
        dispatch({ type: actionTypes.GET_VEHICLE_LOCATION_REQUEST })
        const { data } = await api.getVehicleLocation(vehicleId, searchDate)
        dispatch({ type: actionTypes.GET_VEHICLE_LOCATION_SUCCESS, payload: data })
    } catch(err){
        dispatch({ type: actionTypes.GET_VEHICLE_LOCATION_FAIL, payload: err.response.data.message })
    }
 }

/**
* function for user saveVehicle
* @param {*} data form data and navigate
* @description user saveVehicle
* @param {function} saveVehicle saveVehicle function
*/
export const saveVehicle = (formData, navigate) => async dispatch => {
    try {
        dispatch({ type: actionTypes.CREATE_VEHICLE_REQUEST })
        const { data } = await api.storeVehicle(formData);
        toast.success(data.message);
        // dispatch({ type: actionTypes.CREATE_VEHICLE_SUCCESS, payload: data })
        navigate('/settings/vehicles')

    } catch (err) {
      
        toast.error(err.response?.data?.message);
        dispatch({ type: actionTypes.CREATE_VEHICLE_FAIL, payload: err.response.data.message })
    }
}

/**
* function for loadDriver
* @param {*} data User data 
* @description get user infromation
* @param {function} loadDriver loadDriver function
*/
export const loadVehicle = id => async dispatch => {
    try {
        dispatch({ type: actionTypes.LOAD_VEHICLE_REQUEST })
        const { data } = await api.editVehicle(id);
        dispatch({ type: actionTypes.LOAD_VEHICLE_SUCCESS, payload: data })

    } catch (err) {
        
        dispatch({ type: actionTypes.LOAD_VEHICLE_FAIL, payload: err.response.data })
    }
}

/**
* function for user vehicleUpdate
* @param {*} data User data 
* @description update user infromation
* @param {function} vehicleUpdate vehicleUpdate function
*/
export const vehicleUpdate = (userData, navigate) => async (dispatch, getState) => {
    try {
        dispatch({ type: actionTypes.UPDATE_VEHICLE_REQUEST })
        const { data } = await api.updateVehicle(userData)
        dispatch({ type: actionTypes.UPDATE_VEHICLE_SUCCESS, payload: data })
        dispatch({ type: actionTypes.UPDATE_VEHICLE_RESET })
        toast.success(data.message);
        navigate('/settings/vehicles')
    } catch (err) {
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.UPDATE_VEHICLE_FAIL, payload: err.response.data.message })
    }
}

export const deactivateVehicle = (userData, navigate) => async (dispatch, getState) => {
    try {
        dispatch({ type: actionTypes.DEACTIVATE_VEHICLE_REQUEST })
        const { data } = await api.deactivateVehicle(userData)
        dispatch({ type: actionTypes.DEACTIVATE_VEHICLE_SUCCESS, payload: data })
        dispatch({ type: actionTypes.DEACTIVATE_VEHICLE_RESET })
        toast.success(data.message);
        navigate('/settings/vehicles')
    } catch(err) {
       
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.DEACTIVATE_VEHICLE_FAIL, payload: err.response.data.message })
    }
}

export const destroyVehicle = (userId) => async dispatch => {
    try {
        dispatch({ type: actionTypes.DELETE_VEHICLE_REQUEST })
        const { data } = await api.deleteVehicle(userId)
        dispatch({ type: actionTypes.DELETE_VEHICLE_SUCCESS, payload: userId })
        toast.success(data.message);
    } catch (err) {
        
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.DELETE_VEHICLE_FAIL, payload: err.response.data.message })
    }
}

export const getVehicleMaster = () => async dispatch => {
    try {
        dispatch({ type: actionTypes.GET_VEHICLE_MASTER_REQUEST })
        const { data } = await api.getVehicleMasterList()
        dispatch({ type: actionTypes.GET_VEHICLE_MASTER_SUCCESS, payload: data })
    } catch (err) {
        
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.GET_VEHICLE_MASTER_FAIL, payload: err.response.data.message })
    }
}

export const unAssignEld = ( userData, navigate ) => async (dispatch) => {
    try{
        dispatch({ type: actionTypes.GET_UNASSIGN_VEHICLE_REQUEST })
        const { data } = await api.unAssignEld(userData)
        dispatch({ type: actionTypes.GET_UNASSIGN_VEHICLE_SUCCESS, payload: data })
        toast.success(data.message);
        navigate('/settings/vehicles')
    } catch(err) {
        
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.GET_UNASSIGN_VEHICLE_FAIL, payload: err.response.data.message })
    }
}

export const getActiveVehiclesList = () => async (dispatch) => {
    try{
        dispatch({ type: actionTypes.GET_ACTIVE_VEHICLE_REQUEST })
        const { data } = await api.activeVehicleList()
        dispatch({ type: actionTypes.GET_ACTIVE_VEHICLE_SUCCESS, payload: data })
    } catch(err) {
       
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.GET_ACTIVE_VEHICLE_FAIL, payload: err.response.data.message })
    }
}

