import *  as actionTypes from '../constants/actionTypes'
import * as api from '../api';
import { toast } from "react-toastify";

/**
 * function for get logs
 * @param {*} data log id 
 * @description get log  by id 
 * @param { function } getLog getLog function
*/

export const getLogs = ( currentPage= '', searchKey= '', searchDate = '', mannererrors = '', violationStatus = '') => async dispatch => {
    try{
        dispatch({ type: actionTypes.GET_LOGS_REQUEST })
        const { data } = await api.getAllLogs(currentPage, searchKey, searchDate,mannererrors, violationStatus)
        dispatch({ type: actionTypes.GET_LOGS_SUCCESS, payload: data })
    }catch (err){
        
        dispatch({ type: actionTypes.GET_LOGS_FAIL, payload: err.response.data.message })
    }
}

/**
* function for loadLog
* @param {*} data Log data 
* @description get log information
* @param {function} loadLog loadLog function
*/
export const loadLog =(id, currentPage= '', searchDate= '',  mannerErrors = '' , violationStatus= '') => async dispatch => {
    try {
        dispatch({ type: actionTypes.LOAD_LOGS_REQUEST })
        const { data } = await api.loadLog(id, currentPage, searchDate, mannerErrors, violationStatus);
        dispatch({ type: actionTypes.LOAD_LOGS_SUCCESS, payload: data })
    } catch (err) {
        
        dispatch({ type: actionTypes.LOAD_LOGS_FAIL, payload: err.response.data })
    }
}
/**
* function for loadLog
* @param {*} data Log data 
* @description get log information
* @param {function} loadLog loadLog function
*/
export const getLogPdf =(id, currentPage= '', searchDate= '',  mannerErrors = '' , violationStatus= '') => async dispatch => {
    try {
        // dispatch({ type: actionTypes.LOAD_LOGS_REQUEST })
        // const { data } = await api.getLogPdf(id, currentPage, searchDate, mannerErrors, violationStatus);
        // dispatch({ type: actionTypes.LOAD_LOGS_SUCCESS, payload: data })
    } catch (err) {
        
        // dispatch({ type: actionTypes.LOAD_LOGS_FAIL, payload: err.response.data })
    }
}

/**
* function for DriverLog
* @param {*} data DriverLog data 
* @description get log information
* @param {function} loadLog loadLog function
*/
export const getDriverLog = (id, logDate) => async dispatch => {
    try {
        dispatch({ type: actionTypes.LOAD_GRAPH_LOG_REQUEST })
        const { data } = await api.getDriverLog(id, logDate);
        dispatch({ type: actionTypes.LOAD_GRAPH_LOG_SUCCESS, payload: data })
    } catch (err) {
       
        dispatch({ type: actionTypes.LOAD_GRAPH_LOG_FAIL, payload: err.response.data })
        dispatch({ type: actionTypes.LOAD_GRAPH_LOG_RESET, payload: {} })
    }
}
/**
* function for DriverLog
* @param {*} data DriverLog data 
* @description get log information
* @param {function} loadLog loadLog function
*/
export const getCoDriverLog = (id, logDate) => async dispatch => {
    try {
        dispatch({ type: actionTypes.LOAD_CO_DRIVER_GRAPH_LOG_REQUEST })
        const { data } = await api.getDriverLog(id, logDate);
        dispatch({ type: actionTypes.LOAD_CO_DRIVER_GRAPH_LOG_SUCCESS, payload: data })
    } catch (err) {
       
        dispatch({ type: actionTypes.LOAD_CO_DRIVER_GRAPH_LOG_FAIL, payload: err.response.data })
        dispatch({ type: actionTypes.LOAD_CO_DRIVER_GRAPH_LOG_RESET, payload: {} })
    }
}

/**
* function for VehicleLog
* @param {*} data VehicleLog data 
* @description get log information
* @param {function} loadVehicleLog loadVehicleLog function
*/
export const loadVehicleLog = (id, searchDate= '') => async dispatch => {
    try {
        dispatch({ type: actionTypes.LOAD_VEHICLE_LOG_REQUEST })
        const { data } = await api.getVehicleLog(id , searchDate);
        dispatch({ type: actionTypes.LOAD_VEHICLE_LOG_SUCCESS, payload: data })
    } catch (err) {
        
        dispatch({ type: actionTypes.LOAD_VEHICLE_LOG_FAIL, payload: err.response.data })
    }
}

