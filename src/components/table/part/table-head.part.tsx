import { TableCell, TableHead, TableRow } from '@mui/material';
import React from 'react';
import { STYLE } from '../../../common/constant';
import { Column } from '../table.interface';

export interface TableHeadPartProps {
  columns: Column[];
}

export const TableHeadPart: React.FC<TableHeadPartProps> = ({ columns }) => {
  return (
    <TableHead>
      <TableRow>
        {columns.map(column => (
          <TableCell
            key={column.id}
            align={column.align}
            sx={{
              width: column.width,
              minWidth: column.width,
              fontWeight: 550,
              padding: STYLE.PADDING_GAP_ITEM,
              backgroundColor: 'transparent',
            }}
          >
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
