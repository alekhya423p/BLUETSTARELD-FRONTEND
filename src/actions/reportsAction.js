import * as actionTypes from '../constants/actionTypes';
import * as api from '../api';
import { toast } from 'react-toastify';

/**
 * function for get ifta records
 * @param {*} data records data 
 * @description get records  by id 
 * @param { function } getrecords getRecords function
*/
 
export const getiftaReports = (currentPage = '') => async dispatch => {
    try{
        dispatch({ type: actionTypes.GET_IFTA_RECORDS_REQUEST })
        const { data } = await api.getiftaReports(currentPage)
        dispatch({ type: actionTypes.GET_IFTA_RECORDS_SUCCESS, payload: data })
    }catch (err){
        // console.log(err)
        dispatch({ type: actionTypes.GET_IFTA_RECORDS_FAIL, payload: err.response.data.message })
    }
} 

/**
 * function for get ifta records
 * @param {*} data records details data 
 * @description get records details by id 
 * @param { function } getrecorddetails getRecorddetails function
*/

export const getReportsDetails = (reportId = '', vehicleNumber = '') => async dispatch => {
    try{
        dispatch({ type: actionTypes.GET_IFTA_DETAILS_REQUEST })
        const { data } = await api.getReportsDetails(reportId, vehicleNumber)
        dispatch({ type: actionTypes.GET_IFTA_DETAILS_SUCCESS, payload: data })
    }catch (err){
        // console.log(err)
        dispatch({ type: actionTypes.GET_IFTA_DETAILS_FAIL, payload: err.response.data.message })
    }
}

/**
 * function for get ifta records
 * @param {*} data records by vehicle data 
 * @description get records details by vehicle 
 * @param { function } getiftarecordsbyvehicle vehicle function
*/

export const getReportsByVehicle = (reportId = '', vehicleId = '', searchKey = '') => async dispatch => {
    try{
        dispatch({ type: actionTypes.GET_IFTA_BY_VEHICLE_REQUEST })
        const { data } = await api.getReportsByVehicle(reportId, vehicleId, searchKey)
        dispatch({ type: actionTypes.GET_IFTA_BY_VEHICLE_SUCCESS, payload: data })
    }catch (err){
        // console.log(err)
        dispatch({ type: actionTypes.GET_IFTA_BY_VEHICLE_FAIL, payload: err.response.data.message })
    }
}

/**
 * function for get ifta records
 * @param {*} data for creating report
 * @description for creating report 
 * @param { function } create report function
 *
*/


export const createReport = (formData) => async dispatch => {
    try {
        dispatch({ type: actionTypes.CREATE_REPORT_REQUEST })
        const { data } = await api.createReport(formData);
        toast.success(data.message);
        dispatch({ type: actionTypes.CREATE_REPORT_SUCCESS, payload: data })

    } catch (err) {
        // console.log('error is: ', err?.response?.data)
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.CREATE_REPORT_FAIL, payload: err.response.data.message })
    }
}

/**
 * function for get fmcsa records
 * @param {*} data for fmcsa records
 * @description for fmcsa records listing 
 * @param { function } fmcsa records function
 *
*/

export const getFmcsaRecords= (searchKey = '', searchDate = '') => async dispatch => {
    try{
        dispatch({ type: actionTypes.GET_FMCSA_RECORDS_REQUEST })
        const { data } = await api.getFmcsaRecords(searchKey, searchDate);
        dispatch({ type: actionTypes.GET_FMCSA_RECORDS_SUCCESS, payload: data })
    }catch (err){
        // console.log(err)
        dispatch({ type: actionTypes.GET_FMCSA_RECORDS_FAIL, payload: err.response.data.message })
    }
} 

/**
 * function for get fmcsa records
 * @param {*} data for get all states
 * @description for states listing 
 * @param { function } states listing function
 *
*/


export const getAllStates = () => async dispatch => {
    try {
        dispatch({ type: actionTypes.GET_ALL_STATES_REQUEST })
        const { data } = await api.getAllStates();
        dispatch({ type: actionTypes.GET_ALL_STATES_SUCCESS, payload: data })
    }catch (err){
        // console.log(err)
        dispatch({ type: actionTypes.GET_ALL_STATES_FAIL, payload: err.response.data.message })
    }
}