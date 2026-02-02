/**
 * Prize Management Part - Simplified version using LuckyDrawContext
 */

import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  styled,
  alpha,
  Button,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from '@mui/material';
import { useLuckyDraw, PrizeWinner, WinnerStatus } from '../../../context/lucky-draw.context';
import { prizes2026 } from '../../../common/data';
import { employees } from '../../../common/data/employees-2026';

// Styled Components
const GlassCard = styled(Paper)(({ theme }) => ({
  background: alpha('#1e293b', 0.85),
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '24px',
  padding: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 700,
  color: '#f1f5f9',
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '&::before': {
    content: '""',
    display: 'block',
    width: '4px',
    height: '28px',
    background: 'linear-gradient(to bottom, #f59e0b, #ef4444)',
    borderRadius: '2px',
  },
}));

const PrizeButton = styled(Button, {
  shouldForwardProp: prop => prop !== 'isActive' && prop !== 'isCompleted' && prop !== 'isLocked',
})<{ isActive?: boolean; isCompleted?: boolean; isLocked?: boolean }>(({ isActive, isCompleted, isLocked }) => ({
  minWidth: 120,
  padding: '12px 16px',
  borderRadius: 12,
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '0.9rem',
  color: isCompleted ? '#10b981' : isActive ? '#fff' : isLocked ? '#64748b' : '#cbd5e1',
  background: isActive ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : isCompleted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(30, 41, 59, 0.6)',
  border: isActive ? '2px solid #f59e0b' : isCompleted ? '2px solid #10b981' : '2px solid #334155',
  cursor: isLocked ? 'not-allowed' : 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: isLocked ? 'none' : 'scale(1.02)',
    background: isActive ? 'linear-gradient(135deg, #d97706, #dc2626)' : isCompleted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(51, 65, 85, 0.8)',
  },
  '&:disabled': {
    opacity: 0.6,
  },
}));

const StatusChip = styled(Chip)<{ statusType: WinnerStatus }>(({ statusType }) => {
  const colors: Record<WinnerStatus, { bg: string; text: string }> = {
    won: { bg: 'rgba(59, 130, 246, 0.2)', text: '#3b82f6' },
    pending_award: { bg: 'rgba(245, 158, 11, 0.2)', text: '#f59e0b' },
    awarded: { bg: 'rgba(16, 185, 129, 0.2)', text: '#10b981' },
    absent: { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444' },
  };
  const c = colors[statusType];
  return {
    backgroundColor: c.bg,
    color: c.text,
    fontWeight: 600,
    fontSize: '0.75rem',
  };
});

export const PrizeManagementNew: React.FC = () => {
  const { state, setPrize, dispatch } = useLuckyDraw();
  const { currentPrizeId, winners, announcement } = state;
  const isBlocked = announcement.visible;
  // Sort prizes by order (smallest first)
  const sortedPrizes = useMemo(() => {
    return [...prizes2026].sort((a, b) => a.order - b.order);
  }, []);

  // Get winner count for each prize
  const getWinnerCount = (prizeId: string) => {
    return winners.filter(w => w.prizeId === prizeId && w.status !== 'absent').length;
  };

  // Get winners for current prize
  const currentPrizeWinners = useMemo(() => {
    if (!currentPrizeId) return [];
    return winners.filter(w => w.prizeId === currentPrizeId);
  }, [currentPrizeId, winners]);

  const handlePrizeSelect = (prizeId: string) => {
    setPrize(prizeId);
  };

  const currentPrize = sortedPrizes.find(p => p.id === currentPrizeId);

  return (
    <GlassCard elevation={0}>
      <CardTitle>🎁 Quản lý Giải thưởng</CardTitle>

      {/* Prize Selector Grid */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ color: '#94a3b8', mb: 2, fontSize: '0.9rem' }}>Chọn giải đang quay:</Typography>
        <Stack direction="row" flexWrap="wrap" gap={1.5}>
          {sortedPrizes.map(prize => {
            const count = getWinnerCount(prize.id);
            const isCompleted = count >= prize.quantity;
            const isActive = currentPrizeId === prize.id;

            // Disable switching if there are pending winners for the ACTIVE prize
            // Relaxed Rule: Only lock if there are people explicitly waiting for award (pending_award).
            // If status is 'won' (just appeared on screen), we allow switching (e.g. to fix mistake).
            const hasPendingWinners = winners.some(w => w.prizeId === currentPrizeId && w.status === 'pending_award');

            const isLocked = isBlocked || (hasPendingWinners && !isActive);

            return (
              <PrizeButton
                key={prize.id}
                isActive={isActive}
                isCompleted={isCompleted}
                isLocked={isLocked}
                disabled={isLocked}
                onClick={() => handlePrizeSelect(prize.id)}
              >
                <Stack alignItems="center" spacing={0.5}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>{prize.name}</Typography>
                  <Typography sx={{ fontSize: '0.7rem', opacity: 0.8 }}>
                    {count}/{prize.quantity}
                  </Typography>
                </Stack>
              </PrizeButton>
            );
          })}
        </Stack>
      </Box>

      {/* Current Prize Progress */}
      {currentPrize && (
        <Box sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: 'rgba(15, 23, 42, 0.5)' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography sx={{ color: '#f59e0b', fontWeight: 700 }}>{currentPrize.name}</Typography>
            <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              {getWinnerCount(currentPrize.id)}/{currentPrize.quantity} giải
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={(getWinnerCount(currentPrize.id) / currentPrize.quantity) * 100}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'rgba(255,255,255,0.1)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(to right, #f59e0b, #ef4444)',
                borderRadius: 4,
              },
            }}
          />
        </Box>
      )}

      {/* Winners Table for Current Prize */}
      {currentPrizeWinners.length > 0 && (
        <Box>
          <Typography sx={{ color: '#94a3b8', mb: 1.5, fontSize: '0.85rem' }}>Người trúng giải {currentPrize?.name}:</Typography>
          <TableContainer sx={{ maxHeight: 200, bgcolor: 'rgba(15, 23, 42, 0.3)', borderRadius: 2 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: 'rgba(30, 41, 59, 0.95)', color: '#94a3b8', fontWeight: 600 }}>MSNV</TableCell>
                  <TableCell sx={{ bgcolor: 'rgba(30, 41, 59, 0.95)', color: '#94a3b8', fontWeight: 600 }}>Họ tên</TableCell>
                  <TableCell sx={{ bgcolor: 'rgba(30, 41, 59, 0.95)', color: '#94a3b8', fontWeight: 600 }}>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentPrizeWinners.map(winner => (
                  <TableRow key={winner.employeeCode}>
                    <TableCell sx={{ color: '#e2e8f0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{winner.employeeCode}</TableCell>
                    <TableCell sx={{ color: '#e2e8f0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{winner.employeeName}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <StatusChip
                        label={
                          winner.status === 'won'
                            ? 'Đã trúng'
                            : winner.status === 'pending_award'
                              ? 'Chờ trao'
                              : winner.status === 'awarded'
                                ? 'Đã trao'
                                : winner.status === 'absent'
                                  ? 'Vắng mặt'
                                  : 'Chờ trao'
                        }
                        statusType={winner.status}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </GlassCard>
  );
};

export default PrizeManagementNew;
