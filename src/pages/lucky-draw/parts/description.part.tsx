import React from 'react';
import { Fade, Stack, Typography } from '@mui/material';
import { ButtonElement } from '../../../components/elements/button/button.element';
import { employees } from '../../../common/constant/employees.constant';
import { StackRow } from '../../../components/styles/stack.style';
import { STYLE } from '../../../common/constant';
import { TypographyGoldComponent } from '../../../components/elements/typography/typography-gold';
import { RingGifComponent } from '../../../components/gif/ring-gif.component';

export interface DescriptionPartProps {
  setStart: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DescriptionPart: React.FC<DescriptionPartProps> = ({ setStart }) => {
  return (
    <React.Fragment>
      <Fade in={true} timeout={STYLE.ANIMATION_TIME * 2}>
        <Stack sx={{ alignItems: 'center' }}>
          <Stack direction="row" alignItems="center" sx={{ gap: 2, width: 600 }}>
            <Stack sx={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, #c8960c)' }} />
            <TypographyGoldComponent variant="h4" content="THỂ LỆ CHƯƠNG TRÌNH" />
            <Stack sx={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, #c8960c)' }} />
          </Stack>

          <Typography variant="h6" sx={{ textAlign: 'center', width: 700 }}>
            Có 15 lần quay số tổng cộng, chia thành 3 lượt quay, mỗi lượt sẽ có 5 lần quay. Kết quả sẽ tương ứng với 5 chữ số trong MÃ SỐ NHÂN VIÊN
            của các thành viên tham gia.
          </Typography>
        </Stack>
      </Fade>

      <Fade in={true} timeout={STYLE.ANIMATION_TIME * 3}>
        <Stack sx={{ alignItems: 'center' }}>
          <Stack direction="row" alignItems="center" sx={{ gap: 2, width: 600 }}>
            <Stack sx={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, #c8960c)' }} />
            <TypographyGoldComponent variant="h4" content="GIẢI THƯỞNG" />
            <Stack sx={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, #c8960c)' }} />
          </Stack>
          <RingGifComponent sx={{ width: 120, height: 120 }} />
        </Stack>
      </Fade>

      <Fade in={true} timeout={STYLE.ANIMATION_TIME * 4}>
        <Stack sx={{ alignItems: 'center' }}>
          <Stack direction="row" alignItems="center" sx={{ gap: 2, width: 600 }}>
            <Stack sx={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, #c8960c)' }} />
            <TypographyGoldComponent variant="h4" content="TỔNG SỐ NHÂN VIÊN THAM DỰ" />
            <Stack sx={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, #c8960c)' }} />
          </Stack>

          <StackRow>
            <Typography variant="h5">{employees.length}</Typography>
            <Typography variant="h5">NHÂN VIÊN</Typography>
          </StackRow>
        </Stack>
      </Fade>

      <ButtonElement content="BẮT ĐẦU QUAY SỐ" onClick={() => setStart(true)} sx={{ width: 200 }} size="large" />
    </React.Fragment>
  );
};
