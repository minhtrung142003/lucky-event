/**
 * Game Logic Part - Simplified version using LuckyDrawContext
 * 
 * Manages exclusions and data reset.
 */

import React, { useState, useMemo } from 'react';
import { 
  Box, Stack, Typography, Button, TextField, Chip, Paper, styled, alpha,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Tabs, Tab, IconButton, Tooltip
} from '@mui/material';
import { useLuckyDraw, PrizeWinner } from '../../../context/lucky-draw.context';
import { employees, prizes2026 } from '../../../common/data';

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
    background: 'linear-gradient(to bottom, #6366f1, #8b5cf6)',
    borderRadius: '2px',
  },
}));

const ActionButton = styled(Button)(() => ({
  borderRadius: 12,
  padding: '12px 24px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1rem',
}));

export const GameLogicNew: React.FC = () => {
  const { state, addExclusion, removeExclusion, removeWinner, resetAll } = useLuckyDraw();
  const { winners, excludedCodes, announcement } = state;
  const isBlocked = announcement.visible;
  const [newExclusion, setNewExclusion] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const handleAddExclusion = () => {
    if (!newExclusion.trim()) return;
    addExclusion(newExclusion.trim());
    setNewExclusion('');
  };

  const handleRemoveExclusion = (code: string) => {
    removeExclusion(code);
  };

  const handleRemoveWinner = (code: string, name: string) => {
    if (window.confirm(`Xóa '${name}' khỏi danh sách trúng giải để họ có thể quay lại?`)) {
      removeWinner(code);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử trúng thưởng và danh sách loại trừ không?')) {
      resetAll();
      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  };

  const filteredWinners = useMemo(() => {
    return winners.filter((w: PrizeWinner) => {
      if (tabValue === 0) return true; // Tất cả
      if (tabValue === 1) return ['won', 'pending_award', 'awarded'].includes(w.status);
      if (tabValue === 2) return w.status === 'absent';
      return true;
    });
  }, [winners, tabValue]);

  const getPrizeName = (id: string) => prizes2026.find(p => p.id === id)?.name || id;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'won':
      case 'pending_award':
      case 'awarded':
        return <Chip label="Đã nhận" size="small" sx={{ bgcolor: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontWeight: 700 }} />;
      case 'absent':
        return <Chip label="Vắng mặt" size="small" sx={{ bgcolor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', fontWeight: 700 }} />;
      default:
        return status;
    }
  };

  return (
    <GlassCard elevation={0}>
      <CardTitle>Dữ liệu</CardTitle>

      <Stack spacing={4}>
        {/* Statistics */}
        <Box>
          <Typography variant="subtitle2" sx={{ color: '#94a3b8', mb: 1.5 }}>
            Thống kê
          </Typography>
          <Stack direction="row" spacing={2}>
            <Box sx={{ flex: 1, p: 2, borderRadius: 2, bgcolor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <Typography sx={{ color: '#10b981', fontSize: 28, fontWeight: 700 }}>
                {winners.length}
              </Typography>
              <Typography sx={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                Người trúng giải
              </Typography>
            </Box>
            <Box sx={{ flex: 1, p: 2, borderRadius: 2, bgcolor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <Typography sx={{ color: '#ef4444', fontSize: 28, fontWeight: 700 }}>
                {excludedCodes.length}
              </Typography>
              <Typography sx={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                Loại trừ thủ công
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Exclusions Logic */}
        <Box>
          <Typography variant="subtitle2" sx={{ color: '#94a3b8', mb: 1.5 }}>
            Danh sách loại trừ thủ công
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <TextField
              size="small"
              placeholder="Nhập mã NV (VD: 00123)..."
              value={newExclusion}
              onChange={(e) => setNewExclusion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddExclusion()}
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleAddExclusion}
              disabled={isBlocked}
              sx={{ background: '#6366f1', '&:hover': { background: '#4f46e5' } }}
            >
              Thêm
            </Button>
          </Stack>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              maxHeight: 120,
              overflowY: 'auto',
              p: 1.5,
              borderRadius: 2,
              bgcolor: 'rgba(15, 23, 42, 0.4)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            {excludedCodes.length === 0 && (
              <Typography sx={{ color: '#64748b', fontSize: '0.8rem', fontStyle: 'italic' }}>
                Chưa có nhân viên nào bị loại trừ thủ công.
              </Typography>
            )}
            {excludedCodes.map((code: string) => {
              const emp = employees.find(e => e.code === code);
              return (
                <Chip
                  key={code}
                  label={emp ? `${emp.name} (${code})` : code}
                  onDelete={isBlocked ? undefined : () => handleRemoveExclusion(code)}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(239, 68, 68, 0.15)',
                    color: '#fca5a5',
                    '& .MuiChip-deleteIcon': { color: '#fca5a5' },
                  }}
                />
              );
            })}
          </Box>
        </Box>

        {/* Winners Table with Filters */}
        <Box>
          <Typography variant="subtitle2" sx={{ color: '#94a3b8', mb: 1 }}>
            Quản lý người trúng giải
          </Typography>
          
          <Tabs 
            value={tabValue} 
            onChange={(_, v) => setTabValue(v)}
            sx={{ 
              mb: 2,
              '& .MuiTab-root': { color: '#64748b', textTransform: 'none', minWidth: 80, fontSize: '0.8rem' },
              '& .Mui-selected': { color: '#6366f1 !important' },
              '& .MuiTabs-indicator': { bgcolor: '#6366f1' }
            }}
          >
            <Tab label={`Tất cả (${winners.length})`} />
            <Tab label="Đã nhận" />
            <Tab label="Vắng mặt" />
          </Tabs>

          <TableContainer sx={{ 
            maxHeight: 300, 
            bgcolor: 'rgba(15, 23, 42, 0.4)', 
            borderRadius: 2,
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: '#1e293b', color: '#94a3b8', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Họ tên</TableCell>
                  <TableCell sx={{ bgcolor: '#1e293b', color: '#94a3b8', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>MSNV</TableCell>
                  <TableCell sx={{ bgcolor: '#1e293b', color: '#94a3b8', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Giải thưởng</TableCell>
                  <TableCell sx={{ bgcolor: '#1e293b', color: '#94a3b8', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Trạng thái</TableCell>
                  <TableCell align="center" sx={{ bgcolor: '#1e293b', color: '#94a3b8', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Xóa</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredWinners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ color: '#64748b', py: 4, fontStyle: 'italic', border: 'none' }}>
                      Không có dữ liệu phù hợp
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWinners.map((w) => (
                    <TableRow key={`${w.employeeCode}-${w.prizeId}`} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                      <TableCell sx={{ color: '#e2e8f0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{w.employeeName}</TableCell>
                      <TableCell sx={{ color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: 'monospace' }}>{w.employeeCode}</TableCell>
                      <TableCell sx={{ color: '#e2e8f0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{getPrizeName(w.prizeId)}</TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{getStatusLabel(w.status)}</TableCell>
                      <TableCell align="center" sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <Tooltip title={isBlocked ? "Đang chờ xác nhận trúng thưởng" : "Cho phép quay thưởng lại"}>
                          <IconButton size="small" onClick={() => handleRemoveWinner(w.employeeCode, w.employeeName)} disabled={isBlocked} sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}>
                            <Typography sx={{ fontSize: '0.8rem', fontWeight: 900 }}>✕</Typography>
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Reset Button */}
        <Box>
          <ActionButton
            variant="outlined"
            fullWidth
            onClick={handleClearAll}
            disabled={isBlocked}
            sx={{
              borderColor: '#ef4444',
              color: '#ef4444',
              '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)', borderColor: '#ef4444' },
            }}
          >
            🗑️ Xóa toàn bộ dữ liệu
          </ActionButton>
          <Typography sx={{ color: '#64748b', fontSize: '0.75rem', mt: 1, textAlign: 'center' }}>
            Sẽ xóa tất cả người trúng giải và danh sách loại trừ
          </Typography>
        </Box>
      </Stack>
    </GlassCard>
  );
};

export default GameLogicNew;
