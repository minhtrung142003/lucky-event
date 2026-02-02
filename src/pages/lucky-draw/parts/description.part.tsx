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
          <TypographyGoldComponent variant="h3" content="THỂ LỆ CHƯƠNG TRÌNH" />

          <Typography variant="h6" sx={{ textAlign: 'center', width: 700 }}>
            Có 15 lần quay số, có 3 lượt quay số, mỗi lượt sẽ có 5 lần quay. Kết quả sẽ tương ứng với 5 ký tự trong MÃ SỐ NHÂN VIÊN của các thành viên
            trong GIA ĐÌNH SEN VÀNG. Khi quay đủ 5 số, Anh/Chị nào có mã số nhân viên trùng khớp với kết quả của lần quay đó là người chiến thắng.
          </Typography>
        </Stack>
      </Fade>

      <Fade in={true} timeout={STYLE.ANIMATION_TIME * 3}>
        <Stack sx={{ alignItems: 'center' }}>
          <TypographyGoldComponent variant="h3" content="GIẢI THƯỞNG" />

          <Typography variant="h5">15 NHẪN VÀNG THIẾT KẾ BỞI SEN VÀNG</Typography>

          <RingGifComponent sx={{ width: 120, height: 120 }} />
        </Stack>
      </Fade>

      <Fade in={true} timeout={STYLE.ANIMATION_TIME * 4}>
        <Stack sx={{ alignItems: 'center' }}>
          <TypographyGoldComponent variant="h3" content="TỔNG SỐ NHÂN VIÊN THAM DỰ" />

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
