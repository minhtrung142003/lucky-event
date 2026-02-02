import { Button, Paper, Slider, Typography, alpha, styled } from '@mui/material';

export const GlassCard = styled(Paper)(({ theme }) => ({
  background: alpha('#1e293b', 0.6), // Semi-transparent slate
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '24px',
  padding: theme.spacing(3),
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  height: '100%',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  }
}));

export const CardTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 700,
  color: '#f1f5f9', // Slate 100
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '&::before': {
    content: '""',
    display: 'block',
    width: '4px',
    height: '24px',
    background: 'linear-gradient(to bottom, #6366f1, #ec4899)',
    borderRadius: '2px',
  }
}));

export const StyledSlider = styled(Slider)(({ theme }) => ({
  height: 6,
  '& .MuiSlider-track': {
    border: 'none',
    background: 'linear-gradient(to right, #6366f1, #ec4899)',
  },
  '& .MuiSlider-thumb': {
    height: 20,
    width: 20,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:before': {
      display: 'none',
    },
  },
  '& .MuiSlider-rail': {
    opacity: 0.2,
    backgroundColor: '#94a3b8',
  },
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '12px 24px',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: 'none',
  fontSize: '1rem',
}));

export const EffectRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1, 0),
}));

export const EffectLabel = styled('span')(({ theme }) => ({
  color: '#cbd5f1', // Slate 300
  fontSize: '0.875rem',
  fontWeight: 500,
}));

export const EffectValue = styled('span')(({ theme }) => ({
  color: '#f1f5f9', // Slate 100
  fontSize: '0.75rem',
  minWidth: '40px',
  textAlign: 'right',
  fontFamily: 'monospace',
}));
