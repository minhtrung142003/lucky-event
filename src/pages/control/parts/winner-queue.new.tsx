/**
 * Winner Queue Part - Unified version with Ceremony Controls
 * ✅ WITH AUTO-SWITCH PRIZE DIALOG ON "Trao giải xong"
 */
import React, { useMemo, useCallback, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  styled,
  alpha,
  Stack,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Divider,
  useTheme,
} from '@mui/material';
import { useLuckyDraw, PrizeWinner, WinnerStatus } from '../../../context/lucky-draw.context';
import { prizes2026 } from '../../../common/data';
import { DialogElement } from '../../../components/elements/dialog/dialog.element';

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
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '&::before': {
    content: '""',
    display: 'block',
    width: '4px',
    height: '28px',
    background: 'linear-gradient(to bottom, #ec4899, #8b5cf6)',
    borderRadius: '2px',
  },
}));

const ActionButton = styled(Button)(() => ({
  borderRadius: 12,
  padding: '10px 20px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '0.9rem',
}));

export const WinnerQueueNew: React.FC = () => {
  const { state, updateWinnerStatus, startCeremony, completeCeremony, backToDrawing, removeFromSession, removeWinner, setPrize } = useLuckyDraw();
  const { winners, ceremony, announcement, currentPrizeId } = state;
  const { palette } = useTheme();
  const isBlocked = announcement.visible;
  const isCeremonyMode = ceremony.displayMode === 'ceremony';
  const [showSwitchDialog, setShowSwitchDialog] = useState(false);
  const sortedPrizes = useMemo(() => [...prizes2026].sort((a, b) => a.order - b.order), []);
  const currentPrize = sortedPrizes.find(p => p.id === currentPrizeId);
  const currentIndex = sortedPrizes.findIndex(p => p.id === currentPrizeId);
  const nextPrize = currentIndex < sortedPrizes.length - 1 ? sortedPrizes[currentIndex + 1] : null;
  // Group winners by status
  const pendingAward = useMemo(() => winners.filter(w => w.status === 'pending_award'), [winners]);
  const awarded = useMemo(() => winners.filter(w => w.status === 'awarded'), [winners]);
  const issues = useMemo(() => winners.filter(w => w.status === 'absent'), [winners]);
  // Pending winners for CURRENT prize only (for ceremony button)
  const pendingForCurrentPrize = useMemo(() => {
    if (!currentPrizeId) return pendingAward;
    return pendingAward.filter(w => w.prizeId === currentPrizeId);
  }, [pendingAward, currentPrizeId]);

  // Session awardees (for current ceremony)
  const sessionAwardees = ceremony.sessionAwardees;
  const pendingInSession = useMemo(() => sessionAwardees.filter(w => w.status === 'pending_award'), [sessionAwardees]);

  const handleMarkAbsent = useCallback(
    (employeeCode: string) => {
      updateWinnerStatus(employeeCode, 'absent');
      removeFromSession(employeeCode);

      // If this was the last pending winner, go back to drawing mode
      if (pendingAward.length <= 1) {
        backToDrawing();
      }
    },
    [updateWinnerStatus, removeFromSession, pendingAward.length, backToDrawing]
  );
  const handleStartCeremony = useCallback(() => {
    startCeremony();
  }, [startCeremony]);
  const handleCompleteCeremony = useCallback(() => {
    completeCeremony();

    if (nextPrize && currentPrize && pendingForCurrentPrize.length >= currentPrize.quantity) {
      setShowSwitchDialog(true);
    }
  }, [completeCeremony, nextPrize]);

  const handleBackToDrawing = useCallback(() => {
    backToDrawing();
  }, [backToDrawing]);

  const handleDelete = useCallback(
    (employeeCode: string) => {
      if (window.confirm('Bạn có chắc muốn HỦY kết quả của người này? (Thao tác này sẽ xóa người này khỏi danh sách trúng giải)')) {
        removeWinner(employeeCode);
      }
    },
    [removeWinner]
  );

  const handleConfirmSwitch = useCallback(() => {
    if (nextPrize) {
      setPrize(nextPrize.id);
    }
    setShowSwitchDialog(false);
  }, [nextPrize, setPrize]);

  const handleCancelSwitch = useCallback(() => {
    setShowSwitchDialog(false);
  }, []);

  const getPrizeName = (prizeId: string) => {
    return prizes2026.find(p => p.id === prizeId)?.name || prizeId;
  };

  const getStatusLabel = (status: WinnerStatus) => {
    switch (status) {
      case 'won':
        return 'Đã trúng';
      case 'pending_award':
        return 'Chờ trao';
      case 'awarded':
        return 'Đã trao';
      case 'absent':
        return 'Vắng mặt';
      default:
        return status;
    }
  };

  return (
    <GlassCard
      elevation={0}
      sx={{
        border: isCeremonyMode ? '2px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.1)',
        background: isCeremonyMode ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(30, 41, 59, 0.85))' : alpha('#1e293b', 0.85),
      }}
    >
      <CardTitle>{isCeremonyMode ? '🎁 Đang trao giải' : 'Hàng đợi trao giải'}</CardTitle>

      <Stack spacing={2}>
        {/* Ceremony Controls - Show when there are pending awardees for current prize */}
        {pendingForCurrentPrize.length > 0 && (
          <Stack direction="row" spacing={1.5} justifyContent="center" flexWrap="wrap">
            {!isCeremonyMode ? (
              <ActionButton
                variant="contained"
                onClick={handleStartCeremony}
                disabled={isBlocked}
                sx={{
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  fontWeight: 700,
                  '&:hover': { background: 'linear-gradient(135deg, #f59e0b, #d97706)' },
                }}
              >
                🎁 Bắt đầu trao giải ({pendingForCurrentPrize.length})
              </ActionButton>
            ) : (
              <>
                <ActionButton
                  variant="contained"
                  onClick={handleBackToDrawing}
                  sx={{
                    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                    fontWeight: 700,
                    '&:hover': { background: 'linear-gradient(135deg, #f59e0b, #d97706)' },
                  }}
                >
                  Tiếp tục quay
                </ActionButton>
                <ActionButton
                  variant="contained"
                  onClick={handleCompleteCeremony}
                  sx={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#fff',
                    fontWeight: 700,
                    '&:hover': { background: 'linear-gradient(135deg, #059669, #047857)' },
                  }}
                >
                  Trao giải xong
                </ActionButton>
              </>
            )}
          </Stack>
        )}

        {/* Pending Award List */}
        <Box>
          <Typography sx={{ color: '#f59e0b', fontWeight: 600, mb: 1.5, fontSize: '0.9rem' }}>⏳ Chờ trao giải ({pendingAward.length})</Typography>
          {pendingAward.length === 0 ? (
            <Typography sx={{ color: '#64748b', fontSize: '0.8rem', fontStyle: 'italic' }}>Không có người chờ trao giải</Typography>
          ) : (
            <List dense sx={{ maxHeight: 180, overflowY: 'auto', bgcolor: 'rgba(15, 23, 42, 0.3)', borderRadius: 2 }}>
              {pendingAward.map(winner => (
                <ListItem
                  key={winner.employeeCode}
                  secondaryAction={
                    <Stack direction="row" spacing={0.5}>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(winner.employeeCode)}
                        sx={{ color: '#94a3b8', fontSize: '0.9rem', '&:hover': { color: '#ef4444' } }}
                        title="Hủy kết quả (Xóa hẳn)"
                      >
                        🗑
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleMarkAbsent(winner.employeeCode)}
                        sx={{ color: '#ef4444', fontSize: '0.8rem' }}
                        title="Đánh dấu vắng mặt"
                      >
                        ✕
                      </IconButton>
                    </Stack>
                  }
                  sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <ListItemText
                    primary={<Typography sx={{ color: '#e2e8f0', fontSize: '0.85rem', fontWeight: 600 }}>{winner.employeeName}</Typography>}
                    secondary={
                      <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                        {winner.lotteryCode || '---'} - {winner.employeeCode} • {getPrizeName(winner.prizeId)}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

        {/* Already Awarded */}
        <Box>
          <Typography sx={{ color: '#10b981', fontWeight: 600, mb: 1.5, fontSize: '0.9rem' }}>✓ Đã trao ({awarded.length})</Typography>
          {awarded.length === 0 ? (
            <Typography sx={{ color: '#64748b', fontSize: '0.8rem', fontStyle: 'italic' }}>Chưa trao giải nào</Typography>
          ) : (
            <Box sx={{ maxHeight: 100, overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {awarded.map(winner => (
                <Chip
                  key={winner.employeeCode}
                  label={`${winner.lotteryCode || '---'} - ${winner.employeeCode} - ${winner.employeeName} (${getPrizeName(winner.prizeId)})`}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(16, 185, 129, 0.15)',
                    color: '#6ee7b7',
                    fontSize: '0.7rem',
                  }}
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Issues */}
        {issues.length > 0 && (
          <>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
            <Box>
              <Typography sx={{ color: '#ef4444', fontWeight: 600, mb: 1.5, fontSize: '0.9rem' }}>⚠️ Có vấn đề ({issues.length})</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {issues.map(winner => (
                  <Chip
                    key={winner.employeeCode}
                    label={`${winner.lotteryCode || '---'} - ${winner.employeeCode} - ${winner.employeeName} : ${getStatusLabel(winner.status)}`}
                    size="small"
                    sx={{
                      bgcolor: winner.status === 'absent' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(156, 163, 175, 0.15)',
                      color: winner.status === 'absent' ? '#fca5a5' : '#d1d5db',
                      fontSize: '0.7rem',
                    }}
                  />
                ))}
              </Box>
            </Box>
          </>
        )}
      </Stack>
      <DialogElement
        open={showSwitchDialog}
        onClose={handleCancelSwitch}
        iconLabel="emoji_events"
        label="Hoàn thành giải thưởng"
        nodeContent={
          <Box sx={{ py: 2, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: palette.success.main }}>
              Đã quay đủ {currentPrize?.quantity} {currentPrize?.name}!
            </Typography>
            {nextPrize && (
              <Typography variant="subtitle2" sx={{ color: palette.text.primary }}>
                Chuyển sang <strong style={{ color: palette.primary.main }}>{nextPrize.name}</strong>?
              </Typography>
            )}
          </Box>
        }
        buttonLeft={{
          content: 'Huỷ',
          onClick: handleCancelSwitch,
          variant: 'outlined',
        }}
        buttonRight={{
          content: nextPrize ? `Chuyển sang ${nextPrize.name}` : 'Đóng',
          variant: 'contained',
          onClick: handleConfirmSwitch,
        }}
      />
    </GlassCard>
  );
};

export default WinnerQueueNew;