/**
* function for VehicleLog
* @param {*} data VehicleLog data 
* @description get log information
* @param {function} loadVehicleLog loadVehicleLog function
*/
export const loadUnidentifiedVehicle = (vehicleId, currentPage= '', searchDate= '') => async dispatch => {
    try {
        dispatch({ type: actionTypes.LOAD_ELD_EVENTS_REQUEST })
        const { data } = await api.getUnidentifiedEvents(vehicleId , currentPage, searchDate);
        dispatch({ type: actionTypes.LOAD_ELD_EVENTS_SUCCESS, payload: data })
    } catch (err) {
        
        dispatch({ type: actionTypes.LOAD_ELD_EVENTS_FAIL, payload: err.response.data })
    }
}

/**
 * function for addEvent
 * @param {*} data AddEvent Data
 * @description save addEvent information
 * @param {function} addEvent addEvent function
 */
 export const storeEvent = (formData) => async dispatch => {
    try {
        dispatch({ type: actionTypes.CREATE_ADD_EVENT_REQUEST })
        const { data } = await api.storeEvent(formData);
        dispatch(getDriverLog(formData.driverId, formData.logDate))
        dispatch({ type: actionTypes.CREATE_ADD_EVENT_SUCCESS, payload: data })
        toast.success(data.message);        

    } catch (err) {
        
        toast.error(err.response?.data?.message);
        dispatch({ type: actionTypes.CREATE_ADD_EVENT_FAIL, payload: err.response?.data?.message })
    }
}
/**
 * function for addEvent
 * @param {*} data AddEvent Data
 * @description save addEvent information
 * @param {function} addEvent addEvent function
 */
 export const eventUpdate = (formData) => async dispatch => {
    try {
        dispatch({ type: actionTypes.UPDATE_EVENT_REQUEST })
        const { data } = await api.updateEvent(formData);
        dispatch(getDriverLog(formData.driverId, formData.logDate))
        dispatch({ type: actionTypes.UPDATE_EVENT_SUCCESS, payload: data })
        toast.success(data.message);        

    } catch (err) {
     
        toast.error(err.response?.data?.message);
        dispatch({ type: actionTypes.UPDATE_EVENT_FAIL, payload: err.response?.data?.message })
    }
}

export const transferData = (formData) => async dispatch => {
    try{
        dispatch({ type: actionTypes.TRANSPORT_DATA_REQUEST })
        const { data } = await api.transferData(formData);
        dispatch({ type: actionTypes.TRANSPORT_DATA_SUCCESS, payload: data })
        toast.success(data.message); 
    } catch (err) {
       
        toast.error(err.response?.data?.message);
        dispatch({ type: actionTypes.TRANSPORT_DATA_FAIL, payload: err.response?.data?.message })
    }
}

/**
* function for DriverLog
* @param {*} data DriverLog data 
* @description get log information
* @param {function} loadLog loadLog function
*/
export const getEventCode = () => async dispatch => {
    try {
        dispatch({ type: actionTypes.LOAD_EVENT_CODE_REQUEST })
        const { data } = await api.getEventCode();
        dispatch({ type: actionTypes.LOAD_EVENT_CODE_SUCCESS, payload: data })
    } catch (err) {
        
        dispatch({ type: actionTypes.LOAD_EVENT_CODE_FAIL, payload: err.response.data })
    }
}

