import * as actionTypes from '../constants/actionTypes';
import * as api from '../api';
// import { toast } from "react-toastify";

/**
* function for get alert
* @param {*} data alert id 
* @description get alert by id
* @param {function} getUser getAlert function
*/
export const getAllAlerts = (currentPage = '' , searchStatus = '') => async dispatch => {
    try {
        dispatch({ type: actionTypes.GET_ALERT_REQUEST })
        const { data } = await api.getAllAlerts(currentPage, searchStatus)
        dispatch({ type: actionTypes.GET_ALERT_SUCCESS, payload: data })

    } catch (err) {
        // console.log(err)
        dispatch({ type: actionTypes.GET_ALERT_FAIL, payload: err.response.data.message })
    }
}

/**
* function for getAlertby id
* @param {*} data alert data 
* @description get alert infromation
* @param {function} getAlert getAlert function
*/
// export const getAlert = id => async dispatch => {
//     try {
//         dispatch({ type: actionTypes.LOAD_ALERT_REQUEST })
//         const { data } = await api.editAlert(id);
//         dispatch({ type: actionTypes.LOAD_ALERT_SUCCESS, payload: data })

//     } catch (err) {
//         console.log(err)
//         dispatch({ type: actionTypes.LOAD_ALERT_FAIL, payload: err.response.data })
//     }
// }

/**
* function for user saveDriver
* @param {*} data form data and navigate
* @description user saveAlert
* @param {function} saveAlert saveAlert function
*/

export const saveAlert = (formData, navigate) => async dispatch => {
    try {
        dispatch({ type: actionTypes.CREATE_ALERT_REQUEST })
        const { data } = await api.storeAlert(formData);
        toast.success(data.message);
        dispatch({ type: actionTypes.CREATE_ALERT_SUCCESS, payload: data })
        navigate('/settings/alerts')

    } catch (err) {
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.CREATE_ALERT_FAIL, payload: err.response.data.message })
    }
}

/**
* function for user alertUpdate
* @param {*} data User data 
* @description update alert infromation
* @param {function} alertUpdate alertUpdate function
*/
// export const alertUpdate = (userData, navigate) => async (dispatch, getState) => {
//     try {
//         dispatch({ type: actionTypes.UPDATE_ALERT_REQUEST })
//         const { data } = await api.updateAlert(userData)
//         dispatch({ type: actionTypes.UPDATE_ALERT_SUCCESS, payload: data })
//         dispatch({ type: actionTypes.UPDATE_ALERT_RESET })
//         toast.success(data.message);
//         navigate('/settings/alerts')
//     } catch (err) {
//         console.log(err.response.data.message)
//         toast.error(err.response.data.message);
//         dispatch({ type: actionTypes.UPDATE_ALERT_FAIL, payload: err.response.data.message })
//     }
// }

// export const destroyAlert = (userId) => async dispatch => {
//     try {
//         dispatch({ type: actionTypes.DELETE_ALERT_REQUEST })
//         const { data } = await api.deleteAlert(userId)
//         dispatch({ type: actionTypes.DELETE_ALERT_SUCCESS, payload: userId })
//         toast.success(data.message);
//     } catch (err) {
//         console.log(err)
//         toast.error(err.response.data.message);
//         dispatch({ type: actionTypes.DELETE_ALERT_FAIL, payload: err.response.data.message })
//     }
// }


