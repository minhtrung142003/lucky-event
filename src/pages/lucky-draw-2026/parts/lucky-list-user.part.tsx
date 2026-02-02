import React from 'react';
import { Stack, Typography } from '@mui/material';
import { ImageElement } from '../../../components/elements/image/image.element';
import { StackRowAlignCenter } from '../../../components/styles/stack.style';
import { Employee } from '../../../common/data';
import avatar from '../../../assets/images/avatar-default.png';

interface LuckyListUserPartProps {
  remainingCandidates: Employee[];
  titleEmployee?: Employee[];
  showAsResults?: boolean;
}

export const LuckyListUserPart: React.FC<LuckyListUserPartProps> = ({ remainingCandidates, titleEmployee, showAsResults = false }) => {
  const displayEmployees = showAsResults ? 1 : 3;

  return (
    <React.Fragment>
      {remainingCandidates.length > 0 && (
        <div
          style={{
            width: !showAsResults ? 'max-content' : 'auto',
            borderRadius: '24px',
            padding: !showAsResults ? '40px' : 0,
            border: !showAsResults ? '1px solid #fff' : 'none',
            backgroundColor: !showAsResults ? 'rgba(175, 250, 241, 0.40)' : 'transparent',
            backdropFilter: !showAsResults ? 'blur(50px)' : 'none',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.min(remainingCandidates.length, displayEmployees)}, minmax(0, 1fr))`,
              gap: '16px',
              overflowY: 'auto',
              maxHeight: showAsResults ? '1200px' : '530px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {remainingCandidates.map(employee => (
              <StackRowAlignCenter
                key={employee.code}
                sx={{
                  gap: 1,
                  padding: '16px 24px',
                  width: 856,
                  borderRadius: '16px',
                  border: '1px solid #fff',
                  background: 'linear-gradient(144deg, #69F8E5 -44.06%, #E8FDFB 59.8%)',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 700,
                    fontSize: 36,
                    color: '#026D60',
                    whiteSpace: 'nowrap',
                    minWidth: 230,
                  }}
                >
                  {employee.lotteryCode} - {employee.code}
                </Typography>
                <ImageElement
                  onError={e => {
                    (e.currentTarget as HTMLImageElement).src = avatar;
                  }}
                  url={`/avatar/${employee.code}.png`}
                  sx={{ width: 84, height: 84, borderRadius: '100px' }}
                />
                <Stack sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: 700,
                      fontSize: 32,
                      lineHeight: 'normal',
                      color: '#026D60',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {employee.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: 700,
                      fontSize: 24,
                      lineHeight: 'normal',
                      color: '#026D60',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      maxWidth: 450,
                    }}
                  >
                    {employee.part}
                  </Typography>
                </Stack>
              </StackRowAlignCenter>
            ))}
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
