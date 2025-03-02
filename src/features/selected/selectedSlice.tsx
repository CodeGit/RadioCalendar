import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store.ts';
import { Programme } from "../../../types/types.ts";

export interface SelectedState {
    selected: Programme[]
}

const initialState: SelectedState = {
    selected: []
}

export const selectedSlice = createSlice({
    name: 'selected',
    initialState,
    reducers: {
        changeSelected: (state, action) => {
            state.selected = action.payload;
        }
    }
});
