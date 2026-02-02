import { Fade, TableRow, TableCell, Collapse, Stack, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { STYLE } from '../../../common/constant';
import { useSnackbar } from '../../../hooks/use-snackbar.hook';
import { IconElement } from '../../elements/icon/icon.element';
import { Column, OnClickRow, DisableRow, CollapseProps } from '../table.interface';
import { StackRowJustCenter } from '../../styles/stack.style';
import { LoadingComponent } from '../../loading/loading.component';
import { EmptyComponent } from '../../empty/empty.component';

export interface RowCollapsePartProps {
  columns: Column[];
  row: any;
  indexRow: number;
  onClickRow?: OnClickRow;
  onUpdateRow?: OnClickRow;
  onDeleteRow?: OnClickRow;
  conditionActiveActions?: DisableRow;
  conditionDisabledRow?: DisableRow;
  collapse: CollapseProps;
}

export const RowCollapsePart: React.FC<RowCollapsePartProps> = ({
  columns,
  row,
  indexRow,
  onClickRow,
  onUpdateRow,
  onDeleteRow,
  conditionActiveActions,
  conditionDisabledRow,
  collapse,
}) => {
  const { showSnackbar } = useSnackbar();

  const { palette } = useTheme();

  const [open, setOpen] = React.useState(false);
  const [fullRow, setFullRow] = useState();
  const [loading, setLoading] = useState(false);

  const toggleCollapse = async (row: any, indexRow: number) => {
    setOpen(!open);

    if (!collapse.onOpenCollapse || fullRow) return;

    setLoading(true);

    try {
      const data = await collapse.onOpenCollapse(row, indexRow);

      setFullRow(data);
    } catch (error: any) {
      showSnackbar({ message: error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Add render vào column actions
  columns[columns.length - 1].render = (row, index) => {
    let disabled = false;

    if (conditionActiveActions) disabled = row[conditionActiveActions.columnId] !== conditionActiveActions.compareWith;

    return (
      <StackRowJustCenter>
        {onDeleteRow && <IconElement icon="delete" onClick={() => onDeleteRow(row, index)} disabled={disabled} />}
        {onUpdateRow && <IconElement icon="settings" onClick={() => onUpdateRow(row, index)} disabled={disabled} />}
        <IconElement onClick={() => toggleCollapse(row, indexRow)} icon={open ? 'keyboard_arrow_down' : 'keyboard_arrow_up'} />
      </StackRowJustCenter>
    );
  };

  return (
    <React.Fragment>
      <Fade in={true} timeout={indexRow * 120}>
        <TableRow hover tabIndex={-1} onClick={() => onClickRow && onClickRow(row, indexRow)} sx={{ cursor: onClickRow ? 'pointer' : 'default' }}>
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
              {column.render ? column.render(row, indexRow) : row[column.id]}
            </TableCell>
          ))}
        </TableRow>
      </Fade>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columns.length + 2}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Stack sx={{ padding: STYLE.PADDING_GAP_LAYOUT }}>
              {loading ? <LoadingComponent /> : fullRow ? collapse.render(fullRow, indexRow) : <EmptyComponent />}
            </Stack>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};
