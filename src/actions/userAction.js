import * as actionTypes from '../constants/actionTypes';
import * as api from '../api';
import { toast } from "react-toastify";

/**
* function for get user
* @param {*} data User id 
* @description get user by id
* @param {function} getUser getUser function
*/
export const getUsers = (currentPage = '',  searchKey = '', searchStatus = '') => async dispatch => {
    try {
        dispatch({ type: actionTypes.GET_USERS_REQUEST })
        const { data } = await api.getAllUser(currentPage, searchKey,searchStatus)
        dispatch({ type: actionTypes.GET_USERS_SUCCESS, payload: data })

    } catch (err) {
       
        dispatch({ type: actionTypes.GET_USERS_FAIL, payload: err.response.data.message })
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
        dispatch({ type: actionTypes.LOAD_USERS_REQUEST })
        const { data } = await api.editUser(id);
        dispatch({ type: actionTypes.LOAD_USERS_SUCCESS, payload: data })

    } catch (err) {
       
        dispatch({ type: actionTypes.LOAD_USERS_FAIL, payload: err.response.data })
    }
}

/**
* function for user register
* @param {*} data form data and navigate
* @description user register
* @param {function} register register function
*/
export const createUser = (formData, navigate) => async dispatch => {
    try {
        dispatch({ type: actionTypes.CREATE_USER_REQUEST })
        const { data } = await api.storeUser(formData);
        toast.success(data.message);
        // dispatch({ type: actionTypes.CREATE_USER_SUCCESS, payload: data })
        navigate('/settings/portal-users')

    } catch (err) {
      
        toast.error(err.response?.data?.message);
        dispatch({ type: actionTypes.CREATE_USER_FAIL, payload: err.response?.data?.message })
    }
}


/**
* function for user update User
* @param {*} data User data 
* @description update user infromation
* @param {function} updateUser updateUser function
*/
export const userUpdate = (userData, navigate ) => async (dispatch, getState) => {
    try {
        dispatch({ type: actionTypes.UPDATE_USER_REQUEST })
        const { data } = await api.updateUser(userData)
        dispatch({ type: actionTypes.UPDATE_USER_SUCCESS, payload: data })
        dispatch({ type: actionTypes.UPDATE_USER_RESET })
        toast.success(data.message);
        navigate('/settings/portal-users')
    } catch (err) {
      
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.UPDATE_USER_FAIL, payload: err.response.data.message })
    }
}
/**
* function for user update User
* @param {*} data User data 
* @description update user infromation
* @param {function} updateUser updateUser function
*/
export const UserUpdateBlockUnblock = userData => async (dispatch, getState) => {
    try {
        dispatch({ type: actionTypes.UPDATE_USER_REQUEST })
        const { data } = await api.updateUser(userData)
        dispatch({ type: actionTypes.UPDATE_USER_SUCCESS, payload: data })
        dispatch({ type: actionTypes.UPDATE_USER_RESET })
        toast.success(data.message);
    } catch (err) {
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.UPDATE_USER_FAIL, payload: err.response.data.message })
    }
}

/**
* function for user update User
* @param {*} data User data 
* @description deactivate user infromation
* @param {function} deactivateUser deactivateUser function
*/

export const deactivateUser = (id, navigate) => async (dispatch, getState) => {
    try {
        dispatch({ type: actionTypes.DEACTIVATE_USER_REQUEST })
        const { data } = await api.deactivateUser(id)
        dispatch({ type: actionTypes.DEACTIVATE_USER_SUCCESS, payload: data })
        dispatch({ type: actionTypes.DEACTIVATE_USER_RESET })
        toast.success(data.message);
        navigate('/settings/portal-users')
    } catch(err) {
        
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.DEACTIVATE_USER_FAIL, payload: err.response.data.message })
    }    
}

export const destroyUser = (userId) => async dispatch => {
    try {
        dispatch({ type: actionTypes.DELETE_USER_REQUEST })
        const { data } = await api.deleteUser(userId)
        dispatch({ type: actionTypes.DELETE_USER_SUCCESS, payload: userId })
        toast.success(data.message);
    } catch (err) {
       
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.DELETE_USER_FAIL, payload: err.response.data.message })
    }
}