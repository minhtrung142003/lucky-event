import React from 'react';
import { Stack } from '@mui/material';
import defaultRibbonBg from '../../../../assets/images/banner-1-big.svg';
import defaultBoxAvatar from '../../../../assets/images/winner-1.svg';
import { LuckyWinnerOwnerPart } from './winner-lucky-owner.part';
import { PrizeWinner } from '../../../../context/lucky-draw.context';
import { GAP_ICON_CONTENT_BY_SIZE } from '../../../../common/constant/style.constant';

interface WinnerModalProps {
  open: boolean;
  awardees: PrizeWinner | PrizeWinner[];
  urlRibbonBg?: string;
  urlBoxAvatar?: string;
}

export const LuckyWinnerPart: React.FC<WinnerModalProps> = ({ open, awardees, urlRibbonBg = defaultRibbonBg, urlBoxAvatar = defaultBoxAvatar }) => {
  return (
    <React.Fragment>
      {open && (
        <Stack
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            gap: `calc(${GAP_ICON_CONTENT_BY_SIZE.medium} * 6)`,
            // top: '20%',
          }}
        >
          <LuckyWinnerOwnerPart awardees={awardees} urlBoxAvatar={urlBoxAvatar} urlRibbonBg={urlRibbonBg} />
        </Stack>
      )}
    </React.Fragment>
  );
};
