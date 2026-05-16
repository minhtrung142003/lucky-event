import React from 'react';
import { Fade, Stack, Typography, useTheme } from '@mui/material';
import { ButtonElement } from '../../../components/elements/button/button.element';
import { employees } from '../../../common/constant/employees.constant';
import { StackRow } from '../../../components/styles/stack.style';
import { STYLE } from '../../../common/constant';
import { TypographyGoldComponent } from '../../../components/elements/typography/typography-gold';
import { RingGifComponent } from '../../../components/gif/ring-gif.component';
import { motion } from 'framer-motion';

export interface DescriptionPartProps {
  setStart: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DescriptionPart: React.FC<DescriptionPartProps> = ({ setStart }) => {
  const { palette } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}
    >
      <Fade in={true} timeout={STYLE.ANIMATION_TIME * 2}>
        <motion.div variants={itemVariants}>
          <Stack sx={{ alignItems: 'center' }}>
            <Stack
              direction="row"
              alignItems="center"
              sx={{
                gap: 2,
                width: 600,
                background: `linear-gradient(90deg, transparent, ${palette.primary.main}40, transparent)`,
                padding: '16px',
                borderRadius: '12px',
              }}
            >
              <Stack
                sx={{
                  flex: 1,
                  height: '2px',
                  background: `linear-gradient(to right, transparent, ${palette.primary.main}80)`,
                }}
              />
              <TypographyGoldComponent variant="h4" content="THỂ LỆ CHƯƠNG TRÌNH" />
              <Stack
                sx={{
                  flex: 1,
                  height: '2px',
                  background: `linear-gradient(to left, transparent, ${palette.primary.main}80)`,
                }}
              />
            </Stack>

            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                width: 700,
                color: palette.text.primary,
                marginTop: 2,
              }}
            >
              Có 15 lần quay số tổng cộng, chia thành 3 lượt quay, mỗi lượt sẽ có 5 lần quay. Kết quả sẽ tương ứng với 5 chữ số trong MÃ SỐ NHÂN VIÊN
              của các thành viên tham gia.
            </Typography>
          </Stack>
        </motion.div>
      </Fade>

      <Fade in={true} timeout={STYLE.ANIMATION_TIME * 3}>
        <motion.div variants={itemVariants}>
          <Stack sx={{ alignItems: 'center' }}>
            <Stack
              direction="row"
              alignItems="center"
              sx={{
                gap: 2,
                width: 600,
                background: `linear-gradient(90deg, transparent, ${palette.secondary.main}30, transparent)`,
                padding: '16px',
                borderRadius: '12px',
              }}
            >
              <Stack
                sx={{
                  flex: 1,
                  height: '2px',
                  background: `linear-gradient(to right, transparent, ${palette.secondary.main}80)`,
                }}
              />
              <TypographyGoldComponent variant="h4" content="GIẢI THƯỞNG" />
              <Stack
                sx={{
                  flex: 1,
                  height: '2px',
                  background: `linear-gradient(to left, transparent, ${palette.secondary.main}80)`,
                }}
              />
            </Stack>
            <motion.div
              animate={{ y: [0, -20, 0], rotateZ: [-5, 0, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <RingGifComponent sx={{ width: 120, height: 120, marginTop: 2 }} />
            </motion.div>
          </Stack>
        </motion.div>
      </Fade>

      <Fade in={true} timeout={STYLE.ANIMATION_TIME * 4}>
        <motion.div variants={itemVariants}>
          <Stack sx={{ alignItems: 'center' }}>
            <Stack
              direction="row"
              alignItems="center"
              sx={{
                gap: 2,
                width: 600,
                background: `linear-gradient(90deg, transparent, ${palette.info.main}30, transparent)`,
                padding: '16px',
                borderRadius: '12px',
              }}
            >
              <Stack
                sx={{
                  flex: 1,
                  height: '2px',
                  background: `linear-gradient(to right, transparent, ${palette.info.main}80)`,
                }}
              />
              <TypographyGoldComponent variant="h4" content="TỔNG SỐ NHÂN VIÊN THAM DỰ" />
              <Stack
                sx={{
                  flex: 1,
                  height: '2px',
                  background: `linear-gradient(to left, transparent, ${palette.info.main}80)`,
                }}
              />
            </Stack>

            <StackRow sx={{ marginTop: 2 }}>
              <Typography
                variant="h5"
                sx={{
                  background: `linear-gradient(135deg, ${palette.primary.main}, ${palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 900,
                }}
              >
                {employees.length}
              </Typography>
              <Typography variant="h5" sx={{ marginLeft: 1 }}>
                NHÂN VIÊN
              </Typography>
            </StackRow>
          </Stack>
        </motion.div>
      </Fade>

      <motion.div
        animate={{
          boxShadow: [
            `0 0 20px ${palette.primary.main}40, 0 0 40px ${palette.secondary.main}20`,
            `0 0 40px ${palette.primary.main}60, 0 0 80px ${palette.secondary.main}40`,
            `0 0 20px ${palette.primary.main}40, 0 0 40px ${palette.secondary.main}20`,
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <ButtonElement
          content="BẮT ĐẦU QUAY SỐ"
          onClick={() => setStart(true)}
          sx={{
            width: 200,
            background: `linear-gradient(135deg, ${palette.primary.main}, ${palette.secondary.main})`,
          }}
          size="large"
        />
      </motion.div>
    </motion.div>
  );
};
