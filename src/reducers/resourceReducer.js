import * as actionTypes from "../constants/actionTypes";

const defaultState = {
  allResources: [],
  resouce: {},
  loading: false,
  errors: {},
};
export const resourceReducers = (state = defaultState, action = {}) => {
  switch (action.type) {
    case actionTypes.GET_RESOURCE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.GET_RESOURCE_SUCCESS:
      return {
        ...state,
        loading: false,
        allResources: action.payload?.data,
      };
    case actionTypes.GET_RESOURCE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case actionTypes.CLEAR_GET_RESOURCE:
      return {
        ...state,
        error: null,
        message: null,
      };
    default:
      return state;
  }
};
