import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import avatar from '../../../../assets/images/avatar-default.png';
import { PrizeWinner } from '../../../../context/lucky-draw.context';
import { STYLE } from '../../../../common/constant';
import { employees } from '../../../../common/data';

interface WinnerModalProps {
  awardees: PrizeWinner | PrizeWinner[];
  urlBoxAvatar?: string;
}

export const LuckyWinnerOwnerResultPart: React.FC<WinnerModalProps> = ({ awardees, urlBoxAvatar }) => {
  const awardeesList = Array.isArray(awardees) ? awardees : [awardees];
  const winner = awardeesList[0];

  return (
    <React.Fragment>
      <Box
        style={{
          position: 'relative',
          minWidth: 415,
          aspectRatio: '31 / 33',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box component="img" src={urlBoxAvatar} alt="badge" sx={{ position: 'absolute', width: '100%', height: '100%' }} />
        <Box
          component="img"
          src={`/avatar/${winner.employeeCode}.png`}
          onError={e => {
            e.currentTarget.src = avatar;
          }}
          alt="avatar"
          sx={{
            width: 295,
            height: 295,
            borderRadius: '50%',
            margin: 'unset !important',
          }}
        />
      </Box>

      <Box
        sx={{
          p: 3,
          borderRadius: `calc(${STYLE.BORDER_RADIUS_ELEMENT} * 4)`,
          backgroundColor: 'rgba(255, 255, 255, 0.48)',
          border: '1px solid #fff',
          width: 820,
          flex: 1,
        }}
      >
        <Stack
          sx={{
            padding: '32px 24px',
            borderRadius: `calc(${STYLE.BORDER_RADIUS_ELEMENT_SMALL} * 4)`,
            backdropFilter: 'blur(8px)',
            background: 'linear-gradient(269deg, var(--Color-Brand-Brand---100, #C3FFF2) 14.51%, var(--Color-White-White, #FFF) 76.23%)',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Typography sx={{ color: '#026D60', fontSize: '56px', fontWeight: 600, lineHeight: 'normal', fontFamily: 'Montserrat, sans-serif' }}>
            {employees.find(e => e.code === winner?.employeeCode)?.lotteryCode || ''} - {winner?.employeeCode}
          </Typography>
          <Typography
            sx={{
              color: '#026D60',
              fontSize: '40px',
              fontWeight: 700,
              lineHeight: 'normal',
              fontFamily: 'Montserrat, sans-serif',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {winner?.employeeName}
          </Typography>
          {winner?.part && (
            <Typography
              sx={{
                color: '#026D60',
                fontSize: '32px',
                fontWeight: 600,
                lineHeight: 'normal',
                textAlign: 'center',
                fontFamily: 'Montserrat, sans-serif',
                maxWidth: 700,
              }}
            >
              {winner?.part}
            </Typography>
          )}
        </Stack>
      </Box>
    </React.Fragment>
  );
};
