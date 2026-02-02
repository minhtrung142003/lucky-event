import { Button, ButtonProps, Typography } from '@mui/material';
import { STYLE } from '../../../common/constant';
import React from 'react';
import { LoadingComponent } from '../../loading/loading.component';
import { IconElement } from '../icon/icon.element';

export interface ButtonIconContentOpacityTextFieldElementProps extends ButtonProps {
  loading?: boolean;
  icon: string;
  content: any;
}

export const ButtonIconContentOpacityTextFieldElement: React.FC<ButtonIconContentOpacityTextFieldElementProps> = ({
  loading,
  icon,
  content,
  variant = 'outlined',
  ...rest
}) => {
  return (
    <Button
      {...rest}
      variant={variant}
      sx={{
        fontWeight: 500,
        fontSize: 15,
        textTransform: 'none',
        borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
        height: '38.56px',
        width: '38.56px', // Cái này height default của input chưa biết xử lí sao
        minWidth: '38.56px', // Cái này height default của input chưa biết xử lí sao
        position: 'relative',
        '& > .material-icons': {
          opacity: 0,
          position: 'absolute',
          cursor: 'pointer',
          transition: `opacity 0.3s`,
        },
        '& > .content': {
          position: 'absolute',
          opacity: 1,
          transition: `opacity 0.3s`,
        },
        '&:hover': {
          '& > .material-icons': {
            opacity: 1,
            transition: `opacity 0.3s`,
          },
          '& > .content': {
            opacity: 0,
            transition: `opacity 0.3s`,
          },
        },
      }}
    >
      {loading ? (
        <LoadingComponent color="primary" size="small" sx={{ minHeight: '24.5px' }} />
      ) : (
        <React.Fragment>
          <IconElement className="icon" icon={icon} />
          <Typography className="content">{content}</Typography>
        </React.Fragment>
      )}
    </Button>
  );
};
