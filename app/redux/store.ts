import { combineReducers, configureStore } from "@reduxjs/toolkit";
import dashboard from "./dashboardSlice";
import client from "./clientSlice";
import report from "./reportSlice";
import prospectus from "./prospectusSlice";

const rootReducer = combineReducers({
    dashboard,
    client,
    report,
    prospectus
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;