/**
 * Game Control Area - Simplified version using LuckyDrawContext
 *
 * Handles digit input for employee code on Control Page.
 */

import React from 'react';
import { Box, Typography, Paper, styled, alpha, Button, Stack, Divider } from '@mui/material';
import { useLuckyDraw } from '../../../context/lucky-draw.context';
import { DIGIT_CONSTRAINTS, LOTTERY_CODE_LENGTH } from '../../lucky-draw-2026/types';
import { employees, prizes2026 } from '../../../common/data';

// Styled Components
const PrizeButton = styled(Button, {
  shouldForwardProp: prop => prop !== 'isActive' && prop !== 'isCompleted',
})<{ isActive?: boolean; isCompleted?: boolean }>(({ isActive, isCompleted }) => ({
  minWidth: 80,
  padding: '6px 12px',
  borderRadius: 10,
  fontWeight: 700,
  textTransform: 'none',
  fontSize: '0.75rem',
  color: isCompleted ? '#10b981' : isActive ? '#fff' : '#94a3b8',
  background: isActive ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : isCompleted ? 'rgba(16, 185, 129, 0.1)' : 'rgba(30, 41, 59, 0.4)',
  border: isActive ? '2px solid #f59e0b' : isCompleted ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
  transition: 'all 0.2s ease',
  whiteSpace: 'nowrap',
  '&:hover': {
    transform: 'scale(1.05)',
    background: isActive ? 'linear-gradient(135deg, #d97706, #dc2626)' : 'rgba(51, 65, 85, 0.8)',
  },
}));

const GlassCard = styled(Paper)(({ theme }) => ({
  background: alpha('#1e293b', 0.85),
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '24px',
  padding: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem',
  fontWeight: 700,
  color: '#f1f5f9',
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '&::before': {
    content: '""',
    display: 'block',
    width: '4px',
    height: '24px',
    background: 'linear-gradient(to bottom, #10b981, #06b6d4)',
    borderRadius: '2px',
  },
}));

const DigitBox = styled(Box, {
  shouldForwardProp: prop => prop !== 'isActive',
})<{ isActive?: boolean }>(({ isActive }) => ({
  width: 100,
  height: 120,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 16,
  fontSize: 56,
  fontWeight: 700,
  fontFamily: 'Montserrat, sans-serif',
  color: '#10b981',
  background: isActive ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))' : 'rgba(15, 23, 42, 0.6)',
  border: isActive ? '3px solid #10b981' : '2px solid #475569',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  boxShadow: isActive ? '0 0 20px rgba(16, 185, 129, 0.4)' : 'none',
  '&:hover': {
    transform: 'scale(1.05)',
    borderColor: '#10b981',
  },
}));

const NumberButton = styled(Button, {
  shouldForwardProp: prop => prop !== 'isDisabled',
})<{ isDisabled?: boolean }>(({ isDisabled }) => ({
  minWidth: 64,
  height: 64,
  borderRadius: 16,
  fontSize: 28,
  fontWeight: 700,
  fontFamily: 'Montserrat, sans-serif',
  color: isDisabled ? '#475569' : '#fff',
  background: isDisabled ? 'rgba(30, 41, 59, 0.5)' : 'linear-gradient(135deg, #10b981, #06b6d4)',
  border: 'none',
  cursor: isDisabled ? 'not-allowed' : 'pointer',
  transition: 'all 0.2s ease',
  boxShadow: isDisabled ? 'none' : '0 4px 15px rgba(16, 185, 129, 0.4)',
  '&:hover': {
    transform: isDisabled ? 'none' : 'scale(1.1)',
    background: isDisabled ? 'rgba(30, 41, 59, 0.5)' : 'linear-gradient(135deg, #059669, #0891b2)',
  },
  '&:active': {
    transform: isDisabled ? 'none' : 'scale(0.95)',
  },
}));

const ActionButton = styled(Button)(() => ({
  borderRadius: 12,
  padding: '12px 24px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1rem',
}));

interface GameControlAreaNewProps {
  onWinnerConfirmed?: (employeeCode: string, employeeName: string) => void;
}

