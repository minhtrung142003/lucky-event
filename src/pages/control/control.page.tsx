import React, { useCallback, useState } from 'react';
import {
  Typography,
  Stack,
  Grid,
  Box,
  Paper,
  Button,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useLuckyDraw } from '../../context/lucky-draw.context';
import { employees, prizes2026 } from '../../common/data';
import { ControlLayout } from '../../layouts/control.layout';
import { GameControlAreaNew } from './parts/game-control-area.new';
import { PrizeManagementNew } from './parts/prize-management.new';
import { GameLogicNew } from './parts/game-logic.new';
import { WinnerQueueNew } from './parts/winner-queue.new';
import { AwardHistoryPart } from './parts/award-history.part';
import * as XLSX from 'xlsx';

// Styled Components
const ActionButton = styled(Button)(() => ({
  borderRadius: 12,
  padding: '12px 24px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1rem',
}));

const NavButton = styled(Button)(() => ({
  color: '#e2e8f0',
  fontWeight: 600,
  padding: '8px 16px',
  borderRadius: 8,
  textTransform: 'none',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.1)',
  },
}));

const StyledDialog = styled(Dialog)(() => ({
  '& .MuiDialog-paper': {
    background: 'rgba(15, 23, 42, 0.95)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    maxWidth: '700px',
    width: '100%',
  },
}));

