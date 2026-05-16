import { Table, TableBody, TableCell, TableRow, useTheme } from '@mui/material';
import React from 'react';
import { STYLE } from '../../common/constant';
import { EmptyComponent } from '../empty/empty.component';
import { LoadingComponent } from '../loading/loading.component';
import { TableContainerPart } from './part/table-container.part';
import { TableHeadPart } from './part/table-head.part';
import { IconElement } from '../elements/icon/icon.element';
import { Column } from './table.interface';
import { StackRowJustCenter } from '../styles/stack.style';

export interface TableComponentProps {
  loading?: boolean;
  columns: Column[];
  rows?: any[];
  onClickRow?: (row: any, index: number) => void;
  onUpdateRow?: (row: any, index: number) => void;
  onDeleteRow?: (row: any, index: number) => void;
  conditionActiveActions?: { columnId: string; compareWith: any };
  conditionDisabledRow?: { columnId: string; compareWith: any };
}

export const TableComponent: React.FC<TableComponentProps> = ({
  loading = false,
  rows,
  columns: initialColumns,
  onClickRow,
  onUpdateRow,
  onDeleteRow,
  conditionActiveActions,
  conditionDisabledRow,
}) => {
  rows = rows || [];

  const { palette } = useTheme();

  const columns = React.useMemo(() => {
    const updateColumns = [...initialColumns];

    if (onUpdateRow || onDeleteRow) {
      updateColumns.push({
        id: 'actions',
        label: 'Actions',
        width: 100,
        align: 'center',
        render: (row, index) => {
          let disabled = false;

          if (conditionActiveActions) disabled = row[conditionActiveActions.columnId] !== conditionActiveActions.compareWith;

          return (
            <StackRowJustCenter>
              {onDeleteRow && <IconElement icon="delete" onClick={() => onDeleteRow(row, index)} disabled={disabled} />}
              {onUpdateRow && <IconElement icon="settings" onClick={() => onUpdateRow(row, index)} disabled={disabled} />}
            </StackRowJustCenter>
          );
        },
      });
    }

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
              <TableRow
                hover
                tabIndex={-1}
                key={`${row.code ?? row.id ?? index}-${index}`}
                onClick={() => onClickRow && onClickRow(row, index)}
                sx={{ cursor: onClickRow ? 'pointer' : 'default' }}
              >
                {columns.map(column => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    sx={{
                      padding: STYLE.PADDING_GAP_ITEM,
                      color: conditionDisabledRow
                        ? row[conditionDisabledRow.columnId] === conditionDisabledRow.compareWith
                          ? palette.divider
                          : 'none'
                        : 'none',
                    }}
                  >
                    {column.render ? column.render(row, index) : row[column.id]}
                  </TableCell>
                ))}
              </TableRow>
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
