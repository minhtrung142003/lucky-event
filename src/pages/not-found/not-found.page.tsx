import { Stack } from '@mui/material';
import React, { ReactNode } from 'react';

export interface NotFoundPageProps {
  children?: ReactNode;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ children }) => {
  return <Stack>{children} NotFound</Stack>;
};