/**
 * function for addEvent
 * @param {*} data AddEvent Data
 * @description save addEvent information
 * @param {function} addEvent addEvent function
 */
 export const eventDestroy = (formData) => async dispatch => {
    try {
        dispatch({ type: actionTypes.UPDATE_EVENT_REQUEST })
        const { data } = await api.eventDestroy(formData);
        dispatch(getDriverLog(formData.driverId, formData.logDate))
        dispatch({ type: actionTypes.UPDATE_EVENT_SUCCESS, payload: data })
        toast.success(data.message);        

    } catch (err) {
      
        toast.error(err.response?.data?.message);
        dispatch({ type: actionTypes.UPDATE_EVENT_FAIL, payload: err.response?.data?.message })
    }
}
/**
 * function for processData
 * @param {*} data processData Data
 * @description save processData information
 * @param {function} processData processData function
 */
 export const processData = (driverId, date, logDate) => async dispatch => {
    try {
        dispatch({ type: actionTypes.UPDATE_EVENT_REQUEST })
        const { data } = await api.updateEvent(driverId, date);
        dispatch(getDriverLog(driverId, logDate))
        dispatch({ type: actionTypes.UPDATE_EVENT_SUCCESS, payload: data })
        toast.success(data.message);        

    } catch (err) {
       
        toast.error(err.response?.data?.message);
        dispatch({ type: actionTypes.UPDATE_EVENT_FAIL, payload: err.response?.data?.message })
    }
}

/**
 * function for processData
 * @param {*} data processData Data
 * @description save processData information
 * @param {function} processData processData function
 */
 export const eventViolations = (formData) => async dispatch => {
    try {
        dispatch({ type: actionTypes.UPDATE_EVENT_REQUEST })
        const { data } = await api.updateEvent(formData);
        dispatch(getDriverLog(formData.driverId, formData.logDate))
        dispatch({ type: actionTypes.UPDATE_EVENT_SUCCESS, payload: data })
        toast.success(data.message);        

    } catch (err) {
        
        toast.error(err.response?.data?.message);
        dispatch({ type: actionTypes.UPDATE_EVENT_FAIL, payload: err.response?.data?.message })
    }
}
/**
 * function for updateViolations
 * @param {*} data updateViolations Data
 * @description save updateViolations information
 * @param {function} updateViolations updateViolations function
 */
export const removeViolations = (formData) => async dispatch => {
    try {
        const { data } = await api.removeViolations(formData.logId);
        dispatch(getDriverLog(formData.driverId, formData.logDate))
        toast.success(data.message);        

    } catch (err) {
        
        toast.error(err.response?.data?.message);
        dispatch({ type: actionTypes.UPDATE_EVENT_FAIL, payload: err.response?.data?.message })
    }
}
/**
 * function for updateDriverLog
 * @param {*} data updateDriverLog Data
 * @description save updateDriverLog information
 * @param {function} updateDriverLog updateDriverLog function
 */
export const updateDriverLog = (formData) => async dispatch => {
    try {
        const { data } = await api.updateDriverLogApi(formData);
        dispatch(getDriverLog(formData.driverId, formData.logDate))
        toast.success(data.message);        

    } catch (err) {
      
        toast.error(err.response?.data?.message);
        dispatch({ type: actionTypes.UPDATE_EVENT_FAIL, payload: err.response?.data?.message })
    }
}
/**
 * function for storeEventByTechnician
 * @param {*} data storeEventByTechnician Data
 * @description save storeEventByTechnician information
 * @param {function} storeEventByTechnician storeEventByTechnician function
 */
export const storeEventByTechnician = (formData) => async dispatch => {
    try {
        dispatch({ type: actionTypes.CREATE_ADD_EVENT_REQUEST })
        const { data } = await api.storeEventByTechnician(formData);
        dispatch(getDriverLog(formData.driverId, formData.logDate))
        dispatch({ type: actionTypes.CREATE_ADD_EVENT_SUCCESS, payload: data })
        toast.success(data.message);        

    } catch (err) {
       
        toast.error(err.response?.data?.message);
        dispatch({ type: actionTypes.CREATE_ADD_EVENT_FAIL, payload: err.response?.data?.message })
    }
}
/**
 * function for eventUpdateByTechnician
 * @param {*} data eventUpdateByTechnician Data
 * @description save eventUpdateByTechnician information
 * @param {function} eventUpdateByTechnician eventUpdateByTechnician function
 */
export const eventUpdateByTechnician = (formData) => async dispatch => {
    try {
        dispatch({ type: actionTypes.UPDATE_EVENT_REQUEST })
        const { data } = await api.updateEventByTechnician(formData);
        dispatch(getDriverLog(formData.driverId, formData.logDate))
        dispatch({ type: actionTypes.UPDATE_EVENT_SUCCESS, payload: data })
        toast.success(data.message);        

    } catch (err) {
       
        toast.error(err.response?.data?.message);
        dispatch({ type: actionTypes.UPDATE_EVENT_FAIL, payload: err.response?.data?.message })
    }
}
/**
 * function for eventUpdateByTechnician
 * @param {*} data eventUpdateByTechnician Data
 * @description save eventUpdateByTechnician information
 * @param {function} eventUpdateByTechnician eventUpdateByTechnician function
 */
