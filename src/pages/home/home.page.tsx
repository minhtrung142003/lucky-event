import { Fade, Stack, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { OPACITY } from '../../common/constant/opacity.constant';
import director from '../../assets/images/director.png';
import { useNavigate } from 'react-router-dom';
import { PATH } from '../../router';
import { STYLE } from '../../common/constant';
import { TypographyGoldComponent } from '../../components/elements/typography/typography-gold';
import { IconElement } from '../../components/elements/icon/icon.element';
import { motion } from 'framer-motion';

export interface HomePageProps {}

export const HomePage: React.FC<HomePageProps> = ({}) => {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
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

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        `0 0 20px ${palette.primary.main}40, 0 0 40px ${palette.secondary.main}20`,
        `0 0 40px ${palette.primary.main}60, 0 0 80px ${palette.secondary.main}40`,
        `0 0 20px ${palette.primary.main}40, 0 0 40px ${palette.secondary.main}20`,
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{ width: '100%', height: '100%' }}
    >
      <Stack
        sx={{
          background: `linear-gradient(135deg, ${palette.background.default}80, ${palette.background.paper}80)`,
          backgroundColor: palette.background.default,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${palette.primary.main}30`,
          alignItems: 'center',
          flexDirection: 'row',
          borderRadius: 15,
          padding: 5,
          gap: 10,
          boxShadow: `0 0 40px ${palette.primary.main}30, 0 0 80px ${palette.secondary.main}15, inset 0 0 30px ${palette.primary.main}10`,
        }}
      >
        <Stack sx={{ flex: 1 }}>
          <Fade in={isVisible} timeout={STYLE.ANIMATION_TIME * 1}>
            <motion.div variants={itemVariants}>
              <Stack>
                <TypographyGoldComponent variant="h1" content="CHÀO MỪNG" />
              </Stack>
            </motion.div>
          </Fade>

          <Fade in={isVisible} timeout={STYLE.ANIMATION_TIME * 1.5}>
            <motion.div variants={itemVariants}>
              <Stack>
                <TypographyGoldComponent variant="h1" content="KỶ NIỆM 15 NĂM" />
              </Stack>
            </motion.div>
          </Fade>

          <Fade in={isVisible} timeout={STYLE.ANIMATION_TIME * 2}>
            <motion.div variants={itemVariants}>
              <Stack>
                <TypographyGoldComponent variant="h1" content="NGÀY THÀNH LẬP CÔNG TY" />
              </Stack>
            </motion.div>
          </Fade>

          <Fade in={isVisible} timeout={STYLE.ANIMATION_TIME * 3}>
            <motion.div variants={itemVariants}>
              <Stack>
                <TypographyGoldComponent variant="h1" content="25/12/2009 - 25/12/2024" />
              </Stack>
            </motion.div>
          </Fade>

          <Fade in={isVisible} timeout={STYLE.ANIMATION_TIME * 4}>
            <motion.div variants={itemVariants}>
              <Stack>
                <TypographyGoldComponent variant="h2" content="&" />
              </Stack>
            </motion.div>
          </Fade>

          <Fade in={isVisible} timeout={STYLE.ANIMATION_TIME * 5}>
            <motion.div variants={itemVariants}>
              <Stack>
                <TypographyGoldComponent variant="h1" content="TIỆC TẤT NIÊN 2024" />
              </Stack>
            </motion.div>
          </Fade>

          <Fade in={isVisible} timeout={STYLE.ANIMATION_TIME * 4.5}>
            <motion.div variants={itemVariants}>
              <Stack
                sx={{
                  cursor: 'pointer',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  width: '100%',
                }}
                onClick={() => navigate(PATH.PAGE.LUCKY_DRAW)}
              >
                <motion.div
                  animate={floatingVariants.animate}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconElement
                    icon="celebration"
                    sx={{
                      fontSize: 96,
                      color: palette.primary.main,
                      filter: `drop-shadow(0 0 20px ${palette.primary.main}90)`,
                    }}
                  />
                </motion.div>
              </Stack>
            </motion.div>
          </Fade>
        </Stack>

        <motion.div
          variants={glowVariants}
          animate="animate"
          style={{
            backgroundImage: `url(${director})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: 350,
            height: '100%',
            borderRadius: 15,
            border: `1px solid ${palette.primary.main}50`,
          }}
        />
      </Stack>
    </motion.div>
  );
};
