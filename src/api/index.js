import axios from 'axios';
import { toast } from 'react-toastify';
import {CONFIG} from '../utility/config'

const API = axios.create({ baseURL: CONFIG.SERVER_URL });
// const API = axios.create({ baseURL: CONFIG.LOCAL_URL });

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
export const signIn = (formData) => API.post('/user/login', formData);
export const signUp = (formData) => API.post('/user/register', formData);
export const logOut = () => API.get('/logout');
export const changePassword = (updatedForm) => API.post('/user/changePasswordUser', updatedForm);
export const passwordReset = (payload) => API.post('/user/reset-password', payload);
export const resendEmailVerification = (email) => API.post(`api/resend/verification/${email}`);
export const emailVerify = (payload) => API.post('/verify', payload);
export const getEmailByUser = (email) => API.post(`/forgotPasswordUser`, email);
export const refreshExpireToken = () => API.get(`user/refreshSystemUser`);
export const activeCurrentCompany = (id) => API.get(`/user/refresh-token/${id}`)
// current user
export const getUserProfile = () => API.get('/user/getProfileUser');
//export const loadCurrentUser = () => API.get('/api/user/profile');
export const getUser = (id) => API.get(`/api/user/get/${id}`);
export const updateProfile = (updateForm) => API.post('/user/updateCompanyUser', updateForm);
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
export const getAllDriver = (currentPage, searchKey, searchStatus) => API.get(`/driver/getDriverList?page=${currentPage}&searchKey=${searchKey}&searchStatus=${searchStatus}`);
export const editDriver = (id) => API.get(`/driver/getDriver/${id}`);
export const storeDriver = (payload) => API.post('/driver/createDriver', payload);
export const updateDriver = (payload) => API.post('/driver/editDriver', payload);
export const deactivateDriver = (payload) => API.post('/driver/deactivate', payload)
export const deleteDriver = (payload) => API.post('/api/admin/manage/payload', payload);
export const getHOSRulesAPI = () => API.get('/hosMaster/hosGetAll');
export const assignDriver = (payload) => API.post('/eldEvents/assignDriver', payload);
export const removeBulk = (payload) => API.post('/removeBulk', payload); // not being used in frontend

// Vehicles API
export const getAllVehicle = (currentPage, searchKey, searchStatus) => API.get(`vehicle/getAllVehicle?page=${currentPage}&searchKey=${searchKey}&searchStatus=${searchStatus}`);
export const editVehicle = (id) => API.get(`vehicle/getVehicleInfo/${id}`);
export const storeVehicle = (payload) => API.post('/vehicle/create', payload);
export const updateVehicle = (payload) => API.post('/vehicle/edit', payload);
export const deleteVehicle = (payload) => API.post('removeVehicle', payload);
export const getVehicleMasterList = () => API.get('/vehicle/vehicleMaster');
export const deactivateVehicle = (payload) => API.post('/vehicle/deactivate' , payload)
export const unAssignEld = (payload) => API.post('/eld/unassignEld', payload)
export const getVehicleLocation = (vehicleId, searchDate) => API.get(`/dashboard/locationHistory?vehicleId=${vehicleId}&searchDate=${searchDate}`)
export const activeVehicleList = () => API.get('/vehicle/activeVehicleList');
export const getPdfLogs = (logDriverId, logDate) => API.get(`/driver-hos/reports/pdfLogs?logDriverId=${logDriverId}&logDate=${logDate}`);
export const downloadPdfLogs = (driverId, logDate) => API.get(`/download/pdfReports?driverId=${driverId}&logDate=${logDate}`); 
export const downloadPdfRangeLogs = (logDriverId, start, end) => API.get(`/driver-hos/reports/pdfLogs?logDriverId=${logDriverId}&start=${start}&end=${end}`)

// ELD Device API
export const getAllELDDevice = (currentPage, searchKey, searchStatus) => API.get(`/eld/getAll?page=${currentPage}&searchKey=${searchKey}&searchStatus=${searchStatus}`);
export const editELDDevice = (id) => API.get(`/eld/get/${id}`);
export const storeELDDevice = (payload) => API.post('/eld/create', payload);
export const updateELDDevice = (payload) => API.post('/eld/edit', payload);
export const deactivateELDDevice = (payload) => API.post('/eld/deactivate', payload);
export const removeELDDevice = (payload) => API.put('/eld/delete', payload);
export const deleteELDDevice = (payload) => API.post('/removeELD', payload);
export const getELDMasterList = () => API.get('/eld/eldMaster');

