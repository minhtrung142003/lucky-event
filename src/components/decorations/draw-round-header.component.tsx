import { useTheme } from '@mui/material';
import React from 'react';
import { StackRowAlignJustCenter } from '../styles/stack.style';
import { TypographyGoldComponent } from '../elements/typography/typography-gold';
import { IconElement } from '../elements/icon/icon.element';

export interface DrawRoundHeaderProps {
  round: number;
}

export const DrawRoundHeader: React.FC<DrawRoundHeaderProps> = ({ round }) => {
  const { palette } = useTheme();

  return (
    <StackRowAlignJustCenter sx={{ gap: 2, marginY: 3 }}>
      <IconElement
        icon="auto_awesome"
        sx={{
          fontSize: 32,
          color: palette.primary.main,
          filter: `drop-shadow(0 0 8px ${palette.primary.main}80)`,
        }}
      />
      <TypographyGoldComponent variant="h5" sx={{ minWidth: 280, textAlign: 'center' }} content={`LẦN QUAY THỨ ${round}`} />
      <IconElement
        icon="auto_awesome"
        sx={{
          fontSize: 32,
          color: palette.secondary.main,
          filter: `drop-shadow(0 0 8px ${palette.secondary.main}80)`,
        }}
      />
    </StackRowAlignJustCenter>
  );
};
