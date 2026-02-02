import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import React from 'react';
import { EmptyComponent } from '../empty/empty.component';
import { LoadingComponent } from '../loading/loading.component';
import { TableContainerPart } from './part/table-container.part';
import { TableHeadPart } from './part/table-head.part';
import { Column, OnClickRow, DisableRow, CollapseProps } from './table.interface';
import { RowCollapsePart } from './part/row-collapse.part';

export interface TableCollapseComponentProps {
  loading: boolean;
  rows?: any[];
  columns: Column[];
  onClickRow?: OnClickRow;
  onUpdateRow?: OnClickRow;
  onDeleteRow?: OnClickRow;
  conditionActiveActions?: DisableRow;
  conditionDisabledRow?: DisableRow;
  collapse: CollapseProps;
}

export const TableCollapseComponent: React.FC<TableCollapseComponentProps> = ({
  loading,
  rows,
  columns: initialColumns,
  onClickRow,
  onUpdateRow,
  onDeleteRow,
  conditionActiveActions,
  conditionDisabledRow,
  collapse,
}) => {
  rows = rows || [];

  const columns = React.useMemo(() => {
    const updateColumns = [...initialColumns];

    // Update trước để render head vì dồn collapse vào đây. Chắc chắn cột này sẽ có.
    // Vào trong RowCollapsePart update thêm hàm render
    updateColumns.push({
      id: 'actions',
      label: 'Actions',
      width: 110,
      align: 'center',
    });

    return updateColumns;
  }, [initialColumns, onDeleteRow, onUpdateRow, conditionActiveActions]);

  return (
    <TableContainerPart>
      <Table sx={{ height: loading || rows.length === 0 ? '100%' : 'none' }}>
        <TableHeadPart columns={columns} />
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <LoadingComponent />
              </TableCell>
            </TableRow>
          ) : rows.length ? (
            rows.map((row, index) => (
              <RowCollapsePart
                columns={columns}
                row={row}
                indexRow={index}
                key={index}
                onClickRow={onClickRow}
                onUpdateRow={onUpdateRow}
                onDeleteRow={onDeleteRow}
                conditionActiveActions={conditionActiveActions}
                conditionDisabledRow={conditionDisabledRow}
                collapse={collapse}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <EmptyComponent />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainerPart>
  );
};
