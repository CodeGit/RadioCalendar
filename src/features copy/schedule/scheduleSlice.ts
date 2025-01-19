import { createSlice, AsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store.ts';

export interface ScheduleState {
    timestamp: number
}

const initialState: ScheduleState = {
    timestamp: new Date().getTime(),
}

export const scheduleSlice = createSlice({
    name: 'selectedDate',
    initialState,
    reducers: {
        changeDate: (state, action: PayloadAction<number>) => {
            state.timestamp = action.payload;
        }
    }
});

export const { changeDate } = scheduleSlice.actions;
export default scheduleSlice.reducer;
export const selectDate = (state: RootState) => state.selectedDate.timestamp;