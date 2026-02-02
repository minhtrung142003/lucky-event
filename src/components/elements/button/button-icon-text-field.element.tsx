import { Button, ButtonProps } from '@mui/material';
import { STYLE } from '../../../common/constant';
import React from 'react';
import { LoadingComponent } from '../../loading/loading.component';
import { IconElement } from '../icon/icon.element';

export interface ButtonIconTextFieldElementProps extends ButtonProps {
  loading?: boolean;
  icon: string;
}

export const ButtonIconTextFieldElement: React.FC<ButtonIconTextFieldElementProps> = ({ loading, icon, ...rest }) => {
  return (
    <Button
      {...rest}
      endIcon={<IconElement icon={icon} sx={{ cursor: 'pointer' }} />}
      sx={{
        fontWeight: 500,
        fontSize: 15,
        textTransform: 'none',
        borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
        height: '37.13px',
        width: '37.13px', // Cái này height default của input chưa biết xử lí sao
        minWidth: '37.13px', // Cái này height default của input chưa biết xử lí sao
        '& > .MuiButton-endIcon': {
          margin: 0,
        },
      }}
    >
      {loading && <LoadingComponent color="primary" size="small" sx={{ minHeight: '24.5px' }} />}
    </Button>
  );
};
