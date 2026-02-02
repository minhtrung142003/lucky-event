import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Paper, styled, alpha, Button, Stack, Divider, TextField, useTheme } from '@mui/material';
import { useLuckyDraw } from '../../../context/lucky-draw.context';
import { DIGIT_CONSTRAINTS, LOTTERY_CODE_LENGTH } from '../../../pages/lucky-draw-2026/types';
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
  width: 80,
  height: 100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 16,
  fontSize: 48,
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
  const { state, setDigit, undoDigit, resetDigits, setPrize, revealDigit, showCongratulations } = useLuckyDraw();
  const {
    digits,
    activePosition,
    matchedEmployee,
    isNotFound,
    currentPrizeId,
    winners,
    announcement,
    remainingCandidates,
    excludedCodes,
    digitRevealed,
  } = state;
  const isBlocked = announcement.visible;

  const sortedPrizes = React.useMemo(() => [...prizes2026].sort((a, b) => a.order - b.order), []);

  const getWinnerCount = React.useCallback(
    (prizeId: string) => {
      return winners.filter(w => w.prizeId === prizeId && (w.status === 'pending_award' || w.status === 'awarded')).length;
    },
    [winners]
  );

  const [showManualInput, setShowManualInput] = React.useState(false);
  const [manualCode, setManualCode] = React.useState('');

  const getDistinctDigitsAtPosition = React.useCallback(
    (prefix: string, position: number) => {
      const activeWinners = winners.filter(w => w.status !== 'won').map(w => w.employeeCode);
      const excluded = new Set([...excludedCodes, ...activeWinners]);

      const digitSet = new Set<string>();
      employees.forEach(emp => {
        if (excluded.has(emp.code)) return;
        if (emp.lotteryCode.startsWith(prefix) && emp.lotteryCode.length > position) {
          digitSet.add(emp.lotteryCode[position]);
        }
      });
      return digitSet.size;
    },
    [winners, excludedCodes]
  );

  // Calculate Win Probability (simple: 1 / remaining candidates)
  const winProbability = React.useMemo(() => {
    if (remainingCandidates.length === 0) return '0';
    const prob = (1 / remainingCandidates.length) * 100;
    return prob === 100 ? '100' : parseFloat(prob.toFixed(4)).toString();
  }, [remainingCandidates]);

  // Calculate Specific Employee "Chain Probability" based on digit tree
  // Updates in real-time as digits are drawn - now uses lotteryCode (3 digits)
  const manualEmployeeData = React.useMemo(() => {
    // Accept both MSNV (5 digits) or lotteryCode (3 digits)
    if (!manualCode || manualCode.length < 3) return null;

    // Try to find by lottery code first, then by employee code
    let employee = employees.find(e => e.lotteryCode === manualCode.padStart(3, '0'));
    if (!employee && manualCode.length >= 5) {
      employee = employees.find(e => e.code === manualCode);
    }
    if (!employee) return { name: 'Không tìm thấy', prob: null, isAlive: false, breakdown: null };

    // Check if this specific employee is still in the race
    const isAlive = remainingCandidates.some(e => e.code === employee!.code);

    // If eliminated, show 0%
    if (!isAlive) {
      return {
        name: employee.name,
        prob: '0',
        isAlive: false,
        breakdown: null,
      };
    }

    const lotteryCode = employee.lotteryCode;

    // Calculate chain probability with current game state for 3 digits:
    // For each level, check if a digit has been drawn:
    // - If drawn and matches: that level = 1 (100% passed)
    // - If drawn and doesn't match: eliminated (handled by isAlive check above)
    // - If not drawn yet: calculate 1/n as before

    const n0_raw = getDistinctDigitsAtPosition('', 0);
    const n1_raw = getDistinctDigitsAtPosition(lotteryCode.substring(0, 1), 1);
    const n2_raw = getDistinctDigitsAtPosition(lotteryCode.substring(0, 2), 2);

    // Check which levels have been passed (digit already drawn)
    const l0Passed = digits[0] !== null; // Level 0 drawn
    const l1Passed = digits[1] !== null; // Level 1 drawn
    const l2Passed = digits[2] !== null; // Level 2 drawn

    // Calculate adjusted probabilities
    const p0 = l0Passed ? 1 : n0_raw > 0 ? 1 / n0_raw : 0;
    const p1 = l1Passed ? 1 : n1_raw > 0 ? 1 / n1_raw : 0;
    const p2 = l2Passed ? 1 : n2_raw > 0 ? 1 / n2_raw : 0;

    const probability = p0 * p1 * p2;
    const probPercent = probability * 100;

    return {
      name: employee.name,
      lotteryCode: employee.lotteryCode,
      prob: probPercent === 100 ? '100' : probPercent < 0.0001 ? probPercent.toExponential(2) : probPercent.toFixed(4),
      isAlive,
      breakdown: {
        n0: n0_raw,
        n1: n1_raw,
        n2: n2_raw,
        l0Passed,
        l1Passed,
        l2Passed,
      },
    };
  }, [manualCode, remainingCandidates, getDistinctDigitsAtPosition, digits]);

  // Get allowed numbers for current position
  const getAllowedNumbers = (position: number): number[] => {
    return DIGIT_CONSTRAINTS[position] || [];
  };

  const handleDigitBoxClick = (position: number) => {
    // All positions are editable now
  };

  const handleNumberClick = (num: number) => {
    const allowedNumbers = getAllowedNumbers(activePosition);
    if (!allowedNumbers.includes(num)) return;

    // Context handles the direct digit setting
    setDigit(activePosition, num);
  };

  const handleUndo = () => undoDigit();
  const handleReset = () => resetDigits();

  const lotteryCode = digits.slice(0, LOTTERY_CODE_LENGTH).join('');

  return (
    <GlassCard elevation={0}>
      <CardTitle>Nhập Kết Quả</CardTitle>

      {/* Integrated Prize Selector */}
      <Box sx={{ mb: 1 }} alignItems="center">
        <Stack direction="row" flexWrap="wrap" alignItems="center">
          {sortedPrizes.map(prize => {
            const count = getWinnerCount(prize.id);
            const isCompleted = count >= prize.quantity;
            const isActive = currentPrizeId === prize.id;

            return (
              <PrizeButton key={prize.id} isActive={isActive} isCompleted={isCompleted} disabled={isBlocked} onClick={() => setPrize(prize.id)}>
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

      {/* Probability & Candidate Stats */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Box
          sx={{
            flex: 1,
            p: 1.5,
            borderRadius: 3,
            bgcolor: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 80,
          }}
        >
          <Typography sx={{ color: '#94a3b8', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800, mb: 0.5, letterSpacing: 1 }}>
            Danh sách cơ hội
          </Typography>
          <Typography sx={{ color: '#818cf8', fontSize: 24, fontWeight: 900, fontFamily: 'Montserrat, sans-serif' }}>
            {remainingCandidates.length} <span style={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.7 }}>người</span>
          </Typography>
        </Box>

        <Box
          onClick={() => setShowManualInput(!showManualInput)}
          sx={{
            flex: 1,
            p: 1.5,
            borderRadius: 3,
            bgcolor: showManualInput ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)',
            border: showManualInput ? '2px solid #10b981' : '1px solid rgba(16, 185, 129, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 80,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              bgcolor: 'rgba(16, 185, 129, 0.15)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          {showManualInput ? (
            <Stack spacing={0.5} sx={{ width: '100%' }} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
              <TextField
                autoFocus
                size="small"
                variant="standard"
                placeholder="Mã NV (VD: 00123)"
                value={manualCode}
                onChange={e => setManualCode(e.target.value)}
                autoComplete="off"
                sx={{
                  '& .MuiInput-root': {
                    color: '#10b981',
                    fontSize: '1rem',
                    fontWeight: 700,
                    '&:before': { borderColor: 'rgba(16, 185, 129, 0.4)' },
                    '&:after': { borderColor: '#10b981' },
                  },
                  '& input': { textAlign: 'center', py: 0 },
                }}
              />
              {manualEmployeeData && (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography noWrap sx={{ color: '#fff', fontSize: '0.65rem', fontWeight: 600, opacity: 0.8 }}>
                    {manualEmployeeData.name}
                  </Typography>
                  <Typography
                    sx={{
                      color: manualEmployeeData.isAlive ? '#10b981' : '#ef4444',
                      fontSize: '1.1rem',
                      fontWeight: 800,
                    }}
                  >
                    {manualEmployeeData.prob !== null ? `${manualEmployeeData.prob}%` : '--- %'}
                    {!manualEmployeeData.isAlive && manualEmployeeData.prob !== null && (
                      <span style={{ fontSize: '0.6rem', display: 'block' }}>(Bị loại)</span>
                    )}
                  </Typography>
                  {manualEmployeeData.breakdown && (
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.5rem', mt: 0.5, opacity: 0.7 }}>
                      {manualEmployeeData.breakdown.l0Passed ? '✓' : `1/${manualEmployeeData.breakdown.n0}`} ×{' '}
                      {manualEmployeeData.breakdown.l1Passed ? '✓' : `1/${manualEmployeeData.breakdown.n1}`} ×{' '}
                      {manualEmployeeData.breakdown.l2Passed ? '✓' : `1/${manualEmployeeData.breakdown.n2}`}
                    </Typography>
                  )}
                </Box>
              )}
            </Stack>
          ) : (
            <>
              <Typography sx={{ color: '#94a3b8', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800, mb: 0.5, letterSpacing: 1 }}>
                Tỉ lệ thắng (%)
              </Typography>
              <Typography sx={{ color: '#10b981', fontSize: 24, fontWeight: 900, fontFamily: 'Montserrat, sans-serif' }}>
                {winProbability}
                <span style={{ fontSize: '1rem', fontWeight: 700, marginLeft: 2 }}>%</span>
              </Typography>
            </>
          )}
        </Box>
      </Stack>

      {/* Digit Display */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={2} justifyContent="center">
          {digits.slice(0, LOTTERY_CODE_LENGTH).map((digit, index) => (
            <DigitBox key={index} isActive={activePosition === index} onClick={() => handleDigitBoxClick(index)}>
              {digit !== null ? digit : '–'}
            </DigitBox>
          ))}
        </Stack>

        {matchedEmployee && !isNotFound && (
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
              KHÔNG TÌM THẤY MÃ DỰ THƯỞNG: {lotteryCode}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Number Keypad - ẩn nếu có số đã nhập nhưng chưa mở */}
      {(() => {
        // Tìm số tiếp theo cần mở (có số nhưng chưa reveal)
        const nextToReveal = digits.findIndex((d, i) => d !== null && !digitRevealed[i]);
        const hasUnrevealedDigit = nextToReveal !== -1;
        const hasFilledThreeDigits = digits.slice(0, LOTTERY_CODE_LENGTH).every(d => d !== null);

        if (hasUnrevealedDigit) {
          return (
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
              <ActionButton
                variant="contained"
                onClick={() => revealDigit(nextToReveal)}
                disabled={isBlocked}
                sx={{
                  background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                  px: 4,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059669, #0891b2)',
                  },
                  width: '100%',
                }}
              >
                ✓ Xác nhận
              </ActionButton>
            </Box>
          );
        }

        return (
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" justifyContent="center" flexWrap="wrap">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
                const allowed = getAllowedNumbers(activePosition);
                const isDisabled = isBlocked || hasFilledThreeDigits || (currentPrizeId && !allowed.includes(num)) || false;
                return (
                  <NumberButton key={num} isDisabled={isDisabled} disabled={isDisabled} onClick={() => handleNumberClick(num)}>
                    {num}
                  </NumberButton>
                );
              })}
            </Stack>
          </Box>
        );
      })()}

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
        <ActionButton
          variant="outlined"
          onClick={handleUndo}
          disabled={isBlocked || digits.filter(d => d !== null).length <= 1}
          sx={{
            borderColor: '#f59e0b',
            color: '#f59e0b',
            '&:hover': { bgcolor: 'rgba(245, 158, 11, 0.1)', borderColor: '#f59e0b' },
          }}
        >
          Xóa số
        </ActionButton>
        <ActionButton
          variant="outlined"
          onClick={handleReset}
          disabled={isBlocked}
          sx={{
            borderColor: '#ef4444',
            color: '#ef4444',
            '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)', borderColor: '#ef4444' },
          }}
        >
          Đặt lại từ đầu
        </ActionButton>
        {/* Chúc mừng button - shows congratulations screen when valid winner found AND all digits revealed */}
        {matchedEmployee && !isNotFound && digitRevealed.every(r => r === true) && (
          <ActionButton
            variant="contained"
            onClick={() => showCongratulations()}
            disabled={isBlocked}
            sx={{
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              '&:hover': {
                background: 'linear-gradient(135deg, #d97706, #dc2626)',
              },
              '&:disabled': {
                background: 'rgba(100, 116, 139, 0.3)',
                color: '#64748b',
              },
            }}
          >
            🎉 Chúc mừng
          </ActionButton>
        )}
      </Stack>
    </GlassCard>
  );
};

export default GameControlAreaNew;
