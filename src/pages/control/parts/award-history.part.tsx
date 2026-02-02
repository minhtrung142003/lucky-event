import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Stack, IconButton, Button, Collapse, Chip, styled, Tooltip } from '@mui/material';
import { useLuckyDraw } from '../../../context/lucky-draw.context';
import { getAwardHistory, deleteAwardEntry, clearAwardHistory } from '../../../services/award-history.service';
import { AwardHistoryEntry } from '../../../common/data/prize.interface';

const HistoryCard = styled(Paper)(() => ({
  background: 'rgba(30, 41, 59, 0.6)',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  padding: '12px 16px',
  marginBottom: '8px',
  transition: 'all 0.2s ease',
  '&:hover': {
    border: '1px solid rgba(255, 255, 255, 0.2)',
    background: 'rgba(30, 41, 59, 0.8)',
  },
}));

const ReplayButton = styled(Button)(() => ({
  background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
  color: '#fff',
  fontWeight: 600,
  padding: '6px 16px',
  borderRadius: '8px',
  textTransform: 'none',
  fontSize: '0.8rem',
  '&:hover': {
    background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
  },
  '&:disabled': {
    background: 'rgba(100, 100, 100, 0.3)',
    color: 'rgba(255, 255, 255, 0.3)',
  },
}));

const DeleteButton = styled(IconButton)(() => ({
  color: '#ef4444',
  padding: '4px',
  '&:hover': {
    background: 'rgba(239, 68, 68, 0.1)',
  },
}));

export const AwardHistoryPart: React.FC = () => {
  const { replayCeremony, endReplay, state } = useLuckyDraw();
  const [history, setHistory] = useState<AwardHistoryEntry[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Load history on mount and when ceremony ends
  useEffect(() => {
    loadHistory();
  }, [state.ceremony.isActive]);

  const loadHistory = () => {
    const data = getAwardHistory();
    // Sort by timestamp descending (newest first)
    setHistory(data.sort((a, b) => b.timestamp - a.timestamp));
  };

  const handleReplay = (historyId: string) => {
    replayCeremony(historyId);
  };

  const handleEndReplay = () => {
    endReplay();
  };

  const handleDelete = (historyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Bạn có chắc muốn xóa lịch sử trao giải này?')) {
      deleteAwardEntry(historyId);
      loadHistory();
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Bạn có chắc muốn xóa TOÀN BỘ lịch sử trao giải? Hành động này không thể hoàn tác.')) {
      clearAwardHistory();
      loadHistory();
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isReplaying = state.ceremony.isReplay;

  if (history.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: '16px',
          background: 'rgba(30, 41, 59, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Typography sx={{ color: '#94a3b8', textAlign: 'center', py: 2 }}>📭 Chưa có lịch sử trao giải</Typography>
        <Typography sx={{ color: '#64748b', textAlign: 'center', fontSize: '0.75rem' }}>
          Lịch sử sẽ được lưu mỗi khi bấm &quot;Trao giải xong&quot;
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: '16px',
        background: 'rgba(30, 41, 59, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography sx={{ color: '#f1f5f9', fontWeight: 600, fontSize: '1rem' }}>📜 Lịch sử trao giải ({history.length})</Typography>
        <Stack direction="row" spacing={1}>
          {isReplaying && (
            <Button
              onClick={handleEndReplay}
              variant="outlined"
              size="small"
              sx={{
                borderColor: '#f59e0b',
                color: '#f59e0b',
                textTransform: 'none',
                fontSize: '0.75rem',
                '&:hover': { bgcolor: 'rgba(245, 158, 11, 0.1)' },
              }}
            >
              ⏹ Dừng replay
            </Button>
          )}
          <Tooltip title="Xóa toàn bộ lịch sử">
            <IconButton onClick={handleClearAll} size="small" sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}>
              🗑️
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Replay indicator */}
      {isReplaying && state.ceremony.replayData && (
        <Paper
          sx={{
            p: 1.5,
            mb: 2,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.2))',
            border: '1px solid #8b5cf6',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography sx={{ fontSize: '1.2rem' }}>📹</Typography>
            <Box flex={1}>
              <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>
                Đang phát lại: {state.ceremony.replayData.prizeName}
              </Typography>
              <Typography sx={{ color: '#a5b4fc', fontSize: '0.7rem' }}>
                {formatTime(state.ceremony.replayData.timestamp)} • {state.ceremony.replayData.winners.length} người
              </Typography>
            </Box>
          </Stack>
        </Paper>
      )}

      {/* History list */}
      <Box sx={{ maxHeight: '300px', overflowY: 'auto', pr: 1 }}>
        {history.map(entry => (
          <HistoryCard key={entry.id} elevation={0}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
              sx={{ cursor: 'pointer' }}
            >
              <Box flex={1}>
                <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                  <Typography sx={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.9rem' }}>{entry.prizeName}</Typography>
                  <Chip
                    label={`${entry.winners.length} người`}
                    size="small"
                    sx={{
                      height: '20px',
                      fontSize: '0.65rem',
                      bgcolor: 'rgba(16, 185, 129, 0.2)',
                      color: '#10b981',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                    }}
                  />
                </Stack>
                <Typography sx={{ color: '#64748b', fontSize: '0.7rem' }}>{formatTime(entry.timestamp)}</Typography>
              </Box>

              <Stack direction="row" alignItems="center" spacing={1}>
                <ReplayButton
                  onClick={e => {
                    e.stopPropagation();
                    handleReplay(entry.id);
                  }}
                  disabled={isReplaying}
                  size="small"
                >
                  ▶ Xem lại
                </ReplayButton>
                <DeleteButton onClick={e => handleDelete(entry.id, e)} size="small">
                  ✕
                </DeleteButton>
              </Stack>
            </Stack>

            {/* Expanded details */}
            <Collapse in={expanded === entry.id}>
              <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem', mb: 1 }}>Danh sách trúng giải:</Typography>
                <Stack spacing={0.5}>
                  {entry.winners.map((winner, idx) => (
                    <Stack
                      key={winner.employeeCode}
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{
                        p: 1,
                        borderRadius: '8px',
                        bgcolor: 'rgba(255, 255, 255, 0.03)',
                      }}
                    >
                      <Typography sx={{ color: '#64748b', fontSize: '0.7rem', minWidth: '20px' }}>{idx + 1}.</Typography>
                      <Box flex={1}>
                        <Typography sx={{ color: '#f1f5f9', fontSize: '0.8rem', fontWeight: 500 }}>{winner.employeeName}</Typography>
                        <Typography sx={{ color: '#64748b', fontSize: '0.65rem' }}>
                          {winner.employeeCode} • {winner.part}
                        </Typography>
                      </Box>
                      <Chip
                        label={winner.lotteryCode}
                        size="small"
                        sx={{
                          height: '18px',
                          fontSize: '0.6rem',
                          bgcolor: 'rgba(99, 102, 241, 0.2)',
                          color: '#a5b4fc',
                        }}
                      />
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Collapse>
          </HistoryCard>
        ))}
      </Box>
    </Paper>
  );
};

export default AwardHistoryPart;
