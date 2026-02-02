import { createAsyncThunk } from '@reduxjs/toolkit';
import { Mode } from '../../common/enums/mode.enum';
import { Winner } from '../../pages/lucky-draw/lucky-draw.page';

export const changeMode = createAsyncThunk('CHANGE_MODE', (currentMode: Mode) => {
  return currentMode === Mode.LIGHT ? Mode.DARK : Mode.LIGHT;
});

export const changeCountAndWinners = createAsyncThunk('CHANGE_COUNT_AND_WINNER', (params: { count: number; winners: Winner[] }) => {
  return params;
});

export const resetCountAndWinners = createAsyncThunk('RESET_COUNT_AND_WINNER', () => {
  return;
});
