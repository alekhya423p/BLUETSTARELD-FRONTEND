import * as actionTypes from '../constants/actionTypes';

const defaultState = {
    companies: [],
    company: {},
    companyUsers: [],
    companiesData: [],
    loading: false,
    errors: {}
}

export const companyReducers = (state = defaultState, action = {}) => {
    switch (action.type) {
        // LOAD company
        case actionTypes.LOAD_COMPANIES_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.LOAD_COMPANIES_SUCCESS:
            return {
                ...state,
                loading: false,
                companies: action.payload.data.companies,
                count: action.payload?.data?.count,
                totalRecord: action.payload?.data?.totalRecord,
            }
        case actionTypes.LOAD_COMPANIES_FAIL:
            return {
                ...state,
                error: action.payload
            }
        // LOAD company
        case actionTypes.LOAD_COMPANY_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.LOAD_COMPANY_SUCCESS:
            return {
                ...state,
                loading: false,
                company: action.payload.data,
            }
        case actionTypes.LOAD_COMPANY_FAIL:
            return {
                ...state,
                error: action.payload
            }
        //Load company users
        case actionTypes.LOAD_COMPANY_USERS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.LOAD_COMPANY_USERS_SUCCESS:
            return {
                ...state,
                loading: false,
                companyUsers: action.payload?.data?.responsible_usrs,
            }
        case actionTypes.LOAD_COMPANY_USERS_FAIL:
            return {
                ...state,
                error: action.payload
            }
        // create company 
        case actionTypes.CREATE_COMPANY_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case actionTypes.CREATE_COMPANY_SUCCESS:
            return {
                ...state,
                loading: false,
                companies: [...state.companies, action.payload.data],
                errors: {},
            }
        case actionTypes.CREATE_COMPANY_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case actionTypes.CREATE_COMPANY_RESET:
            return {
                ...state,
                error: null,
                message: null
            }
        // update company 
        case actionTypes.UPDATE_COMPANY_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case actionTypes.UPDATE_COMPANY_SUCCESS:
            return {
                ...state,
                loading: false,
                companies: state.companies.map(item => item._id === action.payload.data._id ? action.payload.data : item),
                errors: {},
            }
        case actionTypes.UPDATE_COMPANY_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case actionTypes.UPDATE_COMPANY_RESET:
            return {
                ...state,
                error: null,
                message: null
            }
        // load companies data 
        case actionTypes.LOAD_COMPANIES_DATA_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.LOAD_COMPANIES_DATA_SUCCESS:
            return {
                ...state,
                loading: false,
                companiesData: action.payload?.data,
            }
        case actionTypes.LOAD_COMPANIES_DATA_FAIL:
            return {
                ...state,
                error: action.payload
            }
        default:
            return state;
    }
}