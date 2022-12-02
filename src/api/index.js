import axios from 'axios';
import { toast } from 'react-toastify';
import {CONFIG} from '../utility/config'

const API = axios.create({ baseURL: CONFIG.SERVER_URL });
API.interceptors.request.use((req) => {
    if (localStorage.getItem('token')) {
        const token = JSON.parse(localStorage.getItem('token')) || '';
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

API.interceptors.response.use(null, error => {
    const expectedError =
     error.response &&
     error.response.status >= 400 &&
     error.response.status < 500;

    if (!expectedError) {
     toast.error("An unexpected error occurred");
    }
   
    return Promise.reject(error);
});

// API.interceptors.response.use(response => {
//     return response;
//  }, error => {
//     //    if (error.response.status === 401) {
//     //        //return error.response;
//     //       //  window.location.assign('/login');
//     //    }
//     console.log(error)
// //    if(error.response.status === 500) {
// //        alert("Server error");
// //    }
//   // return error;
   
//  });

// authantication apis
export const signIn = (formData) => API.post('/login', formData);
export const signUp = (formData) => API.post('/register', formData);
export const logOut = () => API.get('/logout');
export const changePassword = (updatedForm) => API.post('/changePasswordUser', updatedForm);
export const passwordReset = (payload) => API.post('/user/reset-password', payload);
export const resendEmailVerification = (email) => API.post(`api/resend/verification/${email}`);
export const emailVerify = (payload) => API.post('/verify', payload);
export const getEmailByUser = (email) => API.post(`/forgotPasswordUser`, email);
export const refreshExpireToken = () => API.get(`user/refresh-token`);
export const activeCurrentCompany = (id) => API.get(`/system/refresh-token/${id}`)
// current user
export const getUserProfile = () => API.get('/getProfileUser');
//export const loadCurrentUser = () => API.get('/api/user/profile');
export const getUser = (id) => API.get(`/api/user/get/${id}`);
export const updateProfile = (updateForm) => API.post('/updateCompanyUser', updateForm);
// admin projects
export const getDashboardProject = () => API.get('/api/admin/project-list');
// user dashboard apis
export const getUserDashboardList = () => API.get('/api/dashboard');
export const updateProjectShortCut = (projectData) => API.put('/api/projects/add-to-shortcuts', projectData);
// admin dashboard api
export const getDashboardStats = () => API.get('/api/admin/dashboard/stats');
// home page contend
export const getHompageContent = () => API.get('/home/content');
export const createPageContent = (content) => API.post('/api/admin/manage/content', content);

// Driver API
export const getAllDriver = (currentPage, searchKey, searchStatus) => API.get(`/getDriverList?page=${currentPage}&searchKey=${searchKey}&searchStatus=${searchStatus}`);
export const editDriver = (id) => API.get(`/getDriver/${id}`);
export const storeDriver = (payload) => API.post('/createDriver', payload);
export const updateDriver = (payload) => API.post('/editDriver', payload);
export const deactivateDriver = (payload) => API.post('/deactivateDriverUser', payload)
export const deleteDriver = (payload) => API.post('/api/admin/manage/payload', payload);
export const getHOSRulesAPI = () => API.get('/hosGetall');
export const assignDriver = (payload) => API.post('/assignDriver', payload);
export const removeBulk = (payload) => API.post('/removeBulk', payload);

// Vehicles API
export const getAllVehicle = (currentPage, searchKey, searchStatus) => API.get(`getVehicles?page=${currentPage}&searchKey=${searchKey}&searchStatus=${searchStatus}`);
export const editVehicle = (id) => API.get(`/getVehicleInfo/${id}`);
export const storeVehicle = (payload) => API.post('/addVehicle', payload);
export const updateVehicle = (payload) => API.post('/editVehicle', payload);
export const deleteVehicle = (payload) => API.post('removeVehicle', payload);
export const getVehicleMasterList = () => API.get('/vehicleMaster');
export const deactivateVehicle = (payload) => API.post('/deactivateVehicle' , payload)
export const unAssignEld = (payload) => API.post('/unAssignEld', payload)
export const getVehicleLocation = (vehicleId, searchDate) => API.get(`/locationHistory?vehicleId=${vehicleId}&searchDate=${searchDate}`)
export const activeVehicleList = () => API.get('/activeVehicleList');
export const getPdfLogs = (logDriverId, logDate) => API.get(`/reports/pdflogs?logDriverId=${logDriverId}&logDate=${logDate}`);
export const downloadPdfLogs = (driverId, logDate) => API.get(`/download/pdfReports?driverId=${driverId}&logDate=${logDate}`); 
export const downloadPdfRangeLogs = (logDriverId, start, end) => API.get(`/reports/pdflogs?logDriverId=${logDriverId}&start=${start}&end=${end}`)

// ELD Device API
export const getAllELDDevice = (currentPage, searchKey, searchStatus) => API.get(`/getELDs?page=${currentPage}&searchKey=${searchKey}&searchStatus=${searchStatus}`);
export const editELDDevice = (id) => API.get(`/geteldDetail/${id}`);
export const storeELDDevice = (payload) => API.post('/addELD', payload);
export const updateELDDevice = (payload) => API.post('/editELD', payload);
export const deactivateELDDevice = (payload) => API.post('/deactivateELD', payload);
export const removeELDDevice = (payload) => API.put('/deleteEld', payload);
export const deleteELDDevice = (payload) => API.post('/removeELD', payload);
export const getELDMasterList = () => API.get('/eldMaster');

// Portal User API
export const getAllUser = (currentPage, searchKey, searchStatus) => API.get(`/getPortelUsersAll?page=${currentPage}&searchKey=${searchKey}&searchStatus=${searchStatus}`);
export const editUser = (id) => API.get(`/getPortelUser/${id}`);
export const storeUser = (payload) => API.post('/createPortelUser', payload);
export const updateUser = (payload) => API.post('/editPortelUser', payload);
export const deactivateUser = (id) => API.put(`/deactivate/system-user/${id}`);
export const deleteUser = (payload) => API.post('/deletePortelUser', payload);

// Company API
export const editCompany = (id) => API.get(`/getCompanyUser`);
export const getCompanyUsers = () => API.get(`/getResponsibleUsers`);
export const updateCompany = (payload) => API.post('/editCompany', payload);
export const getCompanies = (searchKey, searchStatus, searchCompany) => API.get(`/system/companies-list?searchStatus=${searchStatus}&searchKey=${searchKey}&companyId=${searchCompany}`);
export const deactivateCompany = (id) => API.put(`/system/deactivate-company/${id}`);

// Logs API
export const getAllLogs = (currentPage, searchKey, searchDate, mannerErrors, violationStatus) => API.get(`getActiveDrivers?page=${currentPage}&searchKey=${searchKey}&searchDate=${searchDate}&mannerErrors=${mannerErrors}&violationStatus=${violationStatus}`);
// export const getAllLogs = (currentPage, searchKey, searchDate, violationStatus, mannererrors) => API.get(`getActiveDrivers`);
export const loadLog = (driverID, currentPage, searchDate, mannerErrors, violationStatus) => API.get(`getLogs?driverId=${driverID}&page=${currentPage}&searchDate=${searchDate}&mannerErrors=${mannerErrors}&violationStatus=${violationStatus}`)
export const getEventCode = () => API.get(`getEventCode`)
export const getDriverLog = (driverID, logDate) => API.get(`getLogDetail?logDriverId=${driverID}&logDate=${logDate}`);
export const getVehicleLog = (vehicleId, searchDate) => API.get(`vehicleLogs/${vehicleId}?searchDate=${searchDate}`);
export const storeEvent = (payload) => API.post('/addEvent', payload);
export const updateEvent = (driverId, date) => API.post(`/processed-events?driverId=${driverId}&date=${date}`);
export const updateDriverLogApi = (payload) => API.post('/edit-formtechnician', payload);
export const removeViolations = (logId) => API.get(`/remove-violation/${logId}`);
export const storeEventByTechnician = (payload) => API.post('/addEvent-technician', payload);
export const updateEventByTechnician = (payload) => API.post('/editEvent-technician', payload);
export const updateBulkEventByTechnician = (payload) => API.post('/editBulk-Technician', payload);
export const reassignEventByTechnician = (payload) => API.post('/reassignEvent-technician', payload);
export const eventDestroy = (payload) => API.post('/removeEvent-technician', payload); 
// export const getLogPdf = (driverID, logDate) => API.get(`/reports/pdflogs?logDriverId=${driverID}&logDate=${logDate}`);

// Driver HOS API
export const getAllDriverHos = (currentPage, searchKey, eldStatus, dutyStatus, violationStatus) => API.get(`hosList?page=${currentPage}&searchKey=${searchKey}&eldStatus=${eldStatus}&dutyStatus=${dutyStatus}&violationStatus=${violationStatus}`);
export const getDriverMasterList = () => API.get('/getDriverMasterList');
export const transferData = (payload) => API.post('/generate/output-csv', payload);
export const generateCsv = (payload) => API.post('/generate/output-csv', payload);

// Assets API
export const getAllAssets = (currentPage, searchKey) => API.get(`assetList?page=${currentPage}&searchKey=${searchKey}`);
export const getAssetDetail = (vehicleId) => API.get(`/assetDetail/${vehicleId}`);

// Eld Events API
export const getEventVehicle = (currentPage, searchKey) => API.get(`getEventVehicleList?page=${currentPage}&searchKey=${searchKey}`)
export const getUnidentifiedEvents = (vehicleId, currentPage, searchDate) => API.get(`unidentifiedEvents?vehicleId=${vehicleId}&page=${currentPage}&searchDate=${searchDate}`)

//Dashboard Count
export const getDashboardCounts = () => API.get(`/getDashboardCounts`);
export const getDashboard = (truckStatus, dutyStatus, order, searchKey) => API.get(`/dashboard?truckStatus=${truckStatus}&dutyStatus=${dutyStatus}&orderBy=${order}&searchKey=${searchKey}`)

//reports api
export const getiftaReports = (currentPage) => API.get(`/reports/ifta?page=${currentPage}`);
export const getReportsDetails = (reportId, vehicleNumber) => API.get(`/reports/ifta/details?reportId=${reportId}&searchKey=${vehicleNumber}`);
export const getReportsByVehicle = (reportId, vehicleId, searchKey) => API.get(`reports/ifta/${reportId}/vehicle/${vehicleId}?searchKey=${searchKey}`); 
export const createReport = (payload) => API.post(`/createReport`, payload);
export const getFmcsaRecords = (searchKey, searchDate) => API.get(`/reports/fmcsa?searchKey=${searchKey}&searchDate=${searchDate}`);

//get all states
export const getAllStates = () => API.get(`stateGetall`); 

// alertActions
export const getAllAlerts = (currentPage, searchStatus) => API.get(`/alerts?page=${currentPage}&searchStatus=${searchStatus}`);
export const storeAlert = (payload) => API.post('/createAlert', payload);

// admin action
export const loadSystemUsers = (currentPage, searchKey, searchStatus) => API.get(`/system/user-lists?page=${currentPage}&searchStatus=${searchStatus}&searchKey=${searchKey}`);
export const storeSystemUser = (payload) => API.post('/manage/system-user', payload);
export const loadSystemUser = (payload) => API.post('/createAlert', payload);
export const updateSystemUser = (payload) => API.post('/manage/system-user', payload);
export const editSystemUser = (id) => API.get(`/system-user/${id}`);

// admin companies
export const createCompany = (payload) => API.post('system/create-company', payload);

// subscriptions apis
export const getAllTransactions = (formData) => API.post('getAllSubcriptions', formData);
export const getSubscription = () => API.post('/getMinPlan');
export const storeSubscription = (formData) => API.post('/updatePaymentMethod', formData);
export const editSubscription = (id) => API.get(`/api/admin/subscription-plans/details/${id}`);
export const updateSubscription = (userData) => API.post(`/updatePlan`, userData);
export const updateSubscriptionStatus = (userData) => API.post('/upgradePlan', userData);
export const deletePaymentMethod = (formData) => API.post('/deletePaymentMethod',formData);
export const cancelSubscription = (formData) => API.post('/cancelSubscription', formData);
export const getPaymentMethods = (formData) => API.post('/getAllPaymentMethods', formData);
export const getUpgradedPlan = (formData) => API.post('/getNextPlan', formData);
export const addDefaultPayment = (userData) => API.post('/defaultPaymentMethods', userData);

//resources api

export const getResources = () => API.get('/getResourceList');
