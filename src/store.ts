import type { Action, ThunkAction } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import scheduleSliceReducer from './features/schedule/scheduleSlice.ts'
import { radioApi } from "./features/api/apiSlice.ts";

export const store = configureStore({
    reducer: {
        schedule: scheduleSliceReducer,
        [radioApi.reducerPath]: radioApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(radioApi.middleware),
});

setupListeners(store.dispatch);

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"]
