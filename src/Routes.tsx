import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import WizardPage from './Routes/WizardPage/WizardPage';
import DetailPage from './Routes/DetailPage/DetailPage';
import DefaultPage from './Routes/DefaultPage/DefaultPage';
import OopsPage from './Routes/OopsPage/OopsPage';

/**
 * the Switch component changes routes depending on the path.
 *
 * Route properties:
 *      exact - path must match exactly,
 *      path - https://prod.foo.redhat.com:1337/insights/advisor/rules
 *      component - component to be rendered when a route has been chosen.
 */
const DomainRegistryRoutes = () => (
  <Routes>
    <Route path="/domains" Component={DefaultPage} />
    <Route path="/details/:domain_id" Component={DetailPage} />
    <Route path="/domains/wizard" Component={WizardPage} />
    <Route path="/oops" Component={OopsPage} />
    {/* Finally, catch all unmatched routes */}
    <Route path="*" element={<Navigate to="/domains" replace />} />
  </Routes>
);

export default DomainRegistryRoutes;
