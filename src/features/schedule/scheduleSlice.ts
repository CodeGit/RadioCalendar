import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store.ts';
import { Station } from "../../../types/types.ts";

export interface ScheduleState {
    timestamp: number,
    station: Station | undefined,
    weekMode: boolean
}

const initialState: ScheduleState = {
    timestamp: new Date().getTime(),
    station: undefined,
    weekMode: true,
}

export const scheduleSlice = createSlice({
    name: 'schedule',
    initialState,
    reducers: {
        changeDate: (state, action: PayloadAction<number>) => {
            state.timestamp = action.payload;
        },
        changeStation: (state, action: PayloadAction<Station>) => {
            state.station = action.payload;
        },
        toggleScheduleMode: (state) => {
            state.weekMode = !state.weekMode;
        }
    }
});

export const { changeDate, changeStation, toggleScheduleMode } = scheduleSlice.actions;
export default scheduleSlice.reducer;
export const selectDate = (state: RootState) => state.schedule.timestamp;
export const selectStation = (state: RootState) => state.schedule.station;
export const fetchByWeek = (state: RootState) => state.schedule.weekMode;
