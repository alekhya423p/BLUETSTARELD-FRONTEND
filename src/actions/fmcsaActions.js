import * as actionTypes from '../constants/actionTypes';
import * as api from '../api';

/**
* function for get
* @param {*} data User data 
* @description get user infromation
* @param {function} get get function
*/
export const getFmcsaLogs = () => async dispatch => {
    try {
        dispatch({ type: actionTypes.GET_FMCSA_LOGS_REQUEST })
        const  { data }  = await api.loadFmcsaLogs();
        dispatch({ type: actionTypes.GET_FMCSA_LOGS_SUCCESS, payload: data })

    } catch (err) {
        // console.log(err)
        dispatch({ type: actionTypes.GET_FMCSA_LOGS_FAIL, payload: err.response.data })
    }
}

export const store = () => async dispatch =>{
    try {
        dispatch({ type: actionTypes.CREATE_FMCSA_LOGS__REQUEST })
        const { data } = await api.storeFmcsaLogs()
        dispatch({ type: actionTypes.CREATE_FMCSA_LOGS_SUCCESS, payload: data })  
    } catch (err) {
        // console.log(err)
        dispatch({ type: actionTypes.CREATE_FMCSA_LOGS_FAIL, payload: err.response.data.message })
    }
}
export const edit = () => async dispatch =>{
    try {
        dispatch({ type: actionTypes.LOAD_FMCSA_LOGS_REQUEST })
        const { data } = await api.loadFmcsaLogs()
        dispatch({ type: actionTypes.LOAD_FMCSA_LOGS_SUCCESS, payload: data })  
    } catch (err) {
        // console.log(err)
        dispatch({ type: actionTypes.LOAD_FMCSA_LOGS_FAIL, payload: err.response.data.message })
    }
}

export const update = () => async dispatch =>{
    try {
        dispatch({ type: actionTypes.UPDATE_FMCSA_LOGS_REQUEST })
        const { data } = await api.updateFmcsaLogs()
        dispatch({ type: actionTypes.UPDATE_FMCSA_LOGS_SUCCESS, payload: data })  
    } catch (err) {
        // console.log(err)
        dispatch({ type: actionTypes.UPDATE_FMCSA_LOGS_FAIL, payload: err.response.data.message })
    }
}