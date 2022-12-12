import { combineReducers } from "@reduxjs/toolkit";
import {authReducer, getUserByEmailReducer, 
        verifyEmailReducer,
        getUserReducer,
        resendVerifyEmailReducer,
        resetPasswordReducer,
        registerReducer,
        updatePassword,
        avatarPreviewReducer,
        updateProfileReducer,
    } from './authReducers'
import { driverReducers } from './driverReducers'
import { vehicleReducers } from './vehicleReducers'
import { userReducers } from './userReducers'
import { eldDeviceReducers } from './eldDeviceReducers'
import { companyReducers } from "./companyReducers";
import { logReducers } from "./logReducers";
import { driverHosReducers } from "./driverhosReducers";
import { assetReducers } from "./assetReducer";
import { dashboardReducers } from "./dashboardReducers";
import { recordsReducers } from "./recordsReducer";
import { alertReducers } from "./alertReducer";
import { systemUserReducers } from "./systemUserReducers";
import {subscriptionReducers} from './subscriptionReducers';
import { resourceReducers} from './resourceReducer';
import { locationsharingReducers } from "./locationsharingReducer";

export default combineReducers({
    auth: authReducer,
    register: registerReducer,
    getUserByEmail: getUserByEmailReducer,
    verifyEmail: verifyEmailReducer,
    updatePassword: updatePassword,
    resendVerifyEmail: resendVerifyEmailReducer,
    resetPassword: resetPasswordReducer,
    getUser: getUserReducer,
    updateProfile: updateProfileReducer,
    avatarPreview: avatarPreviewReducer,
    drivers: driverReducers,
    logs: logReducers,
    driverHos: driverHosReducers,
    assets: assetReducers,
    vehicles: vehicleReducers,
    user: userReducers,
    elddevice: eldDeviceReducers,
    companyDetail: companyReducers,
    dashboard: dashboardReducers,
    reports: recordsReducers,
    alerts: alertReducers,
    systemUsers: systemUserReducers,
    subscriptionStore: subscriptionReducers,
    resources: resourceReducers,
    locationsharing: locationsharingReducers
});