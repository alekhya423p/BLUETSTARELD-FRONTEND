import * as actionTypes from '../constants/actionTypes';


/**
 * function for user login
 * @param {object} action action response
 * @param {function} authReducer authReducer reducer function
 */
export const authReducer = (state = {}, action) => {
    switch (action.type) {
        case actionTypes.LOGIN_REQUEST:
        case actionTypes.LOAD_USER_REQUEST:
            return {
                loading: true
            }
        case actionTypes.LOGIN_SUCCESS:
        case actionTypes.LOAD_USER_SUCCESS:
            return {
                loading: false,
                user: action.payload.data ? action.payload.data : action.payload,
                isAuthenticated: true
            }

        case actionTypes.LOGOUT_SUCCESS:
            return {
                isAuthenticated: false,
                loading: false,
                user: null
            }

        case actionTypes.LOAD_USER_UPDATE:
            return {
                ...state,
                user: action.payload
            }

        case actionTypes.LOGIN_FAIL:
            return {
                loading: false,
                isAuthenticated: false,
                user: null,
                error: action.payload
            }

        case actionTypes.LOGOUT_FAIL:
            return {
                ...state,
                logoutError: action.payload
            }

        case actionTypes.LOGOUT_RESET:
            return {
                ...state,
                logoutError: null
            }

        case actionTypes.LOAD_USER_FAIL:
            return {
                loading: false,
                isAuthenticated: false,
                user: null,
                error: null
            }

        case actionTypes.AUTH_RESET:
            return {
                ...state,
                error: null
            }
        
          // LOAD company
          case actionTypes.LOAD_TOKEN_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.LOAD_TOKEN_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.payload,
            }
        case actionTypes.LOAD_TOKEN_FAIL:
            return {
                ...state,
                error: action.payload
            }

        default: return state
    }
}

/**
 * function for user register
 * @param {object} action action response
 * @param {function} registerReducer register reducer function
 */
export const registerReducer = (state = { error: null }, action) => {
    switch (action.type) {
        case actionTypes.REGISTER_REQUEST:
            return {
                loading: true
            }
        case actionTypes.REGISTER_SUCCESS:
            return {
                loading: false,
                user: action.payload.data ? action.payload.data : action.payload,
                message: action.payload.message,
            }
        case actionTypes.REGISTER_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case actionTypes.REGISTER_RESET:
            return {
                message: null,
                error: null
            }

        default: return state
    }
}

/**
 * function for user verify email reducer
 * @param {object} action action response
 * @param {function} verifyEmailReducer verifyEmail reducer function
 */

export const verifyEmailReducer = (state = {}, action) => {
    switch (action.type) {
        case actionTypes.VERIFY_EMAIL_REQUEST:
            return {
                loading: true
            }
        case actionTypes.VERIFY_EMAIL_SUCCESS:
            return {
                loading: false,
                message: action.payload,
                success: true
            }
        case actionTypes.VERIFY_EMAIL_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case actionTypes.VERIFY_EMAIL_RESET:
            return {
                ...state,
                message: null,
                error: null,
            }
        default: return state
    }
}

/**
 * function for user get user reducer
 * @param {object} action action response
 * @param {function} getUserReducer get user reducer function
 */
export const getUserReducer = (state = {}, action) => {
    switch (action.type) {
        case actionTypes.GET_USER_REQUEST:
            return {
                loading: true
            }
        case actionTypes.GET_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.payload.user
            }

        case actionTypes.GET_USER_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        default: return state
    }
}

/**
 * function for get user by email reducer
 * @param {object} action action response
 * @param {function} getUserByEmailReducer get user by email reducer function
 */
export const getUserByEmailReducer = (state = {}, action) => {
    switch (action.type) {
        case actionTypes.GET_USER_BY_EMAIL_REQUEST:
            return {
                loading: true
            }

        case actionTypes.GET_USER_BY_EMAIL_SUCCESS:
            return {
                loading: false,
                user: null,
                message: action.payload.message
            }

        case actionTypes.GET_USER_BY_EMAIL_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case actionTypes.GET_USER_BY_EMAIL_RESET:
            return {
                error: null
            }

        default: return state
    }
}

/**
 * function for resend user verify email reducer
 * @param {object} action action response
 * @param {function} resendverifyEmailReducer resend verifyEmail reducer function
 */
export const resendVerifyEmailReducer = (state = {}, action) => {
    switch (action.type) {
        case actionTypes.RESEND_VERIFY_EMAIL_REQUEST:
            return {
                loading: true
            }
        case actionTypes.RESEND_VERIFY_EMAIL_SUCCESS:
            return {
                loading: false,
                message: action.payload.message
            }
        case actionTypes.RESEND_VERIFY_EMAIL_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case actionTypes.RESEND_VERIFY_EMAIL_RESET:
            return {
                message: null,
                error: null
            }
        default: return state
    }
}

/**
 * function for reset user password reducer
 * @param {object} action action response
 * @param {function} resetPasswordReducer resetPassword reducer function
 */

export const resetPasswordReducer = (state = {}, action) => {
    switch (action.type) {
        case actionTypes.RESET_PASSWORD_REQUEST:
            return {
                loading: true
            }
        case actionTypes.RESET_PASSWORD_SUCCESS:
            return {
                loading: false,
                message: action.payload.message
            }
        case actionTypes.RESET_PASSWORD_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case actionTypes.RESET_PASSWORD_RESET:
            return {
                message: null,
                error: null
            }
        default: return state
    }
}

/**
 * function for update profile reducer
 * @param {object} action action response
 * @param {function} updateProfileReducer updare profile reducer function
 */
export const updateProfileReducer = (state = {}, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_PROFILE_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.UPDATE_PROFILE_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.payload.data ? action.payload.data : action.payload,
                message: action.payload.message
            }
        case actionTypes.UPDATE_PROFILE_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case actionTypes.UPDATE_PROFILE_RESET:
            return {
                ...state,
                error: null,
                message: null
            }
            
        case actionTypes.LOAD_PROFILE_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.LOAD_PROFILE_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.payload.data ? action.payload.data : action.payload,
                isAuthenticated: true
            }
        case actionTypes.LOAD_PROFILE_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case actionTypes.LOAD_PROFILE_RESET:
            return {
                ...state,
                error: null,
                message: null
            }
        default: return state
    }
}

/**
 * function for user verify email reducer
 * @param {object} action action response
 * @param {function} updatePassword update password reducer function
 */
export const updatePassword = (state = {}, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_PASSWORD_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.UPDATE_PASSWORD_SUCCESS:
            return {
                ...state,
                loading: false,
                message: action.payload.message
            }
        case actionTypes.UPDATE_PASSWORD_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case actionTypes.UPDATE_PASSWORD_RESET: {
            return {
                ...state,
                error: null,
                message: null
            }
        }
        default: return state
    }
}


export const avatarPreviewReducer = (state = {}, action) => {
    switch (action.type) {
        case actionTypes.SHOW_AVATAR_PREVIEW_SUCCESS:
            return {
                avatarPreview: action.payload
            }
        default: return state
    }
}