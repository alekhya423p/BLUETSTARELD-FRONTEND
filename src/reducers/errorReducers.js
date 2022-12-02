import { ERROR } from '../constants/actionTypes';

const errorReducer = (state = { error: null }, action) => {

    switch (action.type) {
        case ERROR:
            return {...state, error: action?.data?.error }
            break;
        default:
            return state;
    }
}

export default errorReducer;
