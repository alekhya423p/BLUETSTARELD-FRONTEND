import * as actionTypes from '../constants/actionTypes';
import * as api from '../api';
import { toast } from "react-toastify";
import setAuthToken from "../utility/setAuthToken";
import json_decode from 'jwt-decode';
/**
 * function for user login
 * @param {object} userData receive from component
 * @param {object} history receive from component
 * @param {function} login user login function
 */
export const login = (user, navigate) => async dispatch => {
    try {
        dispatch({ type: actionTypes.LOGIN_REQUEST })
        const { data } = await api.signIn(user);
        
        const currentUser = json_decode(data.token);
        dispatch({ type: actionTypes.LOGIN_SUCCESS, payload: currentUser })
        // set localstorage profile
        dispatch(setCurrentUser(currentUser, data.token))
        // const redirectUrl = localStorage.getItem('redirectUrl');
        // Set token to Auth header
        setAuthToken(data.token);
        // redirect url system-super-admin
        if (currentUser.user.userType === 'system-administrator' || currentUser.user.userType === 'system-technician' || currentUser.user.userType === 'system-super-admin')  navigate('/companies')
        else if (currentUser.landingPage)  navigate(currentUser.landingPage)
        else navigate('/dashboard')

    } catch (err) {
        dispatch({ type: actionTypes.LOGIN_FAIL, payload: err.response.data.message })
        toast.error(err.response.data.message);
        if (err.response.data?.data?.isVerify === false) {
            navigate('/verify/email')
        }
    }
}

/**
* function for user login
* @param {*} data User data 
* @description get user infromation
* @param {function} loadUser loadUser function
*/
export const loadUserProfile = () => async dispatch => {
    try {
        dispatch({ type: actionTypes.LOAD_PROFILE_REQUEST })
        const { data } = await api.getUserProfile();
        dispatch({ type: actionTypes.LOAD_PROFILE_SUCCESS, payload: data })

    } catch (err) {
       
        dispatch({ type: actionTypes.LOAD_PROFILE_FAIL, payload: err.response.data })
    }
}
/**
* function for loadUserProfile
* @param {*} data User data 
* @description get user infromation
* @param {function} loadUserProfile loadUserProfile function
*/
export const loadUser = () => async dispatch => {
    try {
        dispatch({ type: actionTypes.LOAD_USER_REQUEST })
        // const currentUser = localStorage.getItem('token') ? json_decode(localStorage.getItem('token')).user : {};
        const currentUser = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('userInfo')) : {};
        dispatch({ type: actionTypes.LOAD_USER_SUCCESS, payload: currentUser })

    } catch (err) {
    
        dispatch({ type: actionTypes.LOAD_USER_FAIL, payload: err.response.data })
    }
}
/**
* function for user register
* @param {*} data form data and navigate
* @description user register
* @param {function} register register function
*/
export const register = (formData, navigate) => async dispatch => {
    try {
        dispatch({ type: actionTypes.REGISTER_REQUEST })
        const { data } = await api.signUp(formData);
        toast.success(data.message);
        dispatch({ type: actionTypes.REGISTER_SUCCESS, payload: data })
        navigate('/register-success')

    } catch (err) {
       
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.REGISTER_FAIL, payload: err.response.data.message })
    }
}

/**
* function for verify email
* @param {*} data verification code , history and id 
* @description user email verify 
* @param {function} verifyEmail verifyEmail function
*/
export const verifyEmail = (payload, navigate) => async dispatch => {
    try {
        dispatch({ type: actionTypes.VERIFY_EMAIL_REQUEST })
        const { data } = await api.emailVerify(payload)
        dispatch({ type: actionTypes.VERIFY_EMAIL_SUCCESS, payload: data.message })
        toast.success(data.message);
        navigate('/login')

    } catch (err) {
    
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.VERIFY_EMAIL_FAIL, payload: err.response.data.message })
        navigate('/login');
    }
}

/**
* function for get user
* @param {*} data User id 
* @description get user by id
* @param {function} getUser getUser function
*/
export const getUser = id => async dispatch => {
    try {
        dispatch({ type: actionTypes.GET_USER_REQUEST })
        const { data } = await api.getUser(id)
        dispatch({ type: actionTypes.GET_USER_SUCCESS, payload: data })

    } catch (err) {
    
        dispatch({ type: actionTypes.GET_USER_FAIL, payload: err.response.data.message })
    }
}
/**
* function for resend Verification Email
* @param {*} data User id
* @description resend verification email
* @param {function} resendVerificationEmail resendVerificationEmail function
*/
export const resendVerificationEmail = (email, navigate) => async dispatch => {
    try {

        dispatch({ type: actionTypes.RESEND_VERIFY_EMAIL_REQUEST })
        const { data } = await api.resendEmailVerification(email)
        dispatch({ type: actionTypes.RESEND_VERIFY_EMAIL_SUCCESS, payload: data })
        toast.success(data.message);
        navigate('/login');
    } catch (err) {
        
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.RESEND_VERIFY_EMAIL_FAIL, payload: err.response.data.message })
    }
}

