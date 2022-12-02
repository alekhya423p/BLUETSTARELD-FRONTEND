import { configureStore } from "@reduxjs/toolkit";
import loginReducer from '../features/login/loginSlice';
import registerReducer from '../features/register/registerSlice';
import logsReducer from '../features/logs/logsSlice';
import driverReducer from '../features/drivers/driversSlice';
import vehiclesSlice from "../features/vehicles/vehiclesSlice";
import  eldSlice  from "../features/eld/eldsSlice";

export const store = configureStore({
    reducer: {
        auth: loginReducer,
        register: registerReducer,
        logs: logsReducer,
        drivers: driverReducer,
        vehicles: vehiclesSlice,
        elds: eldSlice
    }
})