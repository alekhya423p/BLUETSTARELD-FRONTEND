import * as actionTypes from '../constants/actionTypes';
import * as api from '../api';
import { toast } from "react-toastify";


/**
* function for get
* @param {*} data User data 
* @description get user infromation
* @param {function} get get function
*/
export const getSystemUsers = (currentPage= '', searchKey= '', searchStatus= '') => async dispatch => {
    try {
        dispatch({ type: actionTypes.GET_SYSTEM_USERS_REQUEST })
        const  { data }  = await api.loadSystemUsers(currentPage, searchKey, searchStatus);
        dispatch({ type: actionTypes.GET_SYSTEM_USERS_SUCCESS, payload: data })

    } catch (err) {
        
        dispatch({ type: actionTypes.GET_SYSTEM_USERS_FAIL, payload: err.response.data })
    }
}

/**
* function for loadUser
* @param {*} data User data 
* @description get user infromation
* @param {function} loadUser loadUser function
*/
export const loadUser = id => async dispatch => {
    try {
        dispatch({ type: actionTypes.LOAD_SYSTEM_USER_REQUEST })
        const { data } = await api.editSystemUser(id);
        dispatch({ type: actionTypes.LOAD_SYSTEM_USER_SUCCESS, payload: data })

    } catch (err) {
       
        dispatch({ type: actionTypes.LOAD_SYSTEM_USER_FAIL, payload: err.response.data })
    }
}

export const storeSystemUser = (formData, navigate) => async dispatch =>{
    try {
        dispatch({ type: actionTypes.CREATE_SYSTEM_USER_REQUEST })
        const { data } = await api.storeSystemUser(formData)
        
        dispatch({ type: actionTypes.CREATE_SYSTEM_USER_SUCCESS, payload: data }) 
        toast.success(data.message)
        navigate('/companies') 
    } catch (err) {
        
        toast.error(err.response?.data?.message);
        dispatch({ type: actionTypes.CREATE_SYSTEM_USER_FAIL, payload: err.response.data.message })
    }
}
export const edit = () => async dispatch =>{
    try {
        dispatch({ type: actionTypes.LOAD_SYSTEM_USER_REQUEST })
        const { data } = await api.loadSystemUser()
        dispatch({ type: actionTypes.LOAD_SYSTEM_USER_SUCCESS, payload: data })  
    } catch (err) {
       
        dispatch({ type: actionTypes.LOAD_SYSTEM_USER_FAIL, payload: err.response.data.message })
    }
}

export const updateSystemUser = (formData, navigate) => async dispatch =>{
    try {
        dispatch({ type: actionTypes.UPDATE_SYSTEM_USER_REQUEST })
        const { data } = await api.updateSystemUser(formData)
        dispatch({ type: actionTypes.UPDATE_SYSTEM_USER_SUCCESS, payload: data })
        toast.success(data.message)
        navigate('/companies') 
    } catch (err) {
       
        toast.error(err.response?.data?.message);
        dispatch({ type: actionTypes.UPDATE_SYSTEM_USER_FAIL, payload: err.response.data.message })
    }
}

export const deactivateUser = (id, navigate) => async (dispatch) => {
    try {
        dispatch({ type: actionTypes.UPDATE_SYSTEM_USER_REQUEST })
        const { data } = await api.deactivateUser(id)
        dispatch({ type: actionTypes.UPDATE_SYSTEM_USER_SUCCESS, payload: data })
        toast.success(data.message);
        navigate('/companies') 
    } catch(err) {
        
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.UPDATE_SYSTEM_USER_FAIL, payload: err.response.data.message })
    }    
}