export const reassignEventByTechnician = (formData) => async dispatch => {
    try {
        dispatch({ type: actionTypes.UPDATE_EVENT_REQUEST })
        const { data } = await api.reassignEventByTechnician(formData);
        dispatch(getDriverLog(formData.currentDriverId, formData.logDate))
        dispatch({ type: actionTypes.UPDATE_EVENT_SUCCESS, payload: data })
        toast.success(data.message);        

    } catch (err) {
        
        toast.error(err.response?.data?.message);
        dispatch({ type: actionTypes.UPDATE_EVENT_FAIL, payload: err.response?.data?.message })
    }
}
/**
 * function for eventUpdateByTechnician
 * @param {*} data eventUpdateByTechnician Data
 * @description save eventUpdateByTechnician information
 * @param {function} eventUpdateByTechnician eventUpdateByTechnician function
 */
export const bulkEventUpdateByTechnician = (formData) => async dispatch => {
    try {
        dispatch({ type: actionTypes.BULK_EVENT_UPDATE_REQUEST })
        const { data } = await api.updateBulkEventByTechnician(formData);
        dispatch({ type: actionTypes.BULK_EVENT_UPDATE_SUCCESS, payload: data })
        toast.success(data.message);        

    } catch (err) {
        
        toast.error(err.response?.data?.message);
        dispatch({ type: actionTypes.BULK_EVENT_UPDATE_FAIL, payload: err.response?.data?.message })
    }
}

/**
 * function for getPdflogs by technician
 * @param {*} data getPdfLogs Data
 * @description  getPdfLogs information
 * @param {function} getPdfLogs getPdfLogs function
 */
 export const getPdfLogs = (logDriverId, logDate) => async dispatch => {
    try {
        dispatch({ type: actionTypes.GET_PDF_LOGS_REQUEST })
        const { data } = await api.getPdfLogs(logDriverId, logDate);
        dispatch({ type: actionTypes.GET_PDF_LOGS_SUCCESS, payload: data })
        // toast.success(data.message);        

    } catch (err) {
       
        // toast.error(err.response?.data?.message);
        dispatch({ type: actionTypes.GET_PDF_LOGS_FAIL, payload: err.response?.data?.message })
    }
}

/**
 * function for download pdflogs
 * @param {*} data downloadPdfLogs Data
 * @description downloadPdfLogs information
 * @param { function } downloadPdfLogs downloadPdf function
 */
export const downloadPdfLogs = (driverId, logDate) => async dispatch => {
    try{
        dispatch({ type: actionTypes.DOWNLOAD_PDF_LOGS_REQUEST })
        const { data } = await api.downloadPdfLogs(driverId, logDate);
        dispatch({ type: actionTypes.DOWNLOAD_PDF_LOGS_SUCCESS, payload: data })
        toast.success(data.message);
    } catch (err) {
        
        toast.error(err.response?.data?.message);
        dispatch({ type: actionTypes.DOWNLOAD_PDF_LOGS_FAIL, payload: err.response?.data?.message })
    }
}

/**
 * function for download pdflogs
 * @param {*} data downloadPdfLogs Data
 * @description downloadPdfLogs information
 * @param { function } downloadPdfRangeLogs downloadPdf function
 */

export const downloadPdfRangeLogs = (logDriverId, start, end) => async dispatch => {
    try{
        dispatch({ type: actionTypes.DOWNLOAD_PDF_LOGS_RANGE_REQUEST })
        const { data } = await api.downloadPdfRangeLogs(logDriverId, start, end);
        dispatch({ type: actionTypes.DOWNLOAD_PDF_LOGS_SUCCESS, payload: data })
        toast.success(data.message);
    }catch(err){
     
        toast.error(err.response?.data?.message);
        dispatch({ type: actionTypes.DOWNLOAD_PDF_LOGS_FAIL, payload: err.response?.data?.message })
    }
}


