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
import { ConfettiEffect } from '../../components/effects/confetti-effect.component';
import { DrawRoundHeader } from '../../components/decorations/draw-round-header.component';
import { useSelector } from 'react-redux';
import { GlobalReduxState } from '../../redux/store.interface';
import { useAppDispatch } from '../../redux/store.redux';
import { ACTION_SYSTEM } from '../../redux';
import { ButtonIconSquareElement } from '../../components/elements/button/button-icon-square.element';
import { DialogElement } from '../../components/elements/dialog/dialog.element';
import { motion } from 'framer-motion';

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
    label: 'Chức vụ',
  },
  {
    id: 'part',
    label: 'Khối',
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
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      sx={{
        background: `linear-gradient(135deg, ${palette.background.default}80, ${palette.background.paper}80)`,
        backgroundColor: palette.background.default,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${palette.primary.main}30`,
        alignItems: 'center',
        borderRadius: 15,
        padding: 5,
        maxHeight: '95%',
        width: start ? '80%' : 'unset',
        boxShadow: `0 0 40px ${palette.primary.main}30, 0 0 80px ${palette.secondary.main}15, inset 0 0 30px ${palette.primary.main}10`,
      }}
    >
      <Fade in={true} timeout={STYLE.ANIMATION_TIME * 1}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }}>
          <Stack>
            <Typography
              sx={{
                background: `linear-gradient(135deg, ${palette.primary.main}, ${palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: `0 0 20px ${palette.primary.main}40`,
                variant: 'h2',
                fontSize: '2.5rem',
                fontWeight: 900,
              }}
              variant="h2"
            >
              CHƯƠNG TRÌNH QUAY SỐ TRÚNG THƯỞNG
            </Typography>
          </Stack>
        </motion.div>
      </Fade>

      {start ? (
        <React.Fragment>
          <Fade in={true} timeout={STYLE.ANIMATION_TIME}>
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <DrawRoundHeader round={system.count} />
            </motion.div>
          </Fade>

          {winner ? (
            <Stack
              sx={{
                alignItems: 'center',
                position: 'relative',
                width: '100%',
                minHeight: 320,
                overflow: 'hidden',
                py: 2,
              }}
            >
              <ConfettiEffect active />

              <Stack sx={{ position: 'relative', zIndex: 1, alignItems: 'center', width: '100%' }}>
              <Grow in={true} timeout={STYLE.ANIMATION_TIME * 2}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  <Stack>
                    <TypographyGoldComponent variant="h1" content={winner.code} sx={{ fontSize: '5rem' }} />
                  </Stack>
                </motion.div>
              </Grow>

              <Grow in={true} timeout={STYLE.ANIMATION_TIME * 3}>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <Stack>
                    <TypographyGoldComponent variant="h1" content={winner.name} sx={{ ...getLimitLineCss(1), fontSize: '5rem' }} />
                  </Stack>
                </motion.div>
              </Grow>

              <Grow in={true} timeout={STYLE.ANIMATION_TIME * 2}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <Stack>
                    <TypographyGoldComponent variant="h2" content={winner.department} />
                  </Stack>
                </motion.div>
              </Grow>

              <StackRow sx={{ marginY: 3 }}>
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
            </Stack>
          ) : (
            <Stack sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', width: '100%', gap: 5, marginY: 3 }}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Fade key={index} in={true} timeout={STYLE.ANIMATION_TIME * (index + 2)}>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
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
                  </motion.div>
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
            <TableComponent columns={columns} rows={winner ? [winner, ...system.winners] : system.winners} />
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
