import { Fade, Stack, useTheme } from '@mui/material';
import React from 'react';
import { OPACITY } from '../../common/constant/opacity.constant';
import director from '../../assets/images/director.png';
import { useNavigate } from 'react-router-dom';
import { PATH } from '../../router';
import { STYLE } from '../../common/constant';
import { TypographyGoldComponent } from '../../components/elements/typography/typography-gold';
import { RingGifComponent } from '../../components/gif/ring-gif.component';

export interface HomePageProps {}

export const HomePage: React.FC<HomePageProps> = ({}) => {
  const { palette } = useTheme();
  const navigate = useNavigate();

  return (
    <Stack
      sx={{
        backgroundColor: `${palette.background.default}${OPACITY[60]}`,
        backdropFilter: 'blur(5px)',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 15,
        padding: 5,
        gap: 10,
      }}
    >
      <Stack>
        <Fade in={true} timeout={STYLE.ANIMATION_TIME * 1}>
          <Stack>
            <TypographyGoldComponent variant="h1" content="CHÀO MỪNG" />
          </Stack>
        </Fade>

        <Fade in={true} timeout={STYLE.ANIMATION_TIME * 1.5}>
          <Stack>
            <TypographyGoldComponent variant="h1" content="KỶ NIỆM 15 NĂM" />
          </Stack>
        </Fade>

        <Fade in={true} timeout={STYLE.ANIMATION_TIME * 2}>
          <Stack>
            <TypographyGoldComponent variant="h1" content="NGÀY THÀNH LẬP CÔNG TY" />
          </Stack>
        </Fade>

        <Fade in={true} timeout={STYLE.ANIMATION_TIME * 3}>
          <Stack>
            <TypographyGoldComponent variant="h1" content="25/12/2009 - 25/12/2024" />
          </Stack>
        </Fade>

        <Fade in={true} timeout={STYLE.ANIMATION_TIME * 4}>
          <Stack>
            <TypographyGoldComponent variant="h2" content="&" />
          </Stack>
        </Fade>

        <Fade in={true} timeout={STYLE.ANIMATION_TIME * 5}>
          <Stack>
            <TypographyGoldComponent variant="h1" content="TIỆC TẤT NIÊN 2024" />
          </Stack>
        </Fade>

        <Fade in={true} timeout={STYLE.ANIMATION_TIME * 4.5}>
          <Stack
            sx={{
              cursor: 'pointer',
              flexDirection: 'row',
              justifyContent: 'center',
              width: '100%',
            }}
            onClick={() => navigate(PATH.PAGE.LUCKY_DRAW)}
          >
            <RingGifComponent sx={{ width: 120, height: 120 }} />
          </Stack>
        </Fade>
      </Stack>

      <div
        style={{
          backgroundImage: `url(${director})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: 350,
          height: '100%',
        }}
      />
    </Stack>
  );
};
