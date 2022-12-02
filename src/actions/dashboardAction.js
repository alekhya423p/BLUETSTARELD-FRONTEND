import * as actionTypes from '../constants/userActionTypes';
import * as api from '../api';


/**
* function for loadUserProfile
* @param {*} data User data 
* @description get user infromation
* @param {function} loadUserProfile loadUserProfile function
*/
export const getuserDashboardData = () => async dispatch => {
    // try {
    //     dispatch({ type: actionTypes.GET_FETCH_ALL_REQUEST })
    //     const { data } = await api.getUserDashboardList();
    //     dispatch({ type: actionTypes.GET_FETCH_ALL_SUCCESS, payload: data })

    // } catch (err) {
    //     console.log(err)
    //     dispatch({ type: actionTypes.GET_FETCH_ALL_FAIL, payload: err.response.data })
    // }
}

export const updateProjectShortCuts = (formData) => async dispatch => {
    // try {
    //     dispatch({ type: actionTypes.UPDATE_PROJECT_REQUEST })
    //     const { data } = await api.updateProjectShortCut(formData);
    //     dispatch({ type: actionTypes.UPDATE_PROJECT_SUCCESS, payload: data })
    //     toast.success(data.message)
    // } catch (err) {
    //     dispatch({ type: actionTypes.UPDATE_PROJECT_FAIL, payload: err.response.data })
    // }
    // return api.updateProjectShortCut(projectData)
    //     .then((response) => toast.success(response?.data?.message))
    //     .catch((error) => {
    //         console.log(error)
    //     })
}

export const updateProjectShortCut = (formData) => {
    
    // return api.updateProjectShortCut(formData)
    //     .then((response) => toast.success(response?.data?.message))
    //     .catch((error) => {
    //         console.log(error)
    //     })
}
/**
* function for loadUserProfile
* @param {*} data User data 
* @description get user infromation
* @param {function} loadUserProfile loadUserProfile function
*/
export const makePayment = (formData, history) => async dispatch => {
    // try {
    //    // dispatch({ type: actionTypes.MAKE_PAYMENT_PARTNER_REQUEST })
    //     const { data } = await api.makePaymentPartner(formData);
    //     toast.success(data.message);
    //     history.push('/dashboard')
    //     dispatch(refreshToken());
    //     //dispatch({ type: actionTypes.MAKE_PAYMENT_PARTNER_SUCCESS, payload: data })

    // } catch (err) {
    //     console.log(err)
    //     //dispatch({ type: actionTypes.MAKE_PAYMENT_PARTNER_FAIL, payload: err.response.data })
    // }
}

/**
* function for loadUserProfile
* @param {*} data User data 
* @description get user infromation
* @param {function} loadUserProfile loadUserProfile function
*/
export const subscriptionPlans = () => async dispatch => {
    // try {
    //    dispatch({ type: actionTypes.GET_SUBSCRIPTION_REQUEST })
    //     const { data } = await api.indexSubscriptions();
    //     dispatch({ type: actionTypes.GET_SUBSCRIPTION_SUCCESS, payload: data })

    // } catch (err) {
    //     console.log(err)
    //     dispatch({ type: actionTypes.GET_SUBSCRIPTION_FAIL, payload: err.response.data })
    // }
}

/**
* function for loadUserProfile
* @param {*} data User data 
* @description get user infromation
* @param {function} loadUserProfile loadUserProfile function
*/
export const clientBudgetOverview = () => async dispatch => {
    // try {
    //     // dispatch({ type: actionTypes.GET_SUBSCRIPTION_REQUEST })
    //     // const { data } = await api.indexSubscriptions();
    //     // dispatch({ type: actionTypes.GET_SUBSCRIPTION_SUCCESS, payload: data })

    // } catch (err) {
    //     console.log(err)
    //     dispatch({ type: actionTypes.GET_SUBSCRIPTION_FAIL, payload: err.response.data })
    // }
}

/**
* function for sidebarMinimize
* @param {*} data User data 
* @description get user infromation
* @param {function} sidebarMinimize sidebarMinimize function
*/
export const sidebarMinimize = () => async dispatch => {
//     try {
//         dispatch({ type: actionTypes.SET_MINIMIZE_REQUEST })
//     } catch (err) {
//         console.log(err)
//     }
}

/**
* function for sidebarMinimize
* @param {*} data User data 
* @description get user infromation
* @param {function} getHeaderSidebar function
*/

export const getHeaderData = () => async dispatch => {
    try{
        dispatch({ type: actionTypes.GET_DASHBOARD_COUNT_REQUEST })
        const { data } = await api.getDashboardCounts()
        dispatch({ type: actionTypes.GET_DASHBOARD_COUNT_SUCCESS, payload: data })
    }catch (err){
        // console.log(err)
        dispatch({ type: actionTypes.GET_DASHBOARD_COUNT_FAIL, payload: err.response.data.message })
    }
}


/**
* function for sidebarMinimize
* @param {*} data for vehicle and driver on dashboard 
* @description get vehicle and driver infromation
* @param {function} getDashboard function
*/

export const getDashboard = (truckStatus = '', dutyStatus = '', order = '', searchKey = '') => async dispatch => {
    try {
        dispatch({ type: actionTypes.GET_VEHICLE_AND_DRIVER_REQUEST })
        const { data } = await api.getDashboard(truckStatus, dutyStatus, order, searchKey);
        dispatch({ type: actionTypes.GET_VEHICLE_AND_DRIVER_SUCCESS, payload: data })
    }
    catch (err){
        // console.log(err)
        dispatch({ type: actionTypes.GET_VEHICLE_AND_DRIVER_FAIL, payload: err.response.data.message })
    }
}