export const ControlPage: React.FC = () => {
  const { state: gameState, confirmWinnerAction, hideAnnouncement } = useLuckyDraw();

  // Modal states
  const [gameLogicOpen, setGameLogicOpen] = useState(false);
  const [prizeManagementOpen, setPrizeManagementOpen] = useState(false);

  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleOpenGameLogic = () => {
    setGameLogicOpen(true);
    handleMenuClose();
  };
  const handleOpenPrizeManagement = () => {
    setPrizeManagementOpen(true);
    handleMenuClose();
  };

  const handleConfirmReceived = useCallback(() => confirmWinnerAction('received'), [confirmWinnerAction]);
  const handleMarkAbsent = useCallback(() => confirmWinnerAction('absent'), [confirmWinnerAction]);

  const handleHomeClick = useCallback(() => {
    hideAnnouncement();
    setTimeout(() => {
      window.location.href = '/';
    }, 100);
  }, [hideAnnouncement]);

  const handleExportExcel = () => {
    try {
      const eligibleStatuses = new Set(['pending_award', 'awarded']);
      const winners = (gameState.winners || []).filter(w => eligibleStatuses.has(w.status));
      const sortedPrizes = [...prizes2026].sort((a, b) => a.order - b.order);

      const wsData: any[][] = [];
      sortedPrizes.forEach(prize => {
        const list = winners.filter(w => w.prizeId === prize.id);
        if (list.length === 0) return;
        wsData.push([prize.name], ['STT', 'Số may mắn', 'MSNV', 'Họ tên', 'Khối']);
        list.forEach((w, idx) => {
          const emp = employees.find(e => e.code === w.employeeCode);
          wsData.push([idx + 1, emp?.lotteryCode || '', w.employeeCode, w.employeeName, w.part]);
        });
        wsData.push([], []);
      });

      if (wsData.length === 0) {
        alert('Không có dữ liệu để xuất.');
        return;
      }

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      ws['!cols'] = [{ wch: 10 }, { wch: 15 }, { wch: 30 }, { wch: 40 }];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Kết quả');
      XLSX.writeFile(wb, `ket-qua-quay-so_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (err) {
      console.error('Export Excel error:', err);
      alert('Xuất excel thất bại.');
    }
  };

  const currentWinner = gameState.announcement.winner;
  const showAnnouncement = gameState.announcement.visible;

  return (
    <ControlLayout>
      <Box sx={{ width: '100%', minHeight: '100vh' }}>
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: 'rgba(30, 41, 59, 0.6)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            mb: 3,
            p: 1,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography sx={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1.2rem', px: 2 }}>🎯 Lucky Draw Control</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={handleExportExcel}
                sx={{ borderColor: 'rgba(255,255,255,0.2)', color: '#94a3b8', borderRadius: '10px', textTransform: 'none' }}
              >
                Xuất excel
              </Button>
              <Button
                variant="outlined"
                onClick={handleHomeClick}
                sx={{
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: '#94a3b8',
                  borderRadius: '10px',
                  textTransform: 'none',
                  '&:hover': { borderColor: '#fff', color: '#fff', bgcolor: 'rgba(255,255,255,0.05)' },
                }}
              >
                Về trang chủ
              </Button>
              <NavButton onClick={handleMenuClick} disabled={showAnnouncement}>
                ☰ Quản lý
              </NavButton>
              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    bgcolor: 'rgba(30, 41, 59, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    mt: 1,
                    minWidth: 200,
                  },
                }}
              >
                <MenuItem onClick={handleOpenGameLogic}>
                  <ListItemIcon>
                    <Typography sx={{ fontSize: '1.2rem' }}>⚙️</Typography>
                  </ListItemIcon>
                  <ListItemText
                    primary="Game Logic"
                    secondary="Thống kê & Loại trừ"
                    primaryTypographyProps={{ sx: { color: '#f1f5f9', fontWeight: 600 } }}
                    secondaryTypographyProps={{ sx: { color: '#94a3b8', fontSize: '0.75rem' } }}
                  />
                </MenuItem>
                <MenuItem onClick={handleOpenPrizeManagement}>
                  <ListItemIcon>
                    <Typography sx={{ fontSize: '1.2rem' }}>🏆</Typography>
                  </ListItemIcon>
                  <ListItemText
                    primary="Quản lý Giải thưởng"
                    secondary="Xem danh sách trúng giải"
                    primaryTypographyProps={{ sx: { color: '#f1f5f9', fontWeight: 600 } }}
                    secondaryTypographyProps={{ sx: { color: '#94a3b8', fontSize: '0.75rem' } }}
                  />
                </MenuItem>
              </Menu>
            </Box>
          </Stack>
        </Paper>

        {/* Main Content */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={7}>
            <GameControlAreaNew />
          </Grid>
          <Grid item xs={12} lg={5}>
            <Stack spacing={2}>
              {showAnnouncement && currentWinner && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))',
                    border: '2px solid #10b981',
                  }}
                >
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, textAlign: 'center', mb: 0.5 }}>
                    {currentWinner.employeeName}
                  </Typography>
                  <Typography sx={{ color: '#94a3b8', textAlign: 'center', fontSize: '0.8rem', mb: 2 }}>
                    MSNV: {currentWinner.employeeCode} | {prizes2026.find(p => p.id === currentWinner?.prizeId)?.name}
                  </Typography>
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <ActionButton
                      variant="contained"
                      size="small"
                      onClick={handleConfirmReceived}
                      sx={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: '#fff',
                        fontSize: '0.75rem',
                        py: 0.8,
                        flex: 1,
                        '&:hover': { background: 'linear-gradient(135deg, #059669, #047857)' },
                      }}
                    >
                      Có mặt
                    </ActionButton>
                    <ActionButton
                      variant="outlined"
                      size="small"
                      onClick={handleMarkAbsent}
                      sx={{
                        borderColor: '#f59e0b',
                        color: '#f59e0b',
                        fontSize: '0.75rem',
                        py: 0.8,
                        flex: 1,
                        '&:hover': { bgcolor: 'rgba(245, 158, 11, 0.1)' },
                      }}
                    >
                      Vắng mặt
                    </ActionButton>
                  </Stack>
                </Paper>
              )}
              <WinnerQueueNew />
              <AwardHistoryPart />
            </Stack>
          </Grid>
        </Grid>

        {/* Game Logic Modal */}
        <StyledDialog open={gameLogicOpen} onClose={() => setGameLogicOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              color: '#f1f5f9',
            }}
          >
            <Stack direction="row" alignItems="center" gap={1}>
              ⚙️ Game Logic & Data
            </Stack>
            <IconButton onClick={() => setGameLogicOpen(false)} sx={{ color: '#94a3b8' }}>
              ✕
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 0, mt: 2 }}>
            <Box sx={{ p: 2 }}>
              <GameLogicNew />
            </Box>
          </DialogContent>
        </StyledDialog>

        {/* Prize Management Modal */}
        <StyledDialog open={prizeManagementOpen} onClose={() => setPrizeManagementOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              color: '#f1f5f9',
            }}
          >
            <Stack direction="row" alignItems="center" gap={1}>
              🏆 Quản lý Giải thưởng
            </Stack>
            <IconButton onClick={() => setPrizeManagementOpen(false)} sx={{ color: '#94a3b8' }}>
              ✕
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 0, mt: 2 }}>
            <Box sx={{ p: 2 }}>
              <PrizeManagementNew />
            </Box>
          </DialogContent>
        </StyledDialog>
      </Box>
    </ControlLayout>
  );
};

export default ControlPage;
