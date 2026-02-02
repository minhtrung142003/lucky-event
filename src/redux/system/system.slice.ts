import { createSlice } from '@reduxjs/toolkit';
import { Mode } from '../../common/enums/mode.enum';
import { ACTION_SYSTEM } from '..';
import { GlobalSystemState } from './system.interface';

const initialState: GlobalSystemState = {
  mode: Mode.DARK,
  count: 1,
  winners: [],
};

export const slice = createSlice({
  // Name Slice
  name: 'system',
  initialState: { ...initialState },
  reducers: {},

  extraReducers: builder => {
    // ChangeMode
    builder.addCase(ACTION_SYSTEM.changeMode.fulfilled, (state, action) => {
      state.mode = action.payload;
    });

    // ChangeCountAndWinners
    builder.addCase(ACTION_SYSTEM.changeCountAndWinners.fulfilled, (state, action) => {
      state.count = action.payload.count;
      state.winners = action.payload.winners;
    });

    // ResetCountAndWinners
    builder.addCase(ACTION_SYSTEM.resetCountAndWinners.fulfilled, (state, action) => {
      state.count = 1;
      state.winners = [];
    });
  },
});

export const reducerSystem = slice.reducer;
