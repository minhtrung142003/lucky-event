import React, { ElementType } from 'react';
import { Navigate } from 'react-router-dom';
import { DefaultLayout } from '../layouts/default.layout';
import { LuckyDrawPage } from '../pages/lucky-draw/lucky-draw.page';
import { NotFoundPage } from '../pages/not-found/not-found.page';
import { PATH } from '.';

export type Route = {
  path: string;
  element: ElementType;
  layout?: ElementType;
};

export const routes: Route[] = [
  {
    path: PATH.PAGE.LUCKY_DRAW,
    element: LuckyDrawPage,
    layout: DefaultLayout,
  },
  {
    path: PATH.PAGE.HOME,
    element: () => <Navigate to={PATH.PAGE.LUCKY_DRAW} replace />,
  },
  {
    path: PATH.PAGE.NOT_FOUND,
    element: NotFoundPage,
    layout: DefaultLayout,
  },
];
