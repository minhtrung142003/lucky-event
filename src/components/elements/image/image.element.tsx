import { Box, BoxProps } from '@mui/material';
import React from 'react';

export interface ImageElementProps extends BoxProps {
  url: any;
}

export const ImageElement: React.FC<ImageElementProps> = ({ url, onClick, sx = {}, ...rest }) => {
  if (onClick) sx = { ...sx, cursor: 'pointer' };

  return (
    <Box {...rest} component="img" src={url} onClick={onClick} sx={{ height: 40, objectFit: 'cover', ...sx, display: 'block', margin: 'auto' }} />
  );
};
