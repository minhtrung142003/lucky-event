import { TableContainer, useTheme } from '@mui/material';
import React, { ReactElement, ReactNode } from 'react';
import { STYLE } from '../../../common/constant';

export interface TableContainerPartProps {
  children: ReactNode;
}

export const TableContainerPart: React.FC<TableContainerPartProps> = ({ children }) => {
  const { palette } = useTheme();

  return (
    <TableContainer
      sx={{
        flex: 1,
        border: `1px solid ${palette.divider}`,
        borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
        padding: STYLE.PADDING_GAP_ITEM,
      }}
    >
      {children}
    </TableContainer>
  );
};