// Portal User API
export const getAllUser = (currentPage, searchKey, searchStatus) => API.get(`/portalUser/getPortalUsersAll?page=${currentPage}&searchKey=${searchKey}&searchStatus=${searchStatus}`);
export const editUser = (id) => API.get(`/portalUser/getPortalUser/${id}`);
export const storeUser = (payload) => API.post('/portalUser/createPortalUser', payload);
export const updateUser = (payload) => API.post('/portalUser/editPortalUser', payload);
export const deactivateUser = (id) => API.put(`/portalUser/deactivatePortalUser/${id}`);
export const deleteUser = (payload) => API.post('/deletePortelUser', payload);

// Company API
export const editCompany = (id) => API.get(`/company/getCompanyUser`);
export const getCompanyUsers = () => API.get(`/driver-hos/getResponsibleUsers`);
export const updateCompany = (payload) => API.post('/company/editCompany', payload);
export const getCompanies = (searchKey, searchStatus, searchCompany) => API.get(`/company/companiesList?searchStatus=${searchStatus}&searchKey=${searchKey}&searchCompany=${searchCompany}`);
export const deactivateCompany = (id) => API.put(`/company/deactivate/${id}`);

// Logs API
export const getAllLogs = (currentPage, searchKey, searchDate, mannerErrors, violationStatus) => API.get(`logs/getActiveDrivers?page=${currentPage}&searchKey=${searchKey}&searchDate=${searchDate}&mannerErrors=${mannerErrors}&violationStatus=${violationStatus}`);
// export const getAllLogs = (currentPage, searchKey, searchDate, violationStatus, mannererrors) => API.get(`getActiveDrivers`);
export const loadLog = (driverID, currentPage, searchDate, mannerErrors, violationStatus) => API.get(`/logs/getLogs?driverId=${driverID}&page=${currentPage}&searchDate=${searchDate}&mannerErrors=${mannerErrors}&violationStatus=${violationStatus}`)
export const getEventCode = () => API.get(`driver-hos/getEventCode`)
export const getDriverLog = (driverID, logDate) => API.get(`driver-hos/getLogDetail?logDriverId=${driverID}&logDate=${logDate}`);
export const getVehicleLog = (vehicleId, searchDate) => API.get(`vehicleLogs/${vehicleId}?searchDate=${searchDate}`);
export const storeEvent = (payload) => API.post('/driver-hos/addEvent', payload);
export const updateEvent = (driverId, date) => API.post(`/logs/processed-events?driverId=${driverId}&date=${date}`);
export const updateDriverLogApi = (payload) => API.post('/logs/edit-formtechnician', payload);
export const removeViolations = (logId) => API.get(`/logs/remove-violation/${logId}`);
export const storeEventByTechnician = (payload) => API.post('/logs/addEvent-technician', payload);
export const updateEventByTechnician = (payload) => API.post('/logs/editEvent-technician', payload);
export const updateBulkEventByTechnician = (payload) => API.post('/logs/editBulk-Technician', payload);
export const reassignEventByTechnician = (payload) => API.post('/logs/reassignEvent-technician', payload);
export const eventDestroy = (payload) => API.post('/logs/removeEvent-technician', payload); 
// export const getLogPdf = (driverID, logDate) => API.get(`/reports/pdflogs?logDriverId=${driverID}&logDate=${logDate}`);

// Driver HOS API
export const getAllDriverHos = (currentPage, searchKey, eldStatus, dutyStatus, violationStatus) => API.get(`driver-hos/getHosList?page=${currentPage}&searchKey=${searchKey}&eldStatus=${eldStatus}&dutyStatus=${dutyStatus}&violationStatus=${violationStatus}`);
export const getDriverMasterList = () => API.get('/driver-hos/driverDetails');
export const transferData = (payload) => API.post('/dev/output-csv/generate', payload);

