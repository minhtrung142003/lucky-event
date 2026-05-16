import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';
import { styled } from '@mui/material/styles';
import gift from '../../assets/images/gift.png';

export interface RingGifComponentProps {
  sx?: SxProps<Theme>;
}

const BaseRing = styled(Box)({
  backgroundImage: `url(${gift})`,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  width: 60,
  height: 60,
  transition: 'transform 0.3s ease-in-out, filter 0.3s ease-in-out',
  perspective: '1000px',
  transform: 'rotateX(15deg) rotateY(15deg) rotateZ(5deg)',
  filter: 'drop-shadow(0px 15px 30px rgba(0, 217, 255, 0.4))',
  '&:hover': {
    transform: 'rotateX(5deg) rotateY(5deg) rotateZ(0deg) scale(1.15)',
    filter: 'drop-shadow(0px 20px 40px rgba(0, 217, 255, 0.6), 0px 0px 20px rgba(192, 0, 255, 0.3))',
  },
});

export const RingGifComponent: React.FC<RingGifComponentProps> = ({ sx }) => {
  return <BaseRing sx={sx} />;
};
