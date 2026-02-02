import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';
import { styled } from '@mui/material/styles';
import animation from '../../assets/images/animation.gif';

export interface CongratulationsGifComponentProps {
  sx?: SxProps<Theme>;
}

const BaseGif = styled(Box)({
  backgroundImage: `url(${animation})`,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  width: 300,
  height: 300,
  zIndex: 1,
  position: 'absolute',
});

export const CongratulationsGifComponent: React.FC<CongratulationsGifComponentProps> = ({ sx }) => {
  return <BaseGif sx={sx} />;
};
