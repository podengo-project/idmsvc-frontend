import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Bullseye, Spinner } from '@patternfly/react-core';
import WizardPage from './Routes/WizardPage/WizardPage';
import DetailPage from './Routes/DetailPage/DetailPage';

const DefaultPage = lazy(() => import(/* webpackChunkName: "DefaultPage" */ './Routes/DefaultPage/DefaultPage'));
const OopsPage = lazy(() => import(/* webpackChunkName: "OopsPage" */ './Routes/OopsPage/OopsPage'));
const NoPermissionsPage = lazy(() => import(/* webpackChunkName: "NoPermissionsPage" */ './Routes/NoPermissionsPage/NoPermissionsPage'));

/**
 * the Switch component changes routes depending on the path.
 *
 * Route properties:
 *      exact - path must match exactly,
 *      path - https://prod.foo.redhat.com:1337/insights/advisor/rules
 *      component - component to be rendered when a route has been chosen.
 */
const DomainRegistryRoutes = () => (
  <Suspense
    fallback={
      <Bullseye>
        <Spinner />
      </Bullseye>
    }
  >
    <Routes>
      <Route path="/domains" Component={DefaultPage} />
      <Route path="/details/:domain_id" Component={DetailPage} />
      <Route path="/domains/wizard" Component={WizardPage} />
      <Route path="/oops" Component={OopsPage} />
      <Route path="/no-permissions" Component={NoPermissionsPage} />
      {/* Finally, catch all unmatched routes */}
      <Route path="*" element={<Navigate to="/domains" replace />} />
    </Routes>
  </Suspense>
);

export default DomainRegistryRoutes;
