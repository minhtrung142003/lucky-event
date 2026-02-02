import React from 'react';
import { Route } from 'react-router-dom';
import { Route as RouteInterface } from './route.route';

export const renderRoutes = (routes: RouteInterface[]) =>
  routes.map(route => {
    const { path, layout, element } = route;

    const Layout = layout || React.Fragment;

    const Element = element;

    return (
      <Route
        key={path}
        path={path}
        element={
          <Layout>
            <Element />
          </Layout>
        }
      />
    );
  });
