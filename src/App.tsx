import React, { Fragment, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import DomainRegistryRoutes from './Routes';
import './App.scss';

import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

const App = () => {
  const navigate = useNavigate();
  const { on } = useChrome();

  useEffect(() => {
    const unregister = on('APP_NAVIGATION', (event) => navigate(`/${event.navId}`));
    return () => {
      unregister?.();
    };
  }, []);

  return (
    <Fragment>
      <NotificationsPortal />
      <DomainRegistryRoutes />
    </Fragment>
  );
};

export default App;
