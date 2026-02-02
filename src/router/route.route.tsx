import React, { ElementType } from 'react';
import { Navigate } from 'react-router-dom';
import { DefaultLayout } from '../layouts/default.layout';
import { LuckyDrawPage } from '../pages/lucky-draw/lucky-draw.page';
import { LuckyDraw2026Page } from '../pages/lucky-draw-2026/lucky-draw-2026.page';
import { ControlPage } from '../pages/control/control.page';
import { NotFoundPage } from '../pages/not-found/not-found.page';
import { PATH } from '.';

export type Route = {
  path: string;
  element: ElementType;
  layout?: ElementType;
};

export const routes: Route[] = [
  {
    path: PATH.PAGE.LUCKY_DRAW_2026,
    element: LuckyDraw2026Page,
  },
  {
    path: PATH.PAGE.LUCKY_DRAW,
    element: LuckyDrawPage,
    layout: DefaultLayout,
  },
  {
    path: PATH.PAGE.CONTROL,
    element: ControlPage,
  },
  {
    path: PATH.PAGE.HOME,
    element: () => <Navigate to={PATH.PAGE.CONTROL} replace />,
  },
  {
    path: PATH.PAGE.NOT_FOUND,
    element: NotFoundPage,
    layout: DefaultLayout,
  },
];
