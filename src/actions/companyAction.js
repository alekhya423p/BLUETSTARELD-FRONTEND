import * as actionTypes from '../constants/actionTypes';
import * as api from '../api';
import { toast } from "react-toastify";
import { refreshToken } from './authAction'
/**
* function for loadCompanyDetail
* @param {*} data CompanyDetail data 
* @description get CompanyDetail infromation
* @param {function} loadCompanyDetail loadCompanyDetail function
*/
export const loadCompanyDetail = () => async dispatch => {
    try {
        dispatch({ type: actionTypes.LOAD_COMPANY_REQUEST })
        const { data } = await api.editCompany();
        dispatch({ type: actionTypes.LOAD_COMPANY_SUCCESS, payload: data })

    } catch (err) {
        // console.log(err)
        dispatch({ type: actionTypes.LOAD_COMPANY_FAIL, payload: err.response.data })
    }
}

/**
 * function for company create Company
 * @params {*} data Company data
 * @description create company information
 * @param { function } companyCreate createCompany function
 */


export const createCompany = (formData, navigate) => async (dispatch) => {
    try{
        dispatch({ type: actionTypes.CREATE_COMPANY_REQUEST})
        const { data } = await api.createCompany(formData);
        dispatch({ type: actionTypes.CREATE_COMPANY_SUCCESS, payload: data })
        dispatch({ type: actionTypes.CREATE_COMPANY_RESET})
        toast.success(data.message);        
        navigate('/companies')
        

    } catch (err){
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.CREATE_COMPANY_FAIL, payload: err.response.data.message })
    }
}


/**
* function for Company update Company
* @param {*} data Company data 
* @description update Company infromation
* @param {function} companyUpdate updateCompany function
*/
export const companyUpdate = (payload, navigate ) => async (dispatch) => {
    try {
        dispatch({ type: actionTypes.LOAD_COMPANY_REQUEST })
        const { data } = await api.updateCompany(payload)
        dispatch({ type: actionTypes.LOAD_COMPANY_SUCCESS, payload: data })
        dispatch(refreshToken())
        // dispatch({ type: actionTypes.UPDATE_COMPANY_RESET })
        toast.success(data.message);
        navigate('/settings/company')

    } catch (err) {
        // console.log(err.response.data.message)
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.UPDATE_COMPANY_FAIL, payload: err.response.data.message })
    }
}

/**
* function for loadCompanyDetail
* @param {*} data CompanyDetail data 
* @description get CompanyDetail infromation
* @param {function} loadCompanyDetail loadCompanyDetail function
*/
export const loadCompanyUsers = id => async dispatch => {
    try {
        dispatch({ type: actionTypes.LOAD_COMPANY_USERS_REQUEST })
        const { data } = await api.getCompanyUsers(id);
        dispatch({ type: actionTypes.LOAD_COMPANY_USERS_SUCCESS, payload: data })

    } catch (err) {
        // console.log(err)
        dispatch({ type: actionTypes.LOAD_COMPANY_USERS_FAIL, payload: err.response.data })
    }
}

/**
* function for loadCompanies
* @param {*} data CompanyDetail data 
* @description get CompanyDetail infromation
* @param {function} loadCompanies loadCompanies function
*/
export const loadCompanies = (searchKey= '', searchStatus= '', searchCompany= '') => async dispatch => {
    try {
        dispatch({ type: actionTypes.LOAD_COMPANIES_REQUEST })
        const { data } = await api.getCompanies(searchKey, searchStatus, searchCompany);
        dispatch({ type: actionTypes.LOAD_COMPANIES_SUCCESS, payload: data })

    } catch (err) {
        // console.log(err)
        dispatch({ type: actionTypes.LOAD_COMPANIES_FAIL, payload: err.response.data })
    }
}

/**
* function for loadCompanies
* @param {*} data CompanyDetail data 
* @description get CompanyDetail infromation
* @param {function} loadCompanies loadCompanies function
*/
export const deactivateCompany = (id) => async dispatch => {
    try {
        dispatch({ type: actionTypes.UPDATE_COMPANY_REQUEST })
        const { data } = await api.deactivateCompany(id);
        dispatch({ type: actionTypes.UPDATE_COMPANY_SUCCESS, payload: data })
        toast.success(data.message);
    } catch (err) {
        // console.log(err)
        dispatch({ type: actionTypes.UPDATE_COMPANY_FAIL, payload: err.response.data })
    }
}