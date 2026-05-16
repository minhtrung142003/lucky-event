import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography, useTheme, styled } from '@mui/material';
import { ButtonElement } from '../../../components/elements/button/button.element';
import { StackBgDefaultBorRadLayCol } from '../../../components/styles/stack.style';
import question from '../../../assets/images/question.png';
import { Employee } from '../../../common/constant/employees.constant';
import { Winner } from '../lucky-draw.page';
import { WinnerStatus } from '../lucky-draw.enum';
import { motion } from 'framer-motion';

export interface NumberPartProps {
  no: number;

  result: (string | null)[];
  setResult: React.Dispatch<React.SetStateAction<(string | null)[]>>;

  employeesFilter: Employee[];
  setEmployeesFilter: React.Dispatch<React.SetStateAction<Employee[]>>;

  setWinner: React.Dispatch<React.SetStateAction<Winner | null>>;

  isDisableAllButton: boolean;
  setIsDisableAllButton: React.Dispatch<React.SetStateAction<boolean>>;

  count: number;
}

// Define styled component outside to resolve TS2590
const AnimatedBox = styled(Box)({
  backgroundImage: `url(${question})`,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  width: '80%',
  height: '80%',
  transition: 'transform 1s ease-in-out',
  animation: 'float 3s infinite ease-in-out',
  transformStyle: 'preserve-3d',
  '@keyframes float': {
    '0%, 100%': { transform: 'rotateX(0deg) rotateY(0deg) translateZ(0)' },
    '25%': { transform: 'rotateX(20deg) rotateY(15deg) translateZ(10px)' },
    '50%': { transform: 'rotateX(-20deg) rotateY(-15deg) translateZ(5px)' },
    '75%': { transform: 'rotateX(15deg) rotateY(-20deg) translateZ(15px)' },
  },
});

export const NumberPart: React.FC<NumberPartProps> = ({
  no,
  result,
  setResult,
  employeesFilter,
  setEmployeesFilter,
  setWinner,
  isDisableAllButton,
  setIsDisableAllButton,
  count,
}) => {
  const { palette } = useTheme();

  const availableTempRandom = no > 1 ? ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] : ['0', '1', '2', '3'];

  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const [randomTemp, setRandomTemp] = useState();

  const availableChars = Array.from(new Set(employeesFilter.map(e => e.code[no])));

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;
    let temp: any;

    if (isAnimating) {
      // Start the interval to generate random numbers
      interval = setInterval(() => {
        const randomCharResutl = availableChars[Math.floor(Math.random() * availableChars.length)];

        const randomChartTemp: any = availableTempRandom[Math.floor(Math.random() * availableTempRandom.length)];

        temp = randomCharResutl;

        setRandomTemp(randomChartTemp);

        setResult(prev => {
          const newResult = [...prev];

          newResult[no] = randomCharResutl;

          return newResult;
        });
      }, 120);

      // Stop the interval after 1 second
      timeout = setTimeout(() => {
        clearInterval(interval);
        setIsAnimating(false);
        setIsDisableAllButton(false);

        // Nếu resultTemp không còn null thì sẽ có người chiến thắng
        const resultTemp = [...result];
        resultTemp[no] = temp;

        if (!resultTemp.some(e => e === null)) {
          const winnerCode = resultTemp.join('');

          const winner = employeesFilter.find(e => e.code === winnerCode)!;

          setWinner({ ...winner, status: WinnerStatus.RECEIVED, count });
        }

        const newEmployeesFilter = employeesFilter.filter(e => e.code[no] === temp);

        setEmployeesFilter(newEmployeesFilter);
        setRandomTemp(undefined);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isAnimating]);

  const startRandomAnimation = () => {
    setIsAnimating(true);
    setIsDisableAllButton(true);
  };

  const cardVariants = {
    spin: {
      rotateY: [0, 360, 720, 1080],
      scale: [1, 1.05, 1.1, 1.05, 1],
      transition: {
        duration: 1,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <Stack sx={{ alignItems: 'center' }}>
      <motion.div
        animate={isAnimating ? 'spin' : 'initial'}
        variants={cardVariants}
        style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
      >
        <StackBgDefaultBorRadLayCol
          sx={{
            width: '100%',
            maxWidth: 200,
            height: 200,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '4rem',
            fontWeight: 'bold',
            position: 'relative',
            background: result[no] ? `linear-gradient(135deg, ${palette.primary.main}20, ${palette.secondary.main}15)` : `${palette.background.paper}80`,
            border: `2px solid ${palette.primary.main}${result[no] ? 'cc' : '50'}`,
            borderRadius: '30px',
            overflow: 'hidden',
            boxShadow: result[no]
              ? `0 0 30px ${palette.primary.main}60, 0 0 60px ${palette.secondary.main}30, inset 0 0 20px ${palette.primary.main}20`
              : `0 0 15px ${palette.primary.main}30, 0 0 30px ${palette.secondary.main}15`,
            transition: 'all 0.3s ease',
          }}
        >
          {result[no] === null ? (
            <AnimatedBox />
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                sx={{
                  background: `linear-gradient(135deg, ${palette.primary.main}, ${palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: `0 0 20px ${palette.primary.main}40`,
                  transition: 'color 0.2s',
                  fontSize: 180,
                  fontWeight: 900,
                }}
              >
                {randomTemp || result[no]}
              </Typography>
            </motion.div>
          )}
        </StackBgDefaultBorRadLayCol>
      </motion.div>

      <ButtonElement
        content="QUAY SỐ"
        size="large"
        onClick={startRandomAnimation}
        sx={{ width: 150, marginTop: 2 }}
        disabled={isDisableAllButton ? isDisableAllButton : isAnimating || Boolean(result[no])}
      />
    </Stack>
  );
};
