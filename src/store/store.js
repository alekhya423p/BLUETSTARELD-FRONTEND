import { createStore, applyMiddleware } from '@reduxjs/toolkit';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';  
import rootReducers from '../reducers';


const initialState = {};
const middlewares = [thunk];

export const store = createStore(
    rootReducers,
    initialState,
    composeWithDevTools(applyMiddleware(...middlewares))
);
