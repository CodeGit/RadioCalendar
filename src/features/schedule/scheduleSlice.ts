import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store.ts';
import { Station, DaySchedule } from "../../../types/types.ts";

export interface ScheduleState {
    timestamp: number,
    station: Station | undefined,
    weekMode: boolean,
    schedule: DaySchedule[],
}

const initialState: ScheduleState = {
    timestamp: new Date().getTime(),
    station: undefined,
    weekMode: true,
    schedule: [],
}

export const scheduleSlice = createSlice({
    name: 'schedule',
    initialState,
    reducers: {
        changeDate: (state, action) => {
            state.timestamp = action.payload;
        },
        changeStation: (state, action) => {
            state.station = action.payload;
        },
        toggleScheduleMode: (state) => {
            state.weekMode = !state.weekMode;
        },
        changeSchedule: (state, action) => {
            state.schedule = action.payload;
        }
    }
});

export const { changeDate, changeStation, toggleScheduleMode, changeSchedule } = scheduleSlice.actions;
export default scheduleSlice.reducer;
export const selectDate = (state: RootState) => state.schedule.timestamp;
export const selectStation = (state: RootState) => state.schedule.station;
export const fetchByWeek = (state: RootState) => state.schedule.weekMode; 
export const selectSchedule = (state: RootState) => state.schedule.schedule;
