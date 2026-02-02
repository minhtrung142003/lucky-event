import { Fade, Grow, Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { OPACITY } from '../../common/constant/opacity.constant';
import { StackRow, StackRowAlignCenterJustBetween, StackRowAlignJustCenter } from '../../components/styles/stack.style';
import { NumberPart } from './parts/number.part';
import { ButtonElement } from '../../components/elements/button/button.element';
import { Employee, employees } from '../../common/constant/employees.constant';
import { TableComponent } from '../../components/table/table.component';
import { Column } from '../../components/table/table.interface';
import { DescriptionPart } from './parts/description.part';
import { STYLE } from '../../common/constant';
import { TypographyGoldComponent } from '../../components/elements/typography/typography-gold';
import { WinnerStatus } from './lucky-draw.enum';
import { TagElement } from '../../components/elements/tag/tag.element';
import { getLimitLineCss } from '../../common/utils/other/get-limit-line-css.utils';
import { RingGifComponent } from '../../components/gif/ring-gif.component';
import { CongratulationsGifComponent } from '../../components/gif/congratulations-gif.component';
import { useSelector } from 'react-redux';
import { GlobalReduxState } from '../../redux/store.interface';
import { useAppDispatch } from '../../redux/store.redux';
import { ACTION_SYSTEM } from '../../redux';
import { ButtonIconSquareElement } from '../../components/elements/button/button-icon-square.element';
import { DialogElement } from '../../components/elements/dialog/dialog.element';

export interface LuckyDrawPageProps {}
export interface Winner extends Employee {
  status: WinnerStatus;
  count: number;
}

const columns: Column[] = [
  {
    id: 'STT',
    label: 'STT',
    align: 'center',
    width: 80,
    render: (winner, index) => <Typography>{index + 1}</Typography>,
  },
  {
    id: 'code',
    label: 'MSNV',
    align: 'center',
    width: 100,
  },
  {
    id: 'name',
    label: 'Họ & Tên',
  },
  {
    id: 'department',
    label: 'Bộ phận',
  },
  {
    id: 'part',
    label: 'Đơn vị',
  },
  {
    id: 'count',
    label: 'Lần quay số',
    align: 'center',
    width: 150,
    render: winner => <Typography>{'Lần ' + winner.count}</Typography>,
  },
  {
    id: 'status',
    label: 'Trạng thái',
    align: 'center',
    width: 110,
    render: (winner: Winner) => <TagElement type={winner.status === WinnerStatus.RECEIVED ? 'success' : 'error'} content={winner.status} />,
  },
];

const initialResult = ['0', null, null, null, null];

export const LuckyDrawPage: React.FC<LuckyDrawPageProps> = ({}) => {
  const { palette } = useTheme();

  const dispatch = useAppDispatch();

  const system = useSelector((state: GlobalReduxState) => state.system);

  const [start, setStart] = useState<boolean>(false);

  const [result, setResult] = useState<(string | null)[]>(initialResult);

  const [employeesFilter, setEmployeesFilter] = useState<Employee[]>(
    employees.filter(employee => !system.winners.some(e => e.code === employee.code))
  );

  const [winner, setWinner] = useState<Winner | null>(null);

  const [isDisableAllButton, setIsDisableAllButton] = useState(false);

  const [open, setOpen] = useState(false);

  return (
    <Stack
      sx={{
        backgroundColor: `${palette.background.default}${OPACITY[60]}`,
        backdropFilter: 'blur(5px)',
        alignItems: 'center',
        borderRadius: 15,
        padding: 5,
        maxHeight: '95%',
        width: start ? '80%' : 'unset',
      }}
    >
      <Fade in={true} timeout={STYLE.ANIMATION_TIME * 1}>
        <Stack>
          <TypographyGoldComponent variant="h2" content=" CHƯƠNG TRÌNH QUAY SỐ TRÚNG THƯỞNG" />
        </Stack>
      </Fade>

      {start ? (
        <React.Fragment>
          <Fade in={true} timeout={STYLE.ANIMATION_TIME}>
            <StackRowAlignJustCenter sx={{ gap: 5 }}>
              <RingGifComponent />
              <RingGifComponent />
              <TypographyGoldComponent variant="h5" sx={{ width: 300 }} content={`LẦN QUAY THỨ ${system.count}`} />
              <RingGifComponent />
              <RingGifComponent />
            </StackRowAlignJustCenter>
          </Fade>

          {winner ? (
            <Stack sx={{ alignItems: 'center', position: 'relative', width: '100%' }}>
              {/* ANIMATION */}
              <CongratulationsGifComponent sx={{ top: -100, left: 200 }} />
              <CongratulationsGifComponent sx={{ top: -100, right: 200 }} />

              <Grow in={true} timeout={STYLE.ANIMATION_TIME * 2}>
                <Stack>
                  <TypographyGoldComponent variant="h1" content={winner.code} sx={{ fontSize: '5rem' }} />
                </Stack>
              </Grow>

              <Grow in={true} timeout={STYLE.ANIMATION_TIME * 3}>
                <Stack>
                  <TypographyGoldComponent variant="h1" content={winner.name} sx={{ ...getLimitLineCss(1), fontSize: '5rem' }} />
                </Stack>
              </Grow>

              <Grow in={true} timeout={STYLE.ANIMATION_TIME * 2}>
                <Stack>
                  <TypographyGoldComponent variant="h2" content={winner.department} />
                </Stack>
              </Grow>

              <StackRow>
                <ButtonElement
                  content={`QUAY LẠI LẦN ${system.count}`}
                  variant="outlined"
                  size="large"
                  startIcon="delete"
                  sx={{ width: 220 }}
                  onClick={() => {
                    setResult(initialResult);

                    const newWinners = [{ ...winner, status: WinnerStatus.ABSENT }, ...system.winners];

                    dispatch(ACTION_SYSTEM.changeCountAndWinners({ count: system.count, winners: newWinners }));

                    setWinner(null);

                    setEmployeesFilter(employees.filter(employee => !newWinners.some(winner => winner.code === employee.code)));
                  }}
                />

                <ButtonElement
                  content={system.count < 15 ? `QUAY TIẾP LẦN ${system.count + 1}` : 'ĐÃ HẾT LƯỢT QUAY'}
                  size="large"
                  disabled={system.count === 15}
                  sx={{ width: 220 }}
                  endIcon="chevron_right"
                  onClick={() => {
                    setResult(initialResult);

                    const newWinners = [winner, ...system.winners];

                    dispatch(ACTION_SYSTEM.changeCountAndWinners({ count: system.count + 1, winners: newWinners }));

                    setWinner(null);

                    setEmployeesFilter(employees.filter(employee => !newWinners.some(winner => winner.code === employee.code)));
                  }}
                />
              </StackRow>
            </Stack>
          ) : (
            <Stack sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', width: '100%', gap: 5 }}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Fade key={index} in={true} timeout={STYLE.ANIMATION_TIME * (index + 2)}>
                  <Stack>
                    <NumberPart
                      no={index}
                      result={result}
                      setResult={setResult}
                      employeesFilter={employeesFilter}
                      setEmployeesFilter={setEmployeesFilter}
                      setWinner={setWinner}
                      isDisableAllButton={isDisableAllButton}
                      setIsDisableAllButton={setIsDisableAllButton}
                      count={system.count}
                    />
                  </Stack>
                </Fade>
              ))}
            </Stack>
          )}

          <Stack sx={{ width: '100%', alignItems: 'center', height: 300 }}>
            <StackRowAlignCenterJustBetween sx={{ width: '100%' }}>
              <Typography>{employees.length - system.winners.length + ' / ' + employees.length}</Typography>
              <TypographyGoldComponent variant="h5" content="DANH SÁCH NHÂN VIÊN TRÚNG THƯỞNG" />
              <ButtonIconSquareElement icon="restart_alt" onClick={() => setOpen(true)} sx={{ width: '36.5px', height: '36.5px' }} />
            </StackRowAlignCenterJustBetween>
            <TableComponent columns={columns} rows={system.winners} />
          </Stack>

          <DialogElement
            open={open}
            onClose={() => setOpen(false)}
            sx={{ width: 400 }}
            iconLabel="delete"
            label="XÁC NHẬN XOÁ DỮ LIỆU"
            nodeContent={'Dữ liệu đã quay sẽ được xoá toàn bộ.'}
            buttonLeft={{
              content: 'HUỶ',
              onClick: () => setOpen(false),
              variant: 'outlined',
            }}
            buttonRight={{
              content: 'XÁC NHẬN',
              color: 'error',
              onClick: () => {
                dispatch(ACTION_SYSTEM.resetCountAndWinners());
                setOpen(false);
                setWinner(null);
                setResult(initialResult);
              },
            }}
          />
        </React.Fragment>
      ) : (
        <DescriptionPart setStart={setStart} />
      )}
    </Stack>
  );
};
