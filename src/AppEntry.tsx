import React, { useContext, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from './store';
import App from './App';
import { getBaseName } from '@redhat-cloud-services/frontend-components-utilities/helpers';
import logger from 'redux-logger';
import { AppContext } from './AppContext';
import { Domain } from './Api';

const AppEntry = () => {
  const appContext = useContext(AppContext);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [wizardToken, setWizardToken] = useState<string>('');
  const [wizardDomain, setWizardDomain] = useState<Domain>({} as Domain);
  const cbSetDomains = (domains: Domain[]) => {
    appContext.domains = domains;
    setDomains(domains);
  };
  const cbGetWizardToken = (): string => {
    return wizardToken;
  };
  const cbSetWizardToken = (value: string) => {
    setWizardToken(value);
  };
  const cbGetWizardDomain = (): Domain => {
    return wizardDomain;
  };
  const cbSetWizardDomain = (value: Domain) => {
    setWizardDomain(value);
  };
  return (
    <Provider store={init(...(process.env.NODE_ENV !== 'production' ? [logger] : [])).getStore()}>
      <Router basename={getBaseName(window.location.pathname)}>
        <AppContext.Provider
          value={{
            domains: domains,
            setDomains: cbSetDomains,
            wizard: {
              getToken: cbGetWizardToken,
              setToken: cbSetWizardToken,
              getDomain: cbGetWizardDomain,
              setDomain: cbSetWizardDomain,
            },
          }}
        >
          <App />
        </AppContext.Provider>
      </Router>
    </Provider>
  );
};

export default AppEntry;
