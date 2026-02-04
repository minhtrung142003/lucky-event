import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import avatar from '../../../../assets/images/avatar-default.png';
import { PrizeWinner } from '../../../../context/lucky-draw.context';
import { STYLE } from '../../../../common/constant';
import { employees, prizes2026 } from '../../../../common/data';
import { shouldHideEmployeeDetails } from '../../lucky-draw-2026.constants';

const avatarBreathingKeyframes = `
  @keyframes avatarBreathing {
    0%, 100% { transform: scale(1.15); }
    50% { transform: scale(1.03); }
  }
`;

interface WinnerModalProps {
  awardees: PrizeWinner | PrizeWinner[];
  urlBoxAvatar?: string;
  urlRibbonBg?: string;
}

export const LuckyWinnerOwnerPart: React.FC<WinnerModalProps> = ({ awardees, urlBoxAvatar, urlRibbonBg }) => {
  const winner = Array.isArray(awardees) ? awardees[0] : awardees;
  const prize = prizes2026.find(p => p?.id === winner?.prizeId);
  const hiddenDetails = shouldHideEmployeeDetails(winner.employeeCode);

  return (
    <>
      <style>{avatarBreathingKeyframes}</style>

      {/* Ribbon Banner */}
      <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box component="img" src={urlRibbonBg} alt="ribbon" sx={{ display: 'block', width: 'auto', height: 'auto' }} />
        <Stack
          sx={{
            position: 'absolute',
            alignItems: 'center',
            gap: 2,
            width: '100%',
            left: 0,
            top: '40%',
            transform: 'translateY(-40%)',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 800,
              fontSize: 56,
              lineHeight: 'normal',
              color: '#fff',
              textTransform: 'uppercase',
            }}
          >
            chúc mừng trúng {prize?.name}
          </Typography>
        </Stack>
      </Box>

      {/* Avatar with breathing effect */}
      <div
        style={{
          position: 'relative',
          minWidth: 415,
          aspectRatio: '31 / 33',
          display: 'flex',
          justifyContent: 'center',
          animation: 'avatarBreathing 2s ease-in-out infinite',
        }}
      >
        <Box component="img" src={urlBoxAvatar} alt="badge" sx={{ position: 'absolute', width: '100%', height: '100%' }} />
        <Box
          component="img"
          src={`/avatar/${winner.employeeCode}.png`}
          onError={e => (e.currentTarget.src = avatar)}
          alt="avatar"
          sx={{ width: 295, height: 295, borderRadius: '50%', margin: 'unset !important' }}
        />
      </div>

      {/* Winner Info Card */}
      <Box
        sx={{
          p: 4,
          borderRadius: `calc(${STYLE.BORDER_RADIUS_ELEMENT} * 4)`,
          backgroundColor: 'rgba(255, 255, 255, 0.48)',
          border: '1px solid #fff',
          minWidth: 1156,
        }}
      >
        <Stack
          sx={{
            padding: '32px 80px',
            borderRadius: `calc(${STYLE.BORDER_RADIUS_ELEMENT_SMALL} * 4)`,
            backdropFilter: 'blur(8px)',
            background: 'linear-gradient(269deg, var(--Color-Brand-Brand---100, #C3FFF2) 14.51%, var(--Color-White-White, #FFF) 76.23%)',
            alignItems: 'center',
          }}
        >
          <Typography sx={{ color: '#026D60', fontSize: 64, fontWeight: 700, lineHeight: 'normal', fontFamily: 'Montserrat, sans-serif' }}>
            {employees.find(e => e.code === winner?.employeeCode)?.lotteryCode || ''}
            {!hiddenDetails && winner?.employeeCode ? `- ${winner.employeeCode}` : ''}
          </Typography>
          <Typography
            sx={{
              color: '#026D60',
              fontSize: 56,
              fontWeight: 700,
              lineHeight: 'normal',
              fontFamily: 'Montserrat, sans-serif',
              textTransform: 'uppercase',
            }}
          >
            {winner?.employeeName}
          </Typography>
          {winner?.part && (
            <Typography sx={{ color: '#026D60', fontSize: 40, fontWeight: 700, lineHeight: 'normal', fontFamily: 'Montserrat, sans-serif' }}>
              {winner?.part}
            </Typography>
          )}
        </Stack>
      </Box>
    </>
  );
};
