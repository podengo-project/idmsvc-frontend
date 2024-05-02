import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { initStore, restoreStore } from './store';
import App from './App';
import { getBaseName } from '@redhat-cloud-services/frontend-components-utilities/helpers';

import { AppContextProvider } from './AppContext';

const AppEntry = () => {
  const store = React.useMemo(() => {
    restoreStore();
    return initStore();
  }, []);

  return (
    <Provider store={store} stabilityCheck="always">
      <Router basename={getBaseName(window.location.pathname)}>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </Router>
    </Provider>
  );
};

export default AppEntry;
