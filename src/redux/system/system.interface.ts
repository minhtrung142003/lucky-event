import { Mode } from '../../common/enums/mode.enum';
import { Winner } from '../../pages/lucky-draw/lucky-draw.page';

export interface GlobalSystemState {
  mode: Mode;
  count: number;
  winners: Winner[];
}
