import type { Action, ThunkAction } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import scheduleSliceReducer from './features/schedule/scheduleSlice.ts'
import { stationApi } from "./features/api/apiSlice.ts";

export const store = configureStore({
    reducer: {
        schedule: scheduleSliceReducer,
        [stationApi.reducerPath]: stationApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(stationApi.middleware),
});

setupListeners(store.dispatch);

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"]
