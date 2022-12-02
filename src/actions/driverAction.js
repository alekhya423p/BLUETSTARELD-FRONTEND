import * as actionTypes from '../constants/actionTypes';
import * as api from '../api';
import { toast } from "react-toastify";

/**
* function for get user
* @param {*} data User id 
* @description get user by id
* @param {function} getUser getUser function
*/
export const getDriver = (currentPage = '' , searchKey = '', searchStatus = '') => async dispatch => {
    try {
        dispatch({ type: actionTypes.GET_DRIVER_REQUEST })
        const { data } = await api.getAllDriver(currentPage, searchKey, searchStatus)
        dispatch({ type: actionTypes.GET_DRIVER_SUCCESS, payload: data })

    } catch (err) {
        // console.log(err)
        dispatch({ type: actionTypes.GET_DRIVER_FAIL, payload: err.response.data.message })
    }
}

/**
* function for loadDriver
* @param {*} data User data 
* @description get user infromation
* @param {function} loadDriver loadDriver function
*/
export const loadDriver = id => async dispatch => {
    try {
        dispatch({ type: actionTypes.LOAD_DRIVER_REQUEST })
        const { data } = await api.editDriver(id);
        dispatch({ type: actionTypes.LOAD_DRIVER_SUCCESS, payload: data })

    } catch (err) {
        // console.log(err)
        dispatch({ type: actionTypes.LOAD_DRIVER_FAIL, payload: err.response.data })
    }
}

/**
* function for user saveDriver
* @param {*} data form data and navigate
* @description user saveDriver
* @param {function} saveDriver saveDriver function
*/
export const saveDriver = (formData, navigate) => async dispatch => {
    try {
        dispatch({ type: actionTypes.CREATE_DRIVER_REQUEST })
        const { data } = await api.storeDriver(formData);
        toast.success(data.message);
        dispatch({ type: actionTypes.CREATE_DRIVER_SUCCESS, payload: data })
        navigate('/settings/drivers')

    } catch (err) {
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.CREATE_DRIVER_FAIL, payload: err.response.data.message })
    }
}
/**
* function for user DriverUpdate
* @param {*} data User data 
* @description update user infromation
* @param {function} DriverUpdate DriverUpdate function
*/
export const driverUpdate = (userData, navigate) => async (dispatch, getState) => {
    try {
        dispatch({ type: actionTypes.UPDATE_DRIVER_REQUEST })
        const { data } = await api.updateDriver(userData)
        dispatch({ type: actionTypes.UPDATE_DRIVER_SUCCESS, payload: data })
        dispatch({ type: actionTypes.UPDATE_DRIVER_RESET })
        toast.success(data.message);
        navigate('/settings/drivers')
    } catch (err) {
        // console.log(err.response.data.message)
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.UPDATE_DRIVER_FAIL, payload: err.response.data.message })
    }
}

/**
* function for get user
* @param {*} data User id 
* @description get user by id
* @param {function} deactivateuser deactivate function
*/
export const deactivateDriver = (userData, navigate) => async (dispatch, getState) => {
    try {
        dispatch({ type: actionTypes.UPDATE_DRIVER_REQUEST })
        const { data } = await api.deactivateDriver(userData)
        dispatch({ type: actionTypes.UPDATE_DRIVER_SUCCESS, payload: data })
        dispatch({ type: actionTypes.UPDATE_DRIVER_RESET })
        toast.success(data.message);
        navigate('/settings/drivers')
    } catch(err) {
        // console.log(err)
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.UPDATE_DRIVER_FAIL, payload: err.response.data.message })
    }    
}

export const destroyDriver = (userId) => async dispatch => {
    try {
        dispatch({ type: actionTypes.GET_DRIVER_REQUEST })
        const { data } = await api.deleteDriver(userId)
        dispatch({ type: actionTypes.GET_DRIVER_SUCCESS, payload: userId })
        toast.success(data.message);
    } catch (err) {
        // console.log(err)
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.GET_DRIVER_FAIL, payload: err.response.data.message })
    }
}

export const getHOSRules = () => async dispatch => {
    try {
        dispatch({ type: actionTypes.GET_HOS_RULES_REQUEST })
        const { data } = await api.getHOSRulesAPI()
        dispatch({ type: actionTypes.GET_HOS_RULES_SUCCESS, payload: data })
    } catch (err) {
        // console.log(err)
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.GET_HOS_RULES_FAIL, payload: err.response.data.message })
    }
}

export const getDriverMaster = () => async dispatch => {
    try {
        dispatch({ type: actionTypes.GET_DRIVER_MASTER_REQUEST })
        const { data } = await api.getDriverMasterList()
        dispatch({ type: actionTypes.GET_DRIVER_MASTER_SUCCESS, payload: data })
    } catch (err) {
        // console.log(err)
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.GET_DRIVER_MASTER_FAIL, payload: err.response.data.message })
    }
}