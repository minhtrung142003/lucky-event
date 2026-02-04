import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { ImageElement } from '../../../components/elements/image/image.element';
import { StackRowAlignCenter } from '../../../components/styles/stack.style';
import { PrizeWinner } from '../../../context/lucky-draw.context';
import { getMaxDisplay, shouldHideEmployeeDetails } from '../lucky-draw-2026.constants';
import avatar from '../../../assets/images/avatar-default.png';
import { LuckyWinnerOwnerResultPart } from './lucky-winner/winner-lucky-owner-result.part';
import urlBoxAvatar from '../../../assets/images/winner-4.svg';
import { GAP_ICON_CONTENT_BY_SIZE } from '../../../common/constant/style.constant';
import { PrizeChip } from './prize-selector.part';
import { employees, prizes2026 } from '../../../common/data';

interface AwardeeListPartProps {
  awardees: PrizeWinner[];
  onRemove?: (employeeCode: string) => void;
  showRemoveButton?: boolean;
  isReplay?: boolean;
}

export const AwardeeListPart: React.FC<AwardeeListPartProps> = ({ awardees, isReplay = false }) => {
  // In replay mode, winners have 'awarded' status; in normal mode, they have 'pending_award'
  const displayAwardees = awardees.filter(w => (isReplay ? w.status === 'awarded' : w.status === 'pending_award'));

  if (displayAwardees.length === 0) {
    return null;
  }

  // Group by prize
  const groupedByPrize: Record<string, PrizeWinner[]> = {};
  displayAwardees.forEach(awardee => {
    if (!groupedByPrize[awardee.prizeId]) {
      groupedByPrize[awardee.prizeId] = [];
    }
    groupedByPrize[awardee.prizeId].push(awardee);
  });

  return (
    <Stack sx={{ gap: '32px', width: '100%' }}>
      {Object.entries(groupedByPrize).map(([prizeId, winners]) => {
        // If consolation prize, use LuckyListUserPart style
        if (prizeId === 'consolation' || prizeId === 'mini_consolation') {
          // Only show if has winners (after draw complete)
          if (winners.length === 0) return null;

          // Dynamic grid columns
          const gridColumns = Math.min(winners.length, 4);

          return (
            <Stack key={prizeId} sx={{ gap: '56px', width: '100%', alignItems: 'center' }}>
              <PrizeChip label={prizes2026.find(p => p.id === prizeId)?.name.toUpperCase() || ''} />
              <Box
                sx={{
                  width: 'max-content',
                  borderRadius: '40px',
                  padding: '40px',
                  border: '1px solid #fff',
                  backgroundColor: 'rgba(175, 250, 241, 0.40)',
                  backdropFilter: 'blur(50px)',
                  margin: '0 auto',
                }}
              >
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
                    gap: '24px',
                  }}
                >
                  {winners.map(awardee => {
                    const hiddenDetails = shouldHideEmployeeDetails(awardee.employeeCode);
                    return (
                      <StackRowAlignCenter
                        key={awardee.employeeCode}
                        sx={{
                          gap: 2,
                          padding: '24px',
                          borderRadius: '24px',
                          border: '1px solid #fff',
                          background: 'linear-gradient(144deg, #69F8E5 -44.06%, #E8FDFB 59.8%)',
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: 'Montserrat, sans-serif',
                            fontWeight: 700,
                            fontSize: 40,

                            color: '#026D60',
                            textAlign: hiddenDetails ? 'center' : 'left',
                            minWidth: winners.length === 1 ? 'auto' : 240,
                          }}
                        >
                          {employees.find(e => e.code === awardee.employeeCode)?.lotteryCode || ''}
                          {!hiddenDetails && awardee?.employeeCode ? `- ${awardee.employeeCode}` : ''}
                        </Typography>
                        <ImageElement
                          onError={e => {
                            (e.currentTarget as HTMLImageElement).src = avatar;
                          }}
                          url={`/avatar/${awardee.employeeCode}.png`}
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
                            }}
                          >
                            {awardee.employeeName}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: 'Montserrat, sans-serif',
                              fontWeight: 700,
                              fontSize: 24,
                              lineHeight: 'normal',
                              color: '#026D60',
                              textOverflow: 'ellipsis',
                              maxWidth: 450,
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {awardee.part}
                          </Typography>
                        </Stack>
                      </StackRowAlignCenter>
                    );
                  })}
                </Box>
              </Box>
            </Stack>
          );
        }

        const maxDisplay = getMaxDisplay(prizeId);
        const displayWinners = winners.slice(0, maxDisplay);
        // const urlRibbonBg = getBannerImage(prizeId);
        // const urlBoxAvatar = getWinnerBadge(prizeId);
        const prize = prizes2026.find(p => p?.id === prizeId);

        return (
          <Stack key={prizeId} sx={{ gap: '32px', width: '100%', alignItems: 'center' }}>
            <PrizeChip label={prize?.name.toUpperCase() || ''} />
            <Box
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${displayWinners.length}, 1fr)`,
                gap: `calc(${GAP_ICON_CONTENT_BY_SIZE.medium} * 7)`,
              }}
            >
              {displayWinners.map(awardee => (
                <Stack
                  key={awardee.employeeCode}
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    gap: `calc(${GAP_ICON_CONTENT_BY_SIZE.medium} * 10)`,
                  }}
                >
                  <LuckyWinnerOwnerResultPart awardees={awardee} urlBoxAvatar={urlBoxAvatar} />
                </Stack>
              ))}
            </Box>
          </Stack>
        );
      })}
    </Stack>
  );
};

export default AwardeeListPart;
