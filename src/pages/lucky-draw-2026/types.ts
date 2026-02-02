import { Employee } from '../../common/data';

export type ViewMode = 'draw' | 'ceremony' | 'winner';

export const LOTTERY_CODE_LENGTH = 3;

export const DIGIT_CONSTRAINTS: Record<number, number[]> = {
  0: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  2: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
};

export type DigitPosition = 0 | 1 | 2;

export interface FilterState {
  digits: (number | null)[];
  remainingCandidates: Employee[];
  winner: Employee | null;
  isDeadEnd: boolean;
  history: Employee[][]; // Lưu lịch sử để rollback
}

