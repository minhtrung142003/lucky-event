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
  perspective: '1000px', // Tạo chiều sâu 3D
  transform: 'rotateX(20deg) rotateY(20deg)', // Xoay mạnh hơn một chút
  filter: 'drop-shadow(0px 20px 30px rgba(255, 215, 0, 0.6))',
  '&:hover': {
    transform: 'rotateX(0deg) rotateY(0deg) scale(1.1)', // Xoay lại phẳng và phóng to khi hover
    filter: 'drop-shadow(0px 25px 35px rgba(255, 215, 0, 0.6))', // Làm bóng mạnh hơn khi hover
  },
});

export const RingGifComponent: React.FC<RingGifComponentProps> = ({ sx }) => {
  return <BaseRing sx={sx} />;
};
