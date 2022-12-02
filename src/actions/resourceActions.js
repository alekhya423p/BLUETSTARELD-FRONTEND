import * as actionTypes from "../constants/actionTypes";
import * as api from "../api";
/**
* function for get resources
* @param {*} data resource id
* @description get resource by id
* @param {function} getResources getResources function
*/
export const getResources = () => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.GET_RESOURCE_REQUEST });
    const { data } = await api.getResources();
    dispatch({ type: actionTypes.GET_RESOURCE_SUCCESS, payload: data });
  } catch (err) {
    // console.log(err);
    dispatch({ type: actionTypes.GET_RESOURCE_FAIL, payload: err.response.data.message });
  }
};
