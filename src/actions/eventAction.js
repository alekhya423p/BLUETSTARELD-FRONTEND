import *  as actionTypes from '../constants/actionTypes'
import * as api from '../api';
import { toast } from "react-toastify";

/**
 * function for get events
 * @param {*} data event id 
 * @description get event  by id 
 * @param { function } getEvent getEvent function
*/

// export const getEvents = () => async dispatch => {
//     try{
//         dispatch({ type: actionTypes.GET_EVENTS_REQUEST })
//         const { data } = await api.getAllEvents()
//         dispatch({ type: actionTypes.GET_EVENTS_SUCCESS, payload: data })
//     }catch (err){
//         console.log(err)
//         dispatch({ type: actionTypes.GET_EVENTS_FAIL, payload: err.response.data.message })
//     }
// }


/**
 * function for get events
 * @param {*} assign driver id 
 * @description assign driver  by id 
 * @param { function } assignDriver assignDriver function
*/
export const assignDriver = (formData) => async dispatch => {
    try {
        dispatch({ type: actionTypes.ASSIGN_DRIVER_REQUEST })
        const { data } = await api.assignDriver(formData);
        toast.success(data.message);
        dispatch({ type: actionTypes.ASSIGN_DRIVER_SUCCESS, payload: data })

    } catch (err) {
        // console.log('error is: ', err?.response?.data)
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.ASSIGN_DRIVER_FAIL, payload: err.response.data.message })
    }
}

/**
 * function for get events
 * @param {*} bulk remove 
 * @description bulk remove 
 * @param { function } bulk remove function
*/

export const removeBulkEvent = (formData) => async dispatch => {
    try{
        dispatch({ type: actionTypes.REMOVE_BULK_EVENT_REQUEST })
        const { data } = await api.removeBulk(formData);
        toast.success(data.message);
        dispatch({ type: actionTypes.REMOVE_BULK_EVENT_SUCCESS, payload: data })

    } catch(err){
        // console.log('err is: ', err?.response?.data)
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.REMOVE_BULK_EVENT_FAIL , payload: err.response.data.message })
    }
}

/**
* function for loadLog
* @param {*} data Log data 
* @description get log information
* @param {function} loadLog loadLog function
*/
export const loadVehicles = (currentPage = '', searchKey = '') => async dispatch => {
    try {
        dispatch({ type: actionTypes.GET_VEHICLE_REQUEST })
        const { data } = await api.getEventVehicle(currentPage,searchKey);
        dispatch({ type: actionTypes.GET_VEHICLE_SUCCESS, payload: data })
    } catch (err) {
        // console.log(err)
        dispatch({ type: actionTypes.GET_VEHICLE_FAIL, payload: err.response.data })
    }
}

/**
* function for DriverLog
* @param {*} data DriverLog data 
* @description get log information
* @param {function} loadLog loadLog function
*/
export const getVehicleEvents = id => async dispatch => {
    try {
        dispatch({ type: actionTypes.LOAD_GRAPH_LOG_REQUEST })
        const { data } = await api.getDriverLog(id);
        dispatch({ type: actionTypes.LOAD_GRAPH_LOG_SUCCESS, payload: data })
    } catch (err) {
        // console.log(err)
        dispatch({ type: actionTypes.LOAD_GRAPH_LOG_FAIL, payload: err.response.data })
    }
}