// Assets API
export const getAllAssets = (currentPage, searchKey) => API.get(`assets/getAssets?page=${currentPage}&searchKey=${searchKey}`);
export const getAssetDetail = (vehicleId) => API.get(`/assets/assetDetail/${vehicleId}`);

// Eld Events API
export const getEventVehicle = (currentPage, searchKey) => API.get(`eldEvents/getAllEvents?page=${currentPage}&searchKey=${searchKey}`)
export const getUnidentifiedEvents = (vehicleId, currentPage, searchDate) => API.get(`eldEvents/unidentifiedEvents?vehicleId=${vehicleId}&page=${currentPage}&searchDate=${searchDate}`)

//Dashboard Count
export const getDashboardCounts = () => API.get(`/dashboard/getCounts`);
export const getDashboard = (truckStatus, dutyStatus, order, searchKey) => API.get(`/dashboard/getStatus?truckStatus=${truckStatus}&dutyStatus=${dutyStatus}&orderBy=${order}&searchKey=${searchKey}`)

//reports api
export const getiftaReports = (currentPage) => API.get(`/ifta/getReports?page=${currentPage}`);
export const getReportsDetails = (reportId, vehicleNumber) => API.get(`/ifta/reports/details?reportId=${reportId}&searchKey=${vehicleNumber}`);
export const getReportsByVehicle = (reportId, vehicleId, searchKey) => API.get(`ifta/getReport/${reportId}/vehicle/${vehicleId}?searchKey=${searchKey}`); 
export const createReport = (payload) => API.post(`/ifta/createReport`, payload);
export const getFmcsaRecords = (searchKey, searchDate) => API.get(`fmcsa/getReports?searchKey=${searchKey}&searchDate=${searchDate}`);

//get all states
export const getAllStates = () => API.get(`/hosMaster/stateGetAll`); 

// alertActions
export const getAllAlerts = (currentPage, searchStatus) => API.get(`/alerts?page=${currentPage}&searchStatus=${searchStatus}`);
export const storeAlert = (payload) => API.post('/createAlert', payload);

// admin action
export const loadSystemUsers = (currentPage, searchKey, searchStatus) => API.get(`/user/getSystemUsers?page=${currentPage}&searchStatus=${searchStatus}&searchKey=${searchKey}`);
export const storeSystemUser = (payload) => API.post('/user/manage/system-user', payload);
export const loadSystemUser = (payload) => API.post('/createAlert', payload);
export const updateSystemUser = (payload) => API.post('/user/manage/system-user', payload);
export const editSystemUser = (id) => API.get(`/user/system-user/${id}`);

// admin companies
export const createCompany = (payload) => API.post('company/createCompanyBySystem', payload);
export const getCompaniesData = () => API.get('fmcsa/getFMCSATransferLogs');

// subscriptions apis
export const getAllTransactions = (formData) => API.post('/billing/getAllSubscription', formData);
export const getSubscription = () => API.get('/billing/getMinPlan');
export const storeSubscription = (formData) => API.post('/billing/updatePaymentMethod', formData);
export const editSubscription = (id) => API.get(`/api/admin/subscription-plans/details/${id}`);
export const updateSubscription = (userData) => API.post(`/billing/updatePlan`, userData);
export const updateSubscriptionStatus = (userData) => API.post('/billing/upgrade', userData);
export const deletePaymentMethod = (formData) => API.post('/billing/deletePaymentMethod',formData);
export const cancelSubscription = (formData) => API.post('/billing/cancelSubscription', formData);
export const getPaymentMethods = (formData) => API.post('/billing/getAllPaymentMethods', formData);
export const getUpgradedPlan = (formData) => API.post('/billing/getNextPlan', formData);
export const addDefaultPayment = (userData) => API.post('/billing/defaultPaymentMethods', userData);

//resources api

export const getResources = () => API.get('/resources/getResourceList');

// Location sharing apis

export const createShareLocation = (dataValue) =>API.post('share-location/createShareLocation',dataValue)
export const expireLocationUrl = (driverId , tokenId) =>API.put(`share-location/deactive?driverId=${driverId}&tokenId=${tokenId}`)
export const getShareLocation = (tokenId) => API.get(`/share-location/getShareLocation?tokenId=${tokenId}`);