/**
* function for user logout
* @description user logout
* @param {function} logout logout function
*/
export const logout = navigate => async dispatch => {
    try {
        //await api.logOut();
        window.localStorage.clear();
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        dispatch({ type: actionTypes.LOGOUT_SUCCESS })
        toast.success('You have successfully logged out', {
            onClose: () => {
              navigate(0);
            }
        });
        navigate('/')
       
        
    } catch (err) {
        
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.LOGOUT_FAIL, payload: err.response.data.message })
    }
}

/**
* function for get user by email
* @param {*} data User email and history 
* @description get user infromation by email
* @param {function} getUserByEmail getUserByEmail function
*/
export const getUserByEmail = (email, navigate) => async dispatch => {
    try {
        dispatch({ type: actionTypes.GET_USER_BY_EMAIL_REQUEST })

        const { data } = await api.getEmailByUser(email)
        toast.success(data.message)
        dispatch({ type: actionTypes.GET_USER_BY_EMAIL_SUCCESS, payload: data })
        // navigate.push(`/verify/email/${data.user._id}`, { from: 'device detail page' })
        localStorage.setItem('forgotPassword', true)
        navigate('/login');
    } catch (err) {
        
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.GET_USER_BY_EMAIL_FAIL, payload: err.response.data.message })
    }
}

/**
* function for reset password
* @param {*} data form data and history
* @description reset password
* @param {function} resetPassword resetPassword function
*/
export const resetPassword = (formData, navigate) => async dispatch => {
    try {
        dispatch({ type: actionTypes.RESET_PASSWORD_REQUEST })
        const { data } = await api.passwordReset(formData)
        toast.success(data.message);
        dispatch({ type: actionTypes.RESET_PASSWORD_SUCCESS, payload: data })
        dispatch({ type: actionTypes.VERIFY_EMAIL_RESET })
        navigate('/login')

    } catch (err) {
       
        toast.error(err.response?.data?.message);
        dispatch({ type: actionTypes.RESET_PASSWORD_FAIL, payload: err.response?.data?.message })
    }
}

/**
* function for user update profile
* @param {*} data User data 
* @description update user infromation
* @param {function} updateProfile updateProfile function
*/
export const updateProfile = userData => async (dispatch, getState) => {
    try {
        dispatch({ type: actionTypes.UPDATE_PROFILE_REQUEST })
        const { data } = await api.updateProfile(userData)
        // dispatch({ type: actionTypes.UPDATE_PROFILE_RESET })
        dispatch({ type: actionTypes.UPDATE_PROFILE_SUCCESS, payload: data })
        // dispatch(refreshToken());
    } catch (err) {
       
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.UPDATE_PROFILE_FAIL, payload: err.response.data.message })
    }
}

/**
* function for password update
* @param {*} data User data 
* @description update password
* @param {function} updatePassword updatePassword function
*/
export const updatePassword = userData => async (dispatch, getState) => {
    try {
        dispatch({ type: actionTypes.UPDATE_PASSWORD_REQUEST })
        const { data } = await api.changePassword(userData)
        dispatch({ type: actionTypes.UPDATE_PASSWORD_SUCCESS, payload: data })

    } catch (err) {       
        toast.error(err.response.data.message);
        dispatch({ type: actionTypes.UPDATE_PASSWORD_FAIL, payload: err.response.data.message })
    }
}

/**
 * function for refresh the expire token if remember me is true
 * @method refreshToken
 */
export const refreshToken = () => async dispatch => {
    try {
        dispatch({ type: actionTypes.LOAD_TOKEN_REQUEST })
        const { data } = await api.refreshExpireToken();
        const currentUser = json_decode(data.token);
        dispatch(setCurrentUser(currentUser, data.token))
        dispatch({ type: actionTypes.LOAD_TOKEN_SUCCESS, payload: currentUser })
    } catch (err) {
     
    }
}



export const showAvatarPreview = avatarPreview => dispatch => {
    dispatch({ type: actionTypes.SHOW_AVATAR_PREVIEW_SUCCESS, payload: avatarPreview })
}


/**
* function for loadCompanyDetail
* @param {*} data CompanyDetail data 
* @description get CompanyDetail infromation
* @param {function} loadCompanyDetail loadCompanyDetail function
*/
export const activeCompany = (id, navigate) => async dispatch => {
    try {
        dispatch({ type: actionTypes.LOAD_TOKEN_REQUEST })
        const { data } = await api.activeCurrentCompany(id);
        const currentUser = json_decode(data.token);
        dispatch(setCurrentUser(currentUser, data.token))
        dispatch({ type: actionTypes.LOAD_TOKEN_SUCCESS, payload: currentUser })
        window.open('/dashboard', '_blank');
        // navigate('/dashboard')
    } catch (err) {
        dispatch({ type: actionTypes.LOAD_TOKEN_FAIL, payload: err.response.data.message })
        toast.error(err.response.data.message);
    }
}

/**
* function for user logout
* @description user logout
* @param {function} logout logout function
*/
export const setCurrentUser = (currentUser,token) => async dispatch => {
    try {
        localStorage.setItem('userInfo', JSON.stringify(currentUser));
        localStorage.setItem('token', JSON.stringify(token));
        localStorage.setItem('authorization', token);
    } catch (err) {
       
    }
}