export const GameControlAreaNew: React.FC<GameControlAreaNewProps> = ({ onWinnerConfirmed }) => {
  const { state, setDigit, undoDigit, resetDigits, confirmWinner, setPrize } = useLuckyDraw();
  const { digits, activePosition, matchedEmployee, isNotFound, currentPrizeId, winners } = state;

  const sortedPrizes = React.useMemo(() => [...prizes2026].sort((a, b) => a.order - b.order), []);

  const getWinnerCount = React.useCallback(
    (prizeId: string) => {
      return winners.filter(w => w.prizeId === prizeId && w.status !== 'absent').length;
    },
    [winners]
  );

  // Get allowed numbers for current position (all 0-9 for 3-digit lottery code)
  const getAllowedNumbers = (position: number): number[] => {
    return DIGIT_CONSTRAINTS[position] || [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  };

  const handleDigitBoxClick = (_position: number) => {
    // All positions are now inputtable
  };

  const handleNumberClick = (num: number) => {
    const allowedNumbers = getAllowedNumbers(activePosition);
    if (!allowedNumbers.includes(num)) return;

    // Set the digit - context handles all state updates
    setDigit(activePosition, num);

    // Check if we completed the code (all 3 digits filled)
    const nextDigits = [...digits];
    nextDigits[activePosition] = num;
    const lastPosition = LOTTERY_CODE_LENGTH - 1;

    if (activePosition === lastPosition) {
      const lotteryCode = nextDigits.join('');
      const employee = employees.find(e => e.lotteryCode === lotteryCode);

      if (employee && onWinnerConfirmed) {
        // Auto-confirm when last digit is valid
        onWinnerConfirmed(employee.code, employee.name);
      }
    }
  };

  const handleUndo = () => undoDigit();
  const handleReset = () => resetDigits();
  const handleConfirm = () => {
    if (!matchedEmployee) return;
    confirmWinner(matchedEmployee.code, matchedEmployee.name, matchedEmployee.department, matchedEmployee.part);
  };

  const isAllFilled = digits.slice(0, LOTTERY_CODE_LENGTH).every(d => d !== null);
  const lotteryCode = digits.slice(0, LOTTERY_CODE_LENGTH).join('');

  return (
    <GlassCard elevation={0}>
      <CardTitle>Nhập Kết Quả</CardTitle>

      {/* Integrated Prize Selector */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ color: '#94a3b8', mb: 1, fontSize: '0.85rem', fontWeight: 600 }}>🎁 Chọn giải thưởng đang quay:</Typography>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {sortedPrizes.map(prize => {
            const count = getWinnerCount(prize.id);
            const isCompleted = count >= prize.quantity;
            const isActive = currentPrizeId === prize.id;

            return (
              <PrizeButton key={prize.id} isActive={isActive} isCompleted={isCompleted} onClick={() => setPrize(prize.id)}>
                <Stack alignItems="center" spacing={0}>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', lineHeight: 1.1 }}>{prize.name}</Typography>
                  <Typography sx={{ fontSize: '0.65rem', opacity: 0.9 }}>
                    {count}/{prize.quantity}
                  </Typography>
                </Stack>
              </PrizeButton>
            );
          })}
        </Stack>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mb: 3 }} />

      {/* Digit Display - 3 Lottery Code Digits */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={3} justifyContent="center">
          {digits.slice(0, LOTTERY_CODE_LENGTH).map((digit, index) => (
            <DigitBox key={index} isActive={activePosition === index} onClick={() => handleDigitBoxClick(index)}>
              {digit !== null ? digit : '–'}
            </DigitBox>
          ))}
        </Stack>

        {isAllFilled && !isNotFound && matchedEmployee && (
          <Typography
            sx={{
              mt: 2,
              textAlign: 'center',
              color: '#10b981',
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            ✓ {matchedEmployee.name} - Mã dự thưởng: {lotteryCode} (MSNV: {matchedEmployee.code})
          </Typography>
        )}

        {isNotFound && (
          <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <Typography
              sx={{
                textAlign: 'center',
                color: '#ef4444',
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              ⚠️ KHÔNG TÌM THẤY MÃ DỰ THƯỞNG: {lotteryCode}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Number Keypad */}
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" justifyContent="center" flexWrap="wrap">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
            const allowed = getAllowedNumbers(activePosition);
            const isDisabled = (currentPrizeId && !allowed.includes(num)) || false;
            return (
              <NumberButton key={num} isDisabled={isDisabled} disabled={isDisabled} onClick={() => handleNumberClick(num)}>
                {num}
              </NumberButton>
            );
          })}
        </Stack>
      </Box>

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} justifyContent="center">
        <ActionButton
          variant="outlined"
          onClick={handleUndo}
          sx={{
            borderColor: '#f59e0b',
            color: '#f59e0b',
            '&:hover': { bgcolor: 'rgba(245, 158, 11, 0.1)', borderColor: '#f59e0b' },
          }}
        >
          Undo
        </ActionButton>
        <ActionButton
          variant="outlined"
          onClick={handleReset}
          sx={{
            borderColor: '#ef4444',
            color: '#ef4444',
            '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)', borderColor: '#ef4444' },
          }}
        >
          Reset
        </ActionButton>
        <ActionButton
          variant="contained"
          onClick={handleConfirm}
          disabled={!matchedEmployee || isNotFound}
          sx={{
            background: matchedEmployee && !isNotFound ? 'linear-gradient(135deg, #10b981, #06b6d4)' : 'rgba(100, 116, 139, 0.5)',
            '&:hover': {
              background: 'linear-gradient(135deg, #059669, #0891b2)',
            },
            '&:disabled': {
              background: 'rgba(100, 116, 139, 0.3)',
              color: '#64748b',
            },
          }}
        >
          Xác nhận trúng thưởng
        </ActionButton>
      </Stack>
    </GlassCard>
  );
};

export default GameControlAreaNew;
