import React from 'react';
import { Typography } from '@mui/material';
import { prizes2026, Prize } from '../../../common/data';
import { GradientColors } from '../lucky-draw-2026.constants';

interface PrizeSelectorPartProps {
  prizes?: Prize[];
  selectedPrizeId?: string;
}

export const PrizeChip: React.FC<{ label: string }> = ({ label }) => {
  // const gradient = prizeId && (GradientColors as any)[prizeId] ? (GradientColors as any)[prizeId] : GradientColors.consolation;
  return (
    <div
      style={{
        padding: '24px 56px',
        borderRadius: '100px',
        background: `linear-gradient(90deg, ${GradientColors.consolation})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 523,
      }}
    >
      <Typography
        sx={{
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 700,
          fontSize: 48,
          lineHeight: 'normal',
          color: '#fff',
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </Typography>
    </div>
  );
};

export const PrizeSelectorPart: React.FC<PrizeSelectorPartProps> = ({ prizes = prizes2026, selectedPrizeId }) => {
  const orderedPrizes = React.useMemo(() => [...prizes].sort((a, b) => a.order - b.order), [prizes]);
  // Derive current prize from selectedPrizeId
  const currentPrize = React.useMemo(() => {
    if (orderedPrizes.length === 0) return null;
    if (!selectedPrizeId) return orderedPrizes[0];
    return orderedPrizes.find(p => p.id === selectedPrizeId) || orderedPrizes[0];
  }, [selectedPrizeId, orderedPrizes]);

  if (!currentPrize) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
      <PrizeChip label={currentPrize.name.toUpperCase()} />
    </div>
  );
};
