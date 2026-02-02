import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH } from '../../router';
import { STYLE } from '../../common/constant';
import { ImageElement } from '../elements/image/image.element';
import { LinkElement } from '../elements/link/link.element';

export interface LogoComponentProps {
  height?: number;
}

export const LogoComponent: React.FC<LogoComponentProps> = ({ height = STYLE.HEIGHT_LOGO_DEFAULT }) => {
  const navigate = useNavigate();

  const toHome = () => navigate(PATH.PAGE.HOME);

  return (
    <LinkElement href={PATH.PAGE.HOME} sx={{ height }}>
      <ImageElement url={'https://google.com'} onClick={toHome} sx={{ height }} />
    </LinkElement>
  